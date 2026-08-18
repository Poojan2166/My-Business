/**
 * ANANTA YOGA — CLIENT-SIDE INTERACTION
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const menuToggle = document.getElementById('menu-toggle');
    const drawerClose = document.getElementById('drawer-close');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const siteHeader = document.querySelector('.site-header');
    const announcementBar = document.getElementById('announcement-bar');
    const mainNavbar = document.getElementById('main-navbar');
    const drawerLinks = document.querySelectorAll('.drawer-link, .btn-book-drawer');

    // --- Mobile Drawer Toggle Logic ---
    const openDrawer = () => {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = ''; // Restore background scrolling
    };

    if (menuToggle) menuToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer when a link inside it is clicked
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // --- Scroll Effects (Header Scroll Shrink & Translucency) ---
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            // Shrink navbar, fade out announcement bar
            siteHeader.classList.add('header-scrolled');
            if (announcementBar) {
                announcementBar.style.height = '0px';
                announcementBar.style.opacity = '0';
            }
            if (mainNavbar) {
                mainNavbar.style.height = '60px';
                mainNavbar.style.backgroundColor = 'rgba(246, 243, 235, 0.95)';
                mainNavbar.style.backdropFilter = 'blur(10px)';
            }
        } else {
            // Restore normal heights
            siteHeader.classList.remove('header-scrolled');
            if (announcementBar) {
                announcementBar.style.height = '39px';
                announcementBar.style.opacity = '1';
            }
            if (mainNavbar) {
                mainNavbar.style.height = '70px';
                mainNavbar.style.backgroundColor = 'var(--color-cream)';
                mainNavbar.style.backdropFilter = 'none';
            }
        }
        
        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once at start to handle page reload in scrolled state
    handleScroll();

    // --- Active Link Observer on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px', // Trigger when section occupies the middle part of viewport
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // --- Schedule Day Tabs Interaction ---
    const scheduleTabs = document.querySelectorAll('.schedule-tab');
    scheduleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            scheduleTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Add a little micro-animation to rows on switch
            const rows = document.querySelectorAll('.schedule-row-content');
            rows.forEach((row, index) => {
                row.style.opacity = '0';
                row.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    row.style.transition = 'all 0.3s ease';
                    row.style.opacity = '1';
                    row.style.transform = 'translateY(0)';
                }, index * 40);
            });
        });
    });

    // --- Look Inside Section Details Interaction ---
    const lookInsideItems = document.querySelectorAll('.look-inside-item');
    
    lookInsideItems.forEach(item => {
        const toggleBtn = item.querySelector('.look-inside-btn');
        const overlay = item.querySelector('.look-inside-overlay');
        const closeBtn = item.querySelector('.look-inside-close');
        
        const toggleActive = (e) => {
            e.stopPropagation();
            item.classList.toggle('active');
        };
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleActive);
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                item.classList.remove('active');
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    item.classList.remove('active');
                }
            });
        }
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isOpen = question.getAttribute('aria-expanded') === 'true';

            // Close every panel first so only one stays open at a time
            faqItems.forEach(other => {
                const otherQuestion = other.querySelector('.faq-question');
                const otherAnswer = other.querySelector('.faq-answer');
                if (!otherQuestion || !otherAnswer) return;
                otherQuestion.setAttribute('aria-expanded', 'false');
                otherAnswer.hidden = true;
            });

            if (!isOpen) {
                question.setAttribute('aria-expanded', 'true');
                answer.hidden = false;
            }
        });
    });

    // --- Visit Map (Rectangle 58) & Zoom Controls (Frame 503) ---
    // A slippy-map tile grid drawn straight from OpenStreetMap raster tiles, so
    // the only chrome on the map is the +/- pair the design calls for.
    const mapEl = document.getElementById('visit-map');
    const mapTiles = document.getElementById('map-tiles');
    const mapZoomIn = document.getElementById('map-zoom-in');
    const mapZoomOut = document.getElementById('map-zoom-out');

    const MAP_CENTER = { lat: 40.68, lng: -73.977 };
    const MAP_MIN_ZOOM = 11;
    const MAP_MAX_ZOOM = 18;
    const TILE_SIZE = 256;
    let mapZoom = 15;

    // Web Mercator: lat/lng -> absolute pixel position at the current zoom.
    const lngToPixel = (lng, zoom) =>
        ((lng + 180) / 360) * TILE_SIZE * Math.pow(2, zoom);

    const latToPixel = (lat, zoom) => {
        const rad = (lat * Math.PI) / 180;
        const y = Math.log(Math.tan(rad) + 1 / Math.cos(rad));
        return (1 - y / Math.PI) / 2 * TILE_SIZE * Math.pow(2, zoom);
    };

    const renderMap = () => {
        if (!mapEl || !mapTiles) return;

        const width = mapEl.clientWidth;
        const height = mapEl.clientHeight;
        if (!width || !height) return;

        const centerX = lngToPixel(MAP_CENTER.lng, mapZoom);
        const centerY = latToPixel(MAP_CENTER.lat, mapZoom);

        // Top-left corner of the viewport, in absolute pixels.
        const originX = centerX - width / 2;
        const originY = centerY - height / 2;

        const maxTile = Math.pow(2, mapZoom) - 1;
        const firstCol = Math.floor(originX / TILE_SIZE);
        const lastCol = Math.floor((originX + width) / TILE_SIZE);
        const firstRow = Math.floor(originY / TILE_SIZE);
        const lastRow = Math.floor((originY + height) / TILE_SIZE);

        const fragment = document.createDocumentFragment();

        for (let row = firstRow; row <= lastRow; row++) {
            if (row < 0 || row > maxTile) continue;

            for (let col = firstCol; col <= lastCol; col++) {
                // Wrap horizontally so the world repeats instead of leaving gaps.
                const wrappedCol = ((col % (maxTile + 1)) + maxTile + 1) % (maxTile + 1);

                const tile = new Image();
                tile.src = `https://tile.openstreetmap.org/${mapZoom}/${wrappedCol}/${row}.png`;
                tile.alt = '';
                tile.style.left = `${col * TILE_SIZE - originX}px`;
                tile.style.top = `${row * TILE_SIZE - originY}px`;
                fragment.appendChild(tile);
            }
        }

        mapTiles.replaceChildren(fragment);
    };

    const setMapZoom = (delta) => {
        const next = Math.min(MAP_MAX_ZOOM, Math.max(MAP_MIN_ZOOM, mapZoom + delta));
        if (next === mapZoom) return;
        mapZoom = next;
        renderMap();
    };

    if (mapEl && mapTiles) {
        if (mapZoomIn) mapZoomIn.addEventListener('click', () => setMapZoom(1));
        if (mapZoomOut) mapZoomOut.addEventListener('click', () => setMapZoom(-1));

        renderMap();

        let mapResizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(mapResizeTimer);
            mapResizeTimer = setTimeout(renderMap, 150);
        });
    }

    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    const contactStatus = document.getElementById('contact-form-status');

    if (contactForm && contactStatus) {
        const showStatus = (message, isError) => {
            contactStatus.textContent = message;
            contactStatus.classList.toggle('is-error', Boolean(isError));
        };

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = contactForm.elements.name.value.trim();
            const email = contactForm.elements.email.value.trim();

            if (!name) {
                showStatus('Please tell us your name.', true);
                contactForm.elements.name.focus();
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showStatus('Please enter a valid email address.', true);
                contactForm.elements.email.focus();
                return;
            }

            // No backend yet — acknowledge locally and clear the form.
            showStatus(`Thank you, ${name}. A real person will reply within a day.`, false);
            contactForm.reset();
        });

        // Clear the message as soon as the visitor starts correcting things
        contactForm.addEventListener('input', () => {
            if (contactStatus.textContent) showStatus('', false);
        });
    }
});
