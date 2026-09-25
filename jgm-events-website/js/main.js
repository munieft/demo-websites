/* =========================================================
   JGM EVENTS — SHARED SITE BEHAVIOUR
   Runs on every page: header state, mobile nav, scroll
   reveals, animated counters, back-to-top.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");

    var toTop = document.querySelector(".to-top");
    if (toTop) {
      if (window.scrollY > 640) toTop.classList.add("is-visible");
      else toTop.classList.remove("is-visible");
    }
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  var scrim = document.querySelector(".nav-scrim");

  function closeNav() {
    if (!toggle) return;
    toggle.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    if (scrim) scrim.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  function openNav() {
    toggle.classList.add("is-open");
    navLinks.classList.add("is-open");
    if (scrim) scrim.classList.add("is-open");
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
  }
  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      toggle.classList.contains("is-open") ? closeNav() : openNav();
    });
    if (scrim) scrim.addEventListener("click", closeNav);
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- Mark active nav link ---------- */
  var here = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a[href]").forEach(function (a) {
    var target = a.getAttribute("href").split("/").pop();
    if (target === here || (here === "" && target === "index.html")) {
      a.classList.add("is-active");
    }
  });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count-to]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count-to"));
    var decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
    var duration = 1600;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = decimals ? value.toFixed(decimals) : Math.round(value);
      if (progress < 1) window.requestAnimationFrame(step);
      else el.textContent = decimals ? target.toFixed(decimals) : target;
    }
    window.requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var ioCount = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            ioCount.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { ioCount.observe(el); });
  }

  /* ---------- Back to top ---------- */
  var toTopBtn = document.querySelector(".to-top");
  if (toTopBtn) {
    toTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
