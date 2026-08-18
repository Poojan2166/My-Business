/* ============================================================
   NORDFORGE — interactions
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
    if (e.target.closest('.nav__link')) {
      nav.classList.remove('is-open');
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      burger.click();
    }
  });

  /* ---------- FAQ accordion ---------- */
  var accordion = document.getElementById('accordion');

  accordion.addEventListener('click', function (e) {
    var trigger = e.target.closest('.acc__q');
    if (!trigger) return;

    var item = trigger.parentElement;
    var isOpen = item.classList.contains('is-open');

    accordion.querySelectorAll('.acc').forEach(function (acc) {
      acc.classList.remove('is-open');
      acc.querySelector('.acc__q').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });

  /* ---------- scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.reveal, .h2, .capcard, .phase, .prod, .quote, .leader, .bignum, .minicard, .cert, .esg, .feat'
  );

  if ('IntersectionObserver' in window) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');

  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var started = null;
    var duration = 1400;

    var step = function (now) {
      if (started === null) started = now;
      var progress = Math.min((now - started) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        counterIO.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { counterIO.observe(el); });
  }

  /* ---------- inquiry form ---------- */
  var form = document.getElementById('quoteForm');
  var formMsg = document.getElementById('formMsg');
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.elements.name;
    var email = form.elements.email;
    var problems = [];

    [name, email].forEach(function (input) {
      input.closest('.field').classList.remove('is-error');
    });

    if (!name.value.trim()) {
      name.closest('.field').classList.add('is-error');
      problems.push('your name');
    }
    if (!emailRe.test(email.value.trim())) {
      email.closest('.field').classList.add('is-error');
      problems.push('a valid work email');
    }

    if (problems.length) {
      formMsg.classList.remove('is-ok');
      formMsg.textContent = 'Please add ' + problems.join(' and ') + '.';
      return;
    }

    formMsg.classList.add('is-ok');
    formMsg.textContent = 'Thanks — an engineer will reply within one business day.';
    form.reset();
  });

  /* ---------- newsletter ---------- */
  var subForm = document.getElementById('subForm');

  subForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = subForm.querySelector('input');

    if (!emailRe.test(input.value.trim())) {
      input.focus();
      return;
    }

    var button = subForm.querySelector('button');
    button.textContent = 'Subscribed';
    button.disabled = true;
    input.value = '';
    input.placeholder = 'You are on the list.';
  });
})();
