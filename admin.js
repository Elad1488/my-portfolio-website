// Data Storage Keys
const STORAGE_KEYS = {
    PROJECTS: 'portfolio_projects',
    GALLERY: 'portfolio_gallery',
    ABOUT: 'portfolio_about',
    SKILLS: 'portfolio_skills',
    CONTACT: 'portfolio_contact',
    HERO: 'portfolio_hero'
};

// Current editing project index
let currentEditingIndex = -1;
let currentEditingGalleryIndex = -1;
let currentEditingSectionIndex = -1;
let currentEditingGallerySectionIndex = -1; // section index for gallery item
let draggedElement = null;
let draggedGalleryElement = null;
let currentImageBase64 = null;
let additionalImages = []; // Array of {imageUrl, imageBase64} for additional gallery images

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    cleanupYouTubeThumbnails(); // Clean up any YouTube thumbnails saved in thumbnail field
    loadAllData();
    initializeDragAndDrop();
    loadGallery();
});

// Clean up YouTube thumbnail URLs from thumbnail field (one-time cleanup)
function cleanupYouTubeThumbnails() {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    let needsUpdate = false;
    
    projects.forEach(project => {
        if (project.thumbnail && project.thumbnail.includes('img.youtube.com/vi/')) {
            project.thumbnail = ''; // Remove YouTube thumbnail URL
            needsUpdate = true;
        }
    });
    
    if (needsUpdate) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    }
}

// Tab Switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Set active button - find button by checking onclick attribute or text
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${tabName}'`)) {
            btn.classList.add('active');
        }
    });
    
    // If switching to gallery tab, make sure gallery is loaded
    if (tabName === 'gallery') {
        setTimeout(() => loadGallery(), 100);
    }
}

// ========== PROJECTS MANAGEMENT ==========

function loadProjects() {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No projects yet. Click "Add Project" to get started!</p>';
        return;
    }
    
    projects.forEach((project, index) => {
        const projectItem = createProjectItem(project, index);
        projectsList.appendChild(projectItem);
    });
}

function createProjectItem(project, index) {
    const div = document.createElement('div');
    div.className = 'project-item';
    div.draggable = true;
    div.dataset.index = index;
    
    const hasYoutube = project.youtubeUrl ? true : false;
    
    // Get thumbnail - use project thumbnail or YouTube thumbnail
    // But ignore YouTube thumbnail URLs that might be saved in the thumbnail field
    let thumbnailUrl = project.thumbnail || '';
    
    // Check if thumbnail is actually valid (not empty and not a YouTube auto-generated one)
    const hasValidThumbnail = thumbnailUrl && thumbnailUrl.trim() !== '' && !thumbnailUrl.includes('img.youtube.com/vi/');
    
    // If no valid thumbnail but YouTube URL exists, ALWAYS use YouTube thumbnail
    if (!hasValidThumbnail && project.youtubeUrl) {
        // Make sure youtubeUrl is a valid video ID
        let videoId = project.youtubeUrl;
        if (typeof videoId === 'string') {
            // If it's a full URL, extract the ID
            if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
                videoId = extractYouTubeId(videoId);
            }
            // Clean the video ID
            if (videoId) {
                videoId = videoId.trim().split('&')[0].split('?')[0];
                if (videoId) {
                    thumbnailUrl = getYouTubeThumbnail(videoId);
                }
            }
        }
    }
    
    // Create thumbnail preview - ALWAYS show if we have a thumbnail URL
    let thumbnailPreview = '';
    if (thumbnailUrl && thumbnailUrl.trim() !== '') {
        // Escape the URL for HTML
        const safeThumbnailUrl = thumbnailUrl.replace(/"/g, '&quot;');
        thumbnailPreview = `<div class="project-thumbnail-preview"><img src="${safeThumbnailUrl}" alt="${project.name || 'Project thumbnail'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.onerror=null;"></div>`;
    }
    
    div.innerHTML = `
        <div class="drag-handle">☰</div>
        ${thumbnailPreview}
        <div class="project-info">
            <h3>${project.name || 'Untitled Project'}</h3>
            <p>${project.description || 'No description'}</p>
            <div class="project-badges">
                ${project.technologies ? project.technologies.map(tech => `<span class="badge">${tech}</span>`).join('') : ''}
                ${hasYoutube ? '<span class="badge youtube">📹 YouTube</span>' : ''}
            </div>
        </div>
        <div class="project-actions">
            <button class="btn-edit" onclick="editProject(${index})">Edit</button>
            <button class="btn-delete" onclick="deleteProject(${index})">Delete</button>
        </div>
    `;
    
    // Drag event listeners
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragover', handleDragOver);
    div.addEventListener('drop', handleDrop);
    div.addEventListener('dragend', handleDragEnd);
    
    return div;
}

function addNewProject() {
    currentEditingIndex = -1;
    document.getElementById('modal-title').textContent = 'Add New Project';
    clearProjectForm();
    document.getElementById('project-modal').classList.add('active');
}

