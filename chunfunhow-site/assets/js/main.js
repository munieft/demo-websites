/* Chun Fun How — site behaviour. Plain JavaScript, no dependencies. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var CFH = window.CFH || {};
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gbp = function (n) { return "£" + n.toFixed(2); };
  var wa = function (text) { return "https://wa.me/" + CFH.whatsapp + "?text=" + encodeURIComponent(text); };

  /* ---------- header: solid after scroll, hides on the way down */
  var head = $(".site-head"), lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    head.classList.toggle("solid", y > 40);
    var hide = y > 500 && y > lastY && !document.body.classList.contains("nav-open");
    head.classList.toggle("hide", hide);
    document.body.classList.toggle("head-shown", !hide);
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var burger = $(".burger");
  burger.addEventListener("click", function () {
    var open = document.body.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", open);
  });
  $$(".nav a").forEach(function (a) { a.addEventListener("click", function () { document.body.classList.remove("nav-open"); }); });

  /* ---------- reveal on scroll */
  if ("IntersectionObserver" in window && !calm) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    $$(".rv,.rv-clip").forEach(function (el) { io.observe(el); });
  } else { $$(".rv,.rv-clip").forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- videos play only while on screen */
  if ("IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && !calm) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); } else e.target.pause(); });
    }, { threshold: 0.25 });
    $$("video[data-auto]").forEach(function (v) { vio.observe(v); });
  }

  /* ---------- opening hours: live status in London time */
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function fmt(t) { var p = t.split(":"), h = +p[0], m = p[1]; return (h % 12 || 12) + (m === "00" ? "" : ":" + m) + (h < 12 ? "am" : "pm"); }
  function london() {
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
    return { day: DAYS.indexOf(o.weekday), mins: (+o.hour % 24) * 60 + +o.minute };
  }
  function mins(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function status() {
    if (!CFH.hours) return;
    var now = london(), h = CFH.hours[now.day], open = now.mins >= mins(h[0]) && now.mins < mins(h[1]), text;
    if (open) text = "Open now, until " + fmt(h[1]);
    else if (now.mins < mins(h[0])) text = "Opens today at " + fmt(h[0]);
    else { var n = (now.day + 1) % 7; text = "Closed now, opens " + DAYS[n] + " at " + fmt(CFH.hours[n][0]); }
    $$("[data-status]").forEach(function (el) { el.textContent = text; el.classList.add(open ? "open" : "closed"); el.classList.remove(open ? "closed" : "open"); });
    $$("[data-hours] tr").forEach(function (tr) { tr.classList.toggle("today", +tr.dataset.d === now.day); });
  }
  $$("[data-hours]").forEach(function (t) {
    var order = [1, 2, 3, 4, 5, 6, 0];
    t.innerHTML = order.map(function (d) { return '<tr data-d="' + d + '"><td>' + DAYS[d] + "</td><td>" + fmt(CFH.hours[d][0]) + " to " + fmt(CFH.hours[d][1]) + "</td></tr>"; }).join("");
  });
  status(); setInterval(status, 60000);

  /* ---------- hero petals: cherry blossom and osmanthus drifting down */
  var cv = $("#petals");
  if (cv && !calm) {
    var ctx = cv.getContext("2d"), W, H, dpr = Math.min(window.devicePixelRatio || 1, 2), P = [], mx = 0;
    var size = function () { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); window.addEventListener("resize", size);
    window.addEventListener("pointermove", function (e) { mx = (e.clientX / window.innerWidth - 0.5) * 2; });
    var make = function (top) {
      var gold = Math.random() < 0.3;
      return { x: Math.random() * W, y: top ? -20 : Math.random() * H, r: gold ? 2 + Math.random() * 2.5 : 5 + Math.random() * 8, vy: 0.35 + Math.random() * 0.9, vx: -0.3 + Math.random() * 0.6, a: Math.random() * 6.28, va: -0.02 + Math.random() * 0.04, sw: Math.random() * 6.28, gold: gold, o: 0.35 + Math.random() * 0.5 };
    };
    for (var i = 0; i < Math.min(46, Math.round(window.innerWidth / 26)); i++) P.push(make(false));
    var running = true;
    new IntersectionObserver(function (e) { running = e[0].isIntersecting; if (running) tick(); }).observe(cv);
    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      P.forEach(function (p, i) {
        p.sw += 0.012; p.y += p.vy; p.x += p.vx + Math.sin(p.sw) * 0.5 + mx * 0.6; p.a += p.va;
        if (p.y > H + 20 || p.x < -30 || p.x > W + 30) P[i] = make(true);
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.globalAlpha = p.o;
        if (p.gold) { ctx.fillStyle = "#E9C46A"; for (var k = 0; k < 4; k++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.ellipse(p.r * 0.7, 0, p.r * 0.7, p.r * 0.45, 0, 0, 6.28); ctx.fill(); } }
        else { ctx.scale(1, 0.55 + 0.45 * Math.cos(p.sw * 2)); ctx.fillStyle = "#F4B4C4"; ctx.beginPath(); ctx.moveTo(0, -p.r); ctx.bezierCurveTo(p.r, -p.r * 0.8, p.r * 0.9, p.r * 0.7, 0, p.r); ctx.bezierCurveTo(-p.r * 0.9, p.r * 0.7, -p.r, -p.r * 0.8, 0, -p.r); ctx.fill(); ctx.fillStyle = "#FCE3E9"; ctx.beginPath(); ctx.ellipse(0, p.r * 0.2, p.r * 0.25, p.r * 0.5, 0, 0, 6.28); ctx.fill(); }
        ctx.restore();
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------- top 8: list drives the picture, rotates on its own until touched */
  var t8 = $("[data-top8]");
  if (t8 && CFH.top8) {
    var list = $(".top8-list", t8), stage = $(".top8-stage .arch", t8), cur = -1, timer;
    CFH.top8.forEach(function (d, i) {
      var li = document.createElement("li");
      li.innerHTML = '<button type="button"><span class="n">' + (i + 1) + '</span><span class="t">' + d.en + '</span><span class="p">' + gbp(d.price) + '</span><span class="c">' + d.zh + "</span></button>";
      list.appendChild(li);
      var im = new Image(); im.src = "assets/img/" + d.img; im.alt = d.en; im.loading = i ? "lazy" : "eager"; stage.appendChild(im);
      var b = li.firstChild;
      b.addEventListener("mouseenter", function () { show(i, true); });
      b.addEventListener("focus", function () { show(i, true); });
      b.addEventListener("click", function () { show(i, true); });
    });
    var show = function (i, user) {
      if (user) clearInterval(timer);
      if (i === cur) return; cur = i;
      $$("li", list).forEach(function (li, k) { li.classList.toggle("on", k === i); });
      $$("img", stage).forEach(function (im, k) { im.classList.toggle("on", k === i); });
    };
    show(0);
    if (!calm) timer = setInterval(function () { show((cur + 1) % CFH.top8.length); }, 5000);
  }

  /* ---------- cup rail: drag to scroll + arrows */
  $$(".rail").forEach(function (rail) {
    var down = false, sx, sl, moved;
    rail.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    window.addEventListener("pointermove", function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) { moved = true; rail.classList.add("drag"); } rail.scrollLeft = sl - dx; });
    window.addEventListener("pointerup", function () { down = false; rail.classList.remove("drag"); });
    rail.addEventListener("click", function (e) { if (moved) e.preventDefault(); }, true);
    $$("[data-rail]").forEach(function (b) { b.addEventListener("click", function () { rail.scrollBy({ left: +b.dataset.rail * 340, behavior: "smooth" }); }); });
  });

  /* ---------- count up */
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, to = parseFloat(el.dataset.count), dec = (el.dataset.count.split(".")[1] || "").length, t0 = null;
        if (calm) { el.textContent = to.toFixed(dec); return; }
        var from = to > 1000 ? to - 40 : 0;
        requestAnimationFrame(function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1400), ez = 1 - Math.pow(1 - k, 3); el.textContent = (from + (to - from) * ez).toFixed(dec); if (k < 1) requestAnimationFrame(step); });
      });
    }, { threshold: 0.6 });
    $$("[data-count]").forEach(function (el) { cio.observe(el); });
  }

  /* ---------- menu page */
  var menuRoot = $("#menu-root");
  if (menuRoot) {
    var FL = { r: ["r", "店長推薦"], h: ["h", "Hot available"], c: ["c", "Caffeine free"], f: ["f", "Fixed sweetness"], v: ["", "Cheese foam suggested"] };
    menuRoot.innerHTML = CFH.categories.map(function (c) {
      return '<section class="mcat" id="' + c.id + '"><div class="mcat-h"><h3>' + c.en + '</h3><span class="han">' + c.zh + "</span>" + (c.note ? "<small>" + c.note + "</small>" : "") + "</div>" +
        c.items.map(function (m) {
          return '<div class="mi" data-flags="' + m.flags + '" data-q="' + (m.en + " " + m.zh + " " + c.en).toLowerCase() + '"><span class="nm">' + m.en + '</span><span class="pr">' + gbp(m.price) + '</span><span class="zh">' + m.zh + '</span><span class="tags">' +
            m.flags.split("").map(function (f) { return '<span class="tag ' + FL[f][0] + '">' + FL[f][1] + "</span>"; }).join("") + "</span></div>";
        }).join("") + "</section>";
    }).join("");
    $("#cats").innerHTML = CFH.categories.map(function (c) { return '<a href="#' + c.id + '">' + c.en + "</a>"; }).join("") + '<a href="#add-ons">Toppings</a><a href="#seasonal">Seasonal</a><a href="#food">Food</a><a href="#coffee">Coffee</a>';
    var q = $("#q"), active = {};
    var apply = function () {
      var term = q.value.trim().toLowerCase(), any = false;
      $$(".mcat", menuRoot).forEach(function (cat) {
        var shown = 0;
        $$(".mi", cat).forEach(function (mi) {
          var ok = (!term || mi.dataset.q.indexOf(term) > -1) && Object.keys(active).every(function (f) { return !active[f] || mi.dataset.flags.indexOf(f) > -1; });
          mi.hidden = !ok; if (ok) shown++;
        });
        cat.hidden = !shown; if (shown) any = true;
      });
      $("#empty").hidden = any;
    };
    q.addEventListener("input", apply);
    $$(".chip[data-f]").forEach(function (ch) { ch.addEventListener("click", function () { var on = ch.getAttribute("aria-pressed") !== "true"; ch.setAttribute("aria-pressed", on); active[ch.dataset.f] = on; apply(); }); });
    $("#clear").addEventListener("click", function () { q.value = ""; active = {}; $$(".chip[data-f]").forEach(function (c) { c.setAttribute("aria-pressed", "false"); }); apply(); });
    if ("IntersectionObserver" in window) {
      var links = $$("#cats a"), sio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { var on = a.getAttribute("href") === "#" + e.target.id; a.classList.toggle("on", on); if (on) a.parentNode.scrollTo({ left: a.offsetLeft - 40, behavior: "smooth" }); }); });
      }, { rootMargin: "-30% 0px -60% 0px" });
      $$(".mcat,#add-ons,#seasonal,#food,#coffee").forEach(function (s) { sio.observe(s); });
    }
    $$("[data-toppings]").forEach(function (ul) { ul.innerHTML = CFH.toppings.map(function (t) { return "<li><span>" + t.en + ' <span class="han">' + t.zh + "</span>" + (t.detail ? "<br><small>" + t.detail + "</small>" : "") + "</span><span>+" + (t.price < 1 ? Math.round(t.price * 100) + "p" : gbp(t.price)) + "</span></li>"; }).join(""); });
  }

  /* ---------- drink builder */
  var bd = $("#builder");
  if (bd) {
    var sel = $("#b-drink"), flat = [];
    sel.innerHTML = CFH.categories.map(function (c) { return '<optgroup label="' + c.en + " " + c.zh + '">' + c.items.map(function (m) { flat.push(m); return '<option value="' + (flat.length - 1) + '">' + m.en + " · " + gbp(m.price) + "</option>"; }).join("") + "</optgroup>"; }).join("");
    sel.value = 4;
    $("#b-top").innerHTML = CFH.toppings.map(function (t) { return '<label><input type="checkbox" name="top" value="' + t.id + '"><span>' + t.en + " " + t.zh + "</span></label>"; }).join("");
    $("#b-sweet").innerHTML = CFH.sweetness.map(function (s, i) { return '<label><input type="radio" name="sweet" value="' + i + '"' + (i === 2 ? " checked" : "") + "><span>" + s[0] + " " + s[1] + " " + s[2] + "%</span></label>"; }).join("");
    $("#b-ice").innerHTML = CFH.ice.map(function (s, i) { return '<label><input type="radio" name="ice" value="' + i + '"' + (i === 1 ? " checked" : "") + "><span>" + s[0] + " " + s[1] + "</span></label>"; }).join("");
    var draw = function () {
      var d = flat[+sel.value], tops = $$("input[name=top]:checked", bd).map(function (i) { return CFH.toppings.filter(function (t) { return t.id === i.value; })[0]; });
      var sw = CFH.sweetness[+$("input[name=sweet]:checked", bd).value], ic = CFH.ice[+$("input[name=ice]:checked", bd).value];
      var milk = $("input[name=milk]:checked", bd).value, fixed = d.flags.indexOf("f") > -1;
      var total = d.price + tops.reduce(function (a, t) { return a + t.price; }, 0) + (milk !== "none" ? 0.3 : 0);
      $("#b-total").textContent = gbp(total);
      $("#b-sweet").parentNode.style.opacity = fixed ? 0.45 : 1;
      var parts = [d.en + " (" + d.zh + ")"];
      if (tops.length) parts.push("with " + tops.map(function (t) { return t.en.toLowerCase(); }).join(", "));
      parts.push(fixed ? "fixed sweetness" : sw[0].toLowerCase() + " sugar " + sw[2] + "%"); parts.push(ic[0].toLowerCase());
      if (milk !== "none") parts.push(milk + " milk");
      var line = parts.join(", ");
      $("#b-sum").textContent = line + ".";
      $("#b-wa").href = wa("Hello Chun Fun How Victoria, I'd like to order for collection: " + line + ". Estimated total " + gbp(total) + ".");
      /* picture */
      $("#cv-liquid").setAttribute("fill", d.tone);
      var has = function (id) { return tops.some(function (t) { return t.id === id; }) || (id === "foam" && d.foam); };
      $$("#cupsvg .tp").forEach(function (g) { g.classList.toggle("off", !has(g.dataset.t)); });
      var foam = has("foam"); $("#cv-foam").style.opacity = foam ? 1 : 0;
      $$("#cupsvg .ice").forEach(function (r, i) { r.style.opacity = i < ic[2] ? 0.55 : 0; });
    };
    bd.addEventListener("change", draw); draw();
  }

  /* ---------- gallery filter + lightbox */
  var gal = $("#gallery");
  if (gal) {
    var items = $$(".gitem", gal), lb = $(".lb"), lbi = $("img", lb), lbc = $("p", lb), idx = 0, vis = items;
    $$(".gfilter .chip").forEach(function (ch) {
      ch.addEventListener("click", function () {
        $$(".gfilter .chip").forEach(function (c) { c.setAttribute("aria-pressed", c === ch); });
        var f = ch.dataset.g;
        items.forEach(function (it) { it.classList.toggle("out", f !== "all" && it.dataset.g.indexOf(f) < 0); });
        vis = items.filter(function (it) { return !it.classList.contains("out"); });
      });
    });
    var openAt = function (i) { idx = (i + vis.length) % vis.length; var im = $("img", vis[idx]); lbi.src = im.src; lbi.alt = im.alt; lbc.textContent = im.alt; lb.classList.add("open"); };
    items.forEach(function (it) { it.addEventListener("click", function () { openAt(vis.indexOf(it)); $(".x", lb).focus(); }); });
    var close = function () { lb.classList.remove("open"); if (vis[idx]) vis[idx].focus(); };
    $(".x", lb).addEventListener("click", close);
    $(".pv", lb).addEventListener("click", function () { openAt(idx - 1); });
    $(".nx", lb).addEventListener("click", function () { openAt(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) { if (!lb.classList.contains("open")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") openAt(idx - 1); if (e.key === "ArrowRight") openAt(idx + 1); });
  }

  /* ---------- enquiry forms open WhatsApp with the message written out */
  $$("form[data-wa]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var lines = [f.dataset.wa];
      $$("input,select,textarea", f).forEach(function (el) { if (el.value && el.name) lines.push(el.dataset.label + ": " + el.value); });
      window.open(wa(lines.join("\n")), "_blank", "noopener");
      var n = $(".note", f); if (n) n.textContent = "WhatsApp has opened with your message ready. Press send there to reach the shop.";
    });
  });

  /* ---------- gentle parallax on marked images */
  var par = $$("[data-par]");
  if (par.length && !calm) {
    var move = function () { par.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; el.style.transform = "translateY(" + ((r.top + r.height / 2 - innerHeight / 2) * -(+el.dataset.par)).toFixed(1) + "px)"; }); };
    window.addEventListener("scroll", move, { passive: true }); move();
  }
})();
