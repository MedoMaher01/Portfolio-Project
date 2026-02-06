// ========================================
// PORTFOLIO RENDERING FUNCTIONS
// ========================================
// This file contains functions to dynamically render HTML from data.js

// ========================================
// PERSONAL INFO RENDERING
// ========================================

function renderPersonalInfo() {
  const { personal } = portfolioData;
  
  // Update document title
  document.title = `Portfolio - ${personal.name} | ${personal.profession}`;
  
  // Update meta tags
  updateMetaTag('description', personal.description);
  updateMetaTag('keywords', personal.keywords);
  updateMetaTag('author', personal.name);
  
  // Update Open Graph
  updateMetaTag('og:title', `Portfolio - ${personal.name}`, 'property');
  updateMetaTag('og:description', personal.description, 'property');
  updateMetaTag('og:url', personal.siteUrl, 'property');
  
  // Update Twitter Card
  updateMetaTag('twitter:title', `Portfolio - ${personal.name}`, 'property');
  updateMetaTag('twitter:description', personal.description, 'property');
  
  // Update Structured Data
  updateStructuredData(personal);
}

function updateMetaTag(name, content, attribute = 'name') {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  if (meta) {
    meta.setAttribute('content', content);
  }
}

function updateStructuredData(personal) {
  const script = document.querySelector('script[type="application/ld+json"]');
  if (script) {
    const data = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": personal.name,
      "jobTitle": personal.profession,
      "url": personal.siteUrl,
      "sameAs": [
        `https://linkedin.com/in/${personal.linkedin}`,
        `https://github.com/${personal.github}`
      ]
    };
    script.textContent = JSON.stringify(data, null, 2);
  }
}

// ========================================
// INDEX PAGE RENDERING
// ========================================

function renderIndexPage() {
  renderPersonalInfo();
  renderAboutSection();
  renderFeaturedProjects();
  renderFooter();
  renderHeader();
}

function renderHeader() {
  const { personal } = portfolioData;
  const logoImg = document.querySelector('.logo');
  if (logoImg) {
    logoImg.src = personal.logo;
    logoImg.alt = `${personal.name} Logo`;
  }
}

function renderAboutSection() {
  const { personal } = portfolioData;
  
  // Update heading
  const heading = document.querySelector('#about-heading');
  if (heading) heading.textContent = 'About Me';
  
  // Update bio
  const bioText = document.querySelector('.about-text p');
  if (bioText) {
    bioText.innerHTML = personal.bio;
  }
  
  // Update profile image
  const profileImg = document.querySelector('.about-image');
  if (profileImg) {
    profileImg.src = personal.profileImage;
    profileImg.alt = `Profile picture of ${personal.name}`;
  }
}

function renderFeaturedProjects() {
  const container = document.querySelector('.scrolling-wrapper');
  if (!container) return;
  
  // Get all projects from all categories
  const allProjects = getAllProjects();
  
  // Get first 5 projects as featured
  const featured = allProjects.slice(0, 5);
  
  container.innerHTML = featured.map(project => `
    <a href="projects.html#project-${project.id}" class="project-card" role="listitem" aria-label="View ${project.title} project">
      <div class="card-icon" aria-hidden="true">
        <img src="${project.icon}" alt="" />
      </div>
      <h3>${project.title}</h3>
      <p>${project.subtitle}</p>
    </a>
  `).join('');
}

function renderFooter() {
  const { personal } = portfolioData;
  const footer = document.querySelector('footer');
  if (!footer) return;
  
  footer.innerHTML = `
    <p>
      <strong>Get In Touch</strong><br />
      Email: <a href="mailto:${personal.email}">${personal.email}</a>
    </p>
    <p style="margin-top: 1rem;">
      <a href="https://github.com/${personal.github}" target="_blank" rel="noopener noreferrer" aria-label="Visit my GitHub profile">GitHub</a> | 
      <a href="https://linkedin.com/in/${personal.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="Visit my LinkedIn profile">LinkedIn</a>
    </p>
    <p style="margin-top: 1rem; font-size: 0.875rem; opacity: 0.8;">
      &copy; ${new Date().getFullYear()} ${personal.name}. All rights reserved.
    </p>
  `;
}

