/* =========================================================
   Arctic Cool — AC Repair  ·  interactions
   ========================================================= */
(function () {
  "use strict";

  var doc = document;

  /* ---------------------------------------------------
     1. Mobile navigation drawer
     --------------------------------------------------- */
  var burger = doc.getElementById("burger");
  var nav = doc.getElementById("nav");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    doc.body.style.overflow = "";
    doc.body.classList.remove("nav-open");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      doc.body.style.overflow = open ? "hidden" : "";
      doc.body.classList.toggle("nav-open", open);
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });

    doc.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || burger.contains(e.target)) return;
      closeNav();
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080) closeNav();
    });
  }

  /* ---------------------------------------------------
     2. Header shadow once the page is scrolled
     --------------------------------------------------- */
  var header = doc.getElementById("header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------
     3. FAQ accordion — keep one panel open at a time
     --------------------------------------------------- */
  var items = doc.querySelectorAll(".acc__item");
  items.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      items.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------------------------------------------------
     4. Reveal-on-scroll
     --------------------------------------------------- */
  var targets = doc.querySelectorAll(
    ".card, .chip, .feature, .stat, .proj, .step, .plan, .quote, .video, .tip, .ccard, .post, .tile, .area"
  );

  if ("IntersectionObserver" in window && targets.length) {
    // The animation is opt-in: the styles that hide elements only apply while
    // <html> carries .js-reveal, so a failure here can never blank the page.
    doc.documentElement.classList.add("js-reveal");

    targets.forEach(function (el) {
      el.classList.add("reveal");
    });

    var fired = false;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          fired = true;
          var el = entry.target;
          el.style.transitionDelay = Math.min(i * 60, 300) + "ms";
          el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.08 }
    );

    targets.forEach(function (el) {
      io.observe(el);
    });

    // Safety net: if the observer never reports anything (unsupported quirk,
    // hidden tab, reduced-motion engine), drop the animation and show all.
    setTimeout(function () {
      if (!fired) doc.documentElement.classList.remove("js-reveal");
    }, 1800);
  }

  /* ---------------------------------------------------
     5. Stat counters
     --------------------------------------------------- */
  var counters = doc.querySelectorAll(".stat b[data-count]");

  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null;
    var dur = 1400;

    function frame(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / dur, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          co.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      co.observe(el);
    });
  }

  /* ---------------------------------------------------
     6. Newsletter form (client-side only)
     --------------------------------------------------- */
  var form = doc.getElementById("newsForm");
  var note = doc.getElementById("newsNote");

  if (form && note) {
    var defaultNote = note.textContent;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = doc.getElementById("newsEmail");
      var value = (input.value || "").trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      note.classList.remove("is-ok", "is-err");

      if (!valid) {
        note.textContent = "Please enter a valid email address.";
        note.classList.add("is-err");
        input.focus();
        return;
      }

      note.textContent = "Thanks — you're on the list. Check your inbox.";
      note.classList.add("is-ok");
      form.reset();

      setTimeout(function () {
        note.textContent = defaultNote;
        note.classList.remove("is-ok");
      }, 5000);
    });
  }

  /* ---------------------------------------------------
     7. Highlight the nav link for the section in view
     --------------------------------------------------- */
  var sections = doc.querySelectorAll("section[id]");
  var navLinks = doc.querySelectorAll(".nav a");

  if ("IntersectionObserver" in window && sections.length) {
    var so = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) {
      so.observe(s);
    });
  }
})();
