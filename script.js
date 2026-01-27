// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Active Navigation Link
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Form Submission
// Contact form handling with Web3Forms API
const contactForm = document.querySelector('.contact-form');
const contactFormMessage = document.getElementById('contact-form-message');
const contactSubmitBtn = document.getElementById('contact-submit-btn');

// Web3Forms Access Key - Get yours free at https://web3forms.com
// Replace this with your own access key from web3forms.com
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Get your email from localStorage or use default
        const contact = JSON.parse(localStorage.getItem('portfolio_contact') || '{}');
        const yourEmail = contact.email || 'elad1488@gmail.com';
        
        // Disable submit button and show loading
        if (contactSubmitBtn) {
            contactSubmitBtn.disabled = true;
            contactSubmitBtn.textContent = 'Sending...';
        }
        
        // Hide previous messages
        if (contactFormMessage) {
            contactFormMessage.style.display = 'none';
        }
        
        try {
            // Use Web3Forms API to send email (free service)
            // If access key is not set, fallback to mailto
            if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_ACCESS_KEY,
                        subject: `Portfolio Contact: ${name}`,
                        from_name: name,
                        from_email: email,
                        message: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                        to_email: yourEmail
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success message
                    if (contactFormMessage) {
                        contactFormMessage.style.display = 'block';
                        contactFormMessage.style.background = '#10b981';
                        contactFormMessage.style.color = 'white';
                        contactFormMessage.textContent = `✅ Thank you ${name}! Your message has been sent successfully. I'll get back to you soon!`;
                        contactFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                    
                    // Reset form after a delay
                    setTimeout(() => {
                        contactForm.reset();
                        if (contactSubmitBtn) {
                            contactSubmitBtn.disabled = false;
                            contactSubmitBtn.textContent = 'Send Message';
                        }
                    }, 2000);
                    return;
                } else {
                    throw new Error(result.message || 'Failed to send message');
                }
            } else {
                // Fallback to mailto if access key not configured
                throw new Error('Web3Forms not configured');
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Fallback to mailto if API fails or not configured
            const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:${yourEmail}?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            
            // Show success message (mailto opened)
            if (contactFormMessage) {
                contactFormMessage.style.display = 'block';
                contactFormMessage.style.background = '#10b981';
                contactFormMessage.style.color = 'white';
                contactFormMessage.textContent = `✅ Thank you ${name}! Your email client should open. If it doesn't, please email me directly at ${yourEmail}`;
                contactFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            // Reset form after a delay
            setTimeout(() => {
                contactForm.reset();
                if (contactSubmitBtn) {
                    contactSubmitBtn.disabled = false;
                    contactSubmitBtn.textContent = 'Send Message';
                }
            }, 2000);
        }
    });
}

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe skill items
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
    observer.observe(item);
});

// Add active class to nav links on page load
window.addEventListener('load', () => {
    activateNavLink();
    loadDynamicContent();
});

// ========== DYNAMIC CONTENT LOADING ==========

// Load data from JSON file - data.json is the primary source, localStorage is only used as fallback
let siteData = null;

