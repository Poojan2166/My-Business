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

    // --- Card Details Database ---
    const cardData = {
        classes: {
            "vinyasa flow": {
                tag: "Class · 75 min",
                title: "Vinyasa Flow",
                image: "Images/Vinyasa_Flow.svg",
                description: "A breath-led movement practice that links posture to breath. Class builds heat, flexibility, and focus, returning to a long, quiet rest at the end. Designed to challenge and ground you simultaneously.",
                info: [
                    { label: "Duration", value: "75 min" },
                    { label: "Level", value: "All levels" },
                    { label: "Intensity", value: "Medium-High" },
                    { label: "Focus", value: "Strength & Breath" }
                ],
                badges: ["Class", "Flow", "Active"],
                actionText: "Book this class"
            },
            "candlelit yin": {
                tag: "Class · 60 min",
                title: "Candlelit Yin",
                image: "Images/Candlelit_Yin.svg",
                description: "A slow, quiet practice focused on passive floor postures held for three to five minutes. Designed to target deep connective tissues, improve joint mobility, and quiet the nervous system under warm candlelight.",
                info: [
                    { label: "Duration", value: "60 min" },
                    { label: "Level", value: "Beginner friendly" },
                    { label: "Intensity", value: "Low" },
                    { label: "Focus", value: "Restoration & Hips" }
                ],
                badges: ["Class", "Yin", "Restorative"],
                actionText: "Book this class"
            },
            "seated meditation": {
                tag: "Class · 30 min",
                title: "Seated Meditation",
                image: "Images/Seated_Meditation.svg",
                description: "Thirty minutes of guided and silent practice. We explore mindfulness of breath, physical sensation, and simple transitions back into daily life. The perfect way to ground your morning.",
                info: [
                    { label: "Duration", value: "30 min" },
                    { label: "Level", value: "All levels" },
                    { label: "Intensity", value: "Low" },
                    { label: "Focus", value: "Mindfulness & Stillness" }
                ],
                badges: ["Class", "Meditation", "Mental Clarity"],
                actionText: "Book this class"
            },
            "prenatal": {
                tag: "Class · 60 min",
                title: "Prenatal",
                image: "Images/Prenatal.svg",
                description: "A safe, supportive class tailored for the physical and emotional changes of pregnancy. Focus is on hip mobility, pelvic floor health, strength, and breathing techniques for labor. Suitable for trimesters 2 and 3.",
                info: [
                    { label: "Duration", value: "60 min" },
                    { label: "Level", value: "Trimester 2–3" },
                    { label: "Intensity", value: "Low-Medium" },
                    { label: "Focus", value: "Mobility & Support" }
                ],
                badges: ["Class", "Specialized", "Motherhood"],
                actionText: "Book this class"
            },
            "ashtanga mysore": {
                tag: "Class · 120 min",
                title: "Ashtanga Mysore",
                image: "Images/Ashtanga_Mysore.svg",
                description: "The traditional method of Ashtanga Yoga. Students practice the primary series at their own pace, receiving individual, physical adjustments and personalized guidance from the teacher in a quiet shala setting.",
                info: [
                    { label: "Duration", value: "120 min" },
                    { label: "Level", value: "Intermediate +" },
                    { label: "Intensity", value: "High" },
                    { label: "Focus", value: "Discipline & Alignment" }
                ],
                badges: ["Class", "Ashtanga", "Mysore Style"],
                actionText: "Book this class"
            },
            "aerial restoration": {
                tag: "Class · 60 min",
                title: "Aerial Restoration",
                image: "Images/Aerial_Restoration.svg",
                description: "A restorative practice utilizing a low-hanging silk hammock. The hammock supports body weight, allowing deep traction in the spine, gentle inversions, and absolute relaxation without joint pressure.",
                info: [
                    { label: "Duration", value: "60 min" },
                    { label: "Level", value: "All levels" },
                    { label: "Intensity", value: "Low" },
                    { label: "Focus", value: "Spinal Decompression" }
                ],
                badges: ["Class", "Aerial", "Restoration"],
                actionText: "Book this class"
            }
        },
        teachers: {
            "anika mehra": {
                tag: "Lead Vinyasa & Pranayama",
                title: "Anika Mehra",
                image: "Images/Anika_Mehra.svg",
                description: "Anika trained in Mysore and Rishikesh and has been teaching breath-led vinyasa since 2013. She leads the 7am morning practice, helping students connect movement to deep, deliberate breathing patterns.",
                info: [
                    { label: "Experience", value: "12 yrs teaching" },
                    { label: "Lead class", value: "Lead Vinyasa & Pranayama" },
                    { label: "Trainings", value: "RYT-500 · Yin-200" },
                    { label: "Languages", value: "EN · HI · FR" }
                ],
                badges: ["In residence", "Available for private"],
                actionText: "Book a class"
            },
            "daniel okafor": {
                tag: "Ashtanga · Mysore",
                title: "Daniel Okafor",
                image: "Images/Daniel_Okafor.svg",
                description: "Daniel has spent over a decade studying Ashtanga Yoga in India and the US. He leads the early morning Mysore practice, focusing on individual adjustments, traditional alignments, and personal growth.",
                info: [
                    { label: "Experience", value: "9 yrs teaching" },
                    { label: "Lead class", value: "Ashtanga · Mysore" },
                    { label: "Trainings", value: "KPJAYI Authorized Level 2" },
                    { label: "Languages", value: "EN · YO · ES" }
                ],
                badges: ["In residence", "Mysore Specialist"],
                actionText: "Book a class"
            },
            "sara linden": {
                tag: "Yin · Restorative · Prenatal",
                title: "Sara Linden",
                image: "Images/Sara_Linden.svg",
                description: "Sara specializes in Yin, Restorative, and Prenatal yoga. She provides a nurturing, unhurried space for students to slow down, recover, and connect with their bodies during pregnancy and transitions.",
                info: [
                    { label: "Experience", value: "8 yrs teaching" },
                    { label: "Lead class", value: "Yin · Restorative · Prenatal" },
                    { label: "Trainings", value: "RYT-500 · Prenatal Specialist" },
                    { label: "Languages", value: "EN · DE · SV" }
                ],
                badges: ["In residence", "Prenatal Certified"],
                actionText: "Book a class"
            }
        },
        workshops: {
            "full moon sound bath": {
                tag: "Workshop · Jul 12",
                title: "Full Moon Sound Bath",
                image: "Images/Full_Moon_Sound_Bath.svg",
                description: "A restorative evening of sound and vibration. Crystal bowls, Tibetan singing bowls, gongs, and chimes guide the nervous system into a state of deep, meditative rest. Ideal for stress release.",
                info: [
                    { label: "Date", value: "Jul 12" },
                    { label: "Time", value: "8:30 — 9:45 PM" },
                    { label: "Spots Left", value: "12 spots" },
                    { label: "Instructor", value: "Sara Linden" }
                ],
                badges: ["Workshop", "Sound Bath", "Full Moon"],
                actionText: "Reserve spot"
            },
            "beginner’s weekend workshop": {
                tag: "Workshop · Aug 03",
                title: "Beginner’s Weekend Workshop",
                image: "Images/Beginners_Weekend_Workshop.svg",
                description: "Two days of breakdown: alignment, breath mechanics, prop usage, and studio etiquette. The perfect, unhurried foundation for starting a regular studio practice with confidence.",
                info: [
                    { label: "Date", value: "Aug 03" },
                    { label: "Time", value: "8:30 — 9:45 PM" },
                    { label: "Spots Left", value: "16 spots" },
                    { label: "Instructor", value: "Anika Mehra" }
                ],
                badges: ["Workshop", "Foundations", "Beginner friendly"],
                actionText: "Reserve spot"
            },
            "autumn retreat — hudson valley": {
                tag: "Retreat · Sep 21",
                title: "Autumn Retreat — Hudson Valley",
                image: "Images/Autumn_Retreat_Hudson_Valley.svg",
                description: "Three days in the Hudson Valley. Unhurried daily practice, communal meals, silent forest walks, and dedicated shala time to rest and reset before the winter transition.",
                info: [
                    { label: "Date", value: "Sep 21" },
                    { label: "Time", value: "All Weekend" },
                    { label: "Spots Left", value: "30 spots" },
                    { label: "Location", value: "Hudson Valley, NY" }
                ],
                badges: ["Retreat", "Hudson Valley", "Weekend"],
                actionText: "Reserve spot"
            }
        },
        journals: {
            "eating around a morning practice": {
                tag: "Nourishment · 5 min read",
                title: "Eating around a morning practice",
                image: "Images/Nourishment.svg",
                description: "What we’ve learned from a decade of watching members find the right way to fuel an early class — and the long mistakes most of us made first. A practical guide on how to balance food intake with a 6 AM shala practice.",
                info: [
                    { label: "Category", value: "Nourishment" },
                    { label: "Read Time", value: "5 min read" },
                    { label: "Published", value: "June 2026" },
                    { label: "Author", value: "Anika Mehra" }
                ],
                badges: ["Nourishment", "Journal", "Morning Practice"],
                actionText: "Read full article"
            },
            "the thirty-second morning sit": {
                tag: "Ritual · 3 min read",
                title: "The thirty-second morning sit",
                image: "Images/Ritual.svg",
                description: "A guide to establishing a minimal, high-impact morning routine. How thirty seconds of absolute stillness right after waking can reshape the rest of your day and prepare your mind for the mat.",
                info: [
                    { label: "Category", value: "Ritual" },
                    { label: "Read Time", value: "3 min read" },
                    { label: "Published", value: "May 2026" },
                    { label: "Author", value: "Sara Linden" }
                ],
                badges: ["Ritual", "Journal", "Meditation"],
                actionText: "Read full article"
            },
            "on mala beads, plainly": {
                tag: "Tradition · 5 min read",
                title: "On mala beads, plainly",
                image: "Images/Tradition.svg",
                description: "A clear, historical look at mala beads, their traditional usage in meditation, and how to choose and practice with them without pretension. Simple, clean instructions for japa meditation.",
                info: [
                    { label: "Category", value: "Tradition" },
                    { label: "Read Time", value: "5 min read" },
                    { label: "Published", value: "April 2026" },
                    { label: "Author", value: "Daniel Okafor" }
                ],
                badges: ["Tradition", "Journal", "Meditation Tools"],
                actionText: "Read full article"
            }
        }
    };

    // --- Modal Elements ---
    const modalOverlay = document.getElementById('card-modal-overlay');
    const modalContainer = document.getElementById('card-modal-container');
    const modalClose = document.getElementById('card-modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const modalInfoGrid = document.getElementById('modal-info-grid');
    const modalBadges = document.getElementById('modal-badges');
    const modalActionBtn = document.getElementById('modal-action-btn');
    const modalActionText = document.getElementById('modal-action-text');

    const openModal = (data) => {
        if (!modalOverlay || !data) return;

        // Set basic content
        modalImg.src = data.image;
        modalImg.alt = data.title;
        modalTag.textContent = data.tag;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.description;
        modalActionText.textContent = data.actionText || "Book a class";

        // If journal, action button might link to journal anchors or something, let's keep it as standard href
        if (modalActionBtn) {
            if (data.actionText.includes("Read")) {
                modalActionBtn.setAttribute('href', '#journal');
            } else {
                modalActionBtn.setAttribute('href', '#weekly-schedule');
            }
        }

        // Populate info grid
        modalInfoGrid.innerHTML = '';
        if (data.info && data.info.length > 0) {
            data.info.forEach(item => {
                const infoItem = document.createElement('div');
                infoItem.className = 'info-item';
                
                const label = document.createElement('span');
                label.className = 'info-label';
                label.textContent = item.label;
                
                const value = document.createElement('span');
                value.className = 'info-value';
                value.textContent = item.value;
                
                infoItem.appendChild(label);
                infoItem.appendChild(value);
                modalInfoGrid.appendChild(infoItem);
            });
            modalInfoGrid.style.display = 'grid';
        } else {
            modalInfoGrid.style.display = 'none';
        }

        // Populate badges
        modalBadges.innerHTML = '';
        if (data.badges && data.badges.length > 0) {
            data.badges.forEach(badgeText => {
                const badge = document.createElement('span');
                badge.className = 'modal-badge';
                badge.textContent = badgeText;
                modalBadges.appendChild(badge);
            });
            modalBadges.style.display = 'flex';
        } else {
            modalBadges.style.display = 'none';
        }

        // Open modal
        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Disable scroll
    };

    const closeModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove('open');
            document.body.style.overflow = ''; // Restore scroll
        }
    };

    // Attach click listeners to cards
    // 1. Classes
    document.querySelectorAll('.class-card-wrapper').forEach(card => {
        const titleEl = card.querySelector('.class-card-title');
        const btn = card.querySelector('.class-card-btn');
        if (!titleEl) return;
        
        const key = titleEl.textContent.trim().toLowerCase();
        const data = cardData.classes[key];
        
        const triggerOpen = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (data) openModal(data);
        };
        
        if (btn) btn.addEventListener('click', triggerOpen);
        card.addEventListener('click', triggerOpen);
    });

    // 2. Teachers
    document.querySelectorAll('.teacher-card-wrapper').forEach(card => {
        const titleEl = card.querySelector('.teacher-card-title');
        const btn = card.querySelector('.teacher-card-btn');
        if (!titleEl) return;
        
        const key = titleEl.textContent.trim().toLowerCase();
        const data = cardData.teachers[key];
        
        const triggerOpen = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (data) openModal(data);
        };
        
        if (btn) btn.addEventListener('click', triggerOpen);
        card.addEventListener('click', triggerOpen);
    });

    // 3. Workshops
    document.querySelectorAll('.workshop-card').forEach(card => {
        const titleEl = card.querySelector('.workshop-title');
        const btn = card.querySelector('.workshop-card-btn');
        if (!titleEl) return;
        
        // Clean key
        const key = titleEl.textContent.trim().toLowerCase().replace(/'/g, '’');
        const data = cardData.workshops[key];
        
        const triggerOpen = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (data) openModal(data);
        };
        
        if (btn) btn.addEventListener('click', triggerOpen);
        card.addEventListener('click', triggerOpen);
    });

    // 4. Journals
    document.querySelectorAll('.journal-card').forEach(card => {
        const titleEl = card.querySelector('.journal-article-title');
        const btn = card.querySelector('.journal-card-btn');
        if (!titleEl) return;
        
        const key = titleEl.textContent.trim().toLowerCase();
        const data = cardData.journals[key];
        
        const triggerOpen = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (data) openModal(data);
        };
        
        if (btn) btn.addEventListener('click', triggerOpen);
        card.addEventListener('click', triggerOpen);
    });

    // Close handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Handle modal action button close to transition user smoothly
    if (modalActionBtn) {
        modalActionBtn.addEventListener('click', () => {
            closeModal();
        });
    }
});
