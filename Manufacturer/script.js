/* =========================================================
   Helion Industries — interactions
   ========================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- sticky header state ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || burger.contains(e.target)) return;
      closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) closeNav();
    });
  }

  function closeNav() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  /* ---------- quality-assurance tabs ---------- */
  var tabsRoot = document.getElementById('qaTabs');
  if (tabsRoot) {
    var tabs = tabsRoot.querySelectorAll('.tab');
    var panels = tabsRoot.querySelectorAll('.tabs__panel');

    tabsRoot.addEventListener('click', function (e) {
      var btn = e.target.closest('.tab');
      if (!btn) return;
      var idx = btn.dataset.tab;

      tabs.forEach(function (t) {
        var on = t === btn;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      panels.forEach(function (p) {
        p.classList.toggle('is-active', p.dataset.panel === idx);
      });
    });

    // arrow-key navigation between tabs
    tabsRoot.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var list = Array.prototype.slice.call(tabs);
      var i = list.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      var next = e.key === 'ArrowRight' ? (i + 1) % list.length
                                        : (i - 1 + list.length) % list.length;
      list[next].focus();
      list[next].click();
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faq = document.getElementById('faq');
  if (faq) {
    faq.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq__q');
      if (!btn) return;
      var item = btn.parentElement;
      var isOpen = item.classList.contains('is-open');

      // single-open accordion
      faq.querySelectorAll('.faq__item.is-open').forEach(function (el) {
        el.classList.remove('is-open');
        el.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    // stagger siblings inside the same grid for a softer cascade
    revealables.forEach(function (el) {
      var siblings = Array.prototype.slice.call(el.parentElement.children)
        .filter(function (c) { return c.classList.contains('reveal'); });
      var i = siblings.indexOf(el);
      if (i > 0) el.style.transitionDelay = Math.min(i, 5) * 80 + 'ms';
      io.observe(el);
    });

    // Safety net: if the observer never fires (background tab, odd engine),
    // show everything above the fold anyway rather than leaving it blank.
    window.setTimeout(function () {
      revealables.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-in');
        }
      });
    }, 1200);
  }

  /* ---------- stat band count-up ---------- */
  var counters = document.querySelectorAll('.statband__item strong[data-target]');

  function runCount(el) {
    var target = parseFloat(el.dataset.target);
    var dec = parseInt(el.dataset.dec || '0', 10);
    var suffix = el.dataset.suffix || '';

    if (reduced) {
      el.textContent = target.toFixed(dec) + suffix;
      return;
    }

    var start = performance.now();
    var dur = 1600;

    function frame(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);          // easeOutCubic
      el.textContent = (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCount(entry.target);
          co.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }

  /* ---------- contact form ---------- */
  var quoteForm = document.getElementById('quoteForm');
  var formNote = document.getElementById('formNote');

  if (quoteForm && formNote) {
    var defaultNote = formNote.textContent;

    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      quoteForm.querySelectorAll('input, textarea').forEach(function (input) {
        var field = input.closest('.field');
        var valid = input.value.trim() !== '' &&
                    (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
        field.classList.toggle('is-invalid', !valid);
        if (!valid && ok) { input.focus(); ok = false; }
      });

      if (!ok) {
        setNote(formNote, 'Please complete every field with a valid work email.', 'is-err');
        return;
      }

      setNote(formNote, 'Thanks — your inquiry is in. We reply within one business day.', 'is-ok');
      quoteForm.reset();
      window.setTimeout(function () { setNote(formNote, defaultNote, ''); }, 6000);
    });

    quoteForm.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field) field.classList.remove('is-invalid');
    });
  }

  /* ---------- newsletter ---------- */
  var signalForm = document.getElementById('signalForm');
  var signalNote = document.getElementById('signalNote');

  if (signalForm && signalNote) {
    var signalDefault = signalNote.textContent;

    signalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('signalEmail');
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());

      if (!valid) {
        setNote(signalNote, 'Enter a valid work email address.', 'is-err');
        input.focus();
        return;
      }

      setNote(signalNote, 'Subscribed. The next Signal lands on the first of the month.', 'is-ok');
      signalForm.reset();
      window.setTimeout(function () { setNote(signalNote, signalDefault, ''); }, 6000);
    });
  }

  function setNote(el, text, state) {
    el.textContent = text;
    el.className = 'form__note' + (state ? ' ' + state : '');
  }
})();
