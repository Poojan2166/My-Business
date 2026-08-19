/* ============================================================
   FERROVANE — interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- sticky header shadow ---------- */
  var header = document.getElementById('header');

  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile navigation ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-active', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a') && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      burger.click();
    }
  });

  /* ---------- active section in nav ---------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('.nav__link'));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navSpy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle(
              'is-active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach(function (section) {
      navSpy.observe(section);
    });
  }

  /* ---------- FAQ accordion ---------- */
  var accordion = document.getElementById('accordion');

  accordion.addEventListener('click', function (e) {
    var trigger = e.target.closest('.acc__q');
    if (!trigger) return;

    var item = trigger.parentElement;
    var panel = item.querySelector('.acc__a');
    var isOpen = item.classList.contains('is-open');

    accordion.querySelectorAll('.acc__item').forEach(function (other) {
      other.classList.remove('is-open');
      other.querySelector('.acc__a').style.maxHeight = null;
      other.querySelector('.acc__q').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('is-open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
      trigger.setAttribute('aria-expanded', 'true');
    }
  });

  window.addEventListener('resize', function () {
    var open = accordion.querySelector('.acc__item.is-open .acc__a');
    if (open) open.style.maxHeight = open.scrollHeight + 'px';
  });

  /* ---------- scroll reveal ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealables.length) {
    document.documentElement.classList.add('js-reveal');

    var revealer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealables.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      revealer.observe(el);
    });

    /* failsafe: if the observer never reports (hidden tab, embedded
       webview, blocked compositing) show everything rather than
       leaving the page blank */
    window.setTimeout(function () {
      if (document.querySelector('.reveal.is-in')) return;
      revealer.disconnect();
      document.documentElement.classList.remove('js-reveal');
    }, 2500);
  }

  /* ---------- animated stat counters ---------- */
  var counters = document.querySelectorAll('.js-count');

  var runCounter = function (el) {
    var target = parseInt(el.getAttribute('data-to'), 10);
    var grouped = el.getAttribute('data-group') === '1';
    var duration = 1400;
    var start = null;

    var tick = function (now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = grouped ? value.toLocaleString('en-US') : value;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window && counters.length) {
    var countSpy = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach(function (el) {
      countSpy.observe(el);
    });
  }

  /* ---------- decorative dotted world map ---------- */
  var mapSvg = document.querySelector('.map__svg');

  if (mapSvg) {
    var landRows = [
      '........................................',
      '..#####...................#####.........',
      '.########........###....########........',
      '..########.......####...##########......',
      '...#######........###...###########.....',
      '....#####.........###....##########.....',
      '.....###..........####....########......',
      '......#...........####.....######.......',
      '..................####......####........',
      '.........##.......#####......##.........',
      '........####......#####.................',
      '........####......#####.................',
      '.........###......####.........####.....',
      '.........###......###.........######....',
      '..........##......###..........####.....',
      '..........##.......#....................',
      '..........#.............................',
      '........................................'
    ];
    /* Houston · Rotterdam · Dubai · Singapore · São Paulo · Sydney */
    var hubs = [[8, 6], [19, 4], [24, 7], [30, 9], [13, 12], [35, 14]];
    var STEP = 12.6;
    var OFFSET = 6;
    var NS = 'http://www.w3.org/2000/svg';

    var isHub = function (col, row) {
      return hubs.some(function (hub) {
        return hub[0] === col && hub[1] === row;
      });
    };

    var dot = function (col, row, r) {
      var circle = document.createElementNS(NS, 'circle');
      circle.setAttribute('cx', (OFFSET + col * STEP).toFixed(1));
      circle.setAttribute('cy', (OFFSET + row * STEP).toFixed(1));
      circle.setAttribute('r', r);
      return circle;
    };

    var land = mapSvg.querySelector('.map__land');
    var hubGroup = mapSvg.querySelector('.map__hubs');

    landRows.forEach(function (line, row) {
      for (var col = 0; col < line.length; col++) {
        if (line[col] !== '#' || isHub(col, row)) continue;
        land.appendChild(dot(col, row, 2));
      }
    });

    hubs.forEach(function (hub) {
      hubGroup.appendChild(dot(hub[0], hub[1], 4.5));
    });
  }

  /* ---------- forms ---------- */
  var emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  var setMessage = function (el, text, isError) {
    el.textContent = text;
    el.classList.toggle('is-error', Boolean(isError));
  };

  var quoteForm = document.getElementById('quoteForm');
  var formMsg = document.getElementById('formMsg');

  quoteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = quoteForm.elements.name;
    var email = quoteForm.elements.email;
    var invalid = false;

    [name, email].forEach(function (field) {
      var ok =
        field === email
          ? emailPattern.test(field.value.trim())
          : field.value.trim().length > 1;
      field.closest('.field').classList.toggle('is-invalid', !ok);
      if (!ok) invalid = true;
    });

    if (invalid) {
      setMessage(formMsg, 'Please add your name and a valid work email.', true);
      return;
    }

    setMessage(
      formMsg,
      'Thanks — your inquiry is with our engineering desk. We reply within one business day.'
    );
    quoteForm.reset();
  });

  quoteForm.addEventListener('input', function (e) {
    var field = e.target.closest('.field');
    if (field) field.classList.remove('is-invalid');
  });

  var newsForm = document.getElementById('newsForm');
  var newsMsg = document.getElementById('newsMsg');

  newsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = newsForm.elements.email.value.trim();

    if (!emailPattern.test(value)) {
      setMessage(newsMsg, 'Enter a valid email address.', true);
      return;
    }

    setMessage(newsMsg, 'You are subscribed. Watch for our next supply brief.');
    newsForm.reset();
  });
})();
