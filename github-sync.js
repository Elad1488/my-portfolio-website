// GitHub-backed storage for the admin panel.
// data.json in the repo is the single source of truth: the admin loads it from
// GitHub on open, keeps edits in memory (no 5MB localStorage limit), and
// "Publish" commits data.json + any newly uploaded images to main in one commit.
// The Pages workflow then redeploys the site automatically.

const GH = { owner: 'Elad1488', repo: 'my-portfolio-website', branch: 'main', mediaDir: 'media' };
const GH_TOKEN_KEY = 'portfolio_gh_token';

// Same interface as localStorage, but in memory and per-session.
const store = {
    _data: {},
    getItem(key) { return key in this._data ? this._data[key] : null; },
    setItem(key, value) {
        value = String(value);
        if (this._data[key] === value) return;
        this._data[key] = value;
        if (!sync.loading) sync.setDirty(true);
    },
    removeItem(key) { delete this._data[key]; if (!sync.loading) sync.setDirty(true); }
};

const sync = {
    loading: true,
    dirty: false,
    baseCommit: null,   // commit data.json was loaded from
    dataBlobSha: null,  // blob sha of data.json at baseCommit

    token() {
        try { return localStorage.getItem(GH_TOKEN_KEY) || ''; } catch (e) { return ''; }
    },

    askToken() {
        const t = prompt(
            'GitHub token (fine-grained, repo "my-portfolio-website", permission Contents: Read and write).\n' +
            'Create one at github.com/settings/personal-access-tokens/new\n' +
            'It is stored only in this browser.',
            this.token()
        );
        if (t === null) return false;
        try { localStorage.setItem(GH_TOKEN_KEY, t.trim()); } catch (e) {}
        this.setStatus(t.trim() ? 'Token saved.' : 'Token cleared.');
        return !!t.trim();
    },

    async api(path, opts = {}) {
        const headers = { Accept: 'application/vnd.github+json', ...(opts.headers || {}) };
        const token = this.token();
        if (token) headers.Authorization = `Bearer ${token}`;
        if (opts.body) headers['Content-Type'] = 'application/json';
        const res = await fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}${path}`, {
            method: opts.method || 'GET',
            headers,
            body: opts.body ? JSON.stringify(opts.body) : undefined,
            cache: 'no-store'
        });
        if (!res.ok) {
            const err = new Error(`GitHub ${res.status}: ${(await res.text()).slice(0, 300)}`);
            err.status = res.status;
            throw err;
        }
        return res.json();
    },

    async headInfo() {
        const ref = await this.api(`/git/ref/heads/${GH.branch}`);
        const commit = await this.api(`/git/commits/${ref.object.sha}`);
        const tree = await this.api(`/git/trees/${commit.tree.sha}`);
        const entry = tree.tree.find(e => e.path === 'data.json');
        return { commitSha: ref.object.sha, treeSha: commit.tree.sha, dataBlobSha: entry && entry.sha };
    },

    async load() {
        this.loading = true;
        this.setStatus('Loading data.json from GitHub…');
        try {
            const head = await this.headInfo();
            const blob = await this.api(`/git/blobs/${head.dataBlobSha}`);
            const bytes = Uint8Array.from(atob(blob.content.replace(/\n/g, '')), c => c.charCodeAt(0));
            this.applyData(JSON.parse(new TextDecoder().decode(bytes)));
            this.baseCommit = head.commitSha;
            this.dataBlobSha = head.dataBlobSha;
            this.setStatus(`Loaded from GitHub (${head.commitSha.slice(0, 7)})`);
        } catch (e) {
            // Fallback (e.g. rate-limited without token): the deployed copy next to this page.
            console.error(e);
            const res = await fetch('data.json', { cache: 'no-store' });
            this.applyData(await res.json());
            this.setStatus('⚠ Could not reach GitHub API, loaded local data.json — publishing will re-check for conflicts.', true);
        }
        this.loading = false;
        this.setDirty(false);
    },

    applyData(data) {
        const map = {
            [STORAGE_KEYS.PROJECTS]: data.projects || [],
            [STORAGE_KEYS.GALLERY]: data.gallery || { sections: [] },
            [STORAGE_KEYS.ABOUT]: data.about || { text1: '', text2: '' },
            [STORAGE_KEYS.SKILLS]: data.skills || [],
            [STORAGE_KEYS.CONTACT]: data.contact || {},
            [STORAGE_KEYS.HERO]: data.hero || {},
            [STORAGE_KEYS.HERO_SLIDESHOW]: data.heroSlideshow || []
        };
        for (const [k, v] of Object.entries(map)) store._data[k] = JSON.stringify(v);
    },

    collectData() {
        const get = (k, d) => JSON.parse(store.getItem(k) || d);
        return {
            projects: get(STORAGE_KEYS.PROJECTS, '[]'),
            gallery: get(STORAGE_KEYS.GALLERY, '{"sections":[]}'),
            about: get(STORAGE_KEYS.ABOUT, '{"text1":"","text2":""}'),
            skills: get(STORAGE_KEYS.SKILLS, '[]'),
            contact: get(STORAGE_KEYS.CONTACT, '{}'),
            hero: get(STORAGE_KEYS.HERO, '{}'),
            heroSlideshow: get(STORAGE_KEYS.HERO_SLIDESHOW, '[]')
        };
    },

    // Replace every embedded data: URL with a file in media/, returning the new files.
    async extractMedia(data) {
        const files = new Map(); // path -> { content (base64), bytes, label }
        const exts = { jpeg: 'jpg', jpg: 'jpg', png: 'png', gif: 'gif', webp: 'webp', 'svg+xml': 'svg', mp4: 'mp4', webm: 'webm' };
        const walk = async (o, label) => {
            if (Array.isArray(o)) { for (const v of o) await walk(v, label); return; }
            if (!o || typeof o !== 'object') return;
            label = o.title || o.name || label;
            const b64 = o.imageBase64;
            if (typeof b64 === 'string' && b64.startsWith('data:')) {
                const [head, content] = b64.split(',', 2);
                const bytes = Uint8Array.from(atob(content), c => c.charCodeAt(0));
                const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-1', bytes)))
                    .map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 12);
                const ext = exts[head.slice(5).split(';')[0].split('/')[1]] || 'bin';
                const path = `${GH.mediaDir}/${hash}.${ext}`;
                files.set(path, { content, bytes: bytes.length, label: label || 'Hero slideshow' });
                o.imageUrl = path;
                o.imageBase64 = null;
            }
            for (const v of Object.values(o)) await walk(v, label);
        };
        await walk(data, '');
        return files;
    },

    async publish() {
        if (!this.token() && !this.askToken()) return;
        // Pick up any unsaved form fields (about / contact / hero).
        saveAbout(); saveContact(); saveHero();

        const btn = document.getElementById('btn-publish');
        if (btn) btn.disabled = true;
        try {
            const data = this.collectData();
            const media = await this.extractMedia(data);

            const mb = (n) => (n / (1024 * 1024)).toFixed(1) + ' MB';
            const tooBig = [...media.values()].filter(f => f.bytes > MAX_UPLOAD_BYTES);
            if (tooBig.length) {
                throw new Error(`These files are over the ${MAX_UPLOAD_MB} MB upload limit:\n` +
                    tooBig.map(f => `• "${f.label}": ${mb(f.bytes)}`).join('\n') +
                    '\n\nRemove or replace them (e.g. a shorter/smaller GIF), then Publish again.');
            }

            const entries = [];
            let i = 0;
            for (const [path, f] of media) {
                this.setStatus(`Uploading image ${++i}/${media.size} (${mb(f.bytes)}, "${f.label}")…`);
                let blob;
                try {
                    blob = await this.api('/git/blobs', { method: 'POST', body: { content: f.content, encoding: 'base64' } });
                } catch (e) {
                    if (e.status === 422) {
                        throw new Error(`GitHub refused the image in "${f.label}" (${mb(f.bytes)}) as too large. ` +
                            'Use a smaller file for it, then Publish again.');
                    }
                    throw e;
                }
                entries.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
            }
            this.setStatus('Uploading data.json…');
            const json = JSON.stringify(data, null, 2) + '\n';
            const dataBlob = await this.api('/git/blobs', { method: 'POST', body: { content: json, encoding: 'utf-8' } });
            entries.push({ path: 'data.json', mode: '100644', type: 'blob', sha: dataBlob.sha });

            for (let attempt = 0; attempt < 3; attempt++) {
                const head = await this.headInfo();
                // Someone else changed data.json since we loaded it: refuse instead of overwriting.
                if (this.dataBlobSha && head.dataBlobSha !== this.dataBlobSha && head.dataBlobSha !== dataBlob.sha) {
                    throw new Error('data.json was changed on GitHub after this page loaded (another tab or a manual commit). ' +
                        'Reload the admin to get the latest version, then redo your change.');
                }
                const tree = await this.api('/git/trees', { method: 'POST', body: { base_tree: head.treeSha, tree: entries } });
                const commit = await this.api('/git/commits', { method: 'POST', body: {
                    message: `Admin: update portfolio${media.size ? ` (+${media.size} image${media.size > 1 ? 's' : ''})` : ''}`,
                    tree: tree.sha,
                    parents: [head.commitSha]
                } });
                try {
                    await this.api(`/git/refs/heads/${GH.branch}`, { method: 'PATCH', body: { sha: commit.sha, force: false } });
                } catch (e) {
                    if (e.status === 422) continue; // branch moved under us (e.g. a GIF pushed from Desktop) — rebase and retry
                    throw e;
                }
                this.baseCommit = commit.sha;
                this.dataBlobSha = dataBlob.sha;
                // Keep the editor in sync with what was committed (base64 → media/ paths).
                this.loading = true;
                this.applyData(data);
                this.loading = false;
                this.setDirty(false);
                reloadAllViews();
                this.setStatus(`✅ Published ${commit.sha.slice(0, 7)} — the site redeploys in ~1 minute.`);
                showSuccess('✅ Published to GitHub! The live site updates in about a minute.');
                return;
            }
            throw new Error('The branch kept changing while publishing — try again.');
        } catch (e) {
            console.error(e);
            if (e.status === 401 || e.status === 403 || e.status === 404) {
                alert('GitHub rejected the token (needs Contents: Read and write on my-portfolio-website).\n\n' + e.message);
                this.askToken();
            } else {
                alert('Publish failed — nothing was changed on the site.\n\n' + e.message);
            }
            this.setStatus('Publish failed: ' + e.message, true);
        } finally {
            if (btn) btn.disabled = false;
        }
    },

    setDirty(dirty) {
        this.dirty = dirty;
        const btn = document.getElementById('btn-publish');
        if (btn) btn.textContent = dirty ? 'Publish to Site •' : 'Publish to Site';
        if (dirty) this.setStatus('Unpublished changes — click "Publish to Site".');
    },

    setStatus(text, isError) {
        const el = document.getElementById('sync-status');
        if (!el) return;
        el.textContent = text;
        el.style.color = isError ? '#ef4444' : '';
    }
};

function reloadAllViews() {
    loadAllData();
    loadGallery();
    loadHeroSlideshow();
}

window.addEventListener('beforeunload', (e) => {
    if (sync.dirty) { e.preventDefault(); e.returnValue = ''; }
});
