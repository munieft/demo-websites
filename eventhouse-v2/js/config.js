/* =========================================================
   Eventhouse Marquee — config.js
   ONE place for your business details. WhatsApp buttons,
   Instagram links, address, rating & the contact form all
   read from here.
   >>> ADD YOUR WHATSAPP NUMBER BELOW.
   ========================================================= */
window.EVEM_CONFIG = {
  name: "Eventhouse Marquee",
  legalName: "MARQUEE HIRE by eventhouse.marquee",

  /* WhatsApp — international format, DIGITS ONLY (no +, spaces or leading 0).
     UK example 07123 456789 -> "447123456789".
     Until set, the buttons open a link that just says the number isn't on
     WhatsApp — they will NOT dial anyone. */
  whatsapp: "44XXXXXXXXXX",

  instagram: "https://www.instagram.com/eventhouse.marquee",
  email: "",

  address: "Redbridge Enterprise Centre, 3a Granton Rd, Ilford IG3 9XL, United Kingdom",
  lat: 51.5634554,
  lng: 0.1081796,
  mapsUrl: "https://www.google.com/maps/place/MARQUEE+HIRE+by+eventhouse.marquee/@51.5634554,0.1081796,17z/data=!3m1!4b1!4m6!3m5!1s0x47d8a5712e404543:0x653481a17be3b91c!8m2!3d51.5634554!4d0.1081796",

  rating: "4.9",
  reviews: "34",
  waMessage: "Hi Eventhouse Marquee! I'd like to enquire about hiring a marquee for my event."
};

(function () {
  var c = window.EVEM_CONFIG;
  function wa(msg){ return "https://wa.me/" + c.whatsapp + "?text=" + encodeURIComponent(msg || c.waMessage); }
  window.EVEM_WA = wa;
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-wa]").forEach(function (el) {
      var m = el.getAttribute("data-wa");
      el.href = wa(m && m.length ? m : null); el.target = "_blank"; el.rel = "noopener";
    });
    document.querySelectorAll("[data-ig]").forEach(function (el) { el.href = c.instagram; el.target = "_blank"; el.rel = "noopener"; });
    document.querySelectorAll("[data-maps]").forEach(function (el) { el.href = c.mapsUrl; el.target = "_blank"; el.rel = "noopener"; });
    document.querySelectorAll("[data-email]").forEach(function (el) { if (c.email){ el.href = "mailto:" + c.email; el.textContent = c.email; } });
    document.querySelectorAll("[data-bind]").forEach(function (el) { var k = el.getAttribute("data-bind"); if (c[k] != null) el.textContent = c[k]; });
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  });
})();
