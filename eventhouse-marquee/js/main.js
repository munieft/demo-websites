/* =========================================================
   Eventhouse Marquee — main.js
   Header, mobile nav, scroll reveal, counters, slider,
   FAQ, contact form -> WhatsApp
   ========================================================= */
(function () {
  "use strict";

  var doc = document;
  var body = doc.body;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header solid on scroll ---------- */
  var header = doc.querySelector(".site-header");
  var hasHero = doc.querySelector(".hero, .pagehero");
  function onScroll() {
    if (!header) return;
    var solid = window.scrollY > (hasHero ? 60 : 10);
    header.classList.toggle("is-solid", solid);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var burger = doc.querySelector(".burger");
  var backdrop = doc.querySelector(".nav-backdrop");
  function closeNav() { body.classList.remove("nav-open"); if (burger) burger.setAttribute("aria-expanded", "false"); }
  if (burger) {
    burger.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  if (backdrop) backdrop.addEventListener("click", closeNav);
  doc.querySelectorAll(".nav a").forEach(function (a) { a.addEventListener("click", closeNav); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });

  /* ---------- Scroll reveal ---------- */
  var revealEls = doc.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Counters ---------- */
  var counters = doc.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var dur = 1600, start = null;
    if (reduce) { el.textContent = prefix + target.toFixed(decimals) + suffix; return; }
    function tick(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Testimonial slider ---------- */
  var quoteWrap = doc.querySelector(".quotes");
  if (quoteWrap) {
    var quotes = quoteWrap.querySelectorAll(".quote");
    var dotsWrap = quoteWrap.querySelector(".quotes__dots");
    var idx = 0, timer;
    quotes.forEach(function (q, i) {
      var b = doc.createElement("button");
      b.setAttribute("aria-label", "Show testimonial " + (i + 1));
      b.addEventListener("click", function () { go(i); rest(); });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll("button");
    function go(n) {
      quotes[idx].classList.remove("is-active");
      dots[idx].classList.remove("is-active");
      idx = (n + quotes.length) % quotes.length;
      quotes[idx].classList.add("is-active");
      dots[idx].classList.add("is-active");
    }
    function rest() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 6000); }
    go(0); if (!reduce) rest();
    quoteWrap.addEventListener("mouseenter", function () { clearInterval(timer); });
    quoteWrap.addEventListener("mouseleave", rest);
  }

  /* ---------- FAQ accordion ---------- */
  doc.querySelectorAll(".faq__q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".faq__item");
      var ans = item.querySelector(".faq__a");
      var open = item.classList.toggle("is-open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      ans.style.maxHeight = open ? ans.scrollHeight + "px" : null;
    });
  });

  /* ---------- Parallax bands ---------- */
  var parallax = doc.querySelectorAll("[data-parallax]");
  if (parallax.length && !reduce) {
    window.addEventListener("scroll", function () {
      parallax.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        var offset = (r.top - window.innerHeight / 2) * speed;
        var img = el.querySelector("img");
        if (img) img.style.transform = "translateY(" + offset + "px) scale(1.15)";
      });
    }, { passive: true });
  }

  /* ---------- Contact form -> WhatsApp ---------- */
  var form = doc.querySelector("#enquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var msg =
        "New marquee enquiry%0A" +
        "----------------------%0A" +
        "Name: " + (f.name.value || "-") + "%0A" +
        "Phone: " + (f.phone.value || "-") + "%0A" +
        (f.email && f.email.value ? "Email: " + f.email.value + "%0A" : "") +
        "Event type: " + (f.event.value || "-") + "%0A" +
        "Event date: " + (f.date.value || "-") + "%0A" +
        "Marquee size: " + (f.size.value || "-") + "%0A" +
        "Postcode / area: " + (f.postcode.value || "-") + "%0A" +
        "Details: " + (f.message.value || "-");
      var url = "https://wa.me/" + window.EVEM_CONFIG.whatsapp + "?text=" + msg;
      window.open(url, "_blank", "noopener");
      var ok = form.querySelector(".form__ok");
      if (ok) { ok.classList.add("show"); }
      form.reset();
    });
  }

  /* ---------- Year in footer handled by config.js ---------- */
})();