function editProject(index) {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const project = projects[index];
    
    if (!project) return;
    
    currentEditingIndex = index;
    document.getElementById('modal-title').textContent = 'Edit Project';
    
    // Fill form
    document.getElementById('project-name').value = project.name || '';
    document.getElementById('project-description').value = project.description || '';
    // Only show user-provided thumbnail, not auto-generated YouTube thumbnails
    // Check if thumbnail is a YouTube thumbnail URL - if so, leave empty
    const thumbnailValue = project.thumbnail || '';
    const isYouTubeThumbnail = thumbnailValue.includes('img.youtube.com/vi/');
    document.getElementById('project-thumbnail').value = isYouTubeThumbnail ? '' : thumbnailValue;
    document.getElementById('project-youtube').value = project.youtubeUrl ? `https://www.youtube.com/watch?v=${project.youtubeUrl}` : '';
    document.getElementById('project-tech').value = project.technologies ? project.technologies.join(', ') : '';
    document.getElementById('project-url').value = project.projectUrl || '';
    document.getElementById('project-source').value = project.sourceUrl || '';
    
    document.getElementById('project-modal').classList.add('active');
}

function saveProject() {
    const name = document.getElementById('project-name').value.trim();
    const description = document.getElementById('project-description').value.trim();
    
    if (!name || !description) {
        alert('Please fill in at least the project name and description.');
        return;
    }
    
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const youtubeUrl = document.getElementById('project-youtube').value.trim();
    const youtubeId = extractYouTubeId(youtubeUrl);
    let thumbnail = document.getElementById('project-thumbnail').value.trim();
    
    // Only save user-provided thumbnail - don't auto-fill with YouTube thumbnail
    // Also, if user somehow entered a YouTube thumbnail URL, don't save it
    if (thumbnail && thumbnail.includes('img.youtube.com/vi/')) {
        thumbnail = ''; // Clear YouTube thumbnail URLs - they should never be saved
    }
    
    const project = {
        name,
        description,
        thumbnail: thumbnail, // Only user-provided thumbnails, empty if not provided
        youtubeUrl: youtubeId,
        technologies: document.getElementById('project-tech').value.split(',').map(t => t.trim()).filter(t => t),
        projectUrl: document.getElementById('project-url').value.trim(),
        sourceUrl: document.getElementById('project-source').value.trim()
    };
    
    if (currentEditingIndex === -1) {
        // Add new
        projects.push(project);
    } else {
        // Update existing
        projects[currentEditingIndex] = project;
    }
    
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    loadProjects();
    closeProjectModal();
    showSuccess('✅ Project saved successfully! Remember to export data.json to update the live site.');
}

function deleteProject(index) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    projects.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    loadProjects();
    showSuccess('Project deleted successfully!');
}

function closeProjectModal() {
    document.getElementById('project-modal').classList.remove('active');
    currentEditingIndex = -1;
    clearProjectForm();
}

function clearProjectForm() {
    document.getElementById('project-name').value = '';
    document.getElementById('project-description').value = '';
    document.getElementById('project-thumbnail').value = '';
    document.getElementById('project-youtube').value = '';
    document.getElementById('project-tech').value = '';
    document.getElementById('project-url').value = '';
    document.getElementById('project-source').value = '';
}

// Extract YouTube ID from various URL formats
function extractYouTubeId(url) {
    if (!url) return '';
    
    // If it's already just an ID (no URL), return it cleaned
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        return url.trim().split('&')[0].split('?')[0];
    }
    
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            // Clean the ID (remove any query parameters)
            return match[1].trim().split('&')[0].split('?')[0];
        }
    }
    
    return ''; // Return empty if we can't extract
}

// Get YouTube thumbnail URL from video ID
function getYouTubeThumbnail(videoId) {
    if (!videoId) return '';
    // Try maxresdefault first (highest quality), fallback to hqdefault
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// ========== DRAG AND DROP ==========

function initializeDragAndDrop() {
    // Set up container drop zone for better drag and drop
    const projectsList = document.getElementById('projects-list');
    if (projectsList) {
        projectsList.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            projectsList.classList.add('drag-over');
        });
        
        projectsList.addEventListener('dragleave', (e) => {
            // Only remove class if we're leaving the container, not just moving to a child
            if (!projectsList.contains(e.relatedTarget)) {
                projectsList.classList.remove('drag-over');
            }
        });
        
        projectsList.addEventListener('drop', (e) => {
            e.preventDefault();
            projectsList.classList.remove('drag-over');
            
            if (draggedElement) {
                const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
                const children = Array.from(projectsList.children);
                const fromIndex = parseInt(draggedElement.dataset.index);
                
                // Find drop position
                const afterElement = getDragAfterElement(projectsList, e.clientY);
                let toIndex;
                
                if (afterElement == null) {
                    toIndex = children.length - 1;
                } else {
                    toIndex = children.indexOf(afterElement);
                }
                
                if (fromIndex !== toIndex && toIndex !== -1 && fromIndex !== -1) {
                    const [moved] = projects.splice(fromIndex, 1);
                    projects.splice(toIndex, 0, moved);
                    
                    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
                    loadProjects();
                    showSuccess('Project order updated!');
                }
            }
        });
    }
    
    // Gallery drag and drop is now handled per-section in createGallerySection
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    const dragging = document.querySelector('.dragging');
    if (!dragging) return false;
    
    // Find the project item we're hovering over
    let hoverTarget = this;
    if (!hoverTarget.classList.contains('project-item')) {
        hoverTarget = e.target.closest('.project-item');
    }
    
    if (!hoverTarget || hoverTarget === dragging) return false;
    
    const projectsList = document.getElementById('projects-list');
    const afterElement = getDragAfterElement(projectsList, e.clientY);
    
    if (afterElement == null) {
        projectsList.appendChild(dragging);
    } else {
        projectsList.insertBefore(dragging, afterElement);
    }
    
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    if (!draggedElement) return false;
    
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const projectsList = document.getElementById('projects-list');
    const children = Array.from(projectsList.children);
    const fromIndex = parseInt(draggedElement.dataset.index);
    
    // Find the drop target - could be this element or a sibling
    let dropTarget = this;
    if (!dropTarget.classList.contains('project-item')) {
        // If dropped on the container, find the closest project item
        dropTarget = e.target.closest('.project-item');
    }
    
    if (!dropTarget) return false;
    
    const toIndex = children.indexOf(dropTarget);
    
    if (fromIndex !== toIndex && toIndex !== -1 && fromIndex !== -1) {
        // Reorder array
        const [moved] = projects.splice(fromIndex, 1);
        projects.splice(toIndex, 0, moved);
        
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        loadProjects();
        showSuccess('Project order updated!');
    }
    
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedElement = null;
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.project-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function getGalleryDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.gallery-item-admin:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Gallery drag and drop handlers
function handleGalleryDragStart(e) {
    draggedGalleryElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleGalleryDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    const dragging = document.querySelector('.gallery-item-admin.dragging');
    if (!dragging) return false;
    
    // Find the target section container
    let targetSectionContainer = e.target.closest('.gallery-section-items');
    if (!targetSectionContainer) {
        // If hovering over an item, get its section container
        const targetItem = e.target.closest('.gallery-item-admin');
        if (targetItem) {
            targetSectionContainer = targetItem.closest('.gallery-section-items');
        }
    }
    
    if (!targetSectionContainer) return false;
    
    // Find the item we're hovering over
    let hoverTarget = e.target.closest('.gallery-item-admin');
    
    if (hoverTarget && hoverTarget !== dragging) {
        const afterElement = getGalleryDragAfterElement(targetSectionContainer, e.clientY);
        if (afterElement == null) {
            targetSectionContainer.appendChild(dragging);
        } else {
            targetSectionContainer.insertBefore(dragging, afterElement);
        }
    } else if (!hoverTarget) {
        // Dropping on empty section
        targetSectionContainer.appendChild(dragging);
    }
    
    return false;
}

function handleGalleryDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    if (!draggedGalleryElement) return false;
    
    const fromSectionIndex = parseInt(draggedGalleryElement.dataset.sectionIndex);
    const fromItemIndex = parseInt(draggedGalleryElement.dataset.itemIndex);
    
    // Find target section - check multiple possible targets
    let targetSectionContainer = e.target.closest('.gallery-section-items');
    
    // If not found, try finding by parent
    if (!targetSectionContainer) {
        // Check if we're dropping on the section container itself
        const sectionDiv = e.target.closest('.gallery-section');
        if (sectionDiv) {
            targetSectionContainer = sectionDiv.querySelector('.gallery-section-items');
        }
    }
    
    // If still not found, try finding via gallery item
    if (!targetSectionContainer) {
        const targetItem = e.target.closest('.gallery-item-admin');
        if (targetItem) {
            targetSectionContainer = targetItem.closest('.gallery-section-items');
        }
    }
    
    // Last resort: check if we're dropping directly on the container
    if (!targetSectionContainer && e.target.classList.contains('gallery-section-items')) {
        targetSectionContainer = e.target;
    }
    
    if (!targetSectionContainer) {
        console.log('Could not find target section container');
        return false;
    }
    
    const toSectionIndex = parseInt(targetSectionContainer.dataset.sectionIndex);
    if (isNaN(toSectionIndex)) {
        console.log('Invalid section index');
        return false;
    }
    
    // Get all gallery items (not the placeholder text)
    const children = Array.from(targetSectionContainer.querySelectorAll('.gallery-item-admin'));
    
    // Find drop position
    let toItemIndex = children.length;
    const targetItem = e.target.closest('.gallery-item-admin');
    if (targetItem) {
        toItemIndex = children.indexOf(targetItem);
        if (toItemIndex === -1) toItemIndex = children.length;
    }
    
    const galleryData = getGalleryData();
    
    if (fromSectionIndex === toSectionIndex) {
        // Same section, just reorder
        if (fromItemIndex !== toItemIndex && fromItemIndex !== -1) {
            const section = galleryData.sections[fromSectionIndex];
            if (section && section.items) {
                const [moved] = section.items.splice(fromItemIndex, 1);
                // Adjust index if needed
                if (toItemIndex > fromItemIndex) {
                    toItemIndex--;
                }
                section.items.splice(toItemIndex, 0, moved);
                saveGalleryData(galleryData);
                loadGallery();
                showSuccess('Gallery order updated!');
            }
        }
    } else {
        // Different section, move item
        const fromSection = galleryData.sections[fromSectionIndex];
        const toSection = galleryData.sections[toSectionIndex];
        
        if (fromSection && toSection && fromSection.items && fromSection.items[fromItemIndex]) {
            const [moved] = fromSection.items.splice(fromItemIndex, 1);
            if (!toSection.items) {
                toSection.items = [];
            }
            // Clamp toItemIndex to valid range
            toItemIndex = Math.min(toItemIndex, toSection.items.length);
            toSection.items.splice(toItemIndex, 0, moved);
            saveGalleryData(galleryData);
            loadGallery();
            showSuccess('Image moved to different section!');
        } else {
            console.error('Invalid section or item index', { fromSection, toSection, fromItemIndex });
        }
    }
    
    return false;
}

function handleGalleryDragEnd(e) {
    this.classList.remove('dragging');
    draggedGalleryElement = null;
}

function getGalleryDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.gallery-item-admin:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ========== ABOUT & SKILLS ==========

function loadAbout() {
    const about = JSON.parse(localStorage.getItem(STORAGE_KEYS.ABOUT) || '{"text1": "", "text2": ""}');
    document.getElementById('about-text-1').value = about.text1 || '';
    document.getElementById('about-text-2').value = about.text2 || '';
}

