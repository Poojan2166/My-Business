document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  /**
   * Toggle Mobile Menu
   */
  const toggleMobileMenu = () => {
    const isOpen = navLinks.classList.toggle('open');
    mobileMenuToggle.classList.toggle('active');
    
    // Accessibility: update aria-expanded state
    mobileMenuToggle.setAttribute('aria-expanded', isOpen.toString());
    
    // Prevent body scrolling when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    navLinks.classList.remove('open');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  mobileMenuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  /**
   * Close menu when clicking on any nav link (important for single-page scroll links)
   */
  const links = navLinks.querySelectorAll('.nav-link, .mobile-cta');
  links.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  /**
   * Close menu when clicking outside of it
   */
  document.addEventListener('click', (e) => {
    const isClickInsideMenu = navLinks.contains(e.target);
    const isClickOnToggle = mobileMenuToggle.contains(e.target);
    
    if (!isClickInsideMenu && !isClickOnToggle && navLinks.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /**
   * Premium Scroll Effect (shrink padding / add shadow on scroll)
   */
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Initial check on load
  handleScroll();

  /**
   * FAQ Accordion Interactivity
   */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-content').style.maxHeight = '';
        }
      });

      // Toggle this item
      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '';
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        // Set dynamic max-height for smooth transition
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });

    // Initialize height for the active item
    if (item.classList.contains('active')) {
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });

  /**
   * Booking Modal Toggle Logic
   */
  const bookingModal = document.getElementById('bookingModal');
  if (bookingModal) {
    const openModalButtons = document.querySelectorAll('.btn-booking, .cta-button, .btn-primary, .banner-btn');
    const closeModalButton = bookingModal.querySelector('.modal-close');
    const modalOverlay = bookingModal.querySelector('.modal-overlay');

    openModalButtons.forEach(btn => {
      const href = btn.getAttribute('href');
      if (href === '#consultation' || href === '#booking-flow') {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          bookingModal.classList.add('open');
          document.body.style.overflow = 'hidden';
        });
      }
    });

    const closeModal = () => {
      bookingModal.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (closeModalButton) closeModalButton.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && bookingModal.classList.contains('open')) {
        closeModal();
      }
    });

    const form = document.getElementById('bookingForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! Your inquiry has been sent successfully. A partner will review your matter and contact you within one business day.');
        form.reset();
        closeModal();
      });
    }
  }
});