async function loadDataFromFile() {
    try {
        const response = await fetch('data.json');
        if (response.ok) {
            siteData = await response.json();
            console.log('✅ Loaded data.json successfully:', siteData);
            console.log('Projects count:', siteData.projects?.length || 0);
            
            // data.json is the PRIMARY source for live site (shared across all visitors)
            // localStorage is only used as fallback if data.json is empty or missing
            // This allows admin to edit via localStorage, then export to update data.json
            if (siteData.projects && siteData.projects.length > 0) {
                // Use data.json if it has projects - this is what visitors see on live site
                // Don't overwrite with localStorage - data.json is the source of truth for public site
                console.log('Using projects from data.json:', siteData.projects.length);
            } else {
                // Fallback to localStorage only if data.json is empty
                console.log('data.json has no projects, checking localStorage...');
                const storedProjects = localStorage.getItem('portfolio_projects');
                if (storedProjects) {
                    try {
                        const parsed = JSON.parse(storedProjects);
                        if (parsed && parsed.length > 0) {
                            siteData.projects = parsed;
                            console.log('Using projects from localStorage (fallback):', parsed.length);
                        } else {
                            siteData.projects = [];
                            console.log('localStorage projects array is empty');
                        }
                    } catch (e) {
                        console.error('Error parsing projects from localStorage:', e);
                        siteData.projects = [];
                    }
                } else {
                    siteData.projects = [];
                    console.log('No projects in localStorage either');
                }
            }
            
            // data.json is the PRIMARY source for live site
            // localStorage is only used as fallback if data.json is empty
            if (siteData.gallery && (siteData.gallery.sections?.length > 0 || Object.keys(siteData.gallery).length > 1)) {
                // Use data.json if it has gallery data
                console.log('Using gallery from data.json:', siteData.gallery.sections?.length || 0, 'sections');
            } else {
                // Fallback to localStorage only if data.json is empty
                console.log('data.json has no gallery, checking localStorage...');
                const storedGallery = localStorage.getItem('portfolio_gallery');
                if (storedGallery && storedGallery !== '{"sections":[]}') {
                    try {
                        siteData.gallery = JSON.parse(storedGallery);
                        console.log('Using gallery from localStorage (fallback):', siteData.gallery.sections?.length || 0, 'sections');
                    } catch (e) {
                        console.error('Error parsing gallery from localStorage:', e);
                        siteData.gallery = { sections: [] };
                    }
                } else {
                    siteData.gallery = { sections: [] };
                    console.log('No gallery in localStorage either');
                }
            }
            
            // For about: localStorage takes priority (user can edit via admin)
            const storedAbout = localStorage.getItem('portfolio_about');
            if (storedAbout && storedAbout !== '{"text1":"","text2":""}') {
                siteData.about = JSON.parse(storedAbout);
            } else if (siteData.about && (siteData.about.text1 || siteData.about.text2)) {
                // Use data.json only if localStorage is empty
                localStorage.setItem('portfolio_about', JSON.stringify(siteData.about));
            }
            
            // For skills: localStorage takes priority (user can add via admin)
            const storedSkills = localStorage.getItem('portfolio_skills');
            if (storedSkills && storedSkills !== '[]') {
                siteData.skills = JSON.parse(storedSkills);
            } else if (siteData.skills && siteData.skills.length > 0) {
                // Use data.json only if localStorage is empty
                localStorage.setItem('portfolio_skills', JSON.stringify(siteData.skills));
            }
            
            // For contact: localStorage takes priority (user can edit via admin)
            const storedContact = localStorage.getItem('portfolio_contact');
            if (storedContact && storedContact !== '{}') {
                siteData.contact = JSON.parse(storedContact);
            } else if (siteData.contact && Object.keys(siteData.contact).length > 0) {
                // Use data.json only if localStorage is empty
                localStorage.setItem('portfolio_contact', JSON.stringify(siteData.contact));
            }
            
            // For hero: localStorage takes priority (user can edit via admin)
            // data.json is only used as default if localStorage is empty
            const storedHero = localStorage.getItem('portfolio_hero');
            if (storedHero && storedHero !== '{}') {
                const parsedHero = JSON.parse(storedHero);
                if (parsedHero.name || parsedHero.subtitle || parsedHero.description) {
                    siteData.hero = parsedHero;
                }
            } else if (siteData.hero && (siteData.hero.name || siteData.hero.subtitle || siteData.hero.description)) {
                // Use data.json only if localStorage is empty
                localStorage.setItem('portfolio_hero', JSON.stringify(siteData.hero));
            }
            
            // IMPORTANT: Don't clear localStorage on live site - users can edit content via admin panel
            // localStorage stores user-edited content, data.json is only the initial/default data
            // Only merge: use data.json values if localStorage is empty, otherwise keep localStorage
        }
    } catch (error) {
        console.error('❌ Could not load data.json, using localStorage only:', error);
        // Fallback to localStorage if data.json fails
        siteData = {
            projects: JSON.parse(localStorage.getItem('portfolio_projects') || '[]'),
            gallery: JSON.parse(localStorage.getItem('portfolio_gallery') || '{"sections":[]}'),
            about: JSON.parse(localStorage.getItem('portfolio_about') || '{"text1":"","text2":""}'),
            skills: JSON.parse(localStorage.getItem('portfolio_skills') || '[]'),
            contact: JSON.parse(localStorage.getItem('portfolio_contact') || '{}'),
            hero: JSON.parse(localStorage.getItem('portfolio_hero') || '{}')
        };
        console.log('Using localStorage as fallback, projects count:', siteData.projects?.length || 0);
    }
}

async function loadDynamicContent() {
    // First try to load from file, then load from localStorage
    await loadDataFromFile();
    console.log('siteData after loadDataFromFile:', siteData);
    console.log('Projects in siteData:', siteData?.projects?.length || 0);
    
    // Now load all sections
    loadProjects();
    loadGallery();
    loadAbout();
    loadSkills();
    loadHero();
    loadContact();
}

// Load Projects from siteData (data.json is primary source)
function loadProjects() {
    // Use siteData.projects (from data.json) as PRIMARY source for live site
    // localStorage is only fallback if data.json is empty
    // Admin can edit via localStorage, then export to update data.json for all visitors
    const projects = siteData?.projects || [];
    
    console.log('Loading projects:', projects.length, 'projects found');
    console.log('siteData:', siteData);
    
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!projectsGrid) {
        console.error('Projects grid element not found!');
        return;
    }
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No projects yet. Use the admin panel to add projects!</p>';
        return;
    }
    
    projectsGrid.innerHTML = '';
    
    // Load ALL projects - no limit
    projects.forEach((project, index) => {
        try {
            const projectCard = createProjectCard(project);
            if (projectCard) {
                projectsGrid.appendChild(projectCard);
            }
        } catch (error) {
            console.error(`Error loading project ${index}:`, error, project);
            // Create a fallback card for broken projects
            const fallbackCard = document.createElement('div');
            fallbackCard.className = 'project-card';
            fallbackCard.innerHTML = `
                <div class="project-content">
                    <h3>${project.name || 'Project Error'}</h3>
                    <p style="color: #ef4444;">Error loading this project. Please check the admin panel.</p>
                </div>
            `;
            projectsGrid.appendChild(fallbackCard);
        }
    });
    
    // Re-observe for animations
    setTimeout(() => {
        const newCards = document.querySelectorAll('.project-card');
        newCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }, 100);
}

// Extract YouTube ID from URL (helper function)
function extractYouTubeIdFromUrl(url) {
    if (!url) return '';
    
    // If it's already just an ID, return it
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        return url;
    }
    
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    
    return '';
}

