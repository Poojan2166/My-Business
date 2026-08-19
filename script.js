/* =========================================================
   Kirana - Business Directory
   Interactions: mobile nav, city select, search, chips,
   sticky header, scroll reveal, counters, live ticker, toast
   ========================================================= */
(function () {
  "use strict";

  /* Mark that JS is alive so the reveal animation can hide content safely.
     Without this class the page renders fully even if the script never runs. */
  document.documentElement.classList.add("js");

  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

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
    }, 2600);
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest ? e.target.closest(".js-toast") : null;
    if (trigger) toast(trigger.getAttribute("data-toast"));
  });

  /* ---------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------- */
  var nav = $("#nav");
  var hamburger = $("#hamburger");
  var backdrop = $("#navBackdrop");
  var navClose = $("#navClose");

  function setNav(open) {
    if (!nav || !hamburger) return;
    nav.classList.toggle("is-open", open);
    hamburger.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (backdrop) {
      backdrop.classList.toggle("is-visible", open);
    }

    // Lock page scroll when mobile menu is open
    document.documentElement.classList.toggle("nav-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      setNav(!nav.classList.contains("is-open"));
    });
  }

  if (navClose) {
    navClose.addEventListener("click", function () {
      setNav(false);
    });
  }

  if (backdrop)
    backdrop.addEventListener("click", function () {
      setNav(false);
    });

  $$(".nav__link, .nav__mobile-actions .btn").forEach(function (link) {
    link.addEventListener("click", function () {
      setNav(false);
    });
  });

  /* ---------------------------------------------------------
     City select (custom dropdown)
     --------------------------------------------------------- */
  var cityToggle = $("#cityToggle");
  var cityMenu = $("#cityMenu");
  var selectedCity = "";

  function openCityMenu(open) {
    if (!cityMenu || !cityToggle) return;
    cityMenu.classList.toggle("is-open", open);
    cityToggle.setAttribute("aria-expanded", String(open));
  }

  function chooseCity(name) {
    selectedCity = name;
    cityToggle.textContent = name;
    openCityMenu(false);
  }

  if (cityToggle && cityMenu) {
    cityToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      openCityMenu(!cityMenu.classList.contains("is-open"));
    });

    $$("li", cityMenu).forEach(function (item) {
      item.addEventListener("click", function () {
        chooseCity(item.textContent.trim());
      });
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          chooseCity(item.textContent.trim());
          cityToggle.focus();
        }
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest || !e.target.closest("#citySelect"))
        openCityMenu(false);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    openCityMenu(false);
    setNav(false);
  });

  /* ---------------------------------------------------------
     Search form + popular chips
     --------------------------------------------------------- */
  var searchForm = $("#searchForm");
  var searchInput = $("#searchInput");

  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var term = searchInput ? searchInput.value.trim() : "";
      if (!term) {
        toast("Please enter a product or supplier name.");
        if (searchInput) searchInput.focus();
        return;
      }
      toast(
        'Searching "' +
          term +
          '"' +
          (selectedCity ? " in " + selectedCity : " across India") +
          "…",
      );
    });
  }

  $$("#popularChips .chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      $$("#popularChips .chip").forEach(function (c) {
        c.classList.remove("is-active");
      });
      chip.classList.add("is-active");
      if (searchInput) {
        searchInput.value = chip.textContent.trim();
        searchInput.focus();
      }
    });
  });

  /* ---------------------------------------------------------
     Sticky header shadow
     --------------------------------------------------------- */
  var header = $("#header");
  var ticking = false;

  function onScroll() {
    if (header) header.classList.toggle("is-stuck", window.scrollY > 8);
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(onScroll);
    },
    { passive: true },
  );
  onScroll();

  /* ---------------------------------------------------------
     Scroll reveal + animated counters
     --------------------------------------------------------- */
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;

    var duration = 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNumber(Math.round(target * eased)) + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    }
    el.textContent = "0" + suffix;
    window.requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          $$("[data-count]", entry.target).forEach(countUp);
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    $$(".reveal").forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    $$(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------------
     Live counter ticker in the hero card
     --------------------------------------------------------- */
  var liveCount = $("#liveCount");
  if (liveCount && !reduceMotion) {
    var current = 25348;
    setInterval(function () {
      current += Math.floor(Math.random() * 3) + 1;
      liveCount.textContent = formatNumber(current);
    }, 4000);
  }

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