function saveAbout() {
    const about = {
        text1: document.getElementById('about-text-1').value,
        text2: document.getElementById('about-text-2').value
    };
    localStorage.setItem(STORAGE_KEYS.ABOUT, JSON.stringify(about));
    // Note: User needs to export data.json to update live site
}

function loadSkills() {
    const skills = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS) || '[]');
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';
    
    skills.forEach((skill, index) => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item-admin';
        skillItem.innerHTML = `
            <input type="text" value="${skill}" onchange="updateSkill(${index}, this.value)">
            <button class="btn-remove" onclick="removeSkill(${index})">Remove</button>
        `;
        skillsList.appendChild(skillItem);
    });
}

function addSkill() {
    const skills = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS) || '[]');
    skills.push('New Skill');
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
    loadSkills();
}

function updateSkill(index, value) {
    const skills = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS) || '[]');
    skills[index] = value.trim();
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
}

function removeSkill(index) {
    const skills = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS) || '[]');
    skills.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
    loadSkills();
}

// ========== CONTACT ==========

function loadContact() {
    let contact = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT) || '{}');
    
    // Set defaults if not already set
    if (!contact.email) {
        contact.email = 'elad1488@gmail.com';
    }
    if (!contact.phone) {
        contact.phone = '+972 502337704';
    }
    
    // Save defaults if they were just set
    if (!localStorage.getItem(STORAGE_KEYS.CONTACT)) {
        localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(contact));
    }
    
    document.getElementById('contact-email').value = contact.email || '';
    document.getElementById('contact-phone').value = contact.phone || '';
    document.getElementById('contact-linkedin').value = contact.linkedin || '';
    document.getElementById('contact-github').value = contact.github || '';
    document.getElementById('contact-twitter').value = contact.twitter || '';
}

function saveContact() {
    const contact = {
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value,
        linkedin: document.getElementById('contact-linkedin').value,
        github: document.getElementById('contact-github').value,
        twitter: document.getElementById('contact-twitter').value
    };
    localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(contact));
    // Note: User needs to export data.json to update live site
}

// ========== HERO ==========

function loadHero() {
    const hero = JSON.parse(localStorage.getItem(STORAGE_KEYS.HERO) || '{}');
    document.getElementById('hero-name').value = hero.name || '';
    document.getElementById('hero-subtitle').value = hero.subtitle || '';
    document.getElementById('hero-description').value = hero.description || '';
}

function saveHero() {
    const hero = {
        name: document.getElementById('hero-name').value,
        subtitle: document.getElementById('hero-subtitle').value,
        description: document.getElementById('hero-description').value
    };
    localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(hero));
    // Note: User needs to export data.json to update live site
}

// ========== AUTO-SAVE ON CHANGE ==========

document.addEventListener('DOMContentLoaded', () => {
    // Auto-save about
    document.getElementById('about-text-1').addEventListener('input', saveAbout);
    document.getElementById('about-text-2').addEventListener('input', saveAbout);
    
    // Auto-save contact
    ['contact-email', 'contact-phone', 'contact-linkedin', 'contact-github', 'contact-twitter'].forEach(id => {
        document.getElementById(id).addEventListener('input', saveContact);
    });
    
    // Auto-save hero
    ['hero-name', 'hero-subtitle', 'hero-description'].forEach(id => {
        document.getElementById(id).addEventListener('input', saveHero);
    });
});

// ========== GALLERY MANAGEMENT ==========

// Migrate old gallery format to new sections format
function migrateGalleryData() {
    const oldGallery = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (!oldGallery) return;
    
    try {
        const parsed = JSON.parse(oldGallery);
        // Check if it's already in new format (has sections property)
        if (parsed && parsed.sections) return;
        
        // If it's an array, migrate to new format
        if (Array.isArray(parsed) && parsed.length > 0) {
            const newFormat = {
                sections: [{
                    name: 'Default',
                    items: parsed
                }]
            };
            localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(newFormat));
        } else if (Array.isArray(parsed) && parsed.length === 0) {
            // Empty array, initialize with new format
            localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify({ sections: [] }));
        }
    } catch (e) {
        console.error('Error migrating gallery data:', e);
    }
}

function getGalleryData() {
    migrateGalleryData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '{"sections":[]}');
    if (!data.sections) {
        data.sections = [];
    }
    return data;
}

function saveGalleryData(data) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(data));
}

function loadGallery() {
    const galleryData = getGalleryData();
    const container = document.getElementById('gallery-sections-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (galleryData.sections.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No gallery sections yet. Click "Add Section" to create your first section!</p>';
        return;
    }
    
    galleryData.sections.forEach((section, sectionIndex) => {
        const sectionDiv = createGallerySection(section, sectionIndex);
        container.appendChild(sectionDiv);
    });
    
    // Update section dropdown in modal
    updateSectionDropdown();
}