// Get YouTube thumbnail URL from video ID
function getYouTubeThumbnail(videoId) {
    if (!videoId) return '';
    // Clean the video ID (remove any extra characters)
    const cleanId = videoId.trim().split('&')[0].split('?')[0];
    return `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;
}

// Handle thumbnail loading errors with fallback
function handleThumbnailError(img, youtubeId) {
    // Clean the YouTube ID if provided
    if (youtubeId) {
        youtubeId = youtubeId.trim().split('&')[0].split('?')[0];
    }
    
    // If it's a YouTube thumbnail and maxresdefault failed, try hqdefault
    if (youtubeId && (img.src.includes('youtube.com') || img.src.includes('maxresdefault'))) {
        // Try hqdefault (high quality default)
        img.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
        // If that also fails, try mqdefault
        img.onerror = function() {
            this.src = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
            this.onerror = function() {
                // Try sddefault as another fallback
                this.src = `https://img.youtube.com/vi/${youtubeId}/sddefault.jpg`;
                this.onerror = function() {
                    // Final fallback - show placeholder
                    this.style.display = 'none';
                    const placeholder = this.nextElementSibling;
                    if (placeholder && placeholder.classList.contains('project-placeholder')) {
                        placeholder.style.display = 'flex';
                    }
                };
            };
        };
        return;
    }
    // Otherwise show placeholder
    img.style.display = 'none';
    const placeholder = img.nextElementSibling;
    if (placeholder && placeholder.classList.contains('project-placeholder')) {
        placeholder.style.display = 'flex';
    }
}

function createProjectCard(project) {
    if (!project) {
        console.error('Project is null or undefined');
        return null;
    }
    
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Always show thumbnail image (not embedded video)
    let thumbnailUrl = project.thumbnail || '';
    
    // If thumbnail is a YouTube thumbnail URL (from old data), treat it as empty
    if (thumbnailUrl && thumbnailUrl.includes('img.youtube.com/vi/')) {
        thumbnailUrl = '';
    }
    
    // Check if thumbnail is actually empty or invalid
    const hasValidThumbnail = thumbnailUrl && thumbnailUrl.trim() !== '' && !thumbnailUrl.includes('img.youtube.com/vi/');
    
    // If no valid thumbnail but YouTube URL exists, ALWAYS use YouTube thumbnail
    if (!hasValidThumbnail && project.youtubeUrl) {
        // Make sure youtubeUrl is a valid video ID (not a full URL)
        let videoId = project.youtubeUrl;
        if (typeof videoId === 'string') {
            if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
                // Extract ID from URL if it's a full URL
                videoId = extractYouTubeIdFromUrl(videoId);
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
    
    let mediaContent = '';
    
    // If we still don't have a thumbnail but have YouTube URL, try one more time
    if (!thumbnailUrl && project.youtubeUrl) {
        let videoId = project.youtubeUrl;
        if (typeof videoId === 'string') {
            if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
                videoId = extractYouTubeIdFromUrl(videoId);
            }
            if (videoId) {
                videoId = videoId.trim().split('&')[0].split('?')[0];
                if (videoId) {
                    thumbnailUrl = getYouTubeThumbnail(videoId);
                }
            }
        }
    }
    
    if (thumbnailUrl) {
        // If YouTube URL exists, make thumbnail clickable to open video
        if (project.youtubeUrl) {
            // Get clean video ID for the link
            let videoIdForLink = project.youtubeUrl;
            if (typeof videoIdForLink === 'string') {
                if (videoIdForLink.includes('youtube.com') || videoIdForLink.includes('youtu.be')) {
                    videoIdForLink = extractYouTubeIdFromUrl(videoIdForLink);
                }
                if (videoIdForLink) {
                    videoIdForLink = videoIdForLink.trim().split('&')[0].split('?')[0];
                }
            }
            const safeVideoId = videoIdForLink || project.youtubeUrl;
            mediaContent = `
                <a href="https://www.youtube.com/watch?v=${safeVideoId}" target="_blank" class="project-thumbnail-link">
                    <img src="${thumbnailUrl}" alt="${project.name}" onerror="handleThumbnailError(this, '${safeVideoId}')">
                    <div class="youtube-play-overlay">
                        <svg width="68" height="48" viewBox="0 0 68 48">
                            <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.63-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                            <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                        </svg>
                    </div>
                    <div class="project-placeholder" style="display: none;">${project.name}</div>
                </a>
            `;
        } else {
            mediaContent = `
                <img src="${thumbnailUrl}" alt="${project.name}" onerror="handleThumbnailError(this, '')">
                <div class="project-placeholder" style="display: none;">${project.name}</div>
            `;
        }
    } else {
        // No thumbnail at all - show placeholder
        mediaContent = `
            <div class="project-placeholder">${project.name}</div>
        `;
    }
    
    // Technologies
    const techTags = project.technologies && project.technologies.length > 0
        ? project.technologies.map(tech => `<span>${tech}</span>`).join('')
        : '';
    
    // Links
    let linksHTML = '';
    if (project.projectUrl) {
        linksHTML += `<a href="${project.projectUrl}" class="project-link" target="_blank">View Project</a>`;
    }
    if (project.sourceUrl) {
        linksHTML += `<a href="${project.sourceUrl}" class="project-link" target="_blank">Source Code</a>`;
    }
    
    // Truncate description to create a summary (first 150 characters)
    let summary = project.description || '';
    if (summary.length > 150) {
        summary = summary.substring(0, 150).trim() + '...';
    }
    
    card.innerHTML = `
        <div class="project-image">
            ${mediaContent}
        </div>
        <div class="project-content">
            <h3>${project.name || 'Untitled Project'}</h3>
            <p class="project-summary">${summary}</p>
            ${techTags ? `<div class="project-tech">${techTags}</div>` : ''}
            ${linksHTML ? `<div class="project-links">${linksHTML}</div>` : ''}
        </div>
    `;
    
    return card;
}

// Load About Section
function loadAbout() {
    // Use siteData.about (from data.json) as PRIMARY source for live site
    // localStorage is only fallback if data.json is empty
    const about = siteData?.about || { text1: "", text2: "" };
    
    const aboutText = document.getElementById('about-text');
    
    let html = '';
    if (about.text1) {
        html += `<p>${about.text1}</p>`;
    }
    if (about.text2) {
        html += `<p>${about.text2}</p>`;
    }
    
    if (!html) {
        html = '<p>I\'m a developer with X years of experience creating modern web applications. I specialize in React, Node.js, and UI/UX design.</p><p>My passion is creating digital solutions that are not only functional, but also beautiful and easy to use.</p>';
    }
    
    aboutText.innerHTML = html;
}

// Load Skills
function loadSkills() {
    // Use siteData.skills (from data.json) as PRIMARY source for live site
    // localStorage is only fallback if data.json is empty
    const skills = siteData?.skills || [];
    
    const skillsGrid = document.getElementById('skills-grid');
    
    if (skills.length === 0) {
        skillsGrid.innerHTML = '<div class="skill-item">React</div><div class="skill-item">JavaScript</div><div class="skill-item">Node.js</div>';
        return;
    }
    
    skillsGrid.innerHTML = skills.map(skill => 
        `<div class="skill-item">${skill}</div>`
    ).join('');
    
    // Re-observe for animations
    setTimeout(() => {
        const newSkills = document.querySelectorAll('.skill-item');
        newSkills.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
            observer.observe(item);
        });
    }, 100);
}

