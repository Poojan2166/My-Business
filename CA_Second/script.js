document.addEventListener('DOMContentLoaded', () => {
    const mobileTrigger = document.querySelector('.mobile-trigger');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const body = document.body;
    
    if (mobileTrigger && mobileDrawer) {
        // Toggle mobile drawer
        mobileTrigger.addEventListener('click', () => {
            const isActive = mobileTrigger.classList.contains('is-active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu when clicking on any menu link
        const mobileLinks = mobileDrawer.querySelectorAll('.nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
        
        // Helper to open mobile menu
        function openMenu() {
            mobileTrigger.classList.add('is-active');
            mobileDrawer.classList.add('is-active');
            body.classList.add('menu-open');
            mobileTrigger.setAttribute('aria-expanded', 'true');
            mobileDrawer.setAttribute('aria-hidden', 'false');
        }
        
        // Helper to close mobile menu
        function closeMenu() {
            mobileTrigger.classList.remove('is-active');
            mobileDrawer.classList.remove('is-active');
            body.classList.remove('menu-open');
            mobileTrigger.setAttribute('aria-expanded', 'false');
            mobileDrawer.setAttribute('aria-hidden', 'true');
        }
        
        // Optional: Close menu on ESC key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileTrigger.classList.contains('is-active')) {
                closeMenu();
            }
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        const iconImg = item.querySelector('.faq-icon');

        // If it starts as active, set its max-height to its scrollHeight
        if (item.classList.contains('active') && content) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }

        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.faq-content');
                    if (otherContent) {
                        otherContent.style.maxHeight = '0px';
                    }
                    const otherIconImg = otherItem.querySelector('.faq-icon');
                    if (otherIconImg) {
                        otherIconImg.src = 'Images/plusicon.svg';
                        otherIconImg.alt = 'Open';
                    }
                    otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                content.style.maxHeight = '0px';
                if (iconImg) {
                    iconImg.src = 'Images/plusicon.svg';
                    iconImg.alt = 'Open';
                }
                trigger.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                if (iconImg) {
                    iconImg.src = 'Images/multipleicon.svg';
                    iconImg.alt = 'Close';
                }
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Form Submission
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = consultationForm.querySelector('.submit-button');
            const originalText = submitBtn.querySelector('span').textContent;
            
            // Show premium loading state
            submitBtn.querySelector('span').textContent = 'SENDING...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Show success state
                submitBtn.querySelector('span').textContent = 'ENQUIRY SENT';
                submitBtn.style.backgroundColor = '#2e7d32'; // Green success color
                submitBtn.style.opacity = '1';
                consultationForm.reset();
                
                setTimeout(() => {
                    submitBtn.querySelector('span').textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ICAI Disclaimer Modal Logic
    const disclaimerLink = document.querySelector('a[href="#disclaimer"]');
    const disclaimerModal = document.getElementById('disclaimerModal');
    const closeDisclaimer = document.getElementById('closeDisclaimer');

    if (disclaimerLink && disclaimerModal && closeDisclaimer) {
        disclaimerLink.addEventListener('click', (e) => {
            e.preventDefault();
            disclaimerModal.classList.add('is-active');
            disclaimerModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
            disclaimerModal.classList.remove('is-active');
            disclaimerModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        closeDisclaimer.addEventListener('click', closeModal);

        // Close on overlay click
        disclaimerModal.addEventListener('click', (e) => {
            if (e.target === disclaimerModal) {
                closeModal();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && disclaimerModal.classList.contains('is-active')) {
                closeModal();
            }
        });
    }
});
