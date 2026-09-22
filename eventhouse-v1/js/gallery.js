/* =========================================================
   Eventhouse Marquee — gallery.js
   Category filtering + accessible lightbox
   ========================================================= */
(function () {
  "use strict";
  var grid = document.querySelector("[data-gallery]");
  if (!grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll(".m-item"));
  var filterBtns = document.querySelectorAll(".filters button");

  /* ---- Filter ---- */
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var cat = btn.getAttribute("data-filter");
      items.forEach(function (it) {
        var show = cat === "all" || it.getAttribute("data-cat").indexOf(cat) > -1;
        it.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---- Lightbox ---- */
  var lb = document.createElement("div");
  lb.className = "lb";
  lb.innerHTML =
    '<button class="lb__close" aria-label="Close">' + icon("close") + '</button>' +
    '<button class="lb__nav prev" aria-label="Previous">' + icon("prev") + '</button>' +
    '<img alt="Marquee hire photo">' +
    '<button class="lb__nav next" aria-label="Next">' + icon("next") + '</button>' +
    '<div class="lb__count"></div>';
  document.body.appendChild(lb);

  var lbImg = lb.querySelector("img");
  var lbCount = lb.querySelector(".lb__count");
  var current = 0;

  function visibleItems() {
    return items.filter(function (it) { return !it.classList.contains("is-hidden"); });
  }
  function open(item) {
    var vis = visibleItems();
    current = vis.indexOf(item);
    render(vis);
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function render(vis) {
    var it = vis[current];
    var full = it.getAttribute("data-full");
    lbImg.src = full;
    lbImg.alt = it.getAttribute("data-alt") || "Marquee hire photo";
    lbCount.textContent = (current + 1) + " / " + vis.length;
  }
  function move(dir) {
    var vis = visibleItems();
    current = (current + dir + vis.length) % vis.length;
    render(vis);
  }
  function close() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  items.forEach(function (it) {
    it.addEventListener("click", function () { open(it); });
  });
  lb.querySelector(".lb__close").addEventListener("click", close);
  lb.querySelector(".prev").addEventListener("click", function () { move(-1); });
  lb.querySelector(".next").addEventListener("click", function () { move(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
  });

  /* swipe */
  var sx = 0;
  lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1);
  }, { passive: true });

  function icon(t) {
    if (t === "close") return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    if (t === "prev") return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
    return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
  }
})();
