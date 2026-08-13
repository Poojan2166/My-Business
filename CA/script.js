document.addEventListener('DOMContentLoaded', () => {
  
  // -------------------------------------------------------------
  // 1. Mobile Menu Hamburger Navigation Toggle
  // -------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const siteHeader = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu && siteHeader) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      siteHeader.classList.toggle('nav-active');
      
      // Accessibility states
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        siteHeader.classList.remove('nav-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -------------------------------------------------------------
  // 2. Sticky Header and Back-to-Top scroll behavior
  // -------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Add background styling to header on scroll
    if (scrollPos > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
    
    // Toggle back to top float button visibility
    if (scrollPos > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  // -------------------------------------------------------------
  // 3. Interactive FAQ Accordion
  // -------------------------------------------------------------
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parentItem = header.parentElement;
      const isActive = parentItem.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });
      
      // If it wasn't active, open it
      if (!isActive) {
        parentItem.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // -------------------------------------------------------------
  // 4. Scroll Reveal Animations (IntersectionObserver)
  // -------------------------------------------------------------
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters view
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(element => {
      element.classList.add('active');
    });
  }

  // -------------------------------------------------------------
  // 5. Contact Enquiry Form validation and submission
  // -------------------------------------------------------------
  const enquiryForm = document.getElementById('enquiry-form');
  const formSuccessOverlay = document.getElementById('form-success');
  const successResetBtn = document.getElementById('success-reset');
  
  if (enquiryForm && formSuccessOverlay) {
    
    // Clear validation error when user inputs text
    const formInputs = enquiryForm.querySelectorAll('.form-input');
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          input.classList.remove('invalid');
          input.parentElement.classList.remove('has-error');
        }
      });
    });

    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isFormValid = true;
      
      // Full Name Validation
      const fullname = document.getElementById('fullname');
      if (!fullname.value.trim()) {
        showError(fullname);
        isFormValid = false;
      }
      
      // Email Validation
      const email = document.getElementById('email');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value)) {
        showError(email);
        isFormValid = false;
      }
      
      // Service Selection Validation
      const service = document.getElementById('service');
      if (!service.value) {
        showError(service);
        isFormValid = false;
      }
      
      // Brief/Message Validation
      const brief = document.getElementById('brief');
      if (!brief.value.trim()) {
        showError(brief);
        isFormValid = false;
      }
      
      // If form is valid, trigger animation overlay
      if (isFormValid) {
        // Form is successfully submitted
        formSuccessOverlay.classList.add('show');
        
        // Disable submission button while in success state
        document.getElementById('submit-btn').disabled = true;
      }
    });

    // Helper to display error state
    function showError(inputElement) {
      inputElement.classList.add('invalid');
      inputElement.parentElement.classList.add('has-error');
    }

    // Reset Form and remove success state overlay
    if (successResetBtn) {
      successResetBtn.addEventListener('click', () => {
        enquiryForm.reset();
        
        // Remove error states if any
        formInputs.forEach(input => {
          input.classList.remove('invalid');
          input.parentElement.classList.remove('has-error');
        });
        
        formSuccessOverlay.classList.remove('show');
        document.getElementById('submit-btn').disabled = false;
      });
    }
  }

  // -------------------------------------------------------------
  // 6. ICAI Disclaimer Popup Trigger
  // -------------------------------------------------------------
  const disclaimerTrigger = document.querySelector('.disclaimer-trigger');
  if (disclaimerTrigger) {
    disclaimerTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      alert(
        "ICAI DISCLAIMER:\n\nThe rules of the Institute of Chartered Accountants of India prohibit chartered accountants from advertising and soliciting work. This website is intended solely to provide basic information about Vardhan & Associates and its members, and not to advertise our services."
      );
    });
  }
});