function createGallerySection(section, sectionIndex) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'gallery-section';
    sectionDiv.dataset.sectionIndex = sectionIndex;
    
    sectionDiv.innerHTML = `
        <div class="gallery-section-header">
            <h3>${section.name || 'Unnamed Section'}</h3>
            <div class="section-actions">
                <button class="btn-edit" onclick="editSection(${sectionIndex})">Edit</button>
                <button class="btn-delete" onclick="deleteSection(${sectionIndex})">Delete</button>
            </div>
        </div>
        <div class="gallery-list gallery-section-items" data-section-index="${sectionIndex}">
            ${section.items && section.items.length > 0 ? '' : '<p style="color: #999; text-align: center; padding: 1rem;">No images in this section yet.</p>'}
        </div>
    `;
    
    // Add items to section
    const itemsContainer = sectionDiv.querySelector('.gallery-section-items');
    // Remove placeholder text if items exist
    if (section.items && section.items.length > 0) {
        const placeholder = itemsContainer.querySelector('p');
        if (placeholder) {
            placeholder.remove();
        }
        section.items.forEach((item, itemIndex) => {
            const galleryItem = createGalleryItem(item, sectionIndex, itemIndex);
            itemsContainer.appendChild(galleryItem);
        });
    }
    
    // Set up drag and drop for this section
    const galleryList = sectionDiv.querySelector('.gallery-section-items');
    if (galleryList) {
        // Add event listeners to the items container
        galleryList.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'move';
            galleryList.classList.add('drag-over');
        });
        
        galleryList.addEventListener('dragleave', (e) => {
            if (!galleryList.contains(e.relatedTarget)) {
                galleryList.classList.remove('drag-over');
            }
        });
        
        galleryList.addEventListener('drop', handleGalleryDrop);
        
        // Also allow dropping on the section div itself (for empty sections)
        sectionDiv.addEventListener('dragover', (e) => {
            // Only handle if not already handled by a child
            if (e.target === sectionDiv || e.target.classList.contains('gallery-section-header')) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'move';
                galleryList.classList.add('drag-over');
            }
        });
        
        sectionDiv.addEventListener('dragleave', (e) => {
            if (!sectionDiv.contains(e.relatedTarget)) {
                galleryList.classList.remove('drag-over');
            }
        });
        
        sectionDiv.addEventListener('drop', (e) => {
            // Only handle if dropping on section itself, not on items
            if (e.target === sectionDiv || e.target.classList.contains('gallery-section-header') || e.target.closest('.gallery-section-header')) {
                handleGalleryDrop(e);
            }
        });
    }
    
    return sectionDiv;
}

function createGalleryItem(item, sectionIndex, itemIndex) {
    const div = document.createElement('div');
    div.className = 'gallery-item-admin';
    div.draggable = true;
    div.dataset.sectionIndex = sectionIndex;
    div.dataset.itemIndex = itemIndex;
    
    const imageSrc = item.imageUrl || item.imageBase64 || '';
    
    div.innerHTML = `
        <div class="drag-handle" title="Drag to reorder or move between sections">☰</div>
        <div class="gallery-item-preview">
            <img src="${imageSrc}" alt="${item.title || 'Gallery image'}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect width=\'200\' height=\'200\' fill=\'%23e0e0e0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\'%3ENo Image%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="gallery-item-info">
            <h4>${item.title || 'Untitled'}</h4>
            <p>${item.description || 'No description'}</p>
        </div>
        <div class="gallery-item-actions">
            <button class="btn-edit" onclick="editGalleryItem(${sectionIndex}, ${itemIndex})">Edit</button>
            <button class="btn-delete" onclick="deleteGalleryItem(${sectionIndex}, ${itemIndex})">Delete</button>
        </div>
    `;
    
    // Add drag event listeners
    div.addEventListener('dragstart', handleGalleryDragStart);
    div.addEventListener('dragover', handleGalleryDragOver);
    div.addEventListener('drop', handleGalleryDrop);
    div.addEventListener('dragend', handleGalleryDragEnd);
    
    return div;
}

function addNewGalleryItem() {
    currentEditingGalleryIndex = -1;
    currentEditingGallerySectionIndex = -1;
    additionalImages = [];
    document.getElementById('gallery-modal-title').textContent = 'Add Gallery Image';
    clearGalleryForm();
    updateSectionDropdown();
    document.getElementById('gallery-modal').classList.add('active');
}

function updateSectionDropdown() {
    const dropdown = document.getElementById('gallery-section');
    if (!dropdown) return;
    
    const galleryData = getGalleryData();
    dropdown.innerHTML = '<option value="">Select a section...</option>';
    
    galleryData.sections.forEach((section, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = section.name || 'Unnamed Section';
        if (currentEditingGallerySectionIndex === index) {
            option.selected = true;
        }
        dropdown.appendChild(option);
    });
}

