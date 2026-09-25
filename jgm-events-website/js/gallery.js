/* =========================================================
   GALLERY PAGE — filter + lightbox
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Filtering ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var items = document.querySelectorAll(".masonry-item");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");

      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");

      items.forEach(function (item) {
        var cats = (item.getAttribute("data-cat") || "").split(" ");
        var show = filter === "all" || cats.indexOf(filter) !== -1;
        item.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  var lbImg = lightbox.querySelector("img");
  var lbCaption = lightbox.querySelector(".lightbox__caption");
  var closeBtn = lightbox.querySelector(".lightbox__close");
  var prevBtn = lightbox.querySelector(".lightbox__prev");
  var nextBtn = lightbox.querySelector(".lightbox__next");

  var visibleItems = [];
  var currentIndex = 0;

  function refreshVisible() {
    visibleItems = Array.prototype.filter.call(items, function (item) {
      return !item.classList.contains("is-hidden");
    });
  }

  function openLightbox(item) {
    refreshVisible();
    currentIndex = visibleItems.indexOf(item);
    render();
    lightbox.classList.add("is-open");
    document.body.classList.add("nav-open");
  }

  function render() {
    var item = visibleItems[currentIndex];
    if (!item) return;
    var img = item.querySelector("img");
    lbImg.src = img.getAttribute("src");
    lbImg.alt = img.getAttribute("alt");
    lbCaption.textContent = img.getAttribute("alt");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  function step(dir) {
    if (!visibleItems.length) return;
    currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
    render();
  }

  items.forEach(function (item) {
    item.addEventListener("click", function () { openLightbox(item); });
  });
  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", function () { step(-1); });
  nextBtn.addEventListener("click", function () { step(1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
