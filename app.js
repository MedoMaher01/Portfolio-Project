// ========================================
// MOBILE MENU FUNCTIONALITY
// ========================================

window.addEventListener('DOMContentLoaded', function() {
  // Get menu elements
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  // Check if elements exist
  if (menuToggle && navMenu) {
    console.log('Menu elements found and ready');
    
    // Add click event listener
    menuToggle.addEventListener('click', function() {
      console.log('Menu clicked');
      
      // Toggle active class
      navMenu.classList.toggle('active');
      
      // Update aria-expanded for accessibility
      const isExpanded = navMenu.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking on a link (smooth UX)
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  } else {
    console.error('Menu elements not found:', {
      menuToggle: !!menuToggle,
      navMenu: !!navMenu
    });
  }
});