function editGalleryItem(sectionIndex, itemIndex) {
    const galleryData = getGalleryData();
    if (!galleryData.sections[sectionIndex] || !galleryData.sections[sectionIndex].items[itemIndex]) return;
    
    const item = galleryData.sections[sectionIndex].items[itemIndex];
    
    currentEditingGalleryIndex = itemIndex;
    currentEditingGallerySectionIndex = sectionIndex;
    document.getElementById('gallery-modal-title').textContent = 'Edit Gallery Image';
    
    // Fill form
    document.getElementById('gallery-title').value = item.title || '';
    document.getElementById('gallery-description').value = item.description || '';
    document.getElementById('gallery-image-url').value = item.imageUrl || '';
    
    // Load additional images
    additionalImages = item.additionalImages || [];
    loadFixedAdditionalImages();
    
    // Show preview if base64 image exists
    if (item.imageBase64) {
        currentImageBase64 = item.imageBase64;
        const preview = document.getElementById('gallery-image-preview');
        const previewImg = document.getElementById('gallery-preview-img');
        if (preview && previewImg) {
            previewImg.src = item.imageBase64;
            preview.style.display = 'block';
        }
    } else if (item.imageUrl) {
        const preview = document.getElementById('gallery-image-preview');
        const previewImg = document.getElementById('gallery-preview-img');
        if (preview && previewImg) {
            previewImg.src = item.imageUrl;
            preview.style.display = 'block';
        }
    }
    
    updateSectionDropdown();
    document.getElementById('gallery-modal').classList.add('active');
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file type - support images and GIFs
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const isImage = validTypes.includes(fileType) || fileName.endsWith('.gif') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png');
    
    if (!isImage) {
        alert('Please upload an image file (JPG, PNG, GIF, WebP, or SVG).');
        return;
    }
    
    // Size limit - 60000 KB (60 MB) for GIFs, 5MB for others
    const maxSize = fileType === 'image/gif' ? 60000 * 1024 : 5 * 1024 * 1024; // 60000 KB for GIFs, 5MB for others
    if (file.size > maxSize) {
        const maxSizeMB = fileType === 'image/gif' ? '60 MB (60000 KB)' : '5 MB';
        alert(`File is too large. Please use a file smaller than ${maxSizeMB}.`);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentImageBase64 = e.target.result;
        const preview = document.getElementById('gallery-image-preview');
        const previewImg = document.getElementById('gallery-preview-img');
        if (preview && previewImg) {
            previewImg.src = currentImageBase64;
            preview.style.display = 'block';
        }
        // Show file size info
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        console.log(`File loaded: ${fileSizeMB} MB`);
    };
    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again or use an image URL instead.');
    };
    reader.readAsDataURL(file);
}

function saveGalleryItem() {
    const title = document.getElementById('gallery-title').value.trim();
    const description = document.getElementById('gallery-description').value.trim();
    const imageUrl = document.getElementById('gallery-image-url').value.trim();
    const sectionIndex = parseInt(document.getElementById('gallery-section').value);
    
    // Validate section selection
    if (sectionIndex === '' || isNaN(sectionIndex)) {
        alert('Please select a section for this image.');
        return;
    }
    
    const galleryData = getGalleryData();
    if (!galleryData.sections[sectionIndex]) {
        alert('Selected section does not exist. Please refresh and try again.');
        return;
    }
    
    // Need either uploaded image, image URL, or existing base64
    if (!currentImageBase64 && !imageUrl) {
        // Check if editing and has existing image
        if (currentEditingGalleryIndex !== -1 && currentEditingGallerySectionIndex !== -1) {
            const existingItem = galleryData.sections[currentEditingGallerySectionIndex].items[currentEditingGalleryIndex];
            if (existingItem && (existingItem.imageBase64 || existingItem.imageUrl)) {
                // Keep existing image
            } else {
                alert('Please upload an image or provide an image URL.');
                return;
            }
        } else {
            alert('Please upload an image or provide an image URL.');
            return;
        }
    }
    
    // Check if base64 is too large for localStorage (warn but allow)
    if (currentImageBase64) {
        const base64Size = currentImageBase64.length;
        const sizeInMB = (base64Size / (1024 * 1024)).toFixed(2);
        
        // localStorage typically has 5-10MB limit, warn if approaching
        if (base64Size > 3 * 1024 * 1024) { // 3MB base64
            const proceed = confirm(`Warning: This file is large (${sizeInMB} MB). Large files may not save properly in browser storage. Consider using an image URL instead. Do you want to continue?`);
            if (!proceed) {
                return;
            }
        }
    }
    
    try {
        // Filter out empty additional images (no URL and no base64)
        const validAdditionalImages = (additionalImages || []).filter(img => 
            (img.imageUrl && img.imageUrl.trim()) || (img.imageBase64 && img.imageBase64.trim())
        );
        
        const item = {
            title: title,
            description: description,
            imageUrl: imageUrl || '',
            imageBase64: currentImageBase64 || null,
            additionalImages: validAdditionalImages // Array of additional images (filtered)
        };
        
        console.log('Saving gallery item with additionalImages:', validAdditionalImages.length, validAdditionalImages);
        
        // If editing existing item, preserve base64 if URL is provided
        if (currentEditingGalleryIndex !== -1 && currentEditingGallerySectionIndex !== -1) {
            const existingItem = galleryData.sections[currentEditingGallerySectionIndex].items[currentEditingGalleryIndex];
            if (existingItem) {
                if (!currentImageBase64 && !imageUrl && existingItem.imageBase64) {
                    item.imageBase64 = existingItem.imageBase64;
                } else if (!currentImageBase64 && imageUrl) {
                    // If URL provided, clear base64
                    item.imageBase64 = null;
                }
                
                // If section changed, remove from old section and add to new
                if (currentEditingGallerySectionIndex !== sectionIndex) {
                    galleryData.sections[currentEditingGallerySectionIndex].items.splice(currentEditingGalleryIndex, 1);
                    if (!galleryData.sections[sectionIndex].items) {
                        galleryData.sections[sectionIndex].items = [];
                    }
                    galleryData.sections[sectionIndex].items.push(item);
                } else {
                    // Same section, just update
                    galleryData.sections[sectionIndex].items[currentEditingGalleryIndex] = item;
                }
            }
        } else {
            // Add new item
            if (!galleryData.sections[sectionIndex].items) {
                galleryData.sections[sectionIndex].items = [];
            }
            galleryData.sections[sectionIndex].items.push(item);
        }
        
        // Try to save to localStorage
        saveGalleryData(galleryData);
        
        console.log('Saved gallery item:', item);
        console.log('Additional images saved:', item.additionalImages?.length || 0);
        
        loadGallery();
        closeGalleryModal();
        showSuccess('✅ Gallery image saved! Remember to export data.json to update the live site.');
    } catch (error) {
        console.error('Error saving gallery item:', error);
        if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
            alert('Storage limit exceeded! The file is too large for browser storage. Please use an image URL instead of uploading the file.');
        } else {
            alert('Error saving gallery item: ' + error.message + '\n\nFor large files, consider using an image URL instead.');
        }
    }
}

