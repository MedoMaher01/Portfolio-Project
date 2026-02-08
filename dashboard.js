// ========================================
// DASHBOARD - COMPLETE PROJECT MANAGEMENT SYSTEM
// ========================================
// Built from scratch with advanced features

// Global State
let dashboardData = {
  personal: {},
  timeline: [],
  projectCategories: {},
  categoryTags: {}
};

let currentProject = {
  techStack: [],
  links: [],
  sections: []
};

// Current section being edited
let currentSectionEditIndex = -1;

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  
  // Auto-save on any input change
  document.addEventListener('input', debounce(saveToLocalStorage, 1000));
});

// ========================================
// SECTION SWITCHING
// ========================================

function switchSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.dashboard-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Remove active from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Show selected section
  document.getElementById(`section-${sectionName}`).classList.add('active');
  document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
  
  // Load data when switching to categories or tags
  if (sectionName === 'categories') {
    renderCategoriesList();
  } else if (sectionName === 'tags') {
    renderTagsList();
  }
}

// ========================================
// IMPORT DATA
// ========================================

function importData() {
  const importText = document.getElementById('data-import').value.trim();
  const statusEl = document.getElementById('import-status');
  
  if (!importText) {
    showStatus(statusEl, 'Please paste your data.js content first', 'error');
    return;
  }
  
  try {
    // Smart parse - supports both JSON and JavaScript
    const data = smartParseData(importText);
    
    // Validate structure
    if (!data.personal || !data.timeline) {
      throw new Error('Invalid data structure - missing required fields');
    }
    
    // Load into dashboardData
    dashboardData.personal = JSON.parse(JSON.stringify(data.personal));
    dashboardData.timeline = JSON.parse(JSON.stringify(data.timeline));
    dashboardData.projectCategories = JSON.parse(JSON.stringify(data.projectCategories || {}));
    dashboardData.categoryTags = JSON.parse(JSON.stringify(data.categories || {}));
    
    // Populate forms
    populateAboutForm();
    renderTimelineList();
    renderProjectsList();
    renderCategoriesList();
    renderTagsList();
    
    showStatus(statusEl, '✓ Data loaded successfully!', 'success');
    saveToLocalStorage();
    
    // Auto-switch to About section
    setTimeout(() => switchSection('about'), 1000);
    
  } catch (error) {
    console.error('Import error:', error);
    showStatus(statusEl, `❌ Error: ${error.message}. Please check your input.`, 'error');
  }
}

// Smart parser that handles JavaScript code
function smartParseData(input) {
  let dataString = input;
  
  // Remove 'const portfolioData = ' if present
  if (dataString.includes('const portfolioData')) {
    dataString = dataString.split('const portfolioData =')[1];
  }
  
  // Remove trailing semicolons and whitespace
  dataString = dataString.trim().replace(/;$/, '');
  
  // Try standard JSON parse first
  try {
    return JSON.parse(dataString);
  } catch (jsonError) {
    // JSON failed, try JavaScript eval
    try {
      // Fix common issues: Remove trailing commas before } or ]
      dataString = dataString.replace(/,(\\s*[}\\]])/g, '$1');
      
      // Try eval (works with JavaScript object notation)
      const result = eval('(' + dataString + ')');
      return result;
    } catch (evalError) {
      throw new Error(`Unable to parse data. ${jsonError.message}`);
    }
  }
}

function loadSampleData() {
  // Load from the global portfolioData variable (from data.js)
  if (typeof portfolioData !== 'undefined') {
    dashboardData.personal = JSON.parse(JSON.stringify(portfolioData.personal));
    dashboardData.timeline = JSON.parse(JSON.stringify(portfolioData.timeline));
    dashboardData.projectCategories = JSON.parse(JSON.stringify(portfolioData.projectCategories || {}));
    dashboardData.categoryTags = JSON.parse(JSON.stringify(portfolioData.categories || {}));
    
    populateAboutForm();
    renderTimelineList();
    renderProjectsList();
    renderCategoriesList();
    renderTagsList();
    
    const statusEl = document.getElementById('import-status');
    showStatus(statusEl, '✓ Sample data loaded from data.js!', 'success');
    saveToLocalStorage();
    
    setTimeout(() => switchSection('about'), 1000);
  }
}

function showStatus(element, message, type) {
  element.textContent = message;
  element.className = `status-message ${type}`;
  element.style.display = 'block';
}

// ========================================
// ABOUT ME SECTION
// ========================================

function populateAboutForm() {
  if (!dashboardData.personal) return;
  
  const p = dashboardData.personal;
  document.getElementById('about-name').value = p.name || '';
  document.getElementById('about-profession').value = p.profession || '';
  document.getElementById('about-tagline').value = p.tagline || '';
  document.getElementById('about-background').value = p.background || '';
  document.getElementById('about-bio').value = p.bio || '';
  document.getElementById('about-email').value = p.email || '';
  document.getElementById('about-github').value = p.github || '';
  document.getElementById('about-linkedin').value = p.linkedin || '';
  document.getElementById('about-profileImage').value = p.profileImage || '';
  document.getElementById('about-logo').value = p.logo || '';
  
  // Trigger previews
  previewMedia(document.getElementById('about-profileImage'), 'preview-profile');
  previewMedia(document.getElementById('about-logo'), 'preview-logo');
}

function saveAbout() {
  dashboardData.personal = {
    ...dashboardData.personal,
    name: document.getElementById('about-name').value,
    profession: document.getElementById('about-profession').value,
    tagline: document.getElementById('about-tagline').value,
    background: document.getElementById('about-background').value,
    bio: document.getElementById('about-bio').value,
    email: document.getElementById('about-email').value,
    github: document.getElementById('about-github').value,
    linkedin: document.getElementById('about-linkedin').value,
    profileImage: document.getElementById('about-profileImage').value,
    logo: document.getElementById('about-logo').value
  };
  
  saveToLocalStorage();
  alert('✓ Personal information saved!');
}