// Load Hero Section
function loadHero() {
    // Use siteData.hero (from data.json) as PRIMARY source for live site
    // localStorage is only fallback if data.json is empty
    let hero = siteData?.hero || {};
    
    if (hero && hero.name) {
        const nameElement = document.getElementById('hero-name');
        if (nameElement) nameElement.textContent = hero.name;
    }
    
    if (hero && hero.subtitle) {
        const subtitleElement = document.getElementById('hero-subtitle');
        if (subtitleElement) {
            subtitleElement.textContent = hero.subtitle;
            console.log('Set subtitle to:', hero.subtitle);
        }
    }
    
    if (hero && hero.description) {
        const descElement = document.getElementById('hero-description');
        if (descElement) descElement.textContent = hero.description;
    }
    
    // Setup GIF slideshow in hero background
    setupHeroGifSlideshow();
}

// Setup GIF slideshow in hero background
function setupHeroGifSlideshow() {
    const slideshowContainer = document.getElementById('hero-background-slideshow');
    if (!slideshowContainer) return;
    
    // Helper function to convert GitHub blob URLs to raw URLs
    function convertGitHubUrl(url) {
        if (url && url.includes('github.com') && url.includes('/blob/')) {
            return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }
        return url;
    }
    
    // Helper function to check if URL or base64 is a GIF (strict check)
    function isGif(url) {
        if (!url) return false;
        const lowerUrl = url.toLowerCase().trim();
        
        // Check if it's a base64 GIF - must start with exact MIME type
        if (lowerUrl.startsWith('data:image/gif')) {
            // Additional check: ensure it's actually a GIF, not just contains "gif" in the string
            const mimeMatch = lowerUrl.match(/^data:image\/([^;]+)/);
            if (mimeMatch && mimeMatch[1] === 'gif') {
                return true;
            }
            return false;
        }
        
        // For URLs: check if it ends with .gif or has .gif before query parameters
        // Remove query parameters and fragments for checking
        const urlWithoutQuery = lowerUrl.split('?')[0].split('#')[0];
        
        // Must end with .gif (not just contain "gif" in path)
        if (urlWithoutQuery.endsWith('.gif')) {
            return true;
        }
        
        // Check for .gif? (with query parameters)
        if (lowerUrl.includes('.gif?')) {
            const beforeQuery = lowerUrl.split('?')[0];
            if (beforeQuery.endsWith('.gif')) {
                return true;
            }
        }
        
        // Additional check: ensure it's not a false positive from paths like /gif/ or domain names
        // Only accept if .gif appears as a file extension
        const gifPattern = /\.gif(\?|#|$)/i;
        if (gifPattern.test(lowerUrl)) {
            return true;
        }
        
        return false;
    }
    
    // Collect images only from Simulation & CAD and 3D printing sections
    const simulationImages = [];
    const printingImages = [];
    const galleryData = siteData?.gallery || { sections: [] };
    
    if (galleryData.sections) {
        galleryData.sections.forEach(section => {
            const sectionName = (section.name || '').toLowerCase();
            const isSimulation = sectionName.includes('simulation') || sectionName.includes('cad');
            const isPrinting = sectionName.includes('3d') || sectionName.includes('printing') || sectionName.includes('print');
            
            if (section.items && (isSimulation || isPrinting)) {
                section.items.forEach((item, itemIndex) => {
                    // Check main image (only GIFs)
                    let mainImage = item.imageUrl || item.imageBase64 || '';
                    mainImage = convertGitHubUrl(mainImage);
                    if (mainImage) {
                        if (isGif(mainImage)) {
                            if (isSimulation) {
                                simulationImages.push(mainImage);
                            } else if (isPrinting) {
                                printingImages.push(mainImage);
                            }
                        } else {
                            console.warn(`Skipping non-GIF main image from ${section.name} item ${itemIndex}:`, mainImage.substring(0, 100));
                        }
                    }
                    
                    // Check additional images (only GIFs)
                    if (item.additionalImages && Array.isArray(item.additionalImages)) {
                        item.additionalImages.forEach((additionalImg, addIndex) => {
                            let imgSrc = additionalImg.imageUrl || additionalImg.imageBase64 || '';
                            imgSrc = convertGitHubUrl(imgSrc);
                            if (imgSrc) {
                                if (isGif(imgSrc)) {
                                    if (isSimulation) {
                                        simulationImages.push(imgSrc);
                                    } else if (isPrinting) {
                                        printingImages.push(imgSrc);
                                    }
                                } else {
                                    console.warn(`Skipping non-GIF additional image from ${section.name} item ${itemIndex} additional ${addIndex}:`, imgSrc.substring(0, 100));
                                }
                            }
                        });
                    }
                });
            }
        });
    }
    
    // Add dedicated hero slideshow images from data.json or localStorage FIRST (only GIFs)
    const heroSlideshowData = siteData?.heroSlideshow || JSON.parse(localStorage.getItem('portfolio_hero_slideshow') || '[]');
    const dedicatedImages = [];
    if (heroSlideshowData && Array.isArray(heroSlideshowData)) {
        heroSlideshowData.forEach((img, index) => {
            let imgSrc = img.imageUrl || img.imageBase64 || '';
            imgSrc = convertGitHubUrl(imgSrc);
            if (imgSrc) {
                if (isGif(imgSrc)) {
                    dedicatedImages.push(imgSrc);
                } else {
                    console.warn(`Skipping non-GIF image from dedicated slideshow at index ${index}:`, imgSrc.substring(0, 100));
                }
            }
        });
        console.log(`Found ${dedicatedImages.length} dedicated hero slideshow GIFs (filtered from ${heroSlideshowData.length} total):`, dedicatedImages);
    }
    
    // Combine images with 80% Simulation, 20% 3D printing ratio
    const gifUrls = [...dedicatedImages]; // Start with dedicated images
    const totalSimulation = simulationImages.length;
    const totalPrinting = printingImages.length;
    
    if (totalSimulation === 0 && totalPrinting === 0 && dedicatedImages.length === 0) {
        console.log('No images found in Simulation, 3D printing sections, or dedicated slideshow');
    } else {
        // Calculate how many images from each section to include
        // Target: 80% Simulation, 20% Printing
        // We'll use a simple approach: for every 4 simulation images, add 1 printing image
        let simIndex = 0;
        let printIndex = 0;
        
        // Add images in 80/20 ratio
        while (simIndex < totalSimulation || printIndex < totalPrinting) {
            // Add 4 simulation images for every 1 printing image
            for (let i = 0; i < 4 && simIndex < totalSimulation; i++) {
                gifUrls.push(simulationImages[simIndex]);
                simIndex++;
            }
            
            // Add 1 printing image
            if (printIndex < totalPrinting) {
                gifUrls.push(printingImages[printIndex]);
                printIndex++;
            }
            
            // If we've added all printing images but still have simulation images, add them all
            if (printIndex >= totalPrinting && simIndex < totalSimulation) {
                while (simIndex < totalSimulation) {
                    gifUrls.push(simulationImages[simIndex]);
                    simIndex++;
                }
            }
            
            // If we've added all simulation images but still have printing images, stop
            if (simIndex >= totalSimulation) {
                break;
            }
        }
        
        console.log(`Hero slideshow: ${dedicatedImages.length} dedicated, ${simulationImages.length} Simulation images, ${printingImages.length} 3D printing images`);
        console.log(`Combined ${gifUrls.length} total images in slideshow`);
    }
    
    // If no images found, don't show slideshow
    if (gifUrls.length === 0) {
        console.log('No images found for hero slideshow');
        return;
    }
    
    console.log(`Found ${gifUrls.length} images for hero slideshow:`, gifUrls);
    
    // Create img elements for each image
    gifUrls.forEach((imgUrl, index) => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = `Hero background image ${index + 1}`;
        img.loading = 'eager'; // Load immediately for background
        if (index === 0) {
            img.classList.add('active'); // First image is active
        }
        slideshowContainer.appendChild(img);
    });
    
    // Cycle through images every 2.5 seconds
    let currentIndex = 0;
    const images = slideshowContainer.querySelectorAll('img');
    
    if (images.length > 1) {
        setInterval(() => {
            // Remove active class from current image
            images[currentIndex].classList.remove('active');
            
            // Move to next image
            currentIndex = (currentIndex + 1) % images.length;
            
            // Add active class to new image
            images[currentIndex].classList.add('active');
        }, 2500); // 2.5 seconds per image
    }
}

