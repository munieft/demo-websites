/* Bouncy Billz — interactions
   Kept dependency-free and small. All effects respect reduced-motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- mobile nav ---- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- header shadow on scroll ---- */
  var onScroll = function () {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 8 ? "0 8px 24px -12px rgba(20,32,74,.4)" : "none";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && !reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- confetti burst ---- */
  var COLORS = ["#e63329", "#2cb5e8", "#fdb726", "#3aa655", "#1b3a8f"];
  function burst(x, y) {
    if (reduce) return;
    var n = 26;
    for (var i = 0; i < n; i++) {
      var d = document.createElement("span");
      d.className = "confetti-dot";
      var c = COLORS[i % COLORS.length];
      d.style.background = c;
      d.style.left = x + "px";
      d.style.top = y + "px";
      d.style.borderRadius = i % 3 === 0 ? "50%" : "3px";
      d.style.position = "fixed";
      d.style.zIndex = 9999;
      document.body.appendChild(d);
      var ang = Math.random() * Math.PI * 2;
      var vel = 60 + Math.random() * 120;
      var dx = Math.cos(ang) * vel;
      var dy = Math.sin(ang) * vel - 60;
      var rot = (Math.random() * 720 - 360) + "deg";
      d.animate(
        [
          { transform: "translate(0,0) rotate(0)", opacity: 1 },
          { transform: "translate(" + dx + "px," + (dy + 220) + "px) rotate(" + rot + ")", opacity: 0 }
        ],
        { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }
      ).onfinish = function () { this.effect.target.remove(); };
    }
  }
  document.querySelectorAll("[data-confetti]").forEach(function (btn) {
    btn.addEventListener("click", function (ev) {
      var r = btn.getBoundingClientRect();
      burst(ev.clientX || r.left + r.width / 2, ev.clientY || r.top + r.height / 2);
    });
  });

  /* ---- enquiry form (demo) ---- */
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var castle = (data.get("castle") || "").toString();
      var date = (data.get("date") || "").toString();
      var msg = (data.get("message") || "").toString();
      var email = (data.get("email") || "").toString();
      var phone = (data.get("phone") || "").toString();

      var alert = document.getElementById("form-alert");
      if (alert) {
        alert.textContent = "Thanks " + (name || "there") + "! Your enquiry is ready to send — your email app will open now.";
        alert.classList.add("show");
      }
      var body =
        "Hi Bouncy Billz,%0D%0A%0D%0A" +
        "I'd like to enquire about hire.%0D%0A%0D%0A" +
        "Name: " + encodeURIComponent(name) + "%0D%0A" +
        "Email: " + encodeURIComponent(email) + "%0D%0A" +
        "Phone: " + encodeURIComponent(phone) + "%0D%0A" +
        "Castle: " + encodeURIComponent(castle) + "%0D%0A" +
        "Date: " + encodeURIComponent(date) + "%0D%0A" +
        "Details: " + encodeURIComponent(msg) + "%0D%0A";
      var href = "mailto:bouncybillz@gmail.com?subject=" +
        encodeURIComponent("Bouncy castle enquiry — " + (name || "New enquiry")) + "&body=" + body;
      var r = form.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + 40);
      setTimeout(function () { window.location.href = href; }, 400);
      form.reset();
    });
  }

  /* ---- footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
