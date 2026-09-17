(function(){
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function(){
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ nav.classList.remove("is-open"); });
    });
  }

  // Lightbox for gallery pages
  var lightbox = document.querySelector("[data-lightbox]");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    document.querySelectorAll("[data-lightbox-trigger]").forEach(function(link){
      link.addEventListener("click", function(e){
        e.preventDefault();
        lbImg.src = link.getAttribute("href");
        lbImg.alt = link.querySelector("img") ? link.querySelector("img").alt : "";
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });
    function closeLB(){
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    closeBtn.addEventListener("click", closeLB);
    lightbox.addEventListener("click", function(e){ if (e.target === lightbox) closeLB(); });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeLB(); });
  }

  // Contact / enquiry form — no backend wired up; shows a confirmation state
  // and prepares a mailto fallback so enquiries are never lost.
  var form = document.querySelector("#enquiry-form");
  if (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var email = (data.get("email") || "").toString().trim();
      var message = (data.get("message") || "").toString().trim();

      if (!name || !email || !message) {
        status.textContent = "Please fill in your name, email and a short message.";
        status.className = "form-status err";
        return;
      }

      var subject = encodeURIComponent("Hall enquiry — " + name);
      var bodyLines = [
        "Name: " + name,
        "Email: " + email,
        "Phone: " + (data.get("phone") || "-"),
        "Event date: " + (data.get("date") || "-"),
        "Type of event: " + (data.get("type") || "-"),
        "",
        message
      ];
      var mailto = "mailto:hatfieldhalldag@gmail.com?subject=" + subject +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));

      status.textContent = "Thanks, " + name.split(" ")[0] + " — opening your email app to send this to the hall now.";
      status.className = "form-status ok";
      window.location.href = mailto;
      form.reset();
    });
  }

  // Footer year
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