// Load Gallery Section
function loadGallery() {
    // Use siteData.gallery (from data.json) as PRIMARY source for live site
    // localStorage is only fallback if data.json is empty
    // Admin can edit via localStorage, then export to update data.json for all visitors
    const galleryData = siteData?.gallery || { sections: [] };
    
    console.log('Loading gallery:', galleryData);
    console.log('Gallery sections count:', galleryData.sections?.length || 0);
    if (galleryData.sections && galleryData.sections.length > 0) {
        galleryData.sections.forEach((section, idx) => {
            console.log(`Section ${idx}: "${section.name}" - ${section.items?.length || 0} items`);
        });
    }
    
    const galleryGrid = document.getElementById('gallery-grid');
    
    // Migrate old format if needed
    if (Array.isArray(galleryData)) {
        const migratedData = {
            sections: [{
                name: 'Gallery',
                items: galleryData
            }]
        };
        localStorage.setItem('portfolio_gallery', JSON.stringify(migratedData));
        return loadGallery(); // Reload with new format
    }
    
    if (!galleryData.sections || galleryData.sections.length === 0) {
        galleryGrid.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No gallery images yet. Use the admin panel to add images!</p>';
        return;
    }
    
    galleryGrid.innerHTML = '';
    
    galleryData.sections.forEach((section, sectionIndex) => {
        if (!section.items || section.items.length === 0) return;
        
        // Create section wrapper
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'gallery-section-display';
        
        // Section title
        if (section.name) {
            const sectionTitle = document.createElement('h3');
            sectionTitle.className = 'gallery-section-title';
            sectionTitle.textContent = section.name;
            sectionDiv.appendChild(sectionTitle);
        }
        
        // Section grid
        const sectionGrid = document.createElement('div');
        sectionGrid.className = 'gallery-grid';
        
        section.items.forEach(item => {
            const galleryItem = createGalleryItem(item);
            sectionGrid.appendChild(galleryItem);
        });
        
        sectionDiv.appendChild(sectionGrid);
        galleryGrid.appendChild(sectionDiv);
    });
    
    // Re-observe for animations
    setTimeout(() => {
        const newItems = document.querySelectorAll('.gallery-item');
        newItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(item);
        });
    }, 100);
}

