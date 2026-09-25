/* =========================================================
   CATERING PAGE — cuisine tab switcher
   ========================================================= */
(function () {
  "use strict";
  var tabs = document.querySelectorAll(".cuisine-tab");
  var panels = document.querySelectorAll(".menu-panel");
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-target");

      tabs.forEach(function (t) { t.classList.remove("is-active"); });
      tab.classList.add("is-active");

      panels.forEach(function (panel) {
        panel.classList.toggle("is-active", panel.id === target);
      });
    });
  });
})();
