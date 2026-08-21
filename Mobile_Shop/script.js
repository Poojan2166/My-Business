/* =========================================================
   MobiStore — interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- product data (from the Zeplin screen) ---------- */
  var PRODUCTS = [
    {
      brand: "iPhone",
      title: "iPhone 15 Pro Max",
      spec: "256GB · Natural Titanium",
      rating: "4.8",
      count: "(4.6k)",
      price: "₹1,58,900",
      mrp: "₹1,59,900",
      emi: "EMI from ₹5,228/month",
      img: "Images/iPhone_15_Pro_Max.svg",
      flag: { text: "NEW", type: "new" }
    },
    {
      brand: "Samsung",
      title: "Samsung S24 Ultra",
      spec: "256GB · Titanium Black",
      rating: "4.7",
      count: "(4.6k)",
      price: "₹1,29,999",
      mrp: "₹1,47,999",
      emi: "EMI from ₹5,228/month",
      img: "Images/Samsung_S24_Ultra.svg",
      flag: { text: "12% OFF", type: "off" }
    },
    {
      brand: "OnePlus",
      title: "OnePlus 12 5G",
      spec: "256GB · Flowy Emerald",
      rating: "4.6",
      count: "(4.6k)",
      price: "₹64,999",
      mrp: "₹69,999",
      emi: "EMI from ₹5,228/month",
      img: "Images/OnePlus_12_5G.svg",
      flag: { text: "NEW", type: "new" }
    },
    {
      brand: "Vivo",
      title: "Vivo X100 Pro 5G",
      spec: "256GB · Asteroid Black",
      rating: "4.6",
      count: "(4.6k)",
      price: "₹59,999",
      mrp: "₹66,999",
      emi: "EMI from ₹5,228/month",
      img: "Images/Vivo_X100_Pro_5G.svg",
      flag: { text: "10% OFF", type: "off" }
    }
  ];

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- toast ---------- */
  var toastEl = $("#toast");
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-show"); }, 2200);
  }

  /* ---------- render product cards ---------- */
  function cardHTML(p, forceNew) {
    var flag = forceNew ? { text: "NEW", type: "new" } : p.flag;
    return (
      '<article class="pcard" data-brand="' + p.brand + '">' +
        '<div class="pcard__media">' +
          '<span class="pcard__flag pcard__flag--' + flag.type + '">' + flag.text + "</span>" +
          '<button class="pcard__wish" type="button" aria-label="Add to wishlist"><img src="Images/heart_icon.svg" alt=""></button>' +
          '<img src="' + p.img + '" alt="' + p.title + '">' +
        "</div>" +
        '<div class="pcard__body">' +
          '<h3 class="pcard__title">' + p.title + "</h3>" +
          '<p class="pcard__spec">' + p.spec + "</p>" +
          '<div class="pcard__rating">' +
            '<span class="pcard__score">' + p.rating + '<img src="Images/star.svg" alt=""></span>' +
            '<span class="pcard__count">' + p.count + "</span>" +
          "</div>" +
          '<p class="pcard__price"><strong>' + p.price + "</strong><s>" + p.mrp + "</s></p>" +
          '<p class="pcard__emi">' + p.emi + "</p>" +
          '<button class="pcard__cart" type="button"><img src="Images/add_to_cart.svg" alt=""> Add to Cart</button>' +
        "</div>" +
      "</article>"
    );
  }

  function render(target, list, forceNew) {
    if (!target) return;
    target.innerHTML = list.map(function (p) { return cardHTML(p, forceNew); }).join("");
  }

  render($("#trendingGrid"), PRODUCTS, false);
  render($("#launchGrid"), PRODUCTS, true);

  /* ---------- mobile nav ---------- */
  var navToggle = $("#navToggle");
  var mainNav = $("#mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- active nav link on scroll ---------- */
  var navLinks = $$(".nav__links a");
  var sections = navLinks
    .map(function (a) {
      var id = a.getAttribute("href");
      return id && id.length > 1 ? { link: a, el: document.querySelector(id) } : null;
    })
    .filter(function (s) { return s && s.el; });

  function syncNav() {
    var pos = window.scrollY + 200;
    var current = null;
    sections.forEach(function (s) {
      if (s.el.offsetTop <= pos) current = s.link;
    });
    navLinks.forEach(function (a) { a.classList.remove("is-active"); });
    (current || navLinks[0]).classList.add("is-active");
  }

  /* ---------- countdown ---------- */
  var cd = $("#countdown");
  if (cd) {
    var total = 15 * 3600 + 32 * 60 + 45;
    var out = {
      h: cd.querySelector('[data-cd="h"]'),
      m: cd.querySelector('[data-cd="m"]'),
      s: cd.querySelector('[data-cd="s"]')
    };
    var pad = function (n) { return n < 10 ? "0" + n : String(n); };
    setInterval(function () {
      total = total > 0 ? total - 1 : 24 * 3600 - 1;
      out.h.textContent = pad(Math.floor(total / 3600));
      out.m.textContent = pad(Math.floor((total % 3600) / 60));
      out.s.textContent = pad(total % 60);
    }, 1000);
  }

  /* ---------- brand filter (Latest Launches) ---------- */
  var filterRow = $("#filterRow");
  var launchGrid = $("#launchGrid");
  var emptyNote = $("#emptyNote");
  if (filterRow && launchGrid) {
    filterRow.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      $$(".filter", filterRow).forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");

      var brand = btn.dataset.brand;
      var shown = 0;
      $$(".pcard", launchGrid).forEach(function (card) {
        var match = brand === "all" || card.dataset.brand === brand;
        card.style.display = match ? "" : "none";
        if (match) shown++;
      });
      if (emptyNote) emptyNote.hidden = shown !== 0;
    });
  }

  /* ---------- cart + wishlist ---------- */
  var cartCount = $("#cartCount");
  var cart = 1;
  document.addEventListener("click", function (e) {
    var cartBtn = e.target.closest(".pcard__cart");
    if (cartBtn) {
      cart++;
      if (cartCount) cartCount.textContent = cart;
      var name = cartBtn.closest(".pcard").querySelector(".pcard__title").textContent;
      toast(name + " added to cart");
      return;
    }

    var wish = e.target.closest(".pcard__wish");
    if (wish) {
      var on = wish.classList.toggle("is-on");
      toast(on ? "Saved to wishlist" : "Removed from wishlist");
      return;
    }

    var copy = e.target.closest(".chip--copy");
    if (copy) {
      var code = copy.dataset.code;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(function () { toast("Coupon " + code + " copied"); });
      } else {
        toast("Coupon code: " + code);
      }
    }
  });

  /* ---------- FAQ: only one open at a time ---------- */
  var faqs = $$(".faq");
  faqs.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      faqs.forEach(function (other) { if (other !== d) other.open = false; });
    });
  });

  /* ---------- newsletter ---------- */
  var newsForm = $("#newsForm");
  if (newsForm) {
    var input = $("#newsEmail");
    var msg = $("#newsMsg");
    newsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = input.value.trim();
      var valid = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value);
      input.classList.toggle("is-error", !valid);
      msg.classList.toggle("is-error", !valid);
      msg.textContent = valid ? "Thanks! You're subscribed." : "Please enter a valid email address.";
      if (valid) {
        input.value = "";
        toast("Subscribed to MobiStore offers");
      }
    });
  }

  /* ---------- back to top ---------- */
  var toTop = $("#toTop");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      if (toTop) toTop.classList.toggle("is-show", window.scrollY > 600);
      syncNav();
      ticking = false;
    });
  }, { passive: true });

  syncNav();
})();