function createGalleryItem(item) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    
    // Helper function to convert GitHub blob URLs to raw URLs
    function convertGitHubUrl(url) {
        if (url && url.includes('github.com') && url.includes('/blob/')) {
            return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }
        return url;
    }
    
    let imageSrc = item.imageUrl || item.imageBase64 || '';
    imageSrc = convertGitHubUrl(imageSrc);
    
    // Collect all images for this item (main + additional)
    const allImages = [];
    if (imageSrc) {
        allImages.push(imageSrc);
    }
    
    if (item.additionalImages && Array.isArray(item.additionalImages)) {
        item.additionalImages.forEach(additionalImg => {
            let imgSrc = additionalImg.imageUrl || additionalImg.imageBase64 || '';
            imgSrc = convertGitHubUrl(imgSrc);
            if (imgSrc) {
                allImages.push(imgSrc);
            }
        });
    }
    
    // Debug log
    if (allImages.length === 0) {
        console.warn('Gallery item has no image source:', item);
    }
    
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'gallery-image-wrapper';
    
    const img = document.createElement('img');
    img.src = allImages[0] || '';
    img.alt = item.title || 'Gallery image';
    img.loading = 'lazy';
    img.onerror = () => console.error('Failed to load gallery image:', (allImages[0] || '').substring(0, 50) + '...');
    
    imageWrapper.appendChild(img);
    
    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    overlay.innerHTML = `
        <div class="gallery-content">
            ${item.title ? `<h4>${item.title}</h4>` : ''}
            ${item.description ? `<p>${item.description}</p>` : ''}
        </div>
    `;
    
    imageWrapper.appendChild(overlay);
    div.appendChild(imageWrapper);
    
    // Add hover cycling for multiple images
    let hoverInterval = null;
    let currentHoverIndex = 0;
    
    if (allImages.length > 1) {
        div.addEventListener('mouseenter', () => {
            currentHoverIndex = 0; // Start from first image
            hoverInterval = setInterval(() => {
                currentHoverIndex = (currentHoverIndex + 1) % allImages.length;
                img.src = allImages[currentHoverIndex];
            }, 1000); // Switch every 1 second
        });
        
        div.addEventListener('mouseleave', () => {
            if (hoverInterval) {
                clearInterval(hoverInterval);
                hoverInterval = null;
            }
            // Reset to first image
            currentHoverIndex = 0;
            img.src = allImages[0];
        });
    }
    
    // Add click handler to open lightbox
    div.addEventListener('click', () => {
        // Collect all gallery items for navigation
        const galleryData = siteData?.gallery || { sections: [] };
        const allItems = [];
        let itemIndex = -1;
        let currentIndex = 0;
        
        if (galleryData.sections) {
            galleryData.sections.forEach(section => {
                if (section.items) {
                    section.items.forEach(galleryItem => {
                        allItems.push(galleryItem);
                        // Find current item index
                        if ((galleryItem.imageUrl === item.imageUrl && item.imageUrl) ||
                            (galleryItem.imageBase64 === item.imageBase64 && item.imageBase64) ||
                            (galleryItem.title === item.title && item.title)) {
                            itemIndex = currentIndex;
                        }
                        currentIndex++;
                    });
                }
            });
        }
        
        openGalleryLightbox(item, itemIndex, allItems);
    });
    
    return div;
}