// ========================================
// TIMELINE RENDERING (My Journey)
// ========================================

function renderTimelinePage() {
  renderPersonalInfo();
  renderHeader();
  renderTimeline();
  renderFooter();
}

function renderTimeline() {
  const container = document.querySelector('.timeline');
  if (!container) return;
  
  const { timeline, categories } = portfolioData;
  
  container.innerHTML = timeline.map(event => {
    const category = categories[event.category];
    let description = event.description;
    
    // Auto-link to project if projectId is specified
    if (event.projectId) {
      const projectLink = getProjectLink(event.projectId);
      if (projectLink) {
        // Find project mention in description or add link
        description = description.replace(
          /Task Management System|Personal Portfolio Website|E-Commerce Platform|Blog Platform|Weather Dashboard/gi,
          (match) => `<a href="${projectLink.url}" class="project-link">${match}</a>`
        );
        
        // If no auto-replace happened, add it at the end
        if (!description.includes('project-link')) {
          description += ` <a href="${projectLink.url}" class="project-link">View Project →</a>`;
        }
      }
    }
    
    // Render media if present
    let mediaHtml = '';
    if (event.media) {
      if (event.media.type === 'image') {
        mediaHtml = `
          <div class="timeline-media">
            <img src="${event.media.url}" alt="${event.title}" loading="lazy" />
          </div>
        `;
      } else if (event.media.type === 'youtube') {
        mediaHtml = `
          <div class="timeline-media">
            <div class="timeline-media-video">
              <iframe 
                src="${event.media.url}" 
                title="${event.title} video"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                loading="lazy">
              </iframe>
            </div>
          </div>
        `;
      }
    }
    
    return `
      <div class="timeline-item" data-category="${event.category}">
        <div class="timeline-marker">
          <div class="timeline-icon">${event.icon}</div>
        </div>
        <div class="timeline-content">
          <div class="timeline-date">${event.date}</div>
          <h3>${event.title}</h3>
          <span class="timeline-badge ${event.category}">${category.label}</span>
          <p>${description}</p>
          ${mediaHtml}
        </div>
      </div>
    `;
  }).join('');
  
  // Re-initialize intersection observer for animations
  initializeTimelineAnimations();
}

function initializeTimelineAnimations() {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
  });
}

// ========================================
// PROJECTS PAGE RENDERING
// ========================================

function renderProjectsPage() {
  renderPersonalInfo();
  renderHeader();
  renderProjectFilters();
  renderProjectsByCategory();
  renderFooter();
  initializeProjectFiltering();
}

function renderProjectFilters() {
  const container = document.querySelector('.category-filter');
  if (!container) return;
  
  // Generate filters dynamically from projectCategories
  const { projectCategories } = portfolioData;
  const categoryKeys = Object.keys(projectCategories);
  
  // Create "All Projects" filter first, then individual category filters
  const filters = [
    { id: 'all', label: 'All Projects', icon: '📂' },
    ...categoryKeys.map(key => ({
      id: key,
      label: projectCategories[key].title,
      icon: projectCategories[key].icon
    }))
  ];
  
  container.innerHTML = filters.map((filter, index) => `
    <button class="filter-btn ${index === 0 ? 'active' : ''}" data-category="${filter.id}">
      <span class="filter-icon">${filter.icon}</span>
      ${filter.label}
    </button>
  `).join('');
}

function renderProjectsByCategory() {
  const container = document.querySelector('.projects-container');
  if (!container) return;
  
  // Read categories dynamically from projectCategories
  const { projectCategories } = portfolioData;
  
  // Render each category section dynamically
  container.innerHTML = Object.entries(projectCategories)
    .map(([key, categoryData]) => `
      <section class="project-category" data-category="${key}">
        <div class="category-header">
          <h2 class="category-title">
            <span class="category-icon">${categoryData.icon}</span>
            ${categoryData.title}
          </h2>
          <p class="category-description">${categoryData.description}</p>
        </div>
        ${categoryData.projects.map(project => renderProjectCard(project, key)).join('')}
      </section>
    `).join('');
  
  // Add CTA section
  container.innerHTML += `
    <section class="projects-cta">
      <h2>Interested in collaborating?</h2>
      <p>Let's build something amazing together</p>
      <a href="index.html#contact">
        <button class="btn btn-primary">
          <span>Get In Touch</span>
        </button>
      </a>
    </section>
  `;
  
  // Re-initialize scroll animations
  initializeProjectAnimations();
}

