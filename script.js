/* ============================================================
   Auréa Dance Academy — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");

  function closeNav() {
    navLinks.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-lock");
  }

  burger.addEventListener("click", function () {
    var open = navLinks.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-lock", open);
  });

  navLinks.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeNav();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1024) closeNav();
  });

  /* ---------- Sticky header state ---------- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    nav.classList.toggle("is-stuck", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Weekly schedule ---------- */
  var SCHEDULE = {
    beginner: [
      { time: "6:30 pm", name: "Hip Hop Foundations", level: "Beginner", room: "Studio 1" },
      { time: "7:30 pm", name: "Bollywood Basics",    level: "Beginner", room: "Studio 1" },
      { time: "8:30 pm", name: "Contemporary Intro",  level: "Beginner", room: "Studio 1" }
    ],
    intermediate: [
      { time: "7:00 am", name: "Kathak Technique",      level: "Intermediate", room: "Studio 2" },
      { time: "6:30 pm", name: "Ballet Barre & Centre", level: "Intermediate", room: "Studio 3" },
      { time: "7:30 pm", name: "Salsa Partnering",      level: "Intermediate", room: "Studio 2" }
    ],
    advanced: [
      { time: "6:00 am", name: "Bharatanatyam Repertoire", level: "Advanced", room: "Studio 3" },
      { time: "7:30 pm", name: "Contemporary Company",     level: "Advanced", room: "Studio 1" },
      { time: "9:00 pm", name: "Freestyle Lab",            level: "Advanced", room: "Studio 2" }
    ],
    kids: [
      { time: "9:00 am", name: "Little Movers (4–6)",   level: "Kids", room: "Studio 2" },
      { time: "10:30 am", name: "Junior Hip Hop (7–11)", level: "Kids", room: "Studio 1" },
      { time: "12:00 pm", name: "Pre-Ballet Grade 1",    level: "Kids", room: "Studio 3" }
    ],
    adults: [
      { time: "7:00 am", name: "Morning Conditioning", level: "Adults", room: "Studio 1" },
      { time: "8:00 pm", name: "Bollywood Fitness",    level: "Adults", room: "Studio 2" },
      { time: "9:00 pm", name: "Open Freestyle Floor", level: "Adults", room: "Studio 1" }
    ]
  };

  var timetable = document.getElementById("timetable");
  var tabs = document.getElementById("tabs");

  function renderSchedule(key) {
    var rows = SCHEDULE[key] || [];
    if (!rows.length) {
      timetable.innerHTML = '<p class="timetable__empty">No sessions listed for this track yet.</p>';
      return;
    }
    timetable.innerHTML = rows
      .map(function (r) {
        return (
          '<div class="trow">' +
          '<span class="trow__time">' + r.time + "</span>" +
          '<span class="trow__name">' + r.name + "</span>" +
          '<span class="trow__level">' + r.level + "</span>" +
          '<span class="trow__room">' + r.room + "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  tabs.addEventListener("click", function (e) {
    var btn = e.target.closest(".tab");
    if (!btn) return;
    tabs.querySelectorAll(".tab").forEach(function (t) {
      var active = t === btn;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
    });
    renderSchedule(btn.dataset.tab);
  });

  renderSchedule("beginner");

  /* ---------- FAQ accordion ---------- */
  var accordion = document.getElementById("accordion");
  accordion.addEventListener("click", function (e) {
    var q = e.target.closest(".acc__q");
    if (!q) return;
    var item = q.parentElement;
    var open = item.classList.contains("is-open");

    accordion.querySelectorAll(".acc").forEach(function (a) {
      a.classList.remove("is-open");
      a.querySelector(".acc__q").setAttribute("aria-expanded", "false");
    });

    if (!open) {
      item.classList.add("is-open");
      q.setAttribute("aria-expanded", "true");
    }
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("cform");
  var note = document.getElementById("cformNote");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;

    form.querySelectorAll("input[required]").forEach(function (input) {
      var field = input.closest(".field");
      var valid = input.value.trim() !== "" && (input.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
      field.classList.toggle("is-bad", !valid);
      if (!valid) ok = false;
    });

    if (!ok) {
      note.textContent = "Please add your name and a valid email.";
      return;
    }

    note.textContent = "Thank you — we will reply within a few hours.";
    form.reset();
  });

  /* ---------- Scroll reveal ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealables = document.querySelectorAll(".reveal");

  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll(".count");

  function runCount(el) {
    var target = parseFloat(el.dataset.to);
    var suffix = el.dataset.suffix || "";
    if (reduce) {
      el.textContent = target.toLocaleString("en-IN") + suffix;
      return;
    }
    var start = performance.now();
    var dur = 1500;

    function step(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(runCount);
  }

  /* ---------- Card popups details data ---------- */
  var POPUP_DATA = {
    // Teachers
    "meera raichand": {
      type: "teacher",
      tag: "Principal · Contemporary",
      title: "Meera Raichand",
      desc: "18 yrs · London Contemporary Dance School. A rigorous technician known for pairing classical fundamentals with contemporary sensibility. Teaches weekday evenings and Saturday intensives. Believes that proper alignment and body awareness are the ultimate pathways to artistic freedom.",
      img: "Images/Meera_Raichand.svg",
      socials: { fb: "#", ig: "#", mail: "mailto:meera@aurea-dance.com" }
    },
    "rohan verma": {
      type: "teacher",
      tag: "Head of Hip Hop",
      title: "Rohan Verma",
      desc: "12 yrs · Millennium Dance Complex, LA. Specializes in commercial hip-hop, locking, popping, and performance styling. Rohan has taught workshops across Europe and South Asia, bringing street authenticity and high energy to the studio floor.",
      img: "Images/Rohan_Verma.svg",
      socials: { fb: "#", ig: "#", mail: "mailto:rohan@aurea-dance.com" }
    },
    "ananya iyer": {
      type: "teacher",
      tag: "Guru · Bharatanatyam",
      title: "Ananya Iyer",
      desc: "20 yrs · Kalakshetra Foundation. A gold medalist in Bharatanatyam pedagogy, devoted to preserving traditional adavus and abhinaya training. Ananya balances structural discipline with expressive freedom, guiding students toward solo and ensemble stage readiness.",
      img: "Images/Ananya_Iyer.svg",
      socials: { fb: "#", ig: "#", mail: "mailto:ananya@aurea-dance.com" }
    },
    "kabir menon": {
      type: "teacher",
      tag: "Ballet Master",
      title: "Kabir Menon",
      desc: "15 yrs · RAD Registered Teacher. Former soloist with the Royal Ballet of Flanders. Kabir combines strict RAD syllabus with modern sports science and conditioning to help dancers build turnout, extension, and alignment safely.",
      img: "Images/Kabir_Menon.svg",
      socials: { fb: "#", ig: "#", mail: "mailto:kabir@aurea-dance.com" }
    },

    // Styles
    "hip hop": {
      type: "style",
      tag: "Beginner → Pro · Hip Hop",
      title: "Hip Hop",
      desc: "Rooted in street dance culture, this program covers popping, locking, breaking, and modern commercial choreography. Focus on musicality, bounce, and developing your own freestyle voice. Taught by Rohan Verma.",
      img: "Images/Hip_Hop.svg"
    },
    "contemporary": {
      type: "style",
      tag: "All Levels · Contemporary",
      title: "Contemporary",
      desc: "A fluid blend of classical ballet technique and modern dance release. Emphasizes floor work, weight shift, improvisation, and emotional storytelling through motion. Taught by Meera Raichand.",
      img: "Images/Contemporary.svg"
    },
    "bollywood": {
      type: "style",
      tag: "All Levels · Bollywood",
      title: "Bollywood",
      desc: "A high-energy fusion of traditional Indian folk, classical dance, and modern commercial styles. Learn expressive storytelling, energetic footwork, and fast-paced group choreographies to current beats. Taught by rotating guest choreographers.",
      img: "Images/Bollywood.svg"
    },
    "salsa": {
      type: "style",
      tag: "Couples · Salsa",
      title: "Salsa",
      desc: "Learn the fundamentals of linear Salsa (LA/NY style). Covers timing, lead-and-follow technique, spin mechanics, and social dancing etiquette. Designed for partners looking to build synergy and rhythm.",
      img: "Images/Salsa.svg"
    },
    "kathak": {
      type: "style",
      tag: "Foundational · Classical",
      title: "Kathak",
      desc: "Explore the grace of this North Indian classical dance form. Focuses on rhythmic footwork (tatkar), fast spins (chakkars), hand gestures, and expressive storytelling (bhava) set to traditional taals.",
      img: "Images/Kathak.svg"
    },
    "bharatanatyam": {
      type: "style",
      tag: "Foundational · Classical",
      title: "Bharatanatyam",
      desc: "Nurture geometric precision and dramatic expression. Taught in the Kalakshetra style, covering adavus (basic steps), mudras (hand gestures), and abhinaya (expression) to classical Carnatic music. Taught by Ananya Iyer.",
      img: "Images/Bharatanatyam.svg"
    },
    "ballet": {
      type: "style",
      tag: "Graded · Classical",
      title: "Ballet",
      desc: "Build core strength, posture, and alignment through classical RAD techniques. Covers barre work, center practice, and across-the-floor combinations. Essential for coordination and classical grace. Taught by Kabir Menon.",
      img: "Images/Ballet.svg"
    },
    "freestyle": {
      type: "style",
      tag: "Open · Contemporary",
      title: "Freestyle",
      desc: "A creative lab designed for advanced dancers to break boundaries. Blends elements of street styles, contact improvisation, and experimental theater. Perfect for finding your unique signature as an artist.",
      img: "Images/Freestyle.svg"
    }
  };

  var modalOverlay = document.getElementById("modalOverlay");
  var modal = document.getElementById("modal");
  var modalClose = document.getElementById("modalClose");
  var modalImg = document.getElementById("modalImg");
  var modalTag = document.getElementById("modalTag");
  var modalTitle = document.getElementById("modalTitle");
  var modalDesc = document.getElementById("modalDesc");
  var modalSocials = document.getElementById("modalSocials");
  var modalActions = document.getElementById("modalActions");

  var activeTrigger = null;

  function openModal(data, triggerEl) {
    if (!data) return;

    activeTrigger = triggerEl;

    // Populate data
    modalImg.src = data.img;
    modalImg.alt = data.title;
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;

    // Toggle actions vs socials
    if (data.type === "teacher") {
      modalSocials.style.display = "flex";
      modalActions.style.display = "none";
      
      // Update social links
      var links = modalSocials.querySelectorAll("a");
      if (links.length >= 3) {
        links[0].href = data.socials.fb || "#";
        links[1].href = data.socials.ig || "#";
        links[2].href = data.socials.mail || "#";
      }
    } else {
      modalSocials.style.display = "none";
      modalActions.style.display = "flex";
    }

    // Show modal and lock page scrolling
    modalOverlay.classList.add("is-visible");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-lock");

    // Accessibility focus management
    setTimeout(function () {
      modalClose.focus();
    }, 50);

    // Trap focus inside modal
    modalOverlay.addEventListener("keydown", trapFocus);
  }

  function closeModal() {
    modalOverlay.classList.remove("is-visible");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-lock");

    modalOverlay.removeEventListener("keydown", trapFocus);

    if (activeTrigger) {
      activeTrigger.focus();
      activeTrigger = null;
    }
  }

  // Trap focus helper
  function trapFocus(e) {
    if (e.key !== "Tab") return;

    var focusables = modalOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]');
    // Filter visible elements
    var visibleFocusables = Array.prototype.filter.call(focusables, function (el) {
      return el.offsetWidth > 0 || el.offsetHeight > 0;
    });

    if (visibleFocusables.length === 0) return;

    var first = visibleFocusables[0];
    var last = visibleFocusables[visibleFocusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  // Style cards event listeners
  document.querySelectorAll(".style-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
      var h3 = card.querySelector("h3");
      if (!h3) return;
      var name = h3.textContent.trim().toLowerCase();
      var data = POPUP_DATA[name];
      if (data) {
        e.preventDefault();
        openModal(data, card);
      }
    });

    // Make card focusable for keyboard navigation
    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Teacher cards event listeners
  document.querySelectorAll(".teacher").forEach(function (card) {
    card.addEventListener("click", function (e) {
      var h3 = card.querySelector("h3");
      if (!h3) return;
      var name = h3.textContent.trim().toLowerCase();
      var data = POPUP_DATA[name];
      if (data) {
        openModal(data, card);
      }
    });

    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Close actions
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.getElementById("modalBookBtn").addEventListener("click", closeModal);
  document.getElementById("modalScheduleBtn").addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalOverlay.classList.contains("is-visible")) {
      closeModal();
    }
  });
})();
