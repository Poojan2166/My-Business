/* ============================================================
   AXONELITE / Ironhouse Fitness Center — interactions
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
    morning: [
      { time: "05:30 – 06:30", name: "Strength", coach: "Coach Marcus" },
      { time: "06:45 – 07:45", name: "HIIT", coach: "Coach Sofia" },
      { time: "08:00 – 09:00", name: "CrossFit", coach: "Coach Jake" }
    ],
    evening: [
      { time: "17:30 – 18:30", name: "Bodybuilding", coach: "Coach Marcus" },
      { time: "18:45 – 19:45", name: "Functional Training", coach: "Coach Priya" },
      { time: "20:00 – 21:00", name: "Cardio", coach: "Coach Jake" }
    ],
    weekend: [
      { time: "07:00 – 08:30", name: "Open Gym Strength", coach: "Coach Sofia" },
      { time: "09:00 – 10:00", name: "CrossFit Team WOD", coach: "Coach Jake" },
      { time: "10:30 – 11:30", name: "Mobility & Recovery", coach: "Coach Priya" }
    ],
    womens: [
      { time: "06:00 – 07:00", name: "Women's Strength", coach: "Coach Sofia" },
      { time: "10:00 – 11:00", name: "Fat Loss Circuit", coach: "Coach Priya" },
      { time: "16:00 – 17:00", name: "Personal Training", coach: "Coach Sofia" }
    ]
  };

  var tabs = document.getElementById("tabs");
  var trows = document.getElementById("trows");

  function renderSchedule(key) {
    var rows = SCHEDULE[key] || [];
    if (!rows.length) {
      trows.innerHTML =
        '<p class="timetable__empty">No sessions listed for this track yet.</p>';
      return;
    }
    trows.innerHTML = rows
      .map(function (r) {
        return (
          '<div class="trow">' +
          '<span class="trow__time">' + r.time + "</span>" +
          '<span class="trow__name">' + r.name + "</span>" +
          '<span class="trow__coach">' + r.coach + "</span>" +
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

  renderSchedule("morning");

  /* ---------- BMI calculator ---------- */
  var bmiForm = document.getElementById("bmiForm");
  var bmiOut = document.getElementById("bmiOut");

  var BMI_ADVICE = [
    { max: 18.5, label: "Underweight", plan: "Strength Training" },
    { max: 25, label: "Healthy range", plan: "Functional Training" },
    { max: 30, label: "Overweight", plan: "Fat Loss" },
    { max: Infinity, label: "Obese", plan: "HIIT + Nutrition Guidance" }
  ];

  bmiForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var w = parseFloat(document.getElementById("bmiWeight").value);
    var h = parseFloat(document.getElementById("bmiHeight").value);

    if (!w || !h || w < 20 || w > 400 || h < 80 || h > 260) {
      bmiOut.innerHTML = "Enter a weight in kg and a height in cm.";
      return;
    }

    var bmi = w / Math.pow(h / 100, 2);
    var band = BMI_ADVICE.find(function (b) {
      return bmi < b.max;
    });

    bmiOut.innerHTML =
      "Your BMI is <b>" + bmi.toFixed(1) + "</b> · " + band.label +
      ". We recommend the <b>" + band.plan + "</b> program.";
  });

  /* ---------- Transformation stories ---------- */
  var STORIES = [
    {
      name: "Alex M.",
      stats: "-14kg · +8kg lean mass · 16 weeks",
      quote:
        '"I came in wanting to move better. I left with a completely rebuilt physique and habits I\'ll carry for life. The coaches didn\'t just train me — they held me accountable to the person I said I wanted to be."'
    },
    {
      name: "Priya R.",
      stats: "-9kg · first pull-up · 12 weeks",
      quote:
        '"I had never touched a barbell before. Twelve weeks later I was deadlifting my bodyweight and sleeping better than I had in years. The programming made it feel inevitable."'
    },
    {
      name: "Daniel K.",
      stats: "+11kg lean mass · 24 weeks",
      quote:
        '"Six months of periodised training and honest nutrition coaching. No shortcuts, no fads — just a plan that adjusted every week until the results showed up."'
    }
  ];

  var storyIndex = document.getElementById("storyIndex");
  var storyName = document.getElementById("storyName");
  var storyStats = document.getElementById("storyStats");
  var storyQuote = document.getElementById("storyQuote");
  var storyNav = document.getElementById("storyNav");

  function renderStory(i) {
    var s = STORIES[i];
    storyIndex.textContent = "Story 0" + (i + 1);
    storyName.textContent = s.name;
    storyStats.textContent = s.stats;
    storyQuote.textContent = s.quote;

    storyNav.querySelectorAll(".story__dot").forEach(function (d, di) {
      var active = di === i;
      d.classList.toggle("is-active", active);
      d.setAttribute("aria-selected", String(active));
    });
  }

  storyNav.addEventListener("click", function (e) {
    var dot = e.target.closest(".story__dot");
    if (!dot) return;
    renderStory(parseInt(dot.dataset.story, 10));
  });

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
      var valid =
        input.value.trim() !== "" &&
        (input.type !== "email" ||
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
      field.classList.toggle("is-bad", !valid);
      if (!valid) ok = false;
    });

    if (!ok) {
      note.textContent = "Please add your name and a valid email.";
      return;
    }

    note.textContent = "Thank you — a coach will reply within a few hours.";
    form.reset();
  });

  /* ---------- Newsletter ---------- */
  var newsForm = document.getElementById("newsForm");
  var newsEmail = document.getElementById("newsEmail");
  var newsNote = document.getElementById("newsNote");

  newsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsEmail.value)) {
      newsNote.textContent = "Please enter a valid email address.";
      return;
    }
    newsNote.textContent = "You're in. Look out for Monday's session notes.";
    newsForm.reset();
  });

  /* ---------- Scroll reveal ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealables = document.querySelectorAll(".reveal");

  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) {
      el.classList.add("is-in");
    });
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
    revealables.forEach(function (el) {
      io.observe(el);
    });
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
      el.textContent =
        Math.round(target * eased).toLocaleString("en-IN") + suffix;
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
    counters.forEach(function (el) {
      cio.observe(el);
    });
  } else {
    counters.forEach(runCount);
  }
})();
