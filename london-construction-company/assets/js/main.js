(function () {
  "use strict";
  var D = window.LCC || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function waLink(msg) {
    var base = "https://wa.me/" + (D.business ? D.business.phoneRaw : "");
    return msg ? base + "?text=" + encodeURIComponent(msg) : base;
  }

  /* ---------- Header solid on scroll ---------- */
  var header = $("#siteHeader");
  function onScroll() {
    if (header) header.classList.toggle("is-solid", window.scrollY > 40);
    var tt = $("#toTop");
    if (tt) tt.classList.toggle("show", window.scrollY > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = $("#navToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$(".mobile-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Hero slideshow + staged reveal ---------- */
  var hero = $("#hero");
  if (hero) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add("is-ready"); });
    });
    var slides = $$(".hero-slide", hero);
    if (slides.length > 1 && !reduce) {
      var i = 0;
      setInterval(function () {
        slides[i].classList.remove("is-active");
        i = (i + 1) % slides.length;
        slides[i].classList.add("is-active");
      }, 5200);
    }
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$(".reveal");
  if (revealEls.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Render services list ---------- */
  var svcList = $("#svcList");
  if (svcList && D.services) {
    svcList.innerHTML = D.services.map(function (s, n) {
      var idx = String(n + 1).padStart(2, "0");
      return '<div class="svc-item reveal"><span class="idx">' + idx + '</span>' +
        '<h3>' + s.t + '</h3><p>' + s.d + '</p></div>';
    }).join("");
  }

  /* ---------- Render process steps ---------- */
  var stepsWrap = $("#steps");
  if (stepsWrap && D.process) {
    stepsWrap.innerHTML = D.process.map(function (p, n) {
      return '<div class="step reveal"><div class="step-no">' + String(n + 1).padStart(2, "0") + '</div>' +
        '<div class="step-b"><h3>' + p.t + '</h3><p>' + p.d + '</p></div>' +
        '<div class="step-tag">' + p.tag + '</div></div>';
    }).join("");
  }

  /* ---------- Render portfolio + filters + lightbox ---------- */
  var grid = $("#workGrid");
  if (grid && D.projects) {
    var limit = parseInt(grid.getAttribute("data-limit") || "0", 10);
    var list = limit ? D.projects.slice(0, limit) : D.projects;

    grid.innerHTML = list.map(function (p, n) {
      return '<figure class="work-card ' + (p.size || "") + ' reveal" data-cat="' + p.cat + '" data-idx="' + n + '">' +
        '<img src="' + p.img + '" alt="' + p.title + ' — ' + p.cat + ' by London Construction Company" loading="lazy" decoding="async">' +
        '<figcaption><span class="w-cat">' + p.cat + '</span><span class="w-title">' + p.title + '</span></figcaption>' +
        '<button class="w-open" aria-label="View ' + p.title + '"></button></figure>';
    }).join("");

    // filters
    var filterBar = $("#workFilters");
    if (filterBar) {
      var cats = ["All"].concat(D.projects.map(function (p) { return p.cat; }).filter(function (v, idx, a) { return a.indexOf(v) === idx; }));
      filterBar.innerHTML = cats.map(function (c, idx) {
        return '<button class="filter' + (idx === 0 ? " is-active" : "") + '" data-filter="' + c + '">' + c + '</button>';
      }).join("");
      filterBar.addEventListener("click", function (e) {
        var b = e.target.closest(".filter"); if (!b) return;
        $$(".filter", filterBar).forEach(function (f) { f.classList.remove("is-active"); });
        b.classList.add("is-active");
        var f = b.getAttribute("data-filter");
        $$(".work-card", grid).forEach(function (card) {
          var show = f === "All" || card.getAttribute("data-cat") === f;
          card.classList.toggle("hide", !show);
        });
      });
    }

    // re-observe newly created reveal cards
    $$(".reveal", grid).forEach(function (el) {
      if (reduce || !("IntersectionObserver" in window)) { el.classList.add("in"); return; }
      var o = new IntersectionObserver(function (ents, ob) {
        ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); ob.unobserve(en.target); } });
      }, { threshold: 0.1 });
      o.observe(el);
    });

    initLightbox(list, grid);
  }

  /* ---------- Lightbox ---------- */
  function initLightbox(items, gridEl) {
    var lb = $("#lightbox"); if (!lb) return;
    var img = $(".lb-img", lb), cat = $(".lb-cap .w-cat", lb),
        title = $(".lb-cap .w-title", lb), desc = $(".lb-cap .w-desc", lb),
        count = $(".lb-count", lb);
    var cur = 0;

    function visibleIndexes() {
      return $$(".work-card", gridEl).filter(function (c) { return !c.classList.contains("hide"); })
        .map(function (c) { return parseInt(c.getAttribute("data-idx"), 10); });
    }
    function show(idx) {
      var p = items[idx]; if (!p) return;
      cur = idx;
      img.style.opacity = 0;
      var pre = new Image();
      pre.onload = function () {
        img.src = p.img; img.alt = p.title;
        cat.textContent = p.cat; title.textContent = p.title; desc.textContent = p.desc || "";
        var vis = visibleIndexes();
        count.textContent = (vis.indexOf(idx) + 1) + " / " + vis.length;
        requestAnimationFrame(function () { img.style.opacity = 1; });
      };
      pre.src = p.img;
    }
    function open(idx) { show(idx); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { lb.classList.remove("open"); document.body.style.overflow = ""; }
    function step(dir) {
      var vis = visibleIndexes(); if (!vis.length) return;
      var at = vis.indexOf(cur); at = (at + dir + vis.length) % vis.length;
      show(vis[at]);
    }

    gridEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".w-open"); if (!btn) return;
      var card = btn.closest(".work-card");
      open(parseInt(card.getAttribute("data-idx"), 10));
    });
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-next", lb).addEventListener("click", function () { step(1); });
    $(".lb-prev", lb).addEventListener("click", function () { step(-1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
  }

  /* ---------- Testimonials rotator ---------- */
  var quotesWrap = $("#quotes");
  if (quotesWrap && D.testimonials) {
    quotesWrap.innerHTML = D.testimonials.map(function (t, n) {
      return '<figure class="quote' + (n === 0 ? " is-active" : "") + '"><span class="quote-mark">&ldquo;</span>' +
        '<blockquote>' + t.q + '</blockquote><cite>' + t.who + '</cite></figure>';
    }).join("");
    var dotsWrap = $("#quoteDots");
    var qs = $$(".quote", quotesWrap);
    if (dotsWrap && qs.length > 1) {
      dotsWrap.innerHTML = qs.map(function (_, n) {
        return '<button class="' + (n === 0 ? "is-active" : "") + '" aria-label="Testimonial ' + (n + 1) + '"></button>';
      }).join("");
      var dots = $$("button", dotsWrap), qi = 0, timer;
      function goto(n) {
        qs[qi].classList.remove("is-active"); dots[qi].classList.remove("is-active");
        qi = n;
        qs[qi].classList.add("is-active"); dots[qi].classList.add("is-active");
      }
      function auto() { if (reduce) return; timer = setInterval(function () { goto((qi + 1) % qs.length); }, 6000); }
      dots.forEach(function (d, n) { d.addEventListener("click", function () { clearInterval(timer); goto(n); auto(); }); });
      auto();
    }
  }

  /* ---------- Counters ---------- */
  var counters = $$("[data-count]");
  if (counters.length) {
    var seen = false;
    function run() {
      if (seen) return; seen = true;
      counters.forEach(function (el) {
        var target = parseFloat(el.getAttribute("data-count"));
        var dec = (el.getAttribute("data-count").indexOf(".") > -1) ? 1 : 0;
        if (reduce) { el.textContent = target.toFixed(dec); return; }
        var start = null, dur = 1500;
        function tick(ts) {
          if (!start) start = ts;
          var pr = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - pr, 3);
          el.textContent = (target * eased).toFixed(dec);
          if (pr < 1) requestAnimationFrame(tick); else el.textContent = target.toFixed(dec);
        }
        requestAnimationFrame(tick);
      });
    }
    var host = $("#proof");
    if (host && "IntersectionObserver" in window && !reduce) {
      var co = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { run(); co.disconnect(); } }, { threshold: 0.4 });
      co.observe(host);
    } else { run(); }
  }

  /* ---------- Showreel ---------- */
  var player = $("#reelPlayer");
  if (player) {
    var vid = $("video", player);
    $(".reel-play", player).addEventListener("click", function () {
      player.classList.add("playing");
      vid.controls = true;
      vid.play();
    });
  }

  /* ---------- Contact form → WhatsApp ---------- */
  var form = $("#enquiry");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = ($("#f-name", form) || {}).value || "";
      var type = ($("#f-type", form) || {}).value || "";
      var post = ($("#f-post", form) || {}).value || "";
      var msg = ($("#f-msg", form) || {}).value || "";
      var body = "Hello London Construction Company,%0A%0A" +
        "New enquiry from the website.%0A" +
        "Name: " + name + "%0A" +
        "Project: " + type + "%0A" +
        (post ? "Postcode: " + post + "%0A" : "") +
        "%0A" + msg;
      window.open("https://wa.me/" + D.business.phoneRaw + "?text=" + body.replace(/%0A/g, "%0A"), "_blank", "noopener");
      var note = $("#formStatus", form);
      if (note) note.textContent = "Opening WhatsApp with your enquiry — send the message to reach us.";
    });
  }

  /* ---------- Fill dynamic WhatsApp CTA links ---------- */
  $$("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa") || "Hello, I'd like to talk about a project.");
  });

  /* ---------- Footer year ---------- */
  var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- To top ---------- */
  var tt = $("#toTop");
  if (tt) tt.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
})();