// Gallery lightbox functionality with multiple images support
let currentLightboxImages = [];
let currentLightboxIndex = 0;
let allGalleryItems = []; // Store all gallery items for navigation between items
let currentGalleryItemIndex = 0; // Current item index in allGalleryItems
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;
let dragStartX = 0;

function openGalleryLightbox(item) {
    // Build array of all images: main image + additional images
    currentLightboxImages = [];
    
    console.log('Opening lightbox for item:', item);
    console.log('Additional images:', item.additionalImages);
    
    // Helper function to convert GitHub blob URLs to raw URLs
    function convertGitHubUrl(url) {
        if (url && url.includes('github.com') && url.includes('/blob/')) {
            return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }
        return url;
    }
    
    // Add main image first
    let mainImageSrc = item.imageUrl || item.imageBase64 || '';
    mainImageSrc = convertGitHubUrl(mainImageSrc);
    if (mainImageSrc) {
        currentLightboxImages.push(mainImageSrc);
        console.log('Added main image:', mainImageSrc.substring(0, 50) + '...');
    }
    
    // Add additional images
    if (item.additionalImages && Array.isArray(item.additionalImages)) {
        console.log('Found additionalImages array with', item.additionalImages.length, 'items');
        item.additionalImages.forEach((additionalImg, index) => {
            let imgSrc = additionalImg.imageUrl || additionalImg.imageBase64 || '';
            imgSrc = convertGitHubUrl(imgSrc);
            if (imgSrc) {
                currentLightboxImages.push(imgSrc);
                console.log(`Added additional image ${index + 1}:`, imgSrc.substring(0, 50) + '...');
            } else {
                console.warn(`Additional image ${index + 1} has no source:`, additionalImg);
            }
        });
    } else {
        console.log('No additionalImages found or not an array:', item.additionalImages);
    }
    
    console.log('Total images in lightbox:', currentLightboxImages.length);
    
    if (currentLightboxImages.length === 0) {
        console.error('No images to display in lightbox!');
        return;
    }
    
    currentLightboxIndex = 0;
    
    // Create lightbox if it doesn't exist
    let lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'gallery-lightbox';
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close">&times;</button>
                <button class="lightbox-nav lightbox-prev" aria-label="Previous image">&#8249;</button>
                <button class="lightbox-nav lightbox-next" aria-label="Next image">&#8250;</button>
                <div class="lightbox-image-container">
                    <img class="lightbox-image" src="" alt="">
                </div>
                <div class="lightbox-info">
                    <h3 class="lightbox-title"></h3>
                    <p class="lightbox-description"></p>
                    <div class="lightbox-dots"></div>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Close on button click
        const closeBtn = lightbox.querySelector('.lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeGalleryLightbox();
            });
            // Also add touch event for mobile
            closeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeGalleryLightbox();
            });
        }
        
        // Navigation buttons
        lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(-1);
        });
        
        lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(1);
        });
        
        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeGalleryLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeGalleryLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }
        });
        
        // Touch/swipe support for mobile
        const imageContainer = lightbox.querySelector('.lightbox-image-container');
        if (imageContainer) {
            // Touch events
            imageContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });
            
            imageContainer.addEventListener('touchmove', (e) => {
                touchEndX = e.touches[0].clientX;
            }, { passive: true });
            
            imageContainer.addEventListener('touchend', () => {
                const swipeThreshold = 50; // Minimum distance for swipe
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Swipe left - next image
                        navigateLightbox(1);
                    } else {
                        // Swipe right - previous image
                        navigateLightbox(-1);
                    }
                }
                touchStartX = 0;
                touchEndX = 0;
            });
            
            // Mouse drag support for desktop
            imageContainer.addEventListener('mousedown', (e) => {
                isDragging = true;
                dragStartX = e.clientX;
                imageContainer.style.cursor = 'grabbing';
            });
            
            imageContainer.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    // Visual feedback could be added here
                }
            });
            
            imageContainer.addEventListener('mouseup', (e) => {
                if (isDragging) {
                    const dragThreshold = 50;
                    const diff = dragStartX - e.clientX;
                    
                    if (Math.abs(diff) > dragThreshold) {
                        if (diff > 0) {
                            // Drag left - next image
                            navigateLightbox(1);
                        } else {
                            // Drag right - previous image
                            navigateLightbox(-1);
                        }
                    }
                    isDragging = false;
                    imageContainer.style.cursor = 'grab';
                }
            });
            
            imageContainer.addEventListener('mouseleave', () => {
                if (isDragging) {
                    isDragging = false;
                    imageContainer.style.cursor = 'grab';
                }
            });
            
            // Set initial cursor
            imageContainer.style.cursor = 'grab';
        }
    }
    
    // Update lightbox content
    updateLightboxContent(item);
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function navigateLightbox(direction) {
    // Try to navigate within current item's images first
    if (currentLightboxImages.length > 1) {
        currentLightboxIndex += direction;
        
        if (currentLightboxIndex < 0) {
            // Went before first image - go to previous item
            currentLightboxIndex = 0;
            navigateToItem(-1);
            return;
        } else if (currentLightboxIndex >= currentLightboxImages.length) {
            // Went after last image - go to next item
            currentLightboxIndex = currentLightboxImages.length - 1;
            navigateToItem(1);
            return;
        }
        
        // Update image within current item
        const img = document.querySelector('.lightbox-image');
        if (img) {
            img.src = currentLightboxImages[currentLightboxIndex];
        }
        updateLightboxDots();
    } else {
        // Only one image in current item - navigate to next/previous item
        navigateToItem(direction);
    }
}

