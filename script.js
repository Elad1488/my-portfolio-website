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
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Get your email from localStorage or use default
        const contact = JSON.parse(localStorage.getItem('portfolio_contact') || '{}');
        const yourEmail = contact.email || 'elad1488@gmail.com';
        
        // Create mailto link with subject and body
        const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:${yourEmail}?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show confirmation
        setTimeout(() => {
            alert(`Thank you ${name}! Your email client should open. If it doesn't, please email me directly at ${yourEmail}`);
        }, 500);
        
        // Reset form after a delay
        setTimeout(() => {
            contactForm.reset();
        }, 1000);
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

// Load data from JSON file if localStorage is empty
async function loadDataFromFile() {
    try {
        const response = await fetch('data.json');
        if (response.ok) {
            const data = await response.json();
            
            // Only load from file if localStorage is empty
            if (!localStorage.getItem('portfolio_projects') || localStorage.getItem('portfolio_projects') === '[]') {
                if (data.projects && data.projects.length > 0) {
                    localStorage.setItem('portfolio_projects', JSON.stringify(data.projects));
                }
            }
            
            if (!localStorage.getItem('portfolio_gallery') || localStorage.getItem('portfolio_gallery') === '{"sections":[]}') {
                if (data.gallery) {
                    localStorage.setItem('portfolio_gallery', JSON.stringify(data.gallery));
                }
            }
            
            if (!localStorage.getItem('portfolio_about') || localStorage.getItem('portfolio_about') === '{"text1":"","text2":""}') {
                if (data.about) {
                    localStorage.setItem('portfolio_about', JSON.stringify(data.about));
                }
            }
            
            if (!localStorage.getItem('portfolio_skills') || localStorage.getItem('portfolio_skills') === '[]') {
                if (data.skills && data.skills.length > 0) {
                    localStorage.setItem('portfolio_skills', JSON.stringify(data.skills));
                }
            }
            
            if (!localStorage.getItem('portfolio_contact')) {
                if (data.contact) {
                    localStorage.setItem('portfolio_contact', JSON.stringify(data.contact));
                }
            }
            
            if (!localStorage.getItem('portfolio_hero')) {
                if (data.hero) {
                    localStorage.setItem('portfolio_hero', JSON.stringify(data.hero));
                }
            }
        }
    } catch (error) {
        console.log('Could not load data.json, using localStorage only:', error);
    }
}

function loadDynamicContent() {
    // First try to load from file, then load from localStorage
    loadDataFromFile().then(() => {
        loadProjects();
        loadGallery();
        loadAbout();
        loadSkills();
        loadHero();
        loadContact();
    });
}

// Load Projects from localStorage
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('portfolio_projects') || '[]');
    const projectsGrid = document.getElementById('projects-grid');
    
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
    const about = JSON.parse(localStorage.getItem('portfolio_about') || '{"text1": "", "text2": ""}');
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
    const skills = JSON.parse(localStorage.getItem('portfolio_skills') || '[]');
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
    const hero = JSON.parse(localStorage.getItem('portfolio_hero') || '{}');
    
    if (hero.name) {
        const nameElement = document.getElementById('hero-name');
        if (nameElement) nameElement.textContent = hero.name;
    }
    
    if (hero.subtitle) {
        const subtitleElement = document.getElementById('hero-subtitle');
        if (subtitleElement) subtitleElement.textContent = hero.subtitle;
    }
    
    if (hero.description) {
        const descElement = document.getElementById('hero-description');
        if (descElement) descElement.textContent = hero.description;
    }
    
    // Update Contact Me button with email from localStorage
    const contactMeBtn = document.getElementById('contact-me-btn');
    if (contactMeBtn) {
        const contact = JSON.parse(localStorage.getItem('portfolio_contact') || '{}');
        const email = contact.email || 'elad1488@gmail.com';
        contactMeBtn.href = `mailto:${email}`;
    }
}

// Load Gallery Section
function loadGallery() {
    const galleryData = JSON.parse(localStorage.getItem('portfolio_gallery') || '{"sections":[]}');
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
    
    const imageSrc = item.imageUrl || item.imageBase64 || '';
    
    div.innerHTML = `
        <div class="gallery-image-wrapper">
            <img src="${imageSrc}" alt="${item.title || 'Gallery image'}" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-content">
                    ${item.title ? `<h4>${item.title}</h4>` : ''}
                    ${item.description ? `<p>${item.description}</p>` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Add click handler to open lightbox
    div.addEventListener('click', () => {
        openGalleryLightbox(item);
    });
    
    return div;
}

// Gallery lightbox functionality
function openGalleryLightbox(item) {
    // Create lightbox if it doesn't exist
    let lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'gallery-lightbox';
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close">&times;</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-info">
                    <h3 class="lightbox-title"></h3>
                    <p class="lightbox-description"></p>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Close on button click
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeGalleryLightbox);
        
        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeGalleryLightbox();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeGalleryLightbox();
            }
        });
    }
    
    // Populate lightbox with item data
    const imageSrc = item.imageUrl || item.imageBase64 || '';
    const img = lightbox.querySelector('.lightbox-image');
    const title = lightbox.querySelector('.lightbox-title');
    const description = lightbox.querySelector('.lightbox-description');
    
    img.src = imageSrc;
    img.alt = item.title || 'Gallery image';
    
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
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
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
    // Set default contact info if not set
    let contact = JSON.parse(localStorage.getItem('portfolio_contact') || '{}');
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
