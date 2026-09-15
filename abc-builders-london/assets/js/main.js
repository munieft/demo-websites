/* ABC Builders — shared interactions */
(function () {
  "use strict";

  /* --- Header scroll state --- */
  var head = document.querySelector(".site-head");
  var onScroll = function () {
    if (!head) return;
    if (window.scrollY > 40) head.classList.add("scrolled");
    else head.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- Mobile drawer --- */
  var burger = document.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
    document.querySelectorAll(".drawer a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* --- Reveal on scroll --- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          var d = el.getAttribute("data-delay");
          if (d) el.style.transitionDelay = d + "ms";
          el.classList.add("in");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* --- Count up stats --- */
  var stats = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && stats.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1400, start = null;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target % 1 !== 0 ? (target * eased).toFixed(1) : Math.round(target * eased);
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        so.unobserve(el);
      });
    }, { threshold: 0.6 });
    stats.forEach(function (el) { so.observe(el); });
  }

  /* --- Gallery filter (work page) --- */
  var filterBtns = document.querySelectorAll("[data-filter]");
  var items = document.querySelectorAll("[data-cat]");
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        items.forEach(function (it) {
          var show = f === "all" || it.getAttribute("data-cat") === f;
          it.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* --- Lightbox --- */
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lb__cap");
    var triggers = document.querySelectorAll("[data-lb]");
    var list = Array.prototype.slice.call(triggers);
    var idx = 0;
    var open = function (i) {
      idx = i;
      var t = list[idx];
      lbImg.src = t.getAttribute("data-lb");
      lbCap.textContent = t.getAttribute("data-cap") || "";
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    var close = function () {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    };
    var nav = function (dir) {
      idx = (idx + dir + list.length) % list.length;
      open(idx);
    };
    list.forEach(function (t, i) {
      t.addEventListener("click", function (e) { e.preventDefault(); open(i); });
    });
    lb.querySelector(".lb__close").addEventListener("click", close);
    lb.querySelector(".lb__prev").addEventListener("click", function () { nav(-1); });
    lb.querySelector(".lb__next").addEventListener("click", function () { nav(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") nav(1);
      if (e.key === "ArrowLeft") nav(-1);
    });
  }

  /* --- Contact form (front-end only demo) --- */
  var form = document.getElementById("enquiry");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-note");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.querySelector("fieldset").disabled = true;
      note.textContent = "Thanks — your enquiry is ready to send. Connect this form to email or WhatsApp to go live.";
      note.classList.add("show");
    });
  }
})();
