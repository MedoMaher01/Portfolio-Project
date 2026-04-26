// ========================================
// PORTFOLIO RENDERING FUNCTIONS
// ========================================
// This file contains functions to dynamically render HTML from data.json and /projects/*.md

function escapeHtmlValue(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function escapeAttribute(value) {
  return escapeHtmlValue(value);
}

const MARKDOWN_SANITIZE_OPTIONS = {
  ADD_TAGS: ['img'],
  ADD_ATTR: ['src', 'alt', 'title', 'loading', 'width', 'height']
};

function isLikelyImagePath(value) {
  return /^(?:https?:\/\/|\/|\.\.?\/|[\w-]+\/).+\.(?:png|jpe?g|gif|webp|svg|avif)(?:[?#].*)?$/i.test(value || '');
}

function normalizeMarkdownImageSyntax(markdown) {
  let inCodeFence = false;

  return markdown.split('\n').map(line => {
    const trimmedLine = line.trim();

    if (/^(?:```|~~~)/.test(trimmedLine)) {
      inCodeFence = !inCodeFence;
      return line;
    }

    if (inCodeFence || !trimmedLine || /^!\[/.test(trimmedLine) || /^<img\b/i.test(trimmedLine)) {
      return line;
    }

    if (isLikelyImagePath(trimmedLine)) {
      return `${line.match(/^\s*/)[0]}![Project image](<${trimmedLine}>)`;
    }

    return line;
  }).join('\n');
}

function getMarkdownDirectory(markdownPath) {
  const cleanPath = String(markdownPath || '').split(/[?#]/)[0];
  const slashIndex = cleanPath.lastIndexOf('/');
  return slashIndex === -1 ? '' : cleanPath.slice(0, slashIndex + 1);
}

function resolveMarkdownAssetPath(src, markdownPath) {
  const value = String(src || '').trim();

  if (!value || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value)) {
    return value;
  }

  try {
    const siteBaseUrl = new URL('.', window.location.href);
    const isSiteRootPath = value.startsWith('/');
    const baseUrl = isSiteRootPath
      ? siteBaseUrl
      : new URL(getMarkdownDirectory(markdownPath), siteBaseUrl);
    const resolvedUrl = new URL(isSiteRootPath ? value.replace(/^\/+/, '') : value, baseUrl);

    return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
  } catch (error) {
    console.warn('Unable to resolve Markdown asset path:', value, error);
    return value;
  }
}

function resolveMarkdownImagePaths(html, markdownPath) {
  if (typeof document === 'undefined') return html;

  const template = document.createElement('template');
  template.innerHTML = html;

  template.content.querySelectorAll('img[src]').forEach(img => {
    img.setAttribute('src', resolveMarkdownAssetPath(img.getAttribute('src'), markdownPath));
    img.setAttribute('loading', 'lazy');

    if (!img.getAttribute('alt')) {
      img.setAttribute('alt', 'Project image');
    }
  });

  return template.innerHTML;
}

function renderSafeMarkdown(markdown, options = {}) {
  const source = normalizeMarkdownImageSyntax(String(markdown || ''));

  if (typeof marked !== 'undefined') {
    const parsedHtml = marked.parse(source);
    const safeHtml = typeof DOMPurify !== 'undefined'
      ? DOMPurify.sanitize(parsedHtml, MARKDOWN_SANITIZE_OPTIONS)
      : parsedHtml;

    return resolveMarkdownImagePaths(safeHtml, options.markdownPath);
  }

  return source
    .split(/\n{2,}/)
    .map(paragraph => `<p>${escapeHtmlValue(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function isSafeProjectMarkdownPath(path) {
  return /^projects\/[a-z0-9][a-z0-9-]*\.md$/i.test(path || '');
}

async function renderProjectMarkdown(project, container) {
  const markdownPath = getProjectMarkdownPath(project);
  container.classList.add('rich-content', 'markdown-content');

  if (!isSafeProjectMarkdownPath(markdownPath)) {
    container.innerHTML = `<p>${escapeHtmlValue(project.description || 'No project content available.')}</p>`;
    return;
  }

  try {
    const response = await fetch(markdownPath);
    if (!response.ok) {
      throw new Error(`Unable to load ${markdownPath} (${response.status})`);
    }

    const markdown = await response.text();
    container.innerHTML = renderSafeMarkdown(markdown, { markdownPath });
    enhanceMarkdownLinks(container);
  } catch (error) {
    console.error('Failed to render project Markdown:', error);
    container.innerHTML = `<p>${escapeHtmlValue(project.description || 'Project content could not be loaded.')}</p>`;
  }
}

function enhanceMarkdownLinks(container) {
  container.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (/^https?:\/\//i.test(href)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });
}

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

async function renderIndexPage() {
  await loadPortfolioData();
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
    <a href="project.html?id=${encodeURIComponent(project.id)}" class="project-card" role="listitem" aria-label="View ${escapeAttribute(project.title)} project">
      <div class="card-icon" aria-hidden="true">
        <img src="${escapeAttribute(project.icon)}" alt="" />
      </div>
      <h3>${escapeHtmlValue(project.title)}</h3>
      <p>${escapeHtmlValue(project.subtitle)}</p>
    </a>
  `).join('');
}

function renderFooter() {
  const { personal, siteVersion } = portfolioData;
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
    ${siteVersion ? `<p style="margin-top: 0.5rem; font-size: 0.75rem; opacity: 0.6;">${siteVersion}</p>` : ''}
  `;
}

// ========================================
// TIMELINE RENDERING (My Journey)
// ========================================

async function renderTimelinePage() {
  await loadPortfolioData();
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

async function renderProjectsPage() {
  await loadPortfolioData();
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
    <button class="filter-btn ${index === 0 ? 'active' : ''}" data-category="${escapeAttribute(filter.id)}">
      <span class="filter-icon">${escapeHtmlValue(filter.icon)}</span>
      ${escapeHtmlValue(filter.label)}
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
      <section class="project-category" data-category="${escapeAttribute(key)}">
        <div class="category-header">
          <h2 class="category-title">
            <span class="category-icon">${escapeHtmlValue(categoryData.icon)}</span>
            ${escapeHtmlValue(categoryData.title)}
          </h2>
          <p class="category-description">${escapeHtmlValue(categoryData.description)}</p>
        </div>
        ${(categoryData.projects || []).map(project => renderProjectCard(project, key)).join('')}
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
  
  const projectTags = getProjectTags(project);
  const techBadges = projectTags.map(tag =>
    `<span class="tech-badge">${escapeHtmlValue(tag)}</span>`
  ).join('');
  
  // Render links using the new array structure
  const linksHTML = (project.links || []).map(link => {
    const config = linkTypeConfig[link.type] || linkTypeConfig.custom;
    const label = link.label || config.defaultLabel;
    
    return `
      <a href="${escapeAttribute(link.url)}" target="_blank" rel="noopener noreferrer" class="project-btn ${config.class}">
        <span class="btn-icon">${config.icon}</span>
        <span>${escapeHtmlValue(label)}</span>
      </a>
    `;
  }).join('');
  
  // Render media if present
  let mediaHtml = '';
  if (project.media) {
    if (project.media.type === 'image') {
      mediaHtml = `
        <div class="project-media">
          <img src="${escapeAttribute(project.media.url)}" alt="${escapeAttribute(project.title)}" loading="lazy" />
        </div>
      `;
    } else if (project.media.type === 'youtube') {
      mediaHtml = `
        <div class="project-media">
          <div class="project-media-video">
            <iframe 
                src="${escapeAttribute(project.media.url)}"
                title="${escapeAttribute(project.title)} video"
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
    <article id="project-${escapeAttribute(project.id)}" class="project-detail" data-category="${escapeAttribute(categoryKey)}">
      <div class="project-header">
        <div class="project-icon">
          <img src="${escapeAttribute(project.icon)}" alt="${escapeAttribute(project.title)} Icon" />
        </div>
        <div class="project-title-group">
          <h3>${escapeHtmlValue(project.title)}</h3>
          <p class="project-subtitle">${escapeHtmlValue(project.subtitle)}</p>
        </div>
      </div>
      
      <div class="project-content">
        <p class="project-description">${escapeHtmlValue(project.description || project.subtitle || '')}</p>
        
        ${mediaHtml}
        
        <div class="tech-stack">
          ${techBadges}
        </div>
        
        <div class="project-links">
          ${linksHTML}
          <a href="project.html?id=${encodeURIComponent(project.id)}" class="project-btn btn-view-details">
            <span class="btn-icon">📖</span>
            <span>View Full Details</span>
          </a>
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
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.project-detail').forEach(card => {
    observer.observe(card);
  });
}

// Initialize all components when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}

function initializePage() {
  // Initialize mobile navigation
  initializeMobileNav();
}

// ========================================
// MOBILE NAVIGATION (All Pages)
// ========================================

function initializeMobileNav() {
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navbar = document.querySelector('.navbar');
  const closeBtn = document.querySelector('.mobile-menu-close');
  
  if (mobileToggle && navbar) {
    mobileToggle.addEventListener('click', () => {
      navbar.classList.toggle('active');
    });
    
    // Close button handler
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        navbar.classList.remove('active');
      });
    }
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      // تجاهل أزرار التنقل - دعها تعمل بشكل طبيعي
      const anchorId = this.getAttribute('id');
      if (anchorId === 'prev-project' || anchorId === 'next-project') {
        return;
      }
      
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
        }
      }
    });
  });
}

// ========================================
// PROJECT DETAIL PAGE RENDERING
// ========================================

async function renderProjectDetailPage() {
  await loadPortfolioData();

  // Get project ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  
  if (!projectId) {
    // No project ID provided, redirect to projects list
    window.location.href = 'projects.html';
    return;
  }
  
  const project = getProjectById(projectId);
  
  if (!project) {
    // Project not found, redirect to projects list
    window.location.href = 'projects.html';
    return;
  }
  
  // Update page title and meta tags
  document.title = `${project.title} - ${portfolioData.personal.name} Portfolio`;
  updateMetaTag('description', project.description);
  updateMetaTag('og:title', `${project.title} - Portfolio Project`, 'property');
  updateMetaTag('og:description', project.description, 'property');
  
  // Render breadcrumb
  document.getElementById('project-title-breadcrumb').textContent = project.title;
  
  // Render header
  document.getElementById('project-title').textContent = project.title;
  document.getElementById('project-subtitle').textContent = project.subtitle;
  
  // Render meta information
  renderProjectMeta(project);
  
  // Render project links
  renderProjectLinks(project);
  
  
  // Render Markdown content from /projects/*.md
  const descriptionElement = document.getElementById('project-description');
  await renderProjectMarkdown(project, descriptionElement);
  
  // Render gallery (if exists)
  if (project.gallery && project.gallery.length > 0) {
    renderProjectGallery(project.gallery);
  }
  
  // Render features (if exists)
  if (project.features && project.features.length > 0) {
    renderProjectFeatures(project.features);
  }
  
  // Render tags / tech stack
  renderProjectTechStack(getProjectTags(project));
  
  // Render challenges and learnings (if exist)
  renderProjectInsights(project);
  
  // Setup navigation
  setupProjectNavigation(projectId);
  
  // Render common elements
  renderHeader();
  renderFooter();
}

function renderProjectMeta(project) {
  const metaContainer = document.getElementById('project-meta');
  const metaItems = [];
  const projectTags = getProjectTags(project);

  if (project.date) {
    metaItems.push(`<div class="meta-item"><strong>Date:</strong> ${escapeHtmlValue(project.date)}</div>`);
  }
  
  if (project.duration) {
    metaItems.push(`<div class="meta-item"><strong>Duration:</strong> ${escapeHtmlValue(project.duration)}</div>`);
  }
  
  if (project.role) {
    metaItems.push(`<div class="meta-item"><strong>Role:</strong> ${escapeHtmlValue(project.role)}</div>`);
  }
  
  if (project.teamSize) {
    metaItems.push(`<div class="meta-item"><strong>Team:</strong> ${escapeHtmlValue(project.teamSize)}</div>`);
  }
  
  if (project.status) {
    metaItems.push(`<div class="meta-item"><strong>Status:</strong> ${escapeHtmlValue(project.status)}</div>`);
  }

  if (projectTags.length > 0) {
    metaItems.push(`<div class="meta-item"><strong>Tags:</strong> ${projectTags.map(escapeHtmlValue).join(', ')}</div>`);
  }
  
  if (metaItems.length > 0) {
    metaContainer.innerHTML = metaItems.join('');
    metaContainer.style.display = 'flex';
  } else {
    metaContainer.style.display = 'none';
  }
}

function renderProjectLinks(project) {
  const linksContainer = document.getElementById('project-links');
  
  const linkTypeConfig = {
    github: { icon: '📦', class: 'btn-github', defaultLabel: 'View Code' },
    linkedin: { icon: '💼', class: 'btn-linkedin', defaultLabel: 'LinkedIn' },
    demo: { icon: '🚀', class: 'btn-demo', defaultLabel: 'Live Demo' },
    behance: { icon: '🎨', class: 'btn-behance', defaultLabel: 'View on Behance' },
    pdf: { icon: '📄', class: 'btn-pdf', defaultLabel: 'Download PDF' },
    drive: { icon: '☁️', class: 'btn-drive', defaultLabel: 'View on Drive' },
    youtube: { icon: '📺', class: 'btn-youtube', defaultLabel: 'Watch Video' },
    custom: { icon: '🔗', class: 'btn-custom', defaultLabel: 'View Link' }
  };
  
  linksContainer.innerHTML = (project.links || []).map(link => {
    const config = linkTypeConfig[link.type] || linkTypeConfig.custom;
    const label = link.label || config.defaultLabel;
    
    return `
      <a href="${escapeAttribute(link.url)}" target="_blank" rel="noopener noreferrer" class="project-btn ${config.class}">
        <span class="btn-icon">${config.icon}</span>
        <span>${escapeHtmlValue(label)}</span>
      </a>
    `;
  }).join('');
}

function renderProjectGallery(gallery) {
  const gallerySection = document.getElementById('gallery-section');
  const galleryContainer = document.getElementById('project-gallery');
  
  galleryContainer.innerHTML = gallery.map(item => {
    if (item.type === 'image') {
      return `
        <figure class="gallery-item">
          <img src="${item.url}" alt="${item.caption || 'Project image'}" loading="lazy">
          ${item.caption ? `<figcaption>${item.caption}</figcaption>` : ''}
        </figure>
      `;
    } else if (item.type === 'youtube') {
      return `
        <div class="gallery-item video">
          <iframe 
            src="${item.url}" 
            title="${item.caption || 'Project video'}"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            loading="lazy">
          </iframe>
          ${item.caption ? `<p>${item.caption}</p>` : ''}
        </div>
      `;
    }
    return '';
  }).join('');
  
  gallerySection.style.display = 'block';
}

function renderProjectFeatures(features) {
  const featuresSection = document.getElementById('features-section');
  const featuresList = document.getElementById('project-features-list');
  
  featuresList.innerHTML = features.map(feature => 
    `<li>${feature}</li>`
  ).join('');
  
  featuresSection.style.display = 'block';
}

function renderProjectTechStack(techStack = []) {
  const techStackContainer = document.getElementById('project-tech-stack');
  
  techStackContainer.innerHTML = techStack.map(tech =>
    `<span class="tech-badge">${escapeHtmlValue(tech)}</span>`
  ).join('');
}

function renderProjectInsights(project) {
  const insightsSection = document.getElementById('insights-section');
  let hasInsights = false;
  
  if (project.challenges) {
    const challengesCard = document.getElementById('challenges-card');
    document.getElementById('project-challenges').textContent = project.challenges;
    challengesCard.style.display = 'block';
    hasInsights = true;
  }
  
  if (project.learnings) {
    const learningsCard = document.getElementById('learnings-card');
    document.getElementById('project-learnings').textContent = project.learnings;
    learningsCard.style.display = 'block';
    hasInsights = true;
  }
  
  if (hasInsights) {
    insightsSection.style.display = 'grid';
  }
}

function setupProjectNavigation(currentProjectId) {
  // الخطوة 1: جلب جميع المشاريع من البيانات المحملة
  const allProjects = getAllProjects();
  
  // الخطوة 2: البحث عن index المشروع الحالي في المصفوفة
  const currentIndex = allProjects.findIndex(p => p.id === currentProjectId);
  
  // إذا لم يتم العثور على المشروع، إخفاء الأزرار
  if (currentIndex === -1 || allProjects.length === 0) {
    document.getElementById('prev-project').style.display = 'none';
    document.getElementById('next-project').style.display = 'none';
    return;
  }
  
  const prevBtn = document.getElementById('prev-project');
  const nextBtn = document.getElementById('next-project');
  
  // الخطوة 3 و 4: إعداد زر Previous
  if (currentIndex > 0) {
    // يوجد مشروع سابق
    const prevProject = allProjects[currentIndex - 1];
    prevBtn.href = `project.html?id=${prevProject.id}`;
    prevBtn.style.display = 'inline-flex';
  } else {
    // لا يوجد مشروع سابق (نحن في أول مشروع)
    prevBtn.style.display = 'none';
  }
  
  // الخطوة 3 و 4: إعداد زر Next
  if (currentIndex < allProjects.length - 1) {
    // يوجد مشروع تالي
    const nextProject = allProjects[currentIndex + 1];
    nextBtn.href = `project.html?id=${nextProject.id}`;
    nextBtn.style.display = 'inline-flex';
  } else {
    // لا يوجد مشروع تالي (نحن في آخر مشروع)
    nextBtn.style.display = 'none';
  }
}

// ========================================
// RICH CONTENT RENDERING SYSTEM
// ========================================
// نظام عرض المحتوى الغني - يدعم أنواع متعددة من المحتوى

/**
 * محرك العرض الرئيسي - يعرض جميع الأقسام ديناميكياً
 * @param {Array} sections - مصفوفة الأقسام
 * @param {HTMLElement} container - العنصر الحاوي
 */
function renderProjectSections(sections, container) {
  container.innerHTML = '';
  container.classList.add('rich-content');
  
  sections.forEach(section => {
    let element;
    
    switch(section.type) {
      case 'heading':
        element = renderHeading(section);
        break;
      case 'text':
        element = renderText(section);
        break;
      case 'image':
        element = renderImage(section);
        break;
      case 'video':
        element = renderVideo(section);
        break;
      case 'list':
        element = renderList(section);
        break;
      case 'code':
        element = renderCode(section);
        break;
      default:
        console.warn('Unknown section type:', section.type);
        return;
    }
    
    if (element) {
      container.appendChild(element);
    }
  });
}

/**
 * عرض العناوين (h2, h3, h4)
 */
function renderHeading(section) {
  const level = section.level || 2;
  const heading = document.createElement(`h${level}`);
  heading.textContent = section.value;
  heading.className = 'section-heading';
  return heading;
}

/**
 * عرض النص (فقرة) - مع دعم Markdown
 */
function renderText(section) {
  const p = document.createElement('div');
  p.innerHTML = renderSafeMarkdown(section.value);
  p.className = 'section-text markdown-content';
  return p;
}

/**
 * عرض الصور مع caption
 */
function renderImage(section) {
  const figure = document.createElement('figure');
  figure.className = 'section-image';
  
  const img = document.createElement('img');
  img.src = section.src;
  img.alt = section.alt || 'Project image';
  img.loading = 'lazy';
  
  figure.appendChild(img);
  
  if (section.caption) {
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = section.caption;
    figure.appendChild(figcaption);
  }
  
  return figure;
}

/**
 * عرض الفيديو (YouTube أو محلي)
 */
function renderVideo(section) {
  const container = document.createElement('div');
  container.className = 'section-video';
  
  if (section.platform === 'youtube') {
    const iframe = document.createElement('iframe');
    iframe.src = section.src;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.title = section.caption || 'Video';
    
    container.appendChild(iframe);
  } else {
    // فيديو محلي
    const video = document.createElement('video');
    video.src = section.src;
    video.controls = true;
    video.setAttribute('loading', 'lazy');
    
    container.appendChild(video);
  }
  
  if (section.caption) {
    const caption = document.createElement('p');
    caption.className = 'video-caption';
    caption.textContent = section.caption;
    container.appendChild(caption);
  }
  
  return container;
}

/**
 * عرض القوائم (مرتبة أو غير مرتبة)
 */
function renderList(section) {
  const list = document.createElement(section.ordered ? 'ol' : 'ul');
  list.className = 'section-list';
  
  section.items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
  
  return list;
}

/**
 * عرض كتل الكود مع syntax highlighting بسيط
 */
function renderCode(section) {
  const container = document.createElement('div');
  container.className = 'section-code';
  
  // إضافة label للغة البرمجة
  if (section.language) {
    const label = document.createElement('div');
    label.className = 'code-language';
    label.textContent = section.language;
    container.appendChild(label);
  }
  
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.className = section.language ? `language-${section.language}` : '';
  code.textContent = section.value;
  
  pre.appendChild(code);
  container.appendChild(pre);
  
  return container;
}
