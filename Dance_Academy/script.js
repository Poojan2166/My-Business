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
})();
