/* =========================================================
   Eventhouse Marquee — config.js
   ---------------------------------------------------------
   ONE place to edit your business details. Everything on the
   site (WhatsApp buttons, Instagram links, address, rating,
   footer, contact form) reads from here.

   >>> IMPORTANT: add your WhatsApp number below (see WHATSAPP).
   ========================================================= */

window.EVEM_CONFIG = {
  name: "Eventhouse Marquee",
  legalName: "MARQUEE HIRE by eventhouse.marquee",
  tagline: "Budget-friendly marquees for unforgettable events",

  /* WhatsApp — international format, DIGITS ONLY (no +, spaces or 0).
     UK example: 44 7123 456789  ->  "447123456789"
     Until you set this, WhatsApp buttons open a link that will simply
     say the number isn't on WhatsApp (it will not dial anyone).       */
  whatsapp: "44XXXXXXXXXX",

  /* Public channels */
  instagram: "https://www.instagram.com/eventhouse.marquee",
  email: "", /* add an email if you have one, e.g. "hello@eventhousemarquee.co.uk" */

  /* Location */
  address: "Redbridge Enterprise Centre, 3a Granton Rd, Ilford IG3 9XL, United Kingdom",
  addressShort: "3a Granton Rd, Ilford IG3 9XL",
  lat: 51.5634554,
  lng: 0.1081796,
  mapsUrl: "https://www.google.com/maps/place/MARQUEE+HIRE+by+eventhouse.marquee/@51.5634554,0.1081796,17z/data=!3m1!4b1!4m6!3m5!1s0x47d8a5712e404543:0x653481a17be3b91c!8m2!3d51.5634554!4d0.1081796",

  /* Google reputation */
  rating: "4.9",
  reviews: "34",

  /* Service area */
  areas: "London & the Home Counties",

  /* Default WhatsApp message */
  waMessage: "Hi Eventhouse Marquee! I'd like to enquire about hiring a marquee for my event."
};

/* ---- Wire everything up ---- */
(function () {
  var c = window.EVEM_CONFIG;

  function waLink(msg) {
    var text = encodeURIComponent(msg || c.waMessage);
    return "https://wa.me/" + c.whatsapp + "?text=" + text;
  }
  window.EVEM_WA = waLink;

  document.addEventListener("DOMContentLoaded", function () {
    /* WhatsApp links */
    document.querySelectorAll("[data-wa]").forEach(function (el) {
      var custom = el.getAttribute("data-wa");
      el.setAttribute("href", waLink(custom && custom.length ? custom : null));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
    /* Instagram links */
    document.querySelectorAll("[data-ig]").forEach(function (el) {
      el.setAttribute("href", c.instagram);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
    /* Maps links */
    document.querySelectorAll("[data-maps]").forEach(function (el) {
      el.setAttribute("href", c.mapsUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
    /* Email links */
    document.querySelectorAll("[data-email]").forEach(function (el) {
      if (c.email) { el.setAttribute("href", "mailto:" + c.email); el.textContent = c.email; }
    });
    /* Text bindings */
    document.querySelectorAll("[data-bind]").forEach(function (el) {
      var key = el.getAttribute("data-bind");
      if (c[key] != null) el.textContent = c[key];
    });
    /* Year */
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  });
})();
