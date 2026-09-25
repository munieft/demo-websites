/* =========================================================
   CONTACT PAGE — client-side validation + fake submit
   ========================================================= */
(function () {
  "use strict";

  var form = document.getElementById("enquiryForm");
  if (!form) return;
  var successPanel = document.getElementById("formSuccess");

  var validators = {
    name: function (v) { return v.trim().length >= 2 || "Please tell us your name."; },
    email: function (v) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v.trim()) || "Enter a valid email address.";
    },
    phone: function (v) {
      if (!v.trim()) return true; // optional
      var re = /^[0-9+()\s-]{7,}$/;
      return re.test(v.trim()) || "Enter a valid phone number.";
    },
    eventType: function (v) { return v !== "" || "Please choose an event type."; },
    message: function (v) { return v.trim().length >= 10 || "Tell us a little more about your event (10+ characters)."; }
  };

  function validateField(field) {
    var name = field.name;
    if (!validators[name]) return true;
    var result = validators[name](field.value);
    var wrap = field.closest(".field");
    var errorEl = wrap.querySelector(".field-error");

    if (result === true) {
      wrap.classList.remove("has-error");
      errorEl.textContent = "";
      return true;
    } else {
      wrap.classList.add("has-error");
      errorEl.textContent = result;
      return false;
    }
  }

  form.querySelectorAll("input, select, textarea").forEach(function (field) {
    field.addEventListener("blur", function () { validateField(field); });
    field.addEventListener("input", function () {
      if (field.closest(".field").classList.contains("has-error")) validateField(field);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fields = form.querySelectorAll("input[name], select[name], textarea[name]");
    var allValid = true;
    fields.forEach(function (field) {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
      if (firstError) firstError.focus();
      return;
    }

    // No backend is wired up — this simulates a successful submission.
    form.style.display = "none";
    successPanel.classList.add("is-visible");
  });
})();
