document.addEventListener('DOMContentLoaded', () => {
  // --- NAVBAR SCROLL EFFECT ---
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- STATS COUNT-UP ANIMATION ---
  const stats = [
    { selector: '.stat-item:nth-child(1) .stat-number', target: 5000, suffix: '+' },
    { selector: '.stat-item:nth-child(2) .stat-number', target: 50, suffix: '+' },
    { selector: '.stat-item:nth-child(3) .stat-number', target: 15, suffix: '' }
  ];

  const animateCount = (element, target, duration, suffix = '') => {
    let startTimestamp = null;
    const startValue = 0;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease Out Quad formula: progress * (2 - progress)
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);
      
      // Update element text
      if (suffix === '+') {
        element.textContent = currentValue.toLocaleString() + '+';
      } else {
        element.textContent = currentValue.toLocaleString() + suffix;
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Ensure exact target is set at completion
        element.textContent = target.toLocaleString() + suffix;
      }
    };
    
    window.requestAnimationFrame(step);
  };

  // Run stats animation with a slight delay for better UX
  setTimeout(() => {
    stats.forEach(stat => {
      const el = document.querySelector(stat.selector);
      if (el) {
        animateCount(el, stat.target, 2000, stat.suffix);
      }
    });
  }, 300);

  // --- CTA CLICK FEEDBACK (Optional Micro-interaction) ---
  const buttons = ['btn-book-trial', 'btn-view-membership', 'btn-personal-training', 'btn-submit-trial'];
  buttons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        // Visual feedback flash
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          btn.style.transform = '';
        }, 150);
      });
    }
  });

  // --- FAQ ACCORDION ---
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      
      // Close other items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherAnswer) {
            otherAnswer.setAttribute('aria-hidden', 'true');
            otherAnswer.style.maxHeight = '0';
          }
        }
      });
      
      // Toggle current item
      if (isExpanded) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // --- MOBILE NAV TOGGLE ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
});