function renderProjectCard(project, categoryKey) {
  // Link type configuration with icons and CSS classes
  const linkTypeConfig = {
    github: { icon: '📦', class: 'btn-github', defaultLabel: 'View on GitHub' },
    behance: { icon: '🎨', class: 'btn-behance', defaultLabel: 'View on Behance' },
    pdf: { icon: '📄', class: 'btn-pdf', defaultLabel: 'Download PDF'},
    drive: { icon: '☁️', class: 'btn-drive', defaultLabel: 'View Files' },
    demo: { icon: '🚀', class: 'btn-demo', defaultLabel: 'Live Demo' },
    linkedin: { icon: '💼', class: 'btn-linkedin', defaultLabel: 'LinkedIn Post' },
    youtube: { icon: '📺', class: 'btn-youtube', defaultLabel: 'Watch Video' },
    custom: { icon: '🔗', class: 'btn-custom', defaultLabel: 'View Link' }
  };
  
  const techBadges = project.techStack.map(tech => 
    `<span class="tech-badge">${tech}</span>`
  ).join('');
  
  // Render links using the new array structure
  const linksHTML = project.links.map(link => {
    const config = linkTypeConfig[link.type] || linkTypeConfig.custom;
    const label = link.label || config.defaultLabel;
    
    return `
      <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="project-btn ${config.class}">
        <span class="btn-icon">${config.icon}</span>
        <span>${label}</span>
      </a>
    `;
  }).join('');
  
  // Render media if present
  let mediaHtml = '';
  if (project.media) {
    if (project.media.type === 'image') {
      mediaHtml = `
        <div class="project-media">
          <img src="${project.media.url}" alt="${project.title}" loading="lazy" />
        </div>
      `;
    } else if (project.media.type === 'youtube') {
      mediaHtml = `
        <div class="project-media">
          <div class="project-media-video">
            <iframe 
              src="${project.media.url}" 
              title="${project.title} video"
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
              loading="lazy">
            </iframe>
          </div>
        </div>
      `;
    }
  }
  
  return `
    <article id="project-${project.id}" class="project-detail" data-category="${categoryKey}">
      <div class="project-header">
        <div class="project-icon">
          <img src="${project.icon}" alt="${project.title} Icon" />
        </div>
        <div class="project-title-group">
          <h3>${project.title}</h3>
          <p class="project-subtitle">${project.subtitle}</p>
        </div>
      </div>
      
      <div class="project-content">
        <p class="project-description">${project.description}</p>
        
        ${mediaHtml}
        
        <div class="tech-stack">
          ${techBadges}
        </div>
        
        <div class="project-links">
          ${linksHTML}
        </div>
      </div>
    </article>
  `;
}

function initializeProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCategories = document.querySelectorAll('.project-category');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const categoryKey = btn.dataset.category;
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter categories
      if (categoryKey === 'all') {
        // Show all categories
        projectCategories.forEach(cat => cat.style.display = 'block');
      } else {
        // Show only selected category
        projectCategories.forEach(cat => {
          if (cat.dataset.category === categoryKey) {
            cat.style.display = 'block';
          } else {
            cat.style.display = 'none';
          }
        });
      }
    });
  });
}

function initializeProjectAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.project-detail').forEach(project => {
    observer.observe(project);
  });
}

// ========================================
// MOBILE NAVIGATION (All Pages)
// ========================================

function initializeMobileNav() {
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navbar = document.querySelector('.navbar');
  
  if (mobileToggle && navbar) {
    mobileToggle.addEventListener('click', () => {
      navbar.classList.toggle('active');
      const isExpanded = navbar.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        if (navbar && navbar.classList.contains('active')) {
          navbar.classList.remove('active');
          if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  });
}
