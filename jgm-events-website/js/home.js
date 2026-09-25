/* =========================================================
   HOME PAGE — hero slideshow
   ========================================================= */
(function () {
  "use strict";

  var slides = document.querySelectorAll(".hero__slide");
  var dotsWrap = document.getElementById("heroDots");
  if (!slides.length) return;

  var current = 0;
  var dots = [];

  slides.forEach(function (slide, i) {
    var dot = document.createElement("button");
    dot.setAttribute("aria-label", "Show slide " + (i + 1));
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", function () { goTo(i); });
    dotsWrap.appendChild(dot);
    dots.push(dot);
  });

  function goTo(index) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = index;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  window.setInterval(next, 5500);
})();
