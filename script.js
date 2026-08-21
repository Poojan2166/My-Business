/* =========================================================
   Luxora — Salon & Spa
   Interactions: sticky header, mobile drawer, scroll reveal,
   counters, active nav, gallery filter, before/after slider,
   tour modal, booking form, back-to-top, toast
   ========================================================= */
(function () {
  "use strict";

  /* Marks that JS is running so the reveal animation can hide content.
     Without it the page still renders fully if the script never loads. */
  document.documentElement.classList.add("js");

  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Toast
     --------------------------------------------------------- */
  var toastEl = $("#toast");
  var toastTimer = null;

  function toast(message) {
    if (!toastEl || !message) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 2800);
  }

  /* ---------------------------------------------------------
     Sticky header
     --------------------------------------------------------- */
  var header = $("#header");

  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-stuck", window.pageYOffset > 40);
  }

  /* ---------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------- */
  var nav = $("#nav");
  var hamburger = $("#hamburger");
  var navClose = $("#navClose");
  var backdrop = $("#navBackdrop");

  function setNav(open) {
    if (!nav || !hamburger) return;
    nav.classList.toggle("is-open", open);
    hamburger.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.documentElement.classList.toggle("nav-open", open);

    if (backdrop) {
      if (open) {
        backdrop.hidden = false;
        // next frame so the opacity transition runs
        requestAnimationFrame(function () {
          backdrop.classList.add("is-visible");
        });
      } else {
        backdrop.classList.remove("is-visible");
        setTimeout(function () {
          backdrop.hidden = true;
        }, 300);
      }
    }
  }

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      setNav(!nav.classList.contains("is-open"));
    });
  }
  if (navClose) navClose.addEventListener("click", function () { setNav(false); });
  if (backdrop) backdrop.addEventListener("click", function () { setNav(false); });

  // Close the drawer after tapping any in-page link
  if (nav) {
    nav.addEventListener("click", function (e) {
      var link = e.target.closest ? e.target.closest("a") : null;
      if (link) setNav(false);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    setNav(false);
    closeModal();
  });

  /* ---------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------- */
  var revealables = $$(".reveal");

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealables.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          // Stagger siblings that enter together for a softer cascade
          el.style.transitionDelay = Math.min(i * 70, 350) + "ms";
          el.classList.add("is-in");
          revealObserver.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    revealables.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------
     Counters (hero stats)
     --------------------------------------------------------- */
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // ease-out
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = $$(".counter");
  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      var countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            countObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (el) {
        countObserver.observe(el);
      });
    }
  }

  /* ---------------------------------------------------------
     Active nav link while scrolling
     --------------------------------------------------------- */
  var navLinks = $$(".nav__link");
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? $(id) : null;
    })
    .filter(Boolean);

  function onScrollSpy() {
    if (!sections.length) return;
    var pos = window.pageYOffset + 140;
    var current = sections[0];

    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === "#" + current.id
      );
    });
  }

  /* ---------------------------------------------------------
     Gallery filter
     --------------------------------------------------------- */
  var mosaic = $("#mosaic");
  var chips = $$(".chip");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filter = chip.getAttribute("data-filter");

      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-selected", String(on));
      });

      if (!mosaic) return;
      mosaic.classList.toggle("is-filtered", filter !== "all");

      var shown = 0;
      $$(".shot", mosaic).forEach(function (shot) {
        var match = filter === "all" || shot.getAttribute("data-cat") === filter;
        shot.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });

      if (!shown) toast("No photos in this category yet.");
    });
  });

  /* ---------------------------------------------------------
     Before / after comparison slider

     The "before" asset is the left half of the shot, so the
     divider travels between 6% and 50% — at 50% the split
     matches the original design exactly.
     --------------------------------------------------------- */
  var viewer = $("#baViewer");
  var beforePane = $("#baBefore");
  var divider = $("#baDivider");

  if (viewer && beforePane && divider) {
    var MIN = 6;
    var MAX = 50;
    var dragging = false;

    // Lock the "before" artwork to half the viewer width so it stays
    // aligned with the composite while the pane above it clips.
    function sizeBefore() {
      viewer.style.setProperty("--ba-half", viewer.clientWidth / 2 + "px");
    }

    function setSplit(pct) {
      var clamped = Math.max(MIN, Math.min(MAX, pct));
      beforePane.style.width = clamped + "%";
      divider.style.left = clamped + "%";
    }

    function pointFrom(e) {
      var rect = viewer.getBoundingClientRect();
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      return ((x - rect.left) / rect.width) * 100;
    }

    function startDrag(e) {
      dragging = true;
      setSplit(pointFrom(e));
    }

    function moveDrag(e) {
      if (!dragging) return;
      if (e.cancelable) e.preventDefault();
      setSplit(pointFrom(e));
    }

    function endDrag() {
      dragging = false;
    }

    divider.addEventListener("mousedown", startDrag);
    viewer.addEventListener("mousedown", startDrag);
    window.addEventListener("mousemove", moveDrag);
    window.addEventListener("mouseup", endDrag);

    divider.addEventListener("touchstart", startDrag, { passive: true });
    window.addEventListener("touchmove", moveDrag, { passive: false });
    window.addEventListener("touchend", endDrag);

    // Keyboard support on the handle
    var handle = $("#baHandle");
    if (handle) {
      handle.addEventListener("keydown", function (e) {
        var current = parseFloat(beforePane.style.width) || 50;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setSplit(current - 3);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          setSplit(current + 3);
        }
      });
      handle.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    sizeBefore();
    window.addEventListener("resize", sizeBefore);
    window.addEventListener("load", sizeBefore);
  }

  /* ---------------------------------------------------------
     Tour modal
     --------------------------------------------------------- */
  var modal = $("#tourModal");
  var playBtn = $("#playTour");

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    document.documentElement.classList.add("modal-open");
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.documentElement.classList.remove("modal-open");
  }

  if (playBtn) playBtn.addEventListener("click", openModal);

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeModal();
    });
  }

  /* ---------------------------------------------------------
     Booking form
     --------------------------------------------------------- */
  var form = $("#bookingForm");

  function setError(field, message) {
    var wrap = field.closest(".field");
    if (!wrap) return;
    wrap.classList.toggle("has-error", Boolean(message));
    var err = $(".field__err", wrap);
    if (err) err.textContent = message || "";
  }

  function validate(field) {
    var value = (field.value || "").trim();

    if (field.id === "bkName") {
      if (value.length < 2) return "Please tell us your name.";
    }
    if (field.id === "bkPhone") {
      if (!/^[0-9]{10}$/.test(value.replace(/[\s-]/g, "")))
        return "Enter a valid 10-digit mobile number.";
    }
    if (field.id === "bkEmail" && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
        return "That email doesn't look right.";
    }
    if (field.id === "bkService" && !value) return "Pick a service.";
    if (field.id === "bkDate") {
      if (!value) return "Choose a date.";
      var picked = new Date(value + "T00:00:00");
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (picked < today) return "Please choose today or a future date.";
    }
    if (field.id === "bkTime" && !value) return "Pick a time slot.";

    return "";
  }

  if (form) {
    // Block past dates in the native picker
    var dateInput = $("#bkDate");
    if (dateInput) {
      var now = new Date();
      var iso =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0");
      dateInput.min = iso;
    }

    $$("input, select, textarea", form).forEach(function (field) {
      field.addEventListener("blur", function () {
        setError(field, validate(field));
      });
      field.addEventListener("input", function () {
        if (field.closest(".field").classList.contains("has-error")) {
          setError(field, validate(field));
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var fields = $$("input, select", form);
      var firstBad = null;

      fields.forEach(function (field) {
        var message = validate(field);
        setError(field, message);
        if (message && !firstBad) firstBad = field;
      });

      if (firstBad) {
        firstBad.focus();
        toast("Please fix the highlighted fields.");
        return;
      }

      var name = $("#bkName").value.trim().split(" ")[0];
      form.reset();
      $$(".field", form).forEach(function (f) {
        f.classList.remove("has-error");
      });
      toast("Thank you, " + name + "! We'll confirm your slot shortly.");
    });
  }

  /* ---------------------------------------------------------
     Back to top
     --------------------------------------------------------- */
  var toTop = $("#toTop");

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  }

  function onScrollTopBtn() {
    if (!toTop) return;
    toTop.classList.toggle("is-visible", window.pageYOffset > 600);
  }

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------
     FAQ Accordion
     --------------------------------------------------------- */
  var accordionItems = $$(".accordion__item");

  accordionItems.forEach(function (item) {
    var trigger = $(".accordion__trigger", item);
    var content = $(".accordion__content", item);
    var icon = $(".accordion__icon", item);

    if (!trigger || !content) return;

    trigger.addEventListener("click", function () {
      var isActive = item.classList.contains("is-active");

      // Close all other items
      accordionItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove("is-active");
          var otherTrigger = $(".accordion__trigger", otherItem);
          var otherContent = $(".accordion__content", otherItem);
          var otherIcon = $(".accordion__icon", otherItem);
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          if (otherContent) otherContent.style.maxHeight = null;
          if (otherIcon) otherIcon.setAttribute("src", "Images/down_img.svg");
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove("is-active");
        trigger.setAttribute("aria-expanded", "false");
        content.style.maxHeight = null;
        if (icon) icon.setAttribute("src", "Images/down_img.svg");
      } else {
        item.classList.add("is-active");
        trigger.setAttribute("aria-expanded", "true");
        content.style.maxHeight = content.scrollHeight + "px";
        if (icon) icon.setAttribute("src", "Images/up_img.svg");
      }
    });
  });

  // Set initial height for active items on window load
  window.addEventListener("load", function () {
    accordionItems.forEach(function (item) {
      if (item.classList.contains("is-active")) {
        var content = $(".accordion__content", item);
        if (content) content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  /* ---------------------------------------------------------
     Newsletter form
     --------------------------------------------------------- */
  var newsletterForm = $("#newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = $(".newsletter-card__input", newsletterForm);
      var value = (input ? input.value : "").trim();
      if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        toast("Please enter a valid email address.");
        return;
      }
      toast("Thank you! You have subscribed to The Sunday edit.");
      newsletterForm.reset();
    });
  }

  /* ---------------------------------------------------------
     Single scroll listener (rAF-throttled)
     --------------------------------------------------------- */
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onScrollHeader();
      onScrollSpy();
      onScrollTopBtn();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScrollSpy);
  onScroll();
})();
