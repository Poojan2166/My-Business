document.addEventListener('DOMContentLoaded', () => {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-inquiry-btn');

    function toggleMenu() {
        const isOpen = mobileNavToggle.classList.toggle('open');
        mobileMenuOverlay.classList.toggle('active');
        
        // Update accessibility attributes
        mobileNavToggle.setAttribute('aria-expanded', isOpen);
        mobileMenuOverlay.setAttribute('aria-hidden', !isOpen);
        
        // Prevent body scrolling when menu is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    mobileNavToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavToggle.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // Close menu when clicking on the overlay background
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            toggleMenu();
        }
    });
});
