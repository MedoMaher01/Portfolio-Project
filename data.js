// ========================================
// STATIC DATA LOADER
// ========================================
// Metadata lives in data.json. Project bodies live in /projects/*.md.

let portfolioData = null;
let portfolioDataPromise = null;

async function loadPortfolioData() {
  if (portfolioData) return portfolioData;
  if (portfolioDataPromise) return portfolioDataPromise;

  portfolioDataPromise = fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Unable to load data.json (${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      portfolioData = data;
      return portfolioData;
    })
    .catch(error => {
      portfolioDataPromise = null;
      console.error('Failed to load portfolio data:', error);
      throw error;
    });

  return portfolioDataPromise;
}

// Get all projects from all categories as a flat array
function getAllProjects() {
  const categories = portfolioData?.projectCategories || {};
  return Object.values(categories).flatMap(category => category.projects || []);
}

// Get project by ID (searches across all categories)
function getProjectById(projectId) {
  return getAllProjects().find(project => project.id === projectId);
}

// Get projects by category key
function getProjectsByCategory(categoryKey) {
  if (categoryKey === 'all') return getAllProjects();
  return portfolioData?.projectCategories?.[categoryKey]?.projects || [];
}

// Get timeline events by category
function getTimelineByCategory(category) {
  return (portfolioData?.timeline || []).filter(event => event.category === category);
}

// Generate project link for timeline
function getProjectLink(projectId) {
  const project = getProjectById(projectId);
  if (!project) return null;

  return {
    url: `project.html?id=${projectId}`,
    title: project.title
  };
}

function getProjectTags(project) {
  return project?.tags || project?.techStack || [];
}

function getProjectMarkdownPath(project) {
  return project?.markdownPath || (project?.id ? `projects/${project.id}.md` : '');
}