function deleteGalleryItem(sectionIndex, itemIndex) {
    if (!confirm('Are you sure you want to delete this gallery image?')) return;
    
    const galleryData = getGalleryData();
    if (galleryData.sections[sectionIndex] && galleryData.sections[sectionIndex].items[itemIndex]) {
        galleryData.sections[sectionIndex].items.splice(itemIndex, 1);
        saveGalleryData(galleryData);
        loadGallery();
        showSuccess('Gallery image deleted successfully!');
    }
}

function closeGalleryModal() {
    document.getElementById('gallery-modal').classList.remove('active');
    currentEditingGalleryIndex = -1;
    currentImageBase64 = null;
    clearGalleryForm();
}

function clearGalleryForm() {
    document.getElementById('gallery-title').value = '';
    document.getElementById('gallery-description').value = '';
    document.getElementById('gallery-image-url').value = '';
    const imageInput = document.getElementById('gallery-image-input');
    if (imageInput) imageInput.value = '';
    document.getElementById('gallery-section').value = '';
    const preview = document.getElementById('gallery-image-preview');
    if (preview) preview.style.display = 'none';
    currentImageBase64 = null;
    additionalImages = [];
    loadFixedAdditionalImages();
}

// Additional images management
function addAdditionalImageInput() {
    additionalImages.push({ imageUrl: '', imageBase64: null });
    renderAdditionalImagesList();
}

function removeAdditionalImage(index) {
    additionalImages.splice(index, 1);
    renderAdditionalImagesList();
}

function renderAdditionalImagesList() {
    const container = document.getElementById('additional-images-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    additionalImages.forEach((img, index) => {
        const div = document.createElement('div');
        div.style.cssText = 'margin-bottom: 0.75rem; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 8px; background: #f9f9f9;';
        div.innerHTML = `
            <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500;">Additional Image ${index + 1}</label>
                    <input type="file" accept="image/*,.gif" onchange="handleAdditionalImageUpload(${index}, event)" style="width: 100%; margin-bottom: 0.5rem; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                    <input type="url" placeholder="Or image URL" value="${img.imageUrl || ''}" onchange="updateAdditionalImageUrl(${index}, this.value)" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                    ${img.imageBase64 || img.imageUrl ? `<img src="${img.imageBase64 || img.imageUrl}" alt="Preview" style="max-width: 100px; max-height: 100px; margin-top: 0.5rem; border-radius: 4px; border: 1px solid #ddd;">` : ''}
                </div>
                <button type="button" onclick="removeAdditionalImage(${index})" style="padding: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1.2rem; line-height: 1;">&times;</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function handleAdditionalImageUpload(index, event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }
    
    // Check file size (60MB for GIFs, 5MB for others)
    const maxSize = file.type === 'image/gif' ? 60 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
        alert(`File is too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        additionalImages[index].imageBase64 = e.target.result;
        additionalImages[index].imageUrl = ''; // Clear URL if base64 is provided
        renderAdditionalImagesList();
    };
    reader.readAsDataURL(file);
}

function updateAdditionalImageUrl(index, url) {
    additionalImages[index].imageUrl = url.trim();
    if (url.trim()) {
        additionalImages[index].imageBase64 = null; // Clear base64 if URL is provided
    }
    renderAdditionalImagesList();
}

// Fixed additional images handlers (for images 2, 3, 4)
function handleFixedAdditionalImage(slotIndex, event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }
    
    // Check file size (60MB for GIFs, 5MB for others)
    const maxSize = file.type === 'image/gif' ? 60 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
        alert(`File is too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        // Ensure additionalImages array is long enough
        while (additionalImages.length <= slotIndex) {
            additionalImages.push({ imageUrl: '', imageBase64: null });
        }
        
        additionalImages[slotIndex].imageBase64 = e.target.result;
        additionalImages[slotIndex].imageUrl = ''; // Clear URL if base64 is provided
        
        // Update preview
        const previewDiv = document.getElementById(`additional-image-${slotIndex + 2}-preview`);
        if (previewDiv) {
            previewDiv.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100px; max-height: 100px; border-radius: 4px; border: 1px solid #ddd;">`;
        }
        
        // Clear URL input
        const urlInput = document.getElementById(`additional-image-${slotIndex + 2}-url`);
        if (urlInput) urlInput.value = '';
    };
    reader.readAsDataURL(file);
}

function updateFixedAdditionalImageUrl(slotIndex, url) {
    // Ensure additionalImages array is long enough
    while (additionalImages.length <= slotIndex) {
        additionalImages.push({ imageUrl: '', imageBase64: null });
    }
    
    additionalImages[slotIndex].imageUrl = url.trim();
    if (url.trim()) {
        additionalImages[slotIndex].imageBase64 = null; // Clear base64 if URL is provided
        
        // Update preview
        const previewDiv = document.getElementById(`additional-image-${slotIndex + 2}-preview`);
        if (previewDiv) {
            previewDiv.innerHTML = `<img src="${url.trim()}" alt="Preview" style="max-width: 100px; max-height: 100px; border-radius: 4px; border: 1px solid #ddd;">`;
        }
    } else {
        // Clear preview if URL is empty
        const previewDiv = document.getElementById(`additional-image-${slotIndex + 2}-preview`);
        if (previewDiv) previewDiv.innerHTML = '';
    }
}

