document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // Mobile Navigation Menu Toggle
    // -------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when links are clicked
        document.querySelectorAll('.nav-link, .mobile-only-action .btn-quote').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // -------------------------------------------------------------
    // FAQ Accordion Toggle
    // -------------------------------------------------------------
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const currentItem = trigger.parentElement;
            const isActive = currentItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const triggerBtn = item.querySelector('.faq-trigger');
                const icon = item.querySelector('.faq-icon');
                if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
                if (icon) icon.src = 'images/plus_icon.svg';
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                currentItem.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                const icon = currentItem.querySelector('.faq-icon');
                if (icon) icon.src = 'images/minus_icon.svg';
            }
        });
    });

    // -------------------------------------------------------------
    // Property Popup Modal & Slider Logic
    // -------------------------------------------------------------
    // Property Details Data
    const propertyData = {
        "residential-towers": {
            title: "Residential Towers",
            description: "Skyline Heights' premium residential towers rise 30 to 60 storeys, featuring double-height entrance lobbies, sky lounges, infinity pools, and expansive 3 and 4 BHK residences with panoramic city views.",
            images: [
                "images/Residential_Towers.svg",
                "images/Background_img.svg",
                "images/Building_More_Than_Just_Homes.svg"
            ]
        },
        "private-villas": {
            title: "Private Villas",
            description: "Forty private villas set inside a gated 8-acre estate, each with a landscaped courtyard, private pool option and dedicated home-office wing.",
            images: [
                "images/Private_Villas.svg",
                "images/Background_img.svg",
                "images/Building_More_Than_Just_Homes.svg"
            ]
        },
        "commercial-campuses": {
            title: "Commercial Campuses",
            description: "State-of-the-art grade-A corporate offices and retail spaces equipped with advanced building management systems, high-speed elevators, sustainable design, and premium dining spaces.",
            images: [
                "images/Commercial_Campuses.svg",
                "images/Background_img.svg",
                "images/Building_More_Than_Just_Homes.svg"
            ]
        }
    };

    const modal = document.getElementById('property-modal');
    const modalOverlay = modal ? modal.querySelector('.property-modal-overlay') : null;
    const modalClose = modal ? modal.querySelector('.property-modal-close') : null;
    const slider = document.getElementById('property-slider');
    const dotsContainer = document.getElementById('slider-dots');
    const modalTitle = document.getElementById('property-modal-title');
    const modalDesc = document.getElementById('property-modal-desc');
    const prevBtn = modal ? modal.querySelector('.arrow-left') : null;
    const nextBtn = modal ? modal.querySelector('.arrow-right') : null;

    let activeImages = [];
    let currentSlide = 0;

    // Open Modal Function
    function openModal(key) {
        const data = propertyData[key];
        if (!data || !modal) return;

        // Set Title & Description
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalDesc) modalDesc.textContent = data.description;

        // Populate Slider Images
        activeImages = data.images;
        currentSlide = 0;
        
        if (slider) {
            slider.innerHTML = '';
            activeImages.forEach(imgUrl => {
                const slideDiv = document.createElement('div');
                slideDiv.className = 'property-modal-slide';
                const img = document.createElement('img');
                img.src = imgUrl;
                img.alt = data.title;
                slideDiv.appendChild(img);
                slider.appendChild(slideDiv);
            });
        }

        // Generate Dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            activeImages.forEach((_, idx) => {
                const dot = document.createElement('span');
                dot.className = 'slider-dot' + (idx === 0 ? ' active' : '');
                dot.addEventListener('click', () => goToSlide(idx));
                dotsContainer.appendChild(dot);
            });
        }

        // Update Slider Position
        updateSlider();

        // Show Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Close Modal Function
    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
    }

    // Go to Specific Slide
    function goToSlide(index) {
        if (index < 0 || index >= activeImages.length) return;
        currentSlide = index;
        updateSlider();
    }

    // Update Slider Position and Dot Activation
    function updateSlider() {
        if (slider) {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.slider-dot');
            dots.forEach((dot, idx) => {
                if (idx === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    // Next Slide
    function nextSlide() {
        if (activeImages.length === 0) return;
        currentSlide = (currentSlide + 1) % activeImages.length;
        updateSlider();
    }

    // Previous Slide
    function prevSlide() {
        if (activeImages.length === 0) return;
        currentSlide = (currentSlide - 1 + activeImages.length) % activeImages.length;
        updateSlider();
    }

    // Attach Click Events to Property Cards
    document.querySelectorAll('.property-card').forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-property-key');
            if (key) {
                openModal(key);
            }
        });
    });

    // Close Modal Click Events
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Arrow Navigations
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Escape Key to Close Modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
