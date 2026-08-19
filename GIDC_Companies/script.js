/* =========================================================
   GIDC Companies — interactions
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. Mobile navigation ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  function closeNav() {
    if (!mainNav) return;
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });

    mainNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 992) closeNav();
    });
  }

  /* ---------- 2. Sticky header state ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Active nav link on scroll ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sectionTargets = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.length > 1 ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sectionTargets.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sectionTargets.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- 4. Search tabs ---------- */
  var tabs = document.querySelectorAll('.search-tabs .tab');
  var searchInput = document.getElementById('searchInput');
  var placeholders = {
    'Company': 'Search by company, product, keyword…',
    'Industry': 'Search an industry — engineering, textile, pharma…',
    'GIDC Estate': 'Search an estate — Vatva, Sanand, Morbi…',
    'City': 'Search a city — Ahmedabad, Rajkot, Surat…',
    'Category': 'Search a category — exporters, wholesalers…'
  };

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      if (searchInput) {
        searchInput.placeholder = placeholders[tab.textContent.trim()] || placeholders.Company;
      }
    });
  });

  var searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  /* ---------- 5. Popular chips fill the search box ---------- */
  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      if (!searchInput) return;
      searchInput.value = chip.textContent.trim();
      searchInput.focus();
    });
  });

  /* ---------- 6. FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var willOpen = !item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function (other) {
        other.classList.remove('is-open');
        var btn = other.querySelector('.faq-q');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', willOpen);
      q.setAttribute('aria-expanded', String(willOpen));
    });
  });

  /* ---------- 7. Testimonial slider ---------- */
  var slides = document.querySelectorAll('#testimonialTrack .testimonial');
  var dots = document.querySelectorAll('#testimonialDots .dot-btn');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) { slide.classList.toggle('is-active', i === current); });
    dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === current); });
  }

  function startAuto() {
    stopAuto();
    if (slides.length > 1) {
      timer = setInterval(function () { showSlide(current + 1); }, 6000);
    }
  }
  function stopAuto() { if (timer) clearInterval(timer); }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { showSlide(i); startAuto(); });
  });

  var track = document.getElementById('testimonialTrack');
  if (track) {
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);
  }
  startAuto();

  /* ---------- 8. Map pins ---------- */
  var pins = document.querySelectorAll('.map-pin');
  pins.forEach(function (pin) {
    pin.addEventListener('click', function () {
      pins.forEach(function (p) { p.classList.remove('is-active'); });
      pin.classList.add('is-active');
    });
  });

  /* ---------- 9. Animated stat counters ---------- */
  function formatIndian(n) {
    var s = String(n);
    if (s.length <= 3) return s;
    var last3 = s.slice(-3);
    var rest = s.slice(0, -3);
    return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var duration = 1400;
    var started = null;

    function step(now) {
      if (!started) started = now;
      var progress = Math.min((now - started) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = formatIndian(value) + '+';
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- 10. Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.section > .container > *, .hero-copy, .hero-visual, .search-card, .popular-row, .stats-grid, .cta-card, .footer-grid > *'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('.stat-num[data-count]').forEach(animateCount);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
