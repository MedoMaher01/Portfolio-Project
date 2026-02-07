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
    name: "Ahmed Maher",
    profession: "Software Developer",
    tagline: "Full-Stack Development & Web Solutions",
    background: "Computer Science & Software Engineering",
    bio: "Hello! I'm Ahmed Maher, a passionate Software Developer with a love for creating innovative solutions. With a background in Computer Science & Software Engineering, I specialize in Full-Stack Development & Web Solutions. My goal is to leverage technology to make a positive impact and drive progress in the industry.",
    
    // Images
    logo: "Image/Logo Without BG.png",
    profileImage: "Image/Portfolio img.jpg",
    
    // Contact & Social
    email: "anshtaun00@gmail.com",
    github: "MedoMaher01",
    linkedin: "x0maro",
    
    // SEO
    siteUrl: "https://yourwebsite.com",
    description: "Professional portfolio of Ahmed Maher, a passionate Software Developer specializing in Full-Stack Development & Web Solutions.",
    keywords: "portfolio, web developer, projects, Ahmed Maher, Software Developer, Full-Stack Development"
  },

  // ========================================
  // PROJECT CATEGORIES - Organize by Domain
  // ========================================
  // Each category contains:
  // - title: Display name for the category
  // - icon: Emoji or icon for visual identification
  // - description: Brief description of the category
  // - projects: Array of projects in this category
  //
  // Each project contains:
  // - id: Unique identifier (use lowercase with hyphens)
  // - title: Project name
  // - subtitle: Short one-line description
  // - description: Full detailed description
  // - techStack: Array of tools/technologies used
  // - links: Array of link objects with { type, url, label }
  //   Available types: github, behance, pdf, drive, demo, linkedin, youtube, custom
  // - icon: Path to project icon/image
  // - media: (OPTIONAL) Add images or videos { type: "image"/"youtube", url: "..." }
  
  projectCategories: {
    programming: {
      title: "Programming Projects",
      icon: "💻",
      description: "Software development and web applications",
      projects: [
        {
          id: "web-portfolio",
          title: "Personal Portfolio Website",
          subtitle: "Responsive portfolio showcasing skills and projects",
          description: "A modern, fully responsive portfolio website built from scratch using HTML5, CSS3, and vanilla JavaScript. Features include an interactive timeline showcasing my professional journey, a projects gallery organized by skills, smooth scroll animations, and comprehensive SEO optimization. The design follows mobile-first principles with a focus on accessibility and user experience.",
          techStack: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "SEO"],
          links: [
            { type: "github", url: "https://github.com/MedoMaher01/Portfolio-Project", label: "View Code" },
            { type: "demo", url: "#", label: "Live Demo" }
          ],
          icon: "Image/Logo.png"
        },
        {
          id: "task-manager",
          title: "Task Management Application",
          subtitle: "Collaborative task tracker with real-time updates",
          description: "A full-featured task management system designed for team collaboration. Includes user authentication, role-based access control, real-time updates using WebSockets, drag-and-drop task organization, priority levels, due dates, file attachments, and comprehensive dashboard with analytics. The application supports team workspaces, task assignments, and notification system.",
          techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "WebSocket", "Redux"],
          links: [
            { type: "github", url: "https://github.com/MedoMaher01/task-manager", label: "View Code" },
            { type: "linkedin", url: "https://linkedin.com/in/x0maro", label: "LinkedIn Profile" }
          ],
          icon: "Image/Logo.png"
        },
        {
          id: "ecommerce",
          title: "E-Commerce Platform",
          subtitle: "Complete online shopping solution with payment integration",
          description: "A comprehensive e-commerce platform with full shopping cart functionality, secure payment processing via Stripe integration, product catalog with advanced filtering and search, user reviews and ratings, order tracking, inventory management, admin dashboard for managing products and orders, and automated email notifications. Features responsive design optimized for mobile shopping experiences.",
          techStack: ["Next.js", "React", "Node.js", "Stripe API", "MongoDB", "Tailwind CSS"],
          links: [
            { type: "github", url: "https://github.com/MedoMaher01/ecommerce-platform", label: "View Code" }
          ],
          icon: "Image/Logo.png"
        }
      ]
    },
    
    cybersecurity: {
      title: "Cyber Security",
      icon: "🔐",
      description: "Security research, penetration testing, and vulnerability analysis",
      projects: [
        {
          id: "security-example",
          title: "Network Security Assessment",
          subtitle: "Comprehensive penetration testing and security audit",
          description: "Example project: Conducted thorough security assessment of enterprise network infrastructure. Identified critical vulnerabilities, performed penetration testing using industry-standard tools, and provided detailed remediation recommendations. Delivered comprehensive security report with risk analysis and mitigation strategies.",
          techStack: ["Kali Linux", "Metasploit", "Burp Suite", "Nmap", "Wireshark"],
          links: [
            { type: "pdf", url: "#", label: "Security Report" },
            { type: "linkedin", url: "#", label: "Read More" }
          ],
          icon: "Image/Logo.png"
        }
      ]
    },
    
    design: {
      title: "Graphic Design",
      icon: "🎨",
      description: "Visual design, branding, and creative work",
      projects: [
        {
          id: "design-example",
          title: "Brand Identity Design",
          subtitle: "Complete branding package for tech startup",
          description: "Example project: Created comprehensive brand identity including logo design, color palette, typography system, and brand guidelines. Developed cohesive visual language across all touchpoints including website mockups, business cards, and social media templates. Delivered complete brand book with usage guidelines.",
          techStack: ["Adobe Illustrator", "Photoshop", "Figma", "InDesign"],
          links: [
            { type: "behance", url: "#", label: "View on Behance" },
            { type: "pdf", url: "#", label: "Brand Guidelines" }
          ],
          icon: "Image/Logo.png"
        }
      ]
    },
    
    freelance: {
      title: "Freelance Work",
      icon: "💼",
      description: "Client projects and consulting services",
      projects: [
        {
          id: "freelance-example",
          title: "Client Web Development",
          subtitle: "Custom website solutions for local businesses",
          description: "Example project: Developed custom websites for various clients including restaurants, retail stores, and professional services. Provided end-to-end solutions from requirements gathering to deployment. Implemented content management systems, responsive designs, and SEO optimization tailored to each client's needs.",
          techStack: ["WordPress", "HTML/CSS", "JavaScript", "PHP"],
          links: [
            { type: "demo", url: "#", label: "View Portfolio" },
            { type: "linkedin", url: "#", label: "Testimonials" }
          ],
          icon: "Image/Logo.png"
        }
      ]
    },
      SystemAdmin: {
      title: "System Admin",
      icon: "⌨️",
      description: "Linux Administration, SSH, Terminal basics",
      projects: [

       ]
      }
  },

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
  // Example: media: { type: "image", url: "Image/my-photo.jpg" }
  // Example: media: { type: "youtube", url: "https://www.youtube.com/embed/VIDEO_ID" }
  
  timeline: [
    {
      date: "2005 - 2015",
      title: "Early Beginnings",
      category: "life",
      description: "Discovered my passion for technology and problem-solving. Started exploring computers, learning basic programming concepts, and developing a curiosity for how things work.",
      icon: "🌱"
    },
    {
      date: "2019 - 2023",
      title: "High School Education",
      category: "education",
      description: "Completed high school with focus on mathematics and sciences. Participated in coding clubs and tech competitions, solidifying my interest in software development.",
      icon: "📚"
    },
    {
      date: "2023 - 2024",
      title: "Start Studing Computer Science in Cairo Higher Institute (CHI)",
      category: "education",
      description: "Pursued degree in Computer Science. Studied data structures, algorithms, web development, and software engineering principles. Graduated with honors.",
      icon: "🎓"
    },
    {
      date: "2024 - now",
      title: "Start Studing Computer Science in Higher Technological Institute (HTI)",
      category: "education",
      description: "Pursued degree in Computer Science. Studied data structures, algorithms, web development, and software engineering principles. Graduated with honors.",
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
      description: "Completed internship where I worked on real-world projects, collaborated with experienced developers, and learned industry best practices.",
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
      description: "Joined as a Junior Developer. Contributed to multiple client projects, improved application performance, and mentored new team members.",
      icon: "🚀"
    },
    {
      date: "2023",
      title: "E-Commerce Platform",
      category: "project",
      description: "Built a comprehensive E-Commerce Platform with payment integration, inventory management, and analytics dashboard. This project significantly enhanced my full-stack development skills.",
      projectId: "ecommerce", // Auto-links to e-commerce project!
      icon: "🛒"
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
  // CATEGORY CONFIGURATIONS (Timeline Categories)
  // ========================================
  categories: {
    life: { label: "Life", color: "#4a90e2" },
    education: { label: "Education", color: "#4caf50" },
    career: { label: "Career", color: "#9c27b0" },
    project: { label: "Project", color: "#ff9800" },
    achievement: { label: "Achievement", color: "#f44336" }
  }
};

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
    url: `project.html?id=${projectId}`,
    title: project.title
  };
}
