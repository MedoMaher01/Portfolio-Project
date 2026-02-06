// ========================================
// PORTFOLIO DATA - YOUR CENTRALIZED DASHBOARD
// ========================================
// This file contains ALL your portfolio content in one place.
// Simply edit the values here and the entire website updates automatically!

const portfolioData = {
  // ========================================
  // PERSONAL INFORMATION
  // ========================================
  personal: {
    name: "Ahmed Maher Ramadan",
    profession: "[Your Profession]",
    tagline: "[Your Specializations]",
    background: "[Your Background]",
    bio: "Hello! I'm Ahmed Maher Ramadan, a passionate [Your Profession] with a love for creating innovative solutions. With a background in [Your Background], I specialize in [Your Specializations]. My goal is to leverage technology to make a positive impact and drive progress in the industry.",
    
    // Images
    logo: "Image/Logo Without BG.png",
    profileImage: "Image/Portfolio img.jpg",
    
    // Contact & Social
    email: "anshtaun00@gmail.com",
    github: "MedoMaher01",
    linkedin: "x0maro",
    
    // SEO
    siteUrl: "https://yourwebsite.com",
    description: "Professional portfolio of Ahmed Maher Ramadan, a passionate [Your Profession] specializing in [Your Specializations].",
    keywords: "portfolio, web developer, projects, Ahmed Maher Ramadan, [Your Profession]"
  },

  // ========================================
  // PROJECTS - Add your projects here!
  // ========================================
  // Each project needs:
  // - id: Unique identifier (use lowercase with hyphens, e.g., "my-app")
  // - title: Project name
  // - subtitle: Short description
  // - description: Full project description
  // - category: Array of categories (web, frontend, fullstack, mobile, other)
  // - techStack: Array of technologies used
  // - links: Object with github, linkedin, demo URLs (use null if not applicable)
  // - icon: Path to project icon/image
  
  projects: [
    {
      id: "web-portfolio",
      title: "Personal Portfolio Website",
      subtitle: "Responsive portfolio showcasing skills and projects",
      description: "A modern, fully responsive portfolio website built from scratch using HTML5, CSS3, and vanilla JavaScript. Features include an interactive timeline showcasing my professional journey, a projects gallery organized by skills, smooth scroll animations, and comprehensive SEO optimization. The design follows mobile-first principles with a focus on accessibility and user experience.",
      category: ["web", "frontend"],
      techStack: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "SEO"],
      links: {
        github: "https://github.com/yourusername/portfolio",
        linkedin: "https://linkedin.com/posts/your-post",
        demo: "#"
      },
      icon: "Image/Logo.png"
    },
    {
      id: "task-manager",
      title: "Task Management Application",
      subtitle: "Collaborative task tracker with real-time updates",
      description: "A full-featured task management system designed for team collaboration. Includes user authentication, role-based access control, real-time updates using WebSockets, drag-and-drop task organization, priority levels, due dates, file attachments, and comprehensive dashboard with analytics. The application supports team workspaces, task assignments, and notification system.",
      category: ["fullstack"],
      techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "WebSocket", "Redux"],
      links: {
        github: "https://github.com/yourusername/task-manager",
        linkedin: "https://linkedin.com/posts/your-post",
        demo: "#"
      },
      icon: "Image/Logo.png"
    },
    {
      id: "ecommerce",
      title: "E-Commerce Platform",
      subtitle: "Complete online shopping solution with payment integration",
      description: "A comprehensive e-commerce platform with full shopping cart functionality, secure payment processing via Stripe integration, product catalog with advanced filtering and search, user reviews and ratings, order tracking, inventory management, admin dashboard for managing products and orders, and automated email notifications. Features responsive design optimized for mobile shopping experiences.",
      category: ["fullstack"],
      techStack: ["Next.js", "React", "Node.js", "Stripe API", "MongoDB", "Tailwind CSS"],
      links: {
        github: "https://github.com/yourusername/ecommerce-platform",
        linkedin: "https://linkedin.com/posts/your-post",
        demo: null
      },
      icon: "Image/Logo.png"
    },
    {
      id: "weather-app",
      title: "Weather Dashboard",
      subtitle: "Real-time weather data visualization and forecasting",
      description: "An interactive weather dashboard that integrates with multiple weather APIs to provide comprehensive weather information. Features include current conditions, 7-day forecast, hourly predictions, interactive maps with weather overlays, location search with autocomplete, favorite locations, weather alerts, and beautiful data visualizations using charts. Supports geolocation for automatic location detection and unit conversion (Celsius/Fahrenheit).",
      category: ["fullstack", "frontend"],
      techStack: ["React", "Weather API", "Chart.js", "Geolocation", "CSS3", "REST API"],
      links: {
        github: "https://github.com/yourusername/weather-dashboard",
        linkedin: "https://linkedin.com/posts/your-post",
        demo: "#"
      },
      icon: "Image/Logo.png"
    },
    {
      id: "blog-platform",
      title: "Blog Platform with CMS",
      subtitle: "Feature-rich blogging platform with content management",
      description: "A comprehensive blog platform with a custom content management system. Features include markdown support for writing articles, rich text editor, comment system with moderation, user authentication, category and tag management, SEO-optimized URLs, and RSS feed generation. The platform is built with modern web technologies and follows best practices for performance and security.",
      category: ["web", "frontend", "fullstack"],
      techStack: ["React", "Node.js", "Express", "MongoDB", "Markdown", "JWT Auth"],
      links: {
        github: "https://github.com/yourusername/blog-platform",
        linkedin: "https://linkedin.com/posts/your-post",
        demo: null
      },
      icon: "Image/Logo.png"
    },
    {
      id: "fitness-tracker",
      title: "Fitness Tracking Mobile App",
      subtitle: "Cross-platform fitness and workout tracker",
      description: "A mobile application for tracking fitness goals, workouts, and nutrition. Features include workout logging, exercise library with animations, progress tracking with charts, calorie counter, water intake tracker, custom workout plans, achievement system, and integration with device health sensors. Built with React Native for cross-platform compatibility.",
      category: ["mobile"],
      techStack: ["React Native", "Expo", "Firebase", "Redux", "Native APIs"],
      links: {
        github: "https://github.com/yourusername/fitness-tracker",
        linkedin: "https://linkedin.com/posts/your-post",
        demo: null
      },
      icon: "Image/Logo.png"
    }
  ],

  // ========================================
  // TIMELINE EVENTS - Add your journey milestones!
  // ========================================
  // Each event needs:
  // - date: Time period (e.g., "2020" or "2020 - 2022")
  // - title: Event title
  // - category: One of: "life", "education", "career", "project", "achievement"
  // - description: Full description (can include HTML for links)
  // - projectId: (OPTIONAL) Link to a project by its ID - will auto-create link!
  // - icon: Emoji to display in timeline marker
  // - media: (OPTIONAL) Add images or videos to your timeline events!
  //   - type: "image", "youtube", or "video"
  //   - url: Path to image file or YouTube embed URL
  //   Example: media: { type: "image", url: "Image/my-photo.jpg" }
  //   Example: media: { type: "youtube", url: "https://www.youtube.com/embed/VIDEO_ID" }
  
  timeline: [
    {
      date: "2000 - 2010",
      title: "Early Beginnings",
      category: "life",
      description: "Discovered my passion for technology and problem-solving. Started exploring computers, learning basic programming concepts, and developing a curiosity for how things work.",
      icon: "🌱"
    },
    {
      date: "2015 - 2018",
      title: "High School Education",
      category: "education",
      description: "Completed high school with focus on mathematics and sciences. Participated in coding clubs and tech competitions, solidifying my interest in software development.",
      icon: "📚"
    },
    {
      date: "2018 - 2022",
      title: "Bachelor's Degree in Computer Science",
      category: "education",
      description: "Pursued degree in Computer Science at [University Name]. Studied data structures, algorithms, web development, and software engineering principles. Graduated with honors.",
      icon: "🎓"
    },
    {
      date: "2020",
      title: "First Major Project",
      category: "project",
      description: "Developed my first full-stack web application - a Task Management System using modern web technologies. This project taught me about database design, API development, and user interface principles.",
      projectId: "task-manager", // Links to project above!
      icon: "💻"
    },
    {
      date: "2021",
      title: "Software Development Internship",
      category: "career",
      description: "Completed internship at [Company Name] where I worked on real-world projects, collaborated with experienced developers, and learned industry best practices.",
      icon: "💼"
    },
    {
      date: "2022",
      title: "Portfolio Website Launch",
      category: "project",
      description: "Created and launched my Personal Portfolio Website to showcase my work and skills. Implemented responsive design, accessibility features, and SEO optimization.",
      projectId: "web-portfolio", // Links to portfolio project!
      icon: "🎨",
      media: {
        type: "image",
        url: "Image/Logo.png" // Example image - replace with your actual screenshot!
      }
    },
    {
      date: "2022 - 2024",
      title: "Junior Developer Position",
      category: "career",
      description: "Joined [Company Name] as a Junior Developer. Contributed to multiple client projects, improved application performance, and mentored new team members.",
      icon: "🚀"
    },
    {
      date: "2023",
      title: "E-Commerce Platform",
      category: "project",
      description: "Built a comprehensive E-Commerce Platform with payment integration, inventory management, and analytics dashboard. This project significantly enhanced my full-stack development skills.",
      projectId: "ecommerce", // Auto-links to e-commerce project!
      icon: "🛒",
      media: {
        type: "youtube",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Example YouTube - replace with your demo!
      }
    },
    {
      date: "2024",
      title: "Professional Certifications",
      category: "achievement",
      description: "Earned multiple professional certifications including AWS Certified Developer, React Advanced Certification, and Responsive Web Design. Committed to continuous learning and professional development.",
      icon: "🏆"
    },
    {
      date: "2025 - Present",
      title: "Current Goals & Future Vision",
      category: "achievement",
      description: "Currently focused on expanding expertise in cloud architecture, mobile development, and contributing to open-source projects. Aspiring to become a technical lead and mentor the next generation of developers.",
      icon: "🎯"
    }
  ],

  // ========================================
  // CATEGORY CONFIGURATIONS
  // ========================================
  categories: {
    life: { label: "Life", color: "#4a90e2" },
    education: { label: "Education", color: "#4caf50" },
    career: { label: "Career", color: "#9c27b0" },
    project: { label: "Project", color: "#ff9800" },
    achievement: { label: "Achievement", color: "#f44336" }
  },

  // Project filter categories
  projectFilters: [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Development" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "fullstack", label: "Full-Stack" },
    { id: "frontend", label: "Frontend" },
    { id: "other", label: "Other" }
  ]
};

// ========================================
// HELPER FUNCTIONS
// ========================================

// Get project by ID
function getProjectById(projectId) {
  return portfolioData.projects.find(p => p.id === projectId);
}

// Get projects by category
function getProjectsByCategory(category) {
  if (category === 'all') return portfolioData.projects;
  return portfolioData.projects.filter(p => p.category.includes(category));
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
    url: `projects.html#project-${projectId}`,
    title: project.title
  };
}