function navigateToItem(direction) {
    if (allGalleryItems.length <= 1) return;
    
    // Find next/previous item with images
    let attempts = 0;
    let newItemIndex = currentGalleryItemIndex;
    
    do {
        newItemIndex += direction;
        
        if (newItemIndex < 0) {
            newItemIndex = allGalleryItems.length - 1;
        } else if (newItemIndex >= allGalleryItems.length) {
            newItemIndex = 0;
        }
        
        attempts++;
        if (attempts > allGalleryItems.length) {
            // Prevent infinite loop
            return;
        }
    } while (!hasImages(allGalleryItems[newItemIndex]) && attempts < allGalleryItems.length);
    
    // Open the new item
    const newItem = allGalleryItems[newItemIndex];
    if (newItem) {
        currentGalleryItemIndex = newItemIndex;
        // Rebuild images array for new item
        openGalleryLightbox(newItem, newItemIndex, allGalleryItems);
        // Set to first or last image based on direction
        if (direction > 0) {
            currentLightboxIndex = 0;
        } else {
            currentLightboxIndex = currentLightboxImages.length - 1;
        }
        updateLightboxContent(newItem);
    }
}

function hasImages(item) {
    if (!item) return false;
    if (item.imageUrl || item.imageBase64) return true;
    if (item.additionalImages && Array.isArray(item.additionalImages) && item.additionalImages.length > 0) {
        return item.additionalImages.some(img => img.imageUrl || img.imageBase64);
    }
    return false;
}

function updateLightboxContent(item) {
    const img = document.querySelector('.lightbox-image');
    const title = document.querySelector('.lightbox-title');
    const description = document.querySelector('.lightbox-description');
    
    if (img && currentLightboxImages.length > 0) {
        img.src = currentLightboxImages[currentLightboxIndex];
        img.alt = item.title || 'Gallery image';
    }
    
    if (item.title) {
        title.textContent = item.title;
        title.style.display = 'block';
    } else {
        title.style.display = 'none';
    }
    
    if (item.description) {
        description.textContent = item.description;
        description.style.display = 'block';
    } else {
        description.style.display = 'none';
    }
    
    // Show/hide navigation arrows based on number of images
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    if (prevBtn && nextBtn) {
        if (currentLightboxImages.length > 1) {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    }
    
    updateLightboxDots();
}

function updateLightboxDots() {
    const dotsContainer = document.querySelector('.lightbox-dots');
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    
    if (currentLightboxImages.length <= 1) {
        dotsContainer.style.display = 'none';
        return;
    }
    
    dotsContainer.style.display = 'flex';
    
    currentLightboxImages.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'lightbox-dot';
        if (index === currentLightboxIndex) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            currentLightboxIndex = index;
            const img = document.querySelector('.lightbox-image');
            if (img) {
                img.src = currentLightboxImages[currentLightboxIndex];
            }
            updateLightboxDots();
        });
        dotsContainer.appendChild(dot);
    });
}

function closeGalleryLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Load Contact Section
function loadContact() {
    // Use siteData.contact (from data.json) as PRIMARY source for live site
    // localStorage is only fallback if data.json is empty
    let contact = siteData?.contact || {};
    
    // Set default contact info if not set
    if (!contact.email) {
        contact.email = 'elad1488@gmail.com';
        contact.phone = '+972 502337704';
        localStorage.setItem('portfolio_contact', JSON.stringify(contact));
    }
    
    // Email
    const emailLink = document.getElementById('contact-email-link');
    if (emailLink) {
        emailLink.href = `mailto:${contact.email}`;
        emailLink.textContent = contact.email;
    }
    
    // Phone
    const phoneLink = document.getElementById('contact-phone-link');
    if (phoneLink) {
        phoneLink.href = `tel:${contact.phone.replace(/\s/g, '')}`;
        phoneLink.textContent = contact.phone;
    }
    
    // Social Links
    const socialLinks = document.getElementById('social-links');
    if (socialLinks) {
        let linksHTML = '';
        if (contact.linkedin) {
            linksHTML += `<a href="${contact.linkedin}" class="social-link" aria-label="LinkedIn" target="_blank">LinkedIn</a>`;
        }
        if (contact.github) {
            linksHTML += `<a href="${contact.github}" class="social-link" aria-label="GitHub" target="_blank">GitHub</a>`;
        }
        if (contact.twitter) {
            linksHTML += `<a href="${contact.twitter}" class="social-link" aria-label="Twitter" target="_blank">Twitter</a>`;
        }
        socialLinks.innerHTML = linksHTML || '<a href="#" class="social-link" aria-label="LinkedIn">LinkedIn</a><a href="#" class="social-link" aria-label="GitHub">GitHub</a><a href="#" class="social-link" aria-label="Twitter">Twitter</a>';
    }
}

// Typing Effect (Optional - can be enabled for hero title)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment to enable typing effect on hero title
// const heroTitle = document.querySelector('.hero-title');
// if (heroTitle) {
//     const originalText = heroTitle.textContent;
//     typeWriter(heroTitle, originalText, 50);
// }