// ========================================
// TIMELINE SECTION
// ========================================

function renderTimelineList() {
  const list = document.getElementById('timeline-list');
  
  if (!dashboardData.timeline || dashboardData.timeline.length === 0) {
    list.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No timeline events yet</p>';
    return;
  }
  
  list.innerHTML = dashboardData.timeline.map((event, index) => `
    <div class="item-card">
      <div class="item-header">
        <div>
          <div class="item-title">${event.icon || '📅'} ${event.title}</div>
          <div class="item-meta">${event.date || event.period || ''} • ${event.category || ''}</div>
        </div>
        <div class="item-actions">
          <button class="btn-icon" onclick="editTimelineEvent(${index})" title="Edit">✏️</button>
          <button class="btn-icon" onclick="deleteTimelineEvent(${index})" title="Delete">🗑️</button>
        </div>
      </div>
      <p>${event.description}</p>
    </div>
  `).join('');
}

function showTimelineForm(index = -1) {
  const form = document.getElementById('timeline-form');
  form.style.display = 'block';
  
  // Populate category dropdown
  const categorySelect = document.getElementById('timeline-category');
  categorySelect.innerHTML = '<option value="">Select Category</option>';
  if (dashboardData.categoryTags) {
    Object.keys(dashboardData.categoryTags).forEach(key => {
      const tag = dashboardData.categoryTags[key];
      const option = document.createElement('option');
      option.value = key;
      option.textContent = tag.label;
      categorySelect.appendChild(option);
    });
  }
  
  if (index >= 0) {
    const event = dashboardData.timeline[index];
    document.getElementById('timeline-edit-index').value = index;
    document.getElementById('timeline-period').value = event.date || event.period || '';
    document.getElementById('timeline-title').value = event.title;
    document.getElementById('timeline-description').value = event.description;
    document.getElementById('timeline-icon').value = event.icon || '';
    document.getElementById('timeline-category').value = event.category || '';
  } else {
    clearTimelineForm();
  }
  
  form.scrollIntoView({ behavior: 'smooth' });
}

function cancelTimelineForm() {
  document.getElementById('timeline-form').style.display = 'none';
  clearTimelineForm();
}

function clearTimelineForm() {
  document.getElementById('timeline-edit-index').value = '-1';
  document.getElementById('timeline-period').value = '';
  document.getElementById('timeline-title').value = '';
  document.getElementById('timeline-description').value = '';
  document.getElementById('timeline-icon').value = '';
  document.getElementById('timeline-category').value = '';
}

function saveTimelineEvent() {
  const index = parseInt(document.getElementById('timeline-edit-index').value);
  const event = {
    date: document.getElementById('timeline-period').value,
    title: document.getElementById('timeline-title').value,
    description: document.getElementById('timeline-description').value,
    icon: document.getElementById('timeline-icon').value || '📅',
    category: document.getElementById('timeline-category').value || 'life'
  };
  
  if (!event.date || !event.title) {
    alert('Please fill in required fields (Period and Title)');
    return;
  }
  
  if (index >= 0) {
    dashboardData.timeline[index] = event;
  } else {
    dashboardData.timeline.push(event);
  }
  
  renderTimelineList();
  cancelTimelineForm();
  saveToLocalStorage();
}

function editTimelineEvent(index) {
  showTimelineForm(index);
}

function deleteTimelineEvent(index) {
  if (confirm('Are you sure you want to delete this event?')) {
    dashboardData.timeline.splice(index, 1);
    renderTimelineList();
    saveToLocalStorage();
  }
}

// ========================================
// PROJECTS SECTION
// ========================================

