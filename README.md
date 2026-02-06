# Personal Portfolio Website

A modern, fully responsive portfolio website showcasing professional work, skills, and journey. Built with HTML5, CSS3, and vanilla JavaScript, featuring an interactive timeline, skill-categorized projects, and professional animations.

## ✨ Features

- **Semantic HTML5**: Proper document structure with semantic elements for better SEO and accessibility
- **Responsive Design**: Mobile-first approach with breakpoints for all device sizes
- **Interactive Timeline**: Visual journey page with milestones, education, and project highlights
- **Skill-Based Projects**: Projects organized by categories with filtering functionality
- **Professional Animations**: Smooth transitions, hover effects, and scroll-triggered animations
- **SEO Optimized**: Comprehensive meta tags, Open Graph, Twitter Cards, and structured data
- **Accessibility**: ARIA labels, proper heading hierarchy, and keyboard navigation support

## 📁 Project Structure

```
Portfolio-Project/
├── Index.html              # Main landing page
├── My Journey.html         # Interactive timeline page
├── projects.html           # Detailed projects page
├── styles.css              # Main stylesheet with design system
├── journey.css             # Timeline-specific styles
├── projects.css            # Projects page styles
├── Image/                  # Image assets
│   ├── Logo.png
│   └── Logo Without BG.png
└── README.md              # This file
```

## 🎨 Design System

The portfolio uses a comprehensive CSS design system with:

- **CSS Variables**: Centralized color palette, typography, spacing, and effects
- **Color Scheme**: Professional blue gradient palette (#1a3d63, #0a1931, #4a90e2)
- **Typography**: Open Sans (primary) and Roboto (secondary) from Google Fonts
- **Responsive Breakpoints**: 320px (mobile), 576px, 768px (tablet), 1024px (desktop), 1440px+

## 🚀 Pages Overview

### Home (Index.html)
- Hero section with about me introduction
- Featured projects preview with horizontal scrolling
- Quick navigation to other pages
- Contact information in footer

### My Journey (My Journey.html)
- Interactive vertical timeline
- Alternating left/right layout (desktop)
- Category badges (Life, Education, Career, Projects, Achievements)
- Links to projects page for detailed information
- Scroll-triggered animations

### Projects (projects.html)
- Skill-based categorization (Web Dev, Full-Stack, Mobile, etc.)
- Category filtering system
- Detailed project cards with:
  - Project descriptions
  - Technology stack badges
  - GitHub repository links
  - LinkedIn post links
  - Live demo links
- Unique IDs for timeline anchoring

## 🛠 Technologies Used

- **HTML5**: Semantic markup, accessibility features
- **CSS3**: Flexbox, Grid, animations, transitions, custom properties
- **JavaScript**: Vanilla JS for interactions (no frameworks)
- **Google Fonts**: Open Sans, Roboto
- **SEO**: Meta tags, Open Graph, Schema.org structured data

## 📱 Responsive Features

- **Desktop (1024px+)**: Full multi-column layouts, alternating timeline
- **Tablet (768px)**: Adjusted layouts, simplified navigation
- **Mobile (<768px)**: Single column, hamburger menu, vertical timeline
- **Touch-Optimized**: Smooth scrolling, touch-friendly buttons

## ♿ Accessibility

- ARIA labels for navigation and interactive elements
- Proper heading hierarchy (single h1 per page)
- Semantic HTML elements
- High contrast ratios for readability
- Keyboard navigation support
- Alt text for all images

## 🎯 Key Animations

- **Fade & Slide**: Entry animations for sections
- **Hover Effects**: Transform and shadow effects on cards
- **Scroll Animations**: Intersection Observer API for timeline and projects
- **Smooth Transitions**: 0.3s ease-in-out for interactive elements
- **Pulse Effects**: Subtle attention-drawing animations

## 🔗 Navigation Flow

```
Index.html
   ├─> My Journey.html ─> projects.html#project-name
   └─> projects.html
       └─> Back to Index.html
```

Timeline milestones link directly to specific project sections using anchor IDs.

## 📝 Customization Guide

### Update Personal Information

1. **Name & Bio**: Replace `[Your Name]`, `[Your Profession]`, etc. in all HTML files
2. **Contact**: Update email and social links in footers
3. **SEO**: Modify meta descriptions, keywords, and Open Graph tags

### Add New Projects

1. Open `projects.html`
2. Duplicate a project article block
3. Update project ID (for timeline linking)
4. Fill in project details, tech stack, and links
5. Add category data attributes for filtering

### Modify Timeline

1. Open `My Journey.html`
2. Add/edit timeline items with appropriate categories
3. Update dates, descriptions, and icons
4. Link to projects using `projects.html#project-id`

### Color Scheme

All colors are defined as CSS variables in `styles.css`:
- Modify `:root` variables to change the entire color scheme
- Key variables: `--color-primary`, `--color-accent`, etc.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ahmed Maher**
- GitHub: [@MedoMaher01](https://github.com/MedoMaher01)
- LinkedIn: [0xmaro](https://linkedin.com/in/0xmaro)
- Email: anshtaun00@gmail.com

## 🙏 Acknowledgments

- Google Fonts for typography
- Design inspiration from modern portfolio trends
- Icons and emojis for visual elements

---

**Note**: Remember to replace all placeholder content (marked with brackets like `[Your Name]`) with your actual information before deployment.