function loadFixedAdditionalImages() {
    // Load images 2, 3, 4 into fixed slots
    for (let i = 0; i < 3; i++) {
        const img = additionalImages[i] || { imageUrl: '', imageBase64: null };
        const urlInput = document.getElementById(`additional-image-${i + 2}-url`);
        const previewDiv = document.getElementById(`additional-image-${i + 2}-preview`);
        
        if (urlInput) {
            urlInput.value = img.imageUrl || '';
        }
        
        if (previewDiv && (img.imageBase64 || img.imageUrl)) {
            previewDiv.innerHTML = `<img src="${img.imageBase64 || img.imageUrl}" alt="Preview" style="max-width: 100px; max-height: 100px; border-radius: 4px; border: 1px solid #ddd;">`;
        } else if (previewDiv) {
            previewDiv.innerHTML = '';
        }
    }
    
    // Render any additional images beyond the first 3
    renderAdditionalImagesList();
}

// ========== SECTION MANAGEMENT ==========

function addNewSection() {
    currentEditingSectionIndex = -1;
    document.getElementById('section-modal-title').textContent = 'Add Section';
    document.getElementById('section-name').value = '';
    document.getElementById('section-modal').classList.add('active');
}

function editSection(sectionIndex) {
    const galleryData = getGalleryData();
    if (!galleryData.sections[sectionIndex]) return;
    
    currentEditingSectionIndex = sectionIndex;
    document.getElementById('section-modal-title').textContent = 'Edit Section';
    document.getElementById('section-name').value = galleryData.sections[sectionIndex].name || '';
    document.getElementById('section-modal').classList.add('active');
}

function saveSection() {
    const name = document.getElementById('section-name').value.trim();
    if (!name) {
        alert('Please enter a section name.');
        return;
    }
    
    const galleryData = getGalleryData();
    
    if (currentEditingSectionIndex === -1) {
        // Add new section
        galleryData.sections.push({
            name: name,
            items: []
        });
    } else {
        // Update existing section
        if (galleryData.sections[currentEditingSectionIndex]) {
            galleryData.sections[currentEditingSectionIndex].name = name;
        }
    }
    
    saveGalleryData(galleryData);
    loadGallery();
    closeSectionModal();
    updateSectionDropdown();
    showSuccess('Section saved successfully!');
}

function deleteSection(sectionIndex) {
    const galleryData = getGalleryData();
    if (!galleryData.sections[sectionIndex]) return;
    
    const section = galleryData.sections[sectionIndex];
    const itemCount = section.items ? section.items.length : 0;
    
    if (itemCount > 0) {
        if (!confirm(`This section contains ${itemCount} image(s). Are you sure you want to delete it? All images in this section will be deleted.`)) {
            return;
        }
    } else {
        if (!confirm('Are you sure you want to delete this section?')) {
            return;
        }
    }
    
    galleryData.sections.splice(sectionIndex, 1);
    saveGalleryData(galleryData);
    loadGallery();
    updateSectionDropdown();
    showSuccess('Section deleted successfully!');
}

function closeSectionModal() {
    document.getElementById('section-modal').classList.remove('active');
    currentEditingSectionIndex = -1;
}

// ========== LOAD ALL DATA ==========

function loadAllData() {
    loadProjects();
    loadAbout();
    loadSkills();
    loadContact();
    loadHero();
}

// ========== SAVE ALL ==========

function saveAllData() {
    saveAbout();
    saveContact();
    saveHero();
    showSuccess('✅ All changes saved to localStorage! Click "Export Data" to update data.json for the live site.');
}

// Export all data to JSON (for updating data.json file)
function exportAllData() {
    const data = {
        projects: JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]'),
        gallery: JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '{"sections":[]}'),
        about: JSON.parse(localStorage.getItem(STORAGE_KEYS.ABOUT) || '{"text1":"","text2":""}'),
        skills: JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS) || '[]'),
        contact: JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT) || '{}'),
        hero: JSON.parse(localStorage.getItem(STORAGE_KEYS.HERO) || '{}')
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    
    // Create download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show detailed instructions
    const instructions = `
✅ הקובץ data.json הורד!

📋 כדי שהשינויים יופיעו באתר האונליין:

1. פתח את GitHub Desktop או את התיקייה המקומית שלך
2. העתק את הקובץ data.json שהורדת לתיקייה:
   C:\\myWebsite\\my-portfolio-website\\data.json
   
   (החלף את הקובץ הקיים)

3. ב-GitHub Desktop:
   - Commit את השינוי
   - Push ל-GitHub
   
4. חכה 1-2 דקות - האתר יתעדכן אוטומטית!

💡 טיפ: אחרי כל שינוי באדמין, ייצא את הנתונים כדי לשמור אותם ב-data.json
    `;
    
    alert(instructions);
    showSuccess('✅ הקובץ data.json הורד! עיין בהוראות איך להעלות אותו ל-GitHub.');
}

// Import data from JSON file
async function importDataFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (data.projects) localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
            if (data.gallery) localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(data.gallery));
            if (data.about) localStorage.setItem(STORAGE_KEYS.ABOUT, JSON.stringify(data.about));
            if (data.skills) localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(data.skills));
            if (data.contact) localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(data.contact));
            if (data.hero) localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(data.hero));
            
            // Reload all data
            loadAllData();
            loadGallery();
            loadProjects();
            
            showSuccess('Data imported successfully!');
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    
    input.click();
}

// ========== UTILITY ==========

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}