function renderProjectsList() {
  const list = document.getElementById('projects-list');
  
  if (!dashboardData.projectCategories || Object.keys(dashboardData.projectCategories).length === 0) {
    list.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No projects yet. Please load data or create categories first.</p>';
    return;
  }
  
  let html = '';
  
  Object.keys(dashboardData.projectCategories).forEach((categoryKey) => {
    const category = dashboardData.projectCategories[categoryKey];
    const projects = category.projects || [];
    
    html += `
      <div style="margin-bottom: 2rem;">
        <h3 style="color: #667eea; margin-bottom: 1rem;">${category.icon} ${category.title}</h3>
        ${projects.length === 0 ? '<p style="color: #999; padding: 1rem;">No projects in this category</p>' : ''}
        ${projects.map((project, projIndex) => `
          <div class="item-card" style="margin-bottom: 1rem;">
            <div class="item-header">
              <div>
                <div class="item-title">${project.title}</div>
                <div class="item-meta">${project.subtitle}</div>
              </div>
              <div class="item-actions">
                <button class="btn-icon" onclick="editProject('${categoryKey}', ${projIndex})" title="Edit">✏️</button>
                <button class="btn-icon" onclick="deleteProject('${categoryKey}', ${projIndex})" title="Delete">🗑️</button>
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
              ${(project.techStack || []).map(tech => `<span class="tag">${tech}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  });
  
  list.innerHTML = html;
}

function showProjectForm() {
  openProjectModal();
  clearProjectForm();
  populateProjectCategoryDropdown();
}

function editProject(categoryKey, projIndex) {
  const project = dashboardData.projectCategories[categoryKey].projects[projIndex];
  
  // Store edit indices
  document.getElementById('project-edit-category').value = categoryKey;
  document.getElementById('project-edit-index').value = projIndex;
  
  // Populate basic fields
  document.getElementById('project-id').value = project.id;
  document.getElementById('project-title').value = project.title;
  document.getElementById('project-subtitle').value = project.subtitle;
  document.getElementById('project-description').value = project.description || '';
  document.getElementById('project-icon').value = project.icon || '';
  
  // Load arrays
  currentProject.techStack = [...(project.techStack || [])];
  currentProject.links = JSON.parse(JSON.stringify(project.links || []));
  currentProject.sections = JSON.parse(JSON.stringify(project.sections || []));
  
  renderProjectTechList();
  renderProjectLinksList();
  renderProjectSectionsList();
  
  previewMedia(document.getElementById('project-icon'), 'preview-project-icon');
  
  openProjectModal();
  populateProjectCategoryDropdown();
  
  // Set category dropdown to current category
  const categorySelect = document.getElementById('project-category-select');
  if (categorySelect) {
    categorySelect.value = categoryKey;
  }
  
  // Update preview
  updatePreview();
}

function deleteProject(categoryKey, projIndex) {
  if (confirm('Are you sure you want to delete this project?')) {
    dashboardData.projectCategories[categoryKey].projects.splice(projIndex, 1);
    renderProjectsList();
    saveToLocalStorage();
  }
}

function openProjectModal() {
  document.getElementById('project-modal').classList.add('active');
  populateProjectCategoryDropdown();
}

function closeProjectModal() {
  document.getElementById('project-modal').classList.remove('active');
  clearProjectForm();
}

function clearProjectForm() {
  document.getElementById('project-edit-category').value = '';
  document.getElementById('project-edit-index').value = '-1';
  document.getElementById('project-id').value = '';
  document.getElementById('project-title').value = '';
  document.getElementById('project-subtitle').value = '';
  document.getElementById('project-description').value = '';
  document.getElementById('project-icon').value = '';
  
  currentProject = {
    techStack: [],
    links: [],
    sections: []
  };
  
  renderProjectTechList();
  renderProjectLinksList();
  renderProjectSectionsList();
  updatePreview();
}

function populateProjectCategoryDropdown() {
  const select = document.getElementById('project-category-select');
  if (!select) return;
  
  select.innerHTML = '<option value="">Select Category</option>';
  
  if (dashboardData.projectCategories) {
    Object.keys(dashboardData.projectCategories).forEach(key => {
      const category = dashboardData.projectCategories[key];
      const option = document.createElement('option');
      option.value = key;
      option.textContent = `${category.icon} ${category.title}`;
      select.appendChild(option);
    });
  }
}

// Project Tech Stack
function addProjectTech() {
  const input = document.getElementById('project-tech-input');
  const tech = input.value.trim();
  
  if (tech) {
    currentProject.techStack.push(tech);
    input.value = '';
    renderProjectTechList();
  }
}

function removeProjectTech(index) {
  currentProject.techStack.splice(index, 1);
  renderProjectTechList();
}

function renderProjectTechList() {
  const list = document.getElementById('project-tech-list');
  list.innerHTML = currentProject.techStack.map((tech, index) => `
    <span class="tag">
      ${tech}
      <button class="tag-remove" onclick="removeProjectTech(${index})">×</button>
    </span>
  `).join('');
}

// Project Links
function addProjectLink() {
  const type = document.getElementById('project-link-type').value;
  const url = document.getElementById('project-link-url').value.trim();
  const label = document.getElementById('project-link-label').value.trim();
  
  if (url) {
    const link = { type, url };
    if (label) link.label = label;
    
    currentProject.links.push(link);
    
    document.getElementById('project-link-url').value = '';
    document.getElementById('project-link-label').value = '';
    renderProjectLinksList();
  }
}

function removeProjectLink(index) {
  currentProject.links.splice(index, 1);
  renderProjectLinksList();
}

function renderProjectLinksList() {
  const list = document.getElementById('project-links-list');
  list.innerHTML = currentProject.links.map((link, index) => `
    <div class="list-item" style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f7fafc; border-radius: 4px; margin-bottom: 0.5rem;">
      <span><strong>${link.type}:</strong> ${link.url} ${link.label ? `(${link.label})` : ''}</span>
      <button class="item-remove" onclick="removeProjectLink(${index})" style="background: #ff4444; color: white; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; cursor: pointer;">Remove</button>
    </div>
  `).join('');
}

// ========================================
// PROJECT SECTIONS - WITH REORDERING SUPPORT
// ========================================

function showProjectSectionForm(type) {
  const formContainer = document.getElementById('project-section-form');
  formContainer.style.display = 'block';
  currentSectionEditIndex = -1; // Reset edit index
  
  let formHTML = `<div class="block-item">
    <h5>Add ${type.charAt(0).toUpperCase() + type.slice(1)} Section</h5>`;
  
  switch(type) {
    case 'heading':
      formHTML += `
        <select id="section-heading-level" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 2px solid #e2e8f0; border-radius: 4px;">
          <option value="1">h1 (Extra Large - Main Title)</option>
          <option value="2" selected>h2 (Large - Section)</option>
          <option value="3">h3 (Medium - Subsection)</option>
          <option value="4">h4 (Small - Minor)</option>
          <option value="5">h5 (Smaller)</option>
          <option value="6">h6 (Smallest)</option>
        </select>
        <input type="text" id="section-heading-value" placeholder="Heading text" style="width: 100%; padding: 0.5rem; border: 2px solid #e2e8f0; border-radius: 4px;">
      `;
      break;
      
    case 'text':
      formHTML += `
        <div class="text-formatting">
          <button type="button" onclick="formatText('bold')" title="Bold"><b>B</b></button>
          <button type="button" onclick="formatText('italic')" title="Italic"><i>I</i></button>
          <button type="button" onclick="insertLink()" title="Insert Link">🔗 Link</button>
          <select id="text-font-size">
            <option value="">Font Size</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <textarea id="section-text-value" rows="6" placeholder="Enter your text..." style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 4px; font-family: inherit;"></textarea>
        <input type="hidden" id="text-is-bold" value="false">
        <input type="hidden" id="text-is-italic" value="false">
        <input type="hidden" id="text-font-size-value" value="medium">
      `;
      break;
      
    case 'list':
      formHTML += `
        <select id="section-list-ordered" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 2px solid #e2e8f0; border-radius: 4px;">
          <option value="false">Bulleted List</option>
          <option value="true">Numbered List</option>
        </select>
        <small style="color: #718096; display: block; margin-bottom: 0.5rem;">💡 Use "+ Sub-item" button next to each item to create nested lists</small>
        <div id="list-items-container" style="max-height: 400px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 4px; padding: 0.5rem;"></div>
        <button type="button" class="btn-add" onclick="addListItemField()" style="margin-top: 0.5rem;">+ Add Main Item</button>
      `;
      break;
      
    case 'code':
      formHTML += `
        <input type="text" id="section-code-language" placeholder="Language (e.g., javascript, python, C++, SQL...)" style="width: 100%; padding: 0.75rem; margin-bottom: 0.5rem; border: 2px solid #e2e8f0; border-radius: 4px;">
        <small style="color: #718096; display: block; margin-bottom: 0.5rem;">Type any programming language name</small>
        <textarea id="section-code-value" rows="8" placeholder="// Your code here..." style="width: 100%; padding: 0.75rem; font-family: 'Consolas', monospace; border: 2px solid #e2e8f0; border-radius: 4px;"></textarea>
      `;
      break;
      
    case 'image':
      formHTML += `
        <input type="text" id="section-image-src" placeholder="Image URL or path" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 2px solid #e2e8f0; border-radius: 4px;">
        <input type="text" id="section-image-alt" placeholder="Alt text" style="width: 100%; padding: 0.5rem; border: 2px solid #e2e8f0; border-radius: 4px;">
      `;
      break;
      
    case 'video':
      formHTML += `
        <select id="section-video-platform" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 2px solid #e2e8f0; border-radius: 4px;">
          <option value="youtube">YouTube</option>
          <option value="local">Local Video</option>
        </select>
        <input type="text" id="section-video-src" placeholder="Video URL" style="width: 100%; padding: 0.5rem; border: 2px solid #e2e8f0; border-radius: 4px;">
      `;
      break;
  }
  
  formHTML += `
    <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
      <button class="btn-primary" onclick="addProjectSection('${type}')">✓ Add</button>
      <button class="btn-secondary" onclick="cancelProjectSection()">✕ Cancel</button>
    </div>
  </div>`;
  
  formContainer.innerHTML = formHTML;
  
  // Initialize list if it's a list type
  if (type === 'list') {
    addListItemField();
  }
}

// Text Formatting Functions
function formatText(command) {
  const textarea = document.getElementById('section-text-value');
  if (!textarea) return;
  
  if (command === 'bold') {
    const isBold = document.getElementById('text-is-bold');
    isBold.value = isBold.value === 'true' ? 'false' : 'true';
  } else if (command === 'italic') {
    const isItalic = document.getElementById('text-is-italic');
    isItalic.value = isItalic.value === 'true' ? 'false' : 'true';
  }
  
  updateTextPreview();
}

function updateTextPreview() {
  // This is called when format buttons are clicked
  // The actual formatting is applied when the section is added
}

// Insert Link Function
function insertLink() {
  const textarea = document.getElementById('section-text-value');
  if (!textarea) return;
  
  // Get the currently selected text (if any)
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  
  // Prompt for link text
  const linkText = prompt('أدخل النص الذي سيظهر (Enter the text to display):', selectedText || '');
  if (!linkText) return; // User cancelled
  
  // Prompt for URL
  const linkUrl = prompt('أدخل رابط الـ URL (Enter the URL):', 'https://');
  if (!linkUrl) return; // User cancelled
  
  // Create markdown-style link
  const markdownLink = `[${linkText}](${linkUrl})`;
  
  // Insert the link at cursor position
  const currentValue = textarea.value;
  const newValue = currentValue.substring(0, start) + markdownLink + currentValue.substring(end);
  textarea.value = newValue;
  
  // Set cursor position after the inserted link
  const newCursorPos = start + markdownLink.length;
  textarea.setSelectionRange(newCursorPos, newCursorPos);
  textarea.focus();
}

// Nested List Management
let listItemsData = [];

function addListItemField(parentId = null, level = 0) {
  let targetContainer;
  
  if (parentId) {
    // Get the specific sub-container for this parent
    targetContainer = document.getElementById(`sub-container-${parentId}`);
    if (!targetContainer) {
      console.error('Sub-container not found for parent:', parentId);
      return;
    }
  } else {
    // Adding to main container
    targetContainer = document.getElementById('list-items-container');
  }
  
  if (!targetContainer) return;
  
  const itemId = 'item-' + Date.now() + '-' + Math.random();
  
  const itemData = {
    id: itemId,
    text: '',
    parentId: parentId,
    level: level,
    children: []
  };
  
  listItemsData.push(itemData);
  
  // Create wrapper that contains BOTH controls AND dedicated sub-container
  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = 'list-item-wrapper';
  wrapperDiv.id = `wrapper-${itemId}`;
  wrapperDiv.style.marginBottom = '0.5rem';
  
  // Create controls
  wrapperDiv.innerHTML = `
    <div class="list-item-controls" id="${itemId}" style="margin-left: ${level * 1.5}rem; display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
      <input type="text" class="list-item-input" data-item-id="${itemId}" placeholder="List item text..." style="flex: 1; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px;">
      <button type="button" onclick="addSubItem('${itemId}', ${level})" style="padding: 0.4rem 0.8rem; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 0.85rem;" title="Add nested sub-item">+ Sub-item</button>
      <button type="button" onclick="removeListItem('${itemId}')" style="padding: 0.4rem 0.7rem; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 700; font-size: 0.9rem;">×</button>
    </div>
    <div id="sub-container-${itemId}" class="nested-sub-container" style="margin-left: 1.5rem; border-left: 2px solid #cbd5e0; padding-left: 0.5rem; margin-top: 0.25rem;"></div>
  `;
  
  targetContainer.appendChild(wrapperDiv);
  
  // Add Enter key listener to the input field
  const inputField = wrapperDiv.querySelector('.list-item-input');
  inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Create new item at same level (same parent and level)
      addListItemField(parentId, level);
      // Focus on the newly created input after a short delay
      setTimeout(() => {
        const allInputs = document.querySelectorAll('.list-item-input');
        const currentIndex = Array.from(allInputs).indexOf(inputField);
        if (currentIndex >= 0 && currentIndex < allInputs.length - 1) {
          allInputs[currentIndex + 1].focus();
        }
      }, 50);
    }
  });
}

function addSubItem(parentId, parentLevel) {
  addListItemField(parentId, parentLevel + 1);
}

function removeListItem(itemId) {
  // Remove the entire wrapper which contains the item AND its sub-container
  const wrapper = document.getElementById(`wrapper-${itemId}`);
  if (wrapper) {
    wrapper.remove();
  }
  
  // Remove from data - also remove all descendants
  listItemsData = listItemsData.filter(item => {
    if (item.id === itemId) return false;
    
    // Check if this item is a descendant of the removed item
    let currentParent = item.parentId;
    while (currentParent) {
      if (currentParent === itemId) return false;
      const parentData = listItemsData.find(p => p.id === currentParent);
      currentParent = parentData ? parentData.parentId : null;
    }
    
    return true;
  });
}

function collectListItems() {
  const items = [];
  const inputs = document.querySelectorAll('.list-item-input');
  
  inputs.forEach(input => {
    const text = input.value.trim();
    if (text) {
      const itemElement = input.parentElement;
      const level = parseInt(itemElement.style.marginLeft) / 24; // 1.5rem = 24px
      items.push({
        text: text,
        level: level
      });
    }
  });
  
  return items;
}

function cancelProjectSection() {
  document.getElementById('project-section-form').innerHTML = '';
  listItemsData = [];
}

function addProjectSection(type) {
  let section = { type };
  
  switch(type) {
    case 'heading':
      section.level = parseInt(document.getElementById('section-heading-level').value);
      section.value = document.getElementById('section-heading-value').value;
      if (!section.value) {
        alert('Please enter heading text');
        return;
      }
      break;
      
    case 'text':
      const textValue = document.getElementById('section-text-value').value;
      const isBold = document.getElementById('text-is-bold').value === 'true';
      const isItalic = document.getElementById('text-is-italic').value === 'true';
      const fontSize = document.getElementById('text-font-size').value || 'medium';
      
      if (!textValue) {
        alert('Please enter some text');
        return;
      }
      
      section.value = textValue;
      section.bold = isBold;
      section.italic = isItalic;
      section.fontSize = fontSize;
      break;
      
    case 'list':
      const isOrdered = document.getElementById('section-list-ordered').value === 'true';
      const items = collectListItems();
      
      if (items.length === 0) {
        alert('Please add at least one list item');
        return;
      }
      
      section.ordered = isOrdered;
      section.items = items.map(item => item.text);
      section.nestedItems = items; // Store with level info
      break;
      
    case 'code':
      const language = document.getElementById('section-code-language').value.trim();
      const codeValue = document.getElementById('section-code-value').value;
      
      if (!codeValue) {
        alert('Please enter some code');
        return;
      }
      
      section.language = language || 'plaintext';
      section.value = codeValue;
      break;
      
    case 'image':
      const imgSrc = document.getElementById('section-image-src').value.trim();
      const imgAlt = document.getElementById('section-image-alt').value.trim();
      
      if (!imgSrc) {
        alert('Please enter image URL');
        return;
      }
      
      section.src = imgSrc;
      section.alt = imgAlt || 'Image';
      break;
      
    case 'video':
      const platform = document.getElementById('section-video-platform').value;
      const videoSrc = document.getElementById('section-video-src').value.trim();
      
      if (!videoSrc) {
        alert('Please enter video URL');
        return;
      }
      
      section.platform = platform;
      section.src = videoSrc;
      break;
  }
  
  if (currentSectionEditIndex >= 0) {
    currentProject.sections[currentSectionEditIndex] = section;
    currentSectionEditIndex = -1;
  } else {
    currentProject.sections.push(section);
  }
  
  cancelProjectSection();
  renderProjectSectionsList();
  updatePreview();
}

// ========================================
// BLOCK REORDERING - CORE FEATURE
// ========================================

function moveBlockUp(index) {
  if (index <= 0) return;
  
  const temp = currentProject.sections[index];
  currentProject.sections[index] = currentProject.sections[index - 1];
  currentProject.sections[index - 1] = temp;
  
  renderProjectSectionsList();
  updatePreview();
}

function moveBlockDown(index) {
  if (index >= currentProject.sections.length - 1) return;
  
  const temp = currentProject.sections[index];
  currentProject.sections[index] = currentProject.sections[index + 1];
  currentProject.sections[index + 1] = temp;
  
  renderProjectSectionsList();
  updatePreview();
}

function removeProjectSection(index) {
  if (confirm('Remove this section?')) {
    currentProject.sections.splice(index, 1);
    renderProjectSectionsList();
    updatePreview();
  }
}

function renderProjectSectionsList() {
  const list = document.getElementById('project-sections-list');
  
  if (currentProject.sections.length === 0) {
    list.innerHTML = '<p style="color: #999; text-align: center; padding: 1rem;">No sections yet</p>';
    updatePreview();
    return;
  }
  
  list.innerHTML = currentProject.sections.map((section, index) => {
    let preview = '';
    
    switch(section.type) {
      case 'heading':
        preview = `<h${section.level}>${section.value}</h${section.level}>`;
        break;
      case 'text':
        let textClass = '';
        if (section.fontSize) textClass += ` font-size-${section.fontSize}`;
        if (section.bold) textClass += ' text-bold';
        if (section.italic) textClass += ' text-italic';
        preview = `<p class="${textClass}">${section.value.substring(0, 100)}${section.value.length > 100 ? '...' : ''}</p>`;
        break;
      case 'list':
        const listType = section.ordered ? 'ol' : 'ul';
        preview = `<${listType}>${section.items.slice(0, 3).map(item => `<li>${item}</li>`).join('')}</${listType}>`;
        break;
      case 'code':
        preview = `<pre><code>${section.value.substring(0, 80)}...</code></pre>`;
        break;
      case 'image':
        preview = `<p>🖼️ Image: ${section.alt}</p>`;
        break;
      case 'video':
        preview = `<p>🎬 Video (${section.platform})</p>`;
        break;
    }
    
    return `
      <div class="block-item">
        <div class="block-controls">
          <button onclick="moveBlockUp(${index})" ${index === 0 ? 'disabled' : ''} title="Move Up">↑</button>
          <button onclick="moveBlockDown(${index})" ${index === currentProject.sections.length - 1 ? 'disabled' : ''} title="Move Down">↓</button>
          <button onclick="removeProjectSection(${index})" style="background: #ef4444;" title="Remove">🗑️</button>
          <span style="flex: 1; text-align: center; font-weight: 500;">${section.type.toUpperCase()}</span>
        </div>
        ${preview}
      </div>
    `;
  }).join('');
  
  updatePreview();
}

// ========================================
// LIVE PREVIEW - CORE FEATURE
// ========================================

function updatePreview() {
  const previewContent = document.getElementById('project-preview-content');
  if (!previewContent) return;
  
  if (currentProject.sections.length === 0) {
    previewContent.innerHTML = '<p class="empty-state">Add sections to see preview...</p>';
    return;
  }
  
  let html = '';
  
  currentProject.sections.forEach(section => {
    switch(section.type) {
      case 'heading':
        html += `<h${section.level}>${escapeHtml(section.value)}</h${section.level}>`;
        break;
        
      case 'text':
        let textClass = '';
        if (section.fontSize) textClass += ` font-size-${section.fontSize}`;
        if (section.bold) textClass += ' text-bold';
        if (section.italic) textClass += ' text-italic';
        // Convert Markdown links to HTML
        const textWithLinks = convertMarkdownLinksToHtml(section.value);
        html += `<p class="${textClass}">${textWithLinks}</p>`;
        break;
        
      case 'list':
        const listType = section.ordered ? 'ol' : 'ul';
        
        if (section.nestedItems && section.nestedItems.length > 0) {
          // Render nested list
          html += renderNestedList(section.nestedItems, section.ordered);
        } else {
          // Simple list
          html += `<${listType}>`;
          section.items.forEach(item => {
            html += `<li>${escapeHtml(item)}</li>`;
          });
          html += `</${listType}>`;
        }
        break;
        
      case 'code':
        html += `<pre><code class="language-${section.language}">${escapeHtml(section.value)}</code></pre>`;
        break;
        
      case 'image':
        html += `<img src="${escapeHtml(section.src)}" alt="${escapeHtml(section.alt)}" style="max-width: 100%; height: auto;">`;
        break;
        
      case 'video':
        if (section.platform === 'youtube') {
          const videoId = extractYouTubeId(section.src);
          html += `
            <div class="video-container">
              <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
          `;
        } else {
          html += `<video controls style="max-width: 100%;"><source src="${escapeHtml(section.src)}"></video>`;
        }
        break;
    }
  });
  
  previewContent.innerHTML = html;
}

function renderNestedList(items, ordered) {
  if (!items || items.length === 0) return '';
  
  const listType = ordered ? 'ol' : 'ul';
  let html = `<${listType}>`;
  let currentLevel = 0;
  
  items.forEach((item, index) => {
    const level = item.level || 0;
    
    if (level > currentLevel) {
      // Open nested list
      html += `<${listType}>`;
    } else if (level < currentLevel) {
      // Close nested lists
      for (let i = 0; i < currentLevel - level; i++) {
        html += `</${listType}></li>`;
      }
    }
    
    html += `<li>${escapeHtml(item.text || item)}`;
    
    // Check if next item is at same or lower level
    const nextItem = items[index + 1];
    if (!nextItem || nextItem.level <= level) {
      html += '</li>';
    }
    
    currentLevel = level;
  });
  
  // Close remaining open tags
  for (let i = 0; i < currentLevel; i++) {
    html += `</${listType}></li>`;
  }
  
  html += `</${listType}>`;
  return html;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Convert Markdown links [text](url) to HTML <a> tags
function convertMarkdownLinksToHtml(text) {
  if (!text) return '';
  
  // First escape HTML to prevent XSS
  let escapedText = escapeHtml(text);
  
  // Regex to match Markdown links: [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  // Replace Markdown links with HTML anchor tags
  const htmlWithLinks = escapedText.replace(markdownLinkRegex, (match, linkText, url) => {
    // The text and url are already escaped from escapeHtml above
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  });
  
  return htmlWithLinks;
}

function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
}

// ========================================
// SAVE PROJECT
// ========================================

function saveProject() {
  const projectId = document.getElementById('project-id').value.trim();
  const title = document.getElementById('project-title').value.trim();
  const subtitle = document.getElementById('project-subtitle').value.trim();
  const categoryKey = document.getElementById('project-category-select').value;
  
  if (!projectId || !title || !subtitle || !categoryKey) {
    alert('Please fill in all required fields: Project ID, Title, Subtitle, and Category');
    return;
  }
  
  const project = {
    id: projectId,
    title: title,
    subtitle: subtitle,
    description: document.getElementById('project-description').value,
    icon: document.getElementById('project-icon').value,
    techStack: [...currentProject.techStack],
    links: JSON.parse(JSON.stringify(currentProject.links)),
    sections: JSON.parse(JSON.stringify(currentProject.sections))
  };
  
  const editCategory = document.getElementById('project-edit-category').value;
  const editIndex = parseInt(document.getElementById('project-edit-index').value);
  
  if (editIndex >= 0 && editCategory) {
    // Editing existing project
    if (editCategory !== categoryKey) {
      // Category changed - remove from old, add to new
      dashboardData.projectCategories[editCategory].projects.splice(editIndex, 1);
      if (!dashboardData.projectCategories[categoryKey].projects) {
        dashboardData.projectCategories[categoryKey].projects = [];
      }
      dashboardData.projectCategories[categoryKey].projects.push(project);
    } else {
      // Same category
      dashboardData.projectCategories[categoryKey].projects[editIndex] = project;
    }
  } else {
    // New project
    if (!dashboardData.projectCategories[categoryKey].projects) {
      dashboardData.projectCategories[categoryKey].projects = [];
    }
    dashboardData.projectCategories[categoryKey].projects.push(project);
  }
  
  saveToLocalStorage();
  renderProjectsList();
  closeProjectModal();
  alert('✓ Project saved successfully!');
}

// ========================================
// CATEGORIES MANAGEMENT
// ========================================

function renderCategoriesList() {
  const list = document.getElementById('categories-list');
  
  if (!dashboardData.projectCategories || Object.keys(dashboardData.projectCategories).length === 0) {
    list.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No categories yet</p>';
    return;
  }
  
  list.innerHTML = Object.keys(dashboardData.projectCategories).map(key => {
    const cat = dashboardData.projectCategories[key];
    return `
      <div class="item-card">
        <div class="item-header">
          <div>
            <div class="item-title">${cat.icon} ${cat.title}</div>
            <div class="item-meta">${cat.description}</div>
          </div>
          <div class="item-actions">
            <button class="btn-icon" onclick="editCategory('${key}')" title="Edit">✏️</button>
            <button class="btn-icon" onclick="deleteCategory('${key}')" title="Delete">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function showCategoryForm() {
  document.getElementById('category-form').style.display = 'block';
  document.getElementById('category-form').scrollIntoView({ behavior: 'smooth' });
}

function cancelCategoryForm() {
  document.getElementById('category-form').style.display = 'none';
  document.getElementById('category-edit-key').value = '';
  document.getElementById('category-key').value = '';
  document.getElementById('category-icon').value = '';
  document.getElementById('category-title').value = '';
  document.getElementById('category-description').value = '';
}

function editCategory(key) {
  const cat = dashboardData.projectCategories[key];
  
  document.getElementById('category-edit-key').value = key;
  document.getElementById('category-key').value = key;
  document.getElementById('category-key').disabled = true;
  document.getElementById('category-icon').value = cat.icon;
  document.getElementById('category-title').value = cat.title;
  document.getElementById('category-description').value = cat.description;
  
  showCategoryForm();
}

function deleteCategory(key) {
  const cat = dashboardData.projectCategories[key];
  const projectCount = (cat.projects || []).length;
  
  if (projectCount > 0) {
    if (!confirm(`This category has ${projectCount} project(s). Delete anyway?`)) {
      return;
    }
  }
  
  delete dashboardData.projectCategories[key];
  renderCategoriesList();
  saveToLocalStorage();
}

function saveCategory() {
  const key = document.getElementById('category-key').value.trim();
  const icon = document.getElementById('category-icon').value.trim();
  const title = document.getElementById('category-title').value.trim();
  const description = document.getElementById('category-description').value.trim();
  
  if (!key || !title) {
    alert('Please fill in Category Key and Title');
    return;
  }
  
  const editKey = document.getElementById('category-edit-key').value;
  
  if (editKey) {
    // Editing
    dashboardData.projectCategories[key].icon = icon;
    dashboardData.projectCategories[key].title = title;
    dashboardData.projectCategories[key].description = description;
  } else {
    // New
    if (dashboardData.projectCategories[key]) {
      alert('Category key already exists');
      return;
    }
    
    dashboardData.projectCategories[key] = {
      title: title,
      icon: icon,
      description: description,
      projects: []
    };
  }
  
  document.getElementById('category-key').disabled = false;
  cancelCategoryForm();
  renderCategoriesList();
  saveToLocalStorage();
}

// ========================================
// TIMELINE TAGS MANAGEMENT
// ========================================

function renderTagsList() {
  const list = document.getElementById('tags-list');
  
  if (!dashboardData.categoryTags || Object.keys(dashboardData.categoryTags).length === 0) {
    list.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No tags yet</p>';
    return;
  }
  
  list.innerHTML = Object.keys(dashboardData.categoryTags).map(key => {
    const tag = dashboardData.categoryTags[key];
    return `
      <div class="item-card">
        <div class="item-header">
          <div>
            <div class="item-title">${tag.label}</div>
            <div class="item-meta" style="background: ${tag.color}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; display: inline-block;">${tag.color}</div>
          </div>
          <div class="item-actions">
            <button class="btn-icon" onclick="editTag('${key}')" title="Edit">✏️</button>
            <button class="btn-icon" onclick="deleteTag('${key}')" title="Delete">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function showTagForm() {
  document.getElementById('tag-form').style.display = 'block';
  document.getElementById('tag-form').scrollIntoView({ behavior: 'smooth' });
}

function cancelTagForm() {
  document.getElementById('tag-form').style.display = 'none';
  document.getElementById('tag-edit-key').value = '';
  document.getElementById('tag-key').value = '';
  document.getElementById('tag-label').value = '';
  document.getElementById('tag-color').value = '#4a90e2';
  updateTagColorPreview();
}

function editTag(key) {
  const tag = dashboardData.categoryTags[key];
  
  document.getElementById('tag-edit-key').value = key;
  document.getElementById('tag-key').value = key;
  document.getElementById('tag-key').disabled = true;
  document.getElementById('tag-label').value = tag.label;
  document.getElementById('tag-color').value = tag.color;
  
  updateTagColorPreview();
  showTagForm();
}

function deleteTag(key) {
  if (confirm('Delete this tag?')) {
    delete dashboardData.categoryTags[key];
    renderTagsList();
    saveToLocalStorage();
  }
}

function saveTag() {
  const key = document.getElementById('tag-key').value.trim();
  const label = document.getElementById('tag-label').value.trim();
  const color = document.getElementById('tag-color').value;
  
  if (!key || !label) {
    alert('Please fill in Tag Key and Label');
    return;
  }
  
  const editKey = document.getElementById('tag-edit-key').value;
  
  if (editKey) {
    // Editing
    dashboardData.categoryTags[key].label = label;
    dashboardData.categoryTags[key].color = color;
  } else {
    // New
    if (dashboardData.categoryTags[key]) {
      alert('Tag key already exists');
      return;
    }
    
    dashboardData.categoryTags[key] = {
      label: label,
      color: color
    };
  }
  
  document.getElementById('tag-key').disabled = false;
  cancelTagForm();
  renderTagsList();
  saveToLocalStorage();
}

function updateTagColorPreview() {
  const color = document.getElementById('tag-color').value;
  const preview = document.getElementById('tag-color-preview');
  if (preview) {
    preview.style.background = color;
  }
}

// ========================================
// EXPORT DATA
// ========================================

function generateDataJS() {
  const output = document.getElementById('export-output');
  const codeEl = document.getElementById('export-code');
  
  // Build the complete data structure
  const exportData = {
    personal: dashboardData.personal,
    projectCategories: dashboardData.projectCategories,
    timeline: dashboardData.timeline,
    categories: dashboardData.categoryTags
  };
  
  // Generate JavaScript code
  const code = `// ========================================
// PORTFOLIO DATA - YOUR CENTRALIZED DASHBOARD
// ========================================
// This file contains ALL your portfolio content in one place.
// Generated by Portfolio Dashboard

const portfolioData = ${JSON.stringify(exportData, null, 2)};

// ========================================
// HELPER FUNCTIONS
// ========================================

// Get all projects from all categories as a flat array
function getAllProjects() {
  const categories = portfolioData.projectCategories;
  return Object.values(categories).flatMap(cat => cat.projects);
}

// Get project by ID (searches across all categories)
function getProjectById(projectId) {
  return getAllProjects().find(p => p.id === projectId);
}

// Get projects by category key
function getProjectsByCategory(categoryKey) {
  if (categoryKey === 'all') return getAllProjects();
  return portfolioData.projectCategories[categoryKey]?.projects || [];
}

// Get timeline events by category
function getTimelineByCategory(category) {
  return portfolioData.timeline.filter(e => e.category === category);
}

// Generate project link for timeline
function getProjectLink(projectId) {
  const project = getProjectById(projectId);
  if (!project) return null;
  return {
    url: \`project.html?id=\${projectId}\`,
    title: project.title
  };
}`;
  
  codeEl.textContent = code;
  output.style.display = 'block';
  output.scrollIntoView({ behavior: 'smooth' });
}

function copyExportCode() {
  const codeEl = document.getElementById('export-code');
  const textArea = document.createElement('textarea');
  textArea.value = codeEl.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  alert('✓ Code copied to clipboard!');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function previewMedia(input, previewId) {
  const preview = document.getElementById(previewId);
  if (!preview) return;
  
  const url = input.value.trim();
  if (!url) {
    preview.innerHTML = '';
    return;
  }
  
  // Check if it's an image
  if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
    preview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; margin-top: 0.5rem;">`;
  } else {
    preview.innerHTML = `<p style="color: #999; font-size: 0.9rem; margin-top: 0.5rem;">Preview not available</p>`;
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('dashboardData');
    if (saved) {
      dashboardData = JSON.parse(saved);
      populateAboutForm();
      renderTimelineList();
      renderProjectsList();
      renderCategoriesList();
      renderTagsList();
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
}

function clearLocalStorage() {
  if (confirm('Clear all cached data? This will not affect your exported code.')) {
    localStorage.removeItem('dashboardData');
    location.reload();
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
