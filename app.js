// ========================================
// MOBILE MENU FUNCTIONALITY
// ========================================

window.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.navbar');
  const closeBtn = document.querySelector('.mobile-menu-close');
  
  // Toggle menu on button click
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking close button
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        navMenu.classList.remove('active');
      });
    }
    
    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
      });
    });
  }
});
