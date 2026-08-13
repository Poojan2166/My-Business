/* ========================================================
   MAISON RESTAURANT — script.js
   ======================================================== */

(function () {
  "use strict";

  /* ── Stats bar: animate items when they enter the viewport ── */
  const statItems = document.querySelectorAll(".stat-item");

  if ("IntersectionObserver" in window && statItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    statItems.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show immediately
    statItems.forEach((el) => el.classList.add("is-visible"));
  }

  /* ── Sticky nav: add background when scrolled past hero ── */
  const siteNav = document.getElementById("site-nav");

  function onScroll() {
    if (!siteNav) return;
    const scrolled = window.scrollY > 40;
    siteNav.classList.toggle("site-nav--scrolled", scrolled);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run on load

  /* ── Lightbox for Gallery ── */
  const galleryCards = document.querySelectorAll(".gallery-card");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxLabel = document.getElementById("lightbox-caption-label");
  const lightboxTitle = document.getElementById("lightbox-caption-title");

  if (galleryCards.length && lightbox && lightboxImg && lightboxClose) {
    galleryCards.forEach((card) => {
      card.addEventListener("click", () => {
        const imgUrl = card.getAttribute("data-image");
        const titleText = card.getAttribute("data-title");
        const labelText = card.getAttribute("data-label");

        lightboxImg.src = imgUrl;
        lightboxImg.alt = titleText;
        if (lightboxLabel) lightboxLabel.textContent = labelText;
        if (lightboxTitle) lightboxTitle.textContent = titleText;

        lightbox.setAttribute("aria-hidden", "false");
        // Prevent body scrolling
        document.body.style.overflow = "hidden";
      });
    });

    const closeLightbox = () => {
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      // Clear sources after fade-out transition
      setTimeout(() => {
        if (lightbox.getAttribute("aria-hidden") === "true") {
          lightboxImg.src = "";
          lightboxImg.alt = "";
        }
      }, 400);
    };

    lightboxClose.addEventListener("click", closeLightbox);

    // Close when clicking background outside content
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard support (Escape key)
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        lightbox.getAttribute("aria-hidden") === "false"
      ) {
        closeLightbox();
      }
    });
  }

  /* ── FAQ Accordion ── */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const answer = item.querySelector(".faq-answer");

    if (trigger && answer) {
      trigger.addEventListener("click", () => {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";

        // Toggle current item
        trigger.setAttribute("aria-expanded", !isExpanded);
        item.classList.toggle("is-active", !isExpanded);
        answer.setAttribute("aria-hidden", isExpanded);

        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
          answer.style.maxHeight = "0px";
        }

        // Close other open accordion items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("is-active")) {
            const otherTrigger = otherItem.querySelector(".faq-trigger");
            const otherAnswer = otherItem.querySelector(".faq-answer");
            if (otherTrigger && otherAnswer) {
              otherTrigger.setAttribute("aria-expanded", "false");
              otherItem.classList.remove("is-active");
              otherAnswer.setAttribute("aria-hidden", "true");
              otherAnswer.style.maxHeight = "0px";
            }
          }
        });
      });
    }
  });

  /* ── Mobile Navigation Drawer Toggle ── */
  const mobileNavToggle = document.getElementById("mobile-nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileNavClose = document.getElementById("mobile-nav-close");
  const mobileNavBackdrop = document.getElementById("mobile-nav-backdrop");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link, #mobile-nav-cta");

  if (mobileNavToggle && mobileNav && mobileNavClose && mobileNavBackdrop) {
    const openMobileNav = () => {
      mobileNav.classList.add("mobile-nav--open");
      mobileNav.setAttribute("aria-hidden", "false");
      mobileNavToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden"; // Disable background scrolling
      
      // Focus close button for accessibility
      setTimeout(() => {
        mobileNavClose.focus();
      }, 50);
    };

    const closeMobileNav = () => {
      mobileNav.classList.remove("mobile-nav--open");
      mobileNav.setAttribute("aria-hidden", "true");
      mobileNavToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = ""; // Enable background scrolling
      
      // Return focus to toggle button
      mobileNavToggle.focus();
    };

    mobileNavToggle.addEventListener("click", openMobileNav);
    mobileNavClose.addEventListener("click", closeMobileNav);
    mobileNavBackdrop.addEventListener("click", closeMobileNav);

    // Close mobile nav when clicking any link inside
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileNav();
      });
    });

    // Close mobile nav with Escape key
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        mobileNav.classList.contains("mobile-nav--open")
      ) {
        closeMobileNav();
      }
    });

    // Simple focus trapping inside mobile nav
    mobileNav.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && mobileNav.classList.contains("mobile-nav--open")) {
        const focusableElements = mobileNav.querySelectorAll(
          'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  /* ── Dish Detail Modal (Frame 422) ── */
  const dishCards = document.querySelectorAll(".dish-card");
  const dishModal = document.getElementById("dish-modal");
  const dishModalBackdrop = document.getElementById("dish-modal-backdrop");
  const dishModalClose = document.getElementById("dish-modal-close");
  
  const dishModalImg = document.getElementById("dish-modal-img");
  const dishModalCourse = document.getElementById("dish-modal-course");
  const dishModalTitle = document.getElementById("dish-modal-title");
  const dishModalDesc = document.getElementById("dish-modal-desc");
  const dishModalIngredientsList = document.getElementById("dish-modal-ingredients-list");
  const dishModalPairingText = document.getElementById("dish-modal-pairing-text");

  let lastActiveElement = null;

  const dishData = {
    "dish-scallop": {
      course: "Course I",
      title: "Hand-dived scallop",
      desc: "Single scallop from the Isle of Mull, barely seared in browned butter, finished with sea grape and a slick of cold-pressed dill oil.",
      ingredients: ["Mull scallop", "Smoked butter", "Sea grape", "Dill oil", "Copper salt"],
      pairing: "Riesling, Trimbach 'Frédéric Émile' 2017",
      img: "Images/Hand_dived_scallop.svg"
    },
    "dish-boeuf": {
      course: "Course II",
      title: "Aged côte de bœuf",
      desc: "Dry-aged côte de bœuf sourced from local farms, grilled over open wood fire, served with a rich bone marrow jus and copper salt.",
      ingredients: ["Côte de bœuf", "Bone marrow", "Shallots", "Copper salt", "Fresh thyme"],
      pairing: "Saint-Émilion Grand Cru, Château Canon 2015",
      img: "Images/Aged_cote_de_bœuf.svg"
    },
    "dish-chocolate": {
      course: "Course III",
      title: "Bitter chocolate",
      desc: "Single-origin 72% Madagascar dark chocolate sphere, filled with sea salt caramel, drizzled with olive oil and gold leaf.",
      ingredients: ["Dark chocolate", "Olive oil", "Fleur de sel", "Gold leaf", "Smoked caramel"],
      pairing: "Tawny Port, Graham's 20 Year Old",
      img: "Images/Bitter_chocolate.svg"
    }
  };

  if (dishCards.length && dishModal && dishModalClose && dishModalBackdrop) {
    const openDishModal = (cardId) => {
      const data = dishData[cardId];
      if (!data) return;

      // Populate content
      dishModalImg.src = data.img;
      dishModalImg.alt = data.title;
      dishModalCourse.textContent = data.course;
      dishModalTitle.textContent = data.title;
      dishModalDesc.textContent = data.desc;
      dishModalPairingText.textContent = data.pairing;

      // Populate ingredients
      dishModalIngredientsList.innerHTML = "";
      data.ingredients.forEach(ing => {
        const li = document.createElement("li");
        li.textContent = ing;
        dishModalIngredientsList.appendChild(li);
      });

      // Show modal
      dishModal.classList.add("dish-modal--open");
      dishModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // Prevent body scroll

      // Focus close button
      setTimeout(() => {
        dishModalClose.focus();
      }, 50);
    };

    const closeDishModal = () => {
      dishModal.classList.remove("dish-modal--open");
      dishModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; // Enable body scroll

      // Return focus
      if (lastActiveElement) {
        lastActiveElement.focus();
      }
    };

    // Attach click listeners to dish cards
    dishCards.forEach(card => {
      // Make card keyboard focusable
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-haspopup", "dialog");

      const handleOpen = () => {
        lastActiveElement = document.activeElement;
        openDishModal(card.id);
      };

      card.addEventListener("click", handleOpen);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      });
    });

    // Close events
    dishModalClose.addEventListener("click", closeDishModal);
    dishModalBackdrop.addEventListener("click", closeDishModal);

    // Escape key close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dishModal.classList.contains("dish-modal--open")) {
        closeDishModal();
      }
    });

    // Focus trapping inside dish modal
    dishModal.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && dishModal.classList.contains("dish-modal--open")) {
        const focusableElements = dishModal.querySelectorAll(
          'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  /* ── Room Detail Modal ── */
  const roomItems = document.querySelectorAll(".rooms-list .rooms-item");
  const roomModal = document.getElementById("room-modal");
  const roomModalBackdrop = document.getElementById("room-modal-backdrop");
  const roomModalClose = document.getElementById("room-modal-close");

  const roomModalImg = document.getElementById("room-modal-img");
  const roomModalCategory = document.getElementById("room-modal-category");
  const roomModalTitle = document.getElementById("room-modal-title");
  const roomModalDesc = document.getElementById("room-modal-desc");
  const roomModalBadges = document.getElementById("room-modal-badges");

  let roomLastActiveElement = null;

  const roomData = {
    "rooms-item-dining": {
      category: "20 seats · single service",
      title: "The Dining Room",
      desc: "Our Main Room, Arranged Around The Open Kitchen. Velvet Banquettes, Hand-Thrown Ceramics, No Music After The First Course.",
      badges: ["Open Kitchen View", "Tasting Menu Only", "Two Seatings Nightly"],
      img: "Images/Room.svg"
    },
    "rooms-item-counter": {
      category: "4 seats facing the pass",
      title: "The Counter",
      desc: "An intimate front-row dining experience. Watch the culinary team plate and fire each course right before your eyes. Directly interact with the chefs.",
      badges: ["Chef interaction", "Front Row Seats", "Single Service"],
      img: "Images/Pass.svg"
    },
    "rooms-item-cellar": {
      category: "Private, up to 10 guests",
      title: "The Cellar",
      desc: "Dine surrounded by our collection of 1,200 bottles. A vaulted stone room reserved for private gatherings, curated wine lists, and dedicated wait staff.",
      badges: ["Vaulted Stone Room", "Curated Wine Pairings", "Dedicated Wait Staff"],
      img: "Images/Cellar.svg"
    }
  };

  if (roomItems.length && roomModal && roomModalClose && roomModalBackdrop) {
    const openRoomModal = (roomId) => {
      const data = roomData[roomId];
      if (!data) return;

      // Populate content
      roomModalImg.src = data.img;
      roomModalImg.alt = data.title;
      roomModalCategory.textContent = data.category;
      roomModalTitle.textContent = data.title;
      roomModalDesc.textContent = data.desc;

      // Populate badges
      roomModalBadges.innerHTML = "";
      data.badges.forEach(badgeText => {
        const badge = document.createElement("div");
        badge.className = "room-badge";
        badge.textContent = badgeText;
        roomModalBadges.appendChild(badge);
      });

      // Show modal
      roomModal.classList.add("room-modal--open");
      roomModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // Prevent body scroll

      // Focus close button
      setTimeout(() => {
        roomModalClose.focus();
      }, 50);
    };

    const closeRoomModal = () => {
      roomModal.classList.remove("room-modal--open");
      roomModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; // Enable body scroll

      // Return focus
      if (roomLastActiveElement) {
        roomLastActiveElement.focus();
      }
    };

    // Attach click listeners to room items
    roomItems.forEach(item => {
      // Setup accessibility attributes
      item.setAttribute("role", "button");
      item.setAttribute("aria-haspopup", "dialog");

      const handleOpen = (e) => {
        e.preventDefault(); // Stop hash navigation
        roomLastActiveElement = document.activeElement;
        openRoomModal(item.id);
      };

      item.addEventListener("click", handleOpen);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen(e);
        }
      });
    });

    // Close events
    roomModalClose.addEventListener("click", closeRoomModal);
    roomModalBackdrop.addEventListener("click", closeRoomModal);

    // Escape key close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && roomModal.classList.contains("room-modal--open")) {
        closeRoomModal();
      }
    });

    // Focus trapping inside room modal
    roomModal.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && roomModal.classList.contains("room-modal--open")) {
        const focusableElements = roomModal.querySelectorAll(
          'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  /* ── Private Enquiry Modal ── */
  const enquireBtn = document.getElementById("btn-private-enquiry");
  const enquiryModal = document.getElementById("enquiry-modal");
  const enquiryModalBackdrop = document.getElementById("enquiry-modal-backdrop");
  const enquiryModalClose = document.getElementById("enquiry-modal-close");
  const enquiryModalForm = document.getElementById("enquiry-modal-form");

  let enquiryLastActiveElement = null;

  if (enquireBtn && enquiryModal && enquiryModalClose && enquiryModalBackdrop && enquiryModalForm) {
    const openEnquiryModal = (e) => {
      e.preventDefault();
      enquiryLastActiveElement = document.activeElement;

      enquiryModal.classList.add("enquiry-modal--open");
      enquiryModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // Prevent body scroll

      // Focus first input (Name)
      setTimeout(() => {
        const nameInput = document.getElementById("enquiry-name");
        if (nameInput) nameInput.focus();
      }, 50);
    };

    const closeEnquiryModal = () => {
      enquiryModal.classList.remove("enquiry-modal--open");
      enquiryModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; // Enable body scroll

      // Return focus
      if (enquiryLastActiveElement) {
        enquiryLastActiveElement.focus();
      }
    };

    enquireBtn.addEventListener("click", openEnquiryModal);

    // Close events
    enquiryModalClose.addEventListener("click", closeEnquiryModal);
    enquiryModalBackdrop.addEventListener("click", closeEnquiryModal);

    // Escape key close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && enquiryModal.classList.contains("enquiry-modal--open")) {
        closeEnquiryModal();
      }
    });

    // Form submission
    enquiryModalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Get values
      const name = document.getElementById("enquiry-name").value;
      const email = document.getElementById("enquiry-email").value;
      
      // Simple notification
      alert(`Thank you, ${name}! Your enquiry has been sent. We will respond to ${email} within 48 hours.`);
      
      // Reset and close
      enquiryModalForm.reset();
      closeEnquiryModal();
    });

    // Focus trapping inside enquiry modal
    enquiryModal.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && enquiryModal.classList.contains("enquiry-modal--open")) {
        const focusableElements = enquiryModal.querySelectorAll(
          'a[href], button, textarea, input[type="text"], input[type="email"], input[type="number"], select'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
})();
