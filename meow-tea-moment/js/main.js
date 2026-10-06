/* Meow Tea Moment — page behaviour. Plain JavaScript, no dependencies. */
(function () {
  "use strict";
  var M = window.MEOW;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var money = function (n) { return "£" + n.toFixed(2); };
  var menuPrice = function (n) { return "£" + n.toFixed(1); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  document.documentElement.classList.add("js");

  var ALL = [];
  M.categories.forEach(function (c) {
    c.items.forEach(function (it) { ALL.push({ en: it[0], zh: it[1], price: it[2], cat: c }); });
  });

  /* ---------- toast ---------- */
  var toastEl = $("#toast"), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2600);
  }
  function copyText(text, okMsg) {
    var done = function () { toast(okMsg); };
    var fail = function () { toast(text); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail);
      else fail();
    } catch (e) { fail(); }
  }

  /* ---------- header ---------- */
  var top = $("#top"), burger = $("#burger"), nav = $("#nav");
  function onScroll() { top.classList.toggle("is-stuck", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- wooden tiles ---------- */
  var tileN = 0;
  $$(".tiles__row").forEach(function (row) {
    row.getAttribute("data-word").split("").forEach(function (ch) {
      var s = document.createElement("span");
      s.setAttribute("aria-hidden", "true");
      if (ch === " ") { s.className = "tile--gap"; }
      else {
        s.className = "tile"; s.textContent = ch;
        s.style.setProperty("--rot", (((tileN * 37) % 7) - 3) * 0.9 + "deg");
        s.style.setProperty("--d", (0.08 + tileN * 0.055) + "s");
        tileN++;
      }
      row.appendChild(s);
    });
  });

  /* ---------- ticker ---------- */
  (function () {
    var picks = ["Pearl Milk Tea", "Creamy Uji Matcha", "Mango Green Tea", "Brown Sugar Pearl Milk Tea", "Taro Milkshake",
      "Uji Hojicha", "Winter Melon Lemon", "Lychee Aloe Smoothie", "Rose Milk Tea", "Meow Coffee with Milk Tea"];
    var html = picks.map(function (n) {
      var it = ALL.filter(function (a) { return a.en === n; })[0];
      return it ? "<span>" + esc(it.en) + "<i lang=\"zh-Hant\">" + esc(it.zh) + "</i></span>" : "";
    }).join("");
    $("#ticker").innerHTML = html + html;
  })();

  /* ---------- floating pearls ---------- */
  (function () {
    var cv = $("#pearls"); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d"), W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), ps = [], raf, on = true, mx = -999, my = -999;
    var cols = ["#3b2219", "#3b2219", "#5b3324", "#ec6a56", "#1c4391", "#fff3e6"];
    function size() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(38, W / 34)); ps = [];
      for (var i = 0; i < n; i++) ps.push(mk(true));
    }
    function mk(any) {
      var r = 5 + Math.random() * 11;
      return { x: Math.random() * W, y: any ? Math.random() * H : H + r + Math.random() * 60, r: r, vy: 0.18 + Math.random() * 0.5, ph: Math.random() * 6.28, c: cols[(Math.random() * cols.length) | 0], vx: 0, a: 0.1 + Math.random() * 0.22 };
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        var dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 12000) { var f = (12000 - d2) / 12000; p.vx += (dx / Math.sqrt(d2 + 1)) * f * 0.6; p.y += (dy / Math.sqrt(d2 + 1)) * f * 1.2; }
        p.vx *= 0.94; p.y -= p.vy; p.x += Math.sin(t / 1400 + p.ph) * 0.3 + p.vx;
        if (p.y < -p.r - 10) ps[i] = p = mk(false);
        ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = p.a * 1.6; ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(p.x - p.r * 0.32, p.y - p.r * 0.32, p.r * 0.22, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (on && !reduce) raf = requestAnimationFrame(draw);
    }
    size(); draw(0);
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(size, 150); });
    cv.parentNode.addEventListener("pointermove", function (e) { var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    cv.parentNode.addEventListener("pointerleave", function () { mx = my = -999; });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) {
      var was = on; on = en[0].isIntersecting; if (on && !was && !reduce) raf = requestAnimationFrame(draw);
    }).observe(cv);
  })();

  /* ---------- rating count-up ---------- */
  (function () {
    var el = $("#ratingNum"); if (reduce) return;
    var t0 = performance.now();
    (function tick(t) {
      var k = Math.min(1, (t - t0) / 1400); el.textContent = (4.3 * (1 - Math.pow(1 - k, 3))).toFixed(1);
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  })();

  /* ---------- opening hours + closures ---------- */
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function londonNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      return { day: DAYS.indexOf(o.weekday), mins: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) { var d = new Date(); return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() }; }
  }
  function toMins(s) { var a = s.split(":"); return a[0] * 60 + +a[1]; }
  function fmt(s) { var a = s.split(":"), h = +a[0]; return (h % 12 || 12) + (a[1] !== "00" ? ":" + a[1] : "") + (h < 12 ? "am" : "pm"); }
  function activeClosure() {
    var now = Date.now();
    return (M.closures || []).filter(function (c) { return now >= Date.parse(c.from) && now < Date.parse(c.until); })[0];
  }
  function renderHours() {
    var n = londonNow(), closure = activeClosure(), tb = $("#hours tbody"), rows = "";
    [1, 2, 3, 4, 5, 6, 0].forEach(function (d) {
      var h = M.hours[d];
      rows += "<tr" + (d === n.day ? " class=\"is-today\"" : "") + "><td>" + DAYS[d] + "</td><td>" + (h ? fmt(h[0]) + " to " + fmt(h[1]) : "Closed") + "</td></tr>";
    });
    tb.innerHTML = rows;
    var msg, open = false, h = M.hours[n.day];
    if (closure) { msg = "On a short break right now"; }
    else if (h && n.mins >= toMins(h[0]) && n.mins < toMins(h[1])) { open = true; msg = "Open now, until " + fmt(h[1]); }
    else if (h && n.mins < toMins(h[0])) { msg = "Closed now, opens " + fmt(h[0]) + " today"; }
    else {
      for (var i = 1; i <= 7; i++) { var d2 = (n.day + i) % 7; if (M.hours[d2]) { msg = "Closed now, opens " + (i === 1 ? "tomorrow" : DAYS[d2]) + " at " + fmt(M.hours[d2][0]); break; } }
    }
    var st = $("#status"); st.classList.toggle("is-open", open); st.classList.toggle("is-closed", !open);
    $("#statusText").textContent = msg + " (London time)";
    var hn = $("#hoursNow"); hn.textContent = msg; hn.classList.toggle("is-closed", !open);
    var notice = $("#notice");
    if (closure) { $("#noticeText").textContent = closure.message; notice.hidden = false; } else { notice.hidden = true; }
  }
  renderHours(); setInterval(renderHours, 60000);

  /* ---------- menu board ---------- */
  var board = $("#board"), chips = $("#chips"), search = $("#menuSearch"), activeCat = "all";
  (function () {
    var html = "<button type=\"button\" class=\"chip\" data-cat=\"all\" aria-pressed=\"true\">Everything</button>";
    M.categories.forEach(function (c) { html += "<button type=\"button\" class=\"chip\" data-cat=\"" + c.id + "\" aria-pressed=\"false\">" + esc(c.name) + "</button>"; });
    chips.innerHTML = html;
  })();
  function hi(text, q) {
    if (!q) return esc(text);
    var i = text.toLowerCase().indexOf(q); if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
  }
  function renderMenu() {
    var q = search.value.trim().toLowerCase(), html = "", count = 0, n = 0;
    M.categories.forEach(function (c) {
      if (activeCat !== "all" && c.id !== activeCat) return;
      var rows = c.items.filter(function (it) { return !q || it[0].toLowerCase().indexOf(q) > -1 || it[1].toLowerCase().indexOf(q) > -1 || c.name.toLowerCase().indexOf(q) > -1; });
      if (!rows.length) return;
      count += rows.length;
      html += "<section class=\"cat\"><h3 class=\"cat__title\">" + esc(c.name) + "</h3><p class=\"cat__note\">" + esc(c.note) + "</p><ul>";
      rows.forEach(function (it) {
        html += "<li class=\"item\" style=\"--i:" + (n++) + "\"><span class=\"item__names\"><span class=\"item__en\">" + hi(it[0], q) + "</span><span class=\"item__zh\" lang=\"zh-Hant\">" + hi(it[1], q) + "</span></span>" +
          "<span class=\"item__price\">" + menuPrice(it[2]) + "</span>" +
          "<button type=\"button\" class=\"item__add\" data-drink=\"" + esc(it[0]) + "\" aria-label=\"Build a " + esc(it[0]) + "\" title=\"Build this drink\">+</button></li>";
      });
      html += "</ul></section>";
    });
    board.innerHTML = html;
    $("#menuEmpty").hidden = count > 0;
    $("#menuCount").textContent = count + (count === 1 ? " drink" : " drinks") + (activeCat === "all" && !q ? " across " + M.categories.length + " series. Tap + to build one your way." : " shown.");
  }
  chips.addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    activeCat = b.getAttribute("data-cat");
    $$(".chip", chips).forEach(function (c) { c.setAttribute("aria-pressed", c === b); });
    renderMenu();
  });
  search.addEventListener("input", renderMenu);
  renderMenu();

  /* ---------- drink builder ---------- */
  var sel = $("#bDrink"), cup = $("#cup"), NS = "http://www.w3.org/2000/svg";
  (function () {
    var html = "";
    M.categories.forEach(function (c) {
      html += "<optgroup label=\"" + esc(c.name) + "\">";
      c.items.forEach(function (it) { html += "<option value=\"" + esc(it[0]) + "\">" + esc(it[0]) + " · " + menuPrice(it[2]) + "</option>"; });
      html += "</optgroup>";
    });
    sel.innerHTML = html; sel.value = "Pearl Milk Tea";
    function levels(id, name, def) {
      $(id).innerHTML = M.levels.map(function (l) {
        return "<input type=\"radio\" name=\"" + name + "\" id=\"" + name + "-" + l.id + "\" value=\"" + l.id + "\"" + (l.id === def ? " checked" : "") + "><label for=\"" + name + "-" + l.id + "\">" + l.label + (l.pct ? "<small>" + l.pct + "%</small>" : "<small>0%</small>") + "</label>";
      }).join("");
    }
    levels("#bIce", "ice", "standard"); levels("#bSugar", "sugar", "standard");
    $("#bAddons").innerHTML = M.addons.map(function (a, i) {
      return "<span class=\"addon\"><input type=\"checkbox\" id=\"addon-" + i + "\" value=\"" + i + "\"><label for=\"addon-" + i + "\" style=\"--c:" + a.color + "\"><i></i>" + esc(a.name) + " <small>+" + Math.round(a.price * 100) + "p</small></label></span>";
    }).join("");
    $("#bDairy").innerHTML = "<input type=\"radio\" name=\"dairy\" id=\"dairy-none\" value=\"\" checked><label for=\"dairy-none\">House milk</label>" +
      M.dairy.map(function (d, i) { return "<input type=\"radio\" name=\"dairy\" id=\"dairy-" + i + "\" value=\"" + esc(d) + "\"><label for=\"dairy-" + i + "\">" + esc(d) + "</label>"; }).join("");
  })();

  var TINTS = [["matcha", "#8db255"], ["hojicha", "#b5835a"], ["taro", "#b9a2d8"], ["strawberry", "#f4a6b4"], ["rose", "#f2b8c6"],
    ["oreo", "#8f7468"], ["chocolate", "#8a5a44"], ["brown sugar", "#cfa173"], ["coffee", "#a9774f"], ["mango", "#f9c544"], ["passionfruit", "#f6b03b"],
    ["lychee", "#f3d9d2"], ["peach", "#f7b58e"], ["apple", "#8fd44a"], ["lemon", "#f1e06a"], ["honey", "#ebc25b"], ["winter melon", "#b9783f"],
    ["red bean", "#c99590"], ["earl grey", "#b86a2a"], ["oolong", "#a66a2e"], ["jasmine", "#d6c56a"], ["green tea", "#cfd07a"]];
  var MILKY = { topping: 1, classic: 1, brown: 1, coffee: 1 };
  function mix(hex, k) { // blend toward milk
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, m = [255, 244, 228];
    return "rgb(" + Math.round(r + (m[0] - r) * k) + "," + Math.round(g + (m[1] - g) * k) + "," + Math.round(b + (m[2] - b) * k) + ")";
  }
  function tint(it) {
    var n = it.en.toLowerCase(), c = null;
    for (var i = 0; i < TINTS.length; i++) if (n.indexOf(TINTS[i][0]) > -1) { c = TINTS[i][1]; break; }
    var milky = MILKY[it.cat.id] || /milk/.test(n);
    if (!c) return "#d9b38c";
    if (/matcha|hojicha|taro|strawberry|rose|chocolate|oreo|red bean|brown sugar|coffee/.test(n)) return milky ? mix(c, 0.22) : c;
    return milky ? mix(c, 0.5) : c;
  }
  function el(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function rnd(seed) { var x = Math.sin(seed * 99.13) * 43758.5453; return x - Math.floor(x); }

  var lastKey = "";
  function state() {
    var it = ALL.filter(function (a) { return a.en === sel.value; })[0] || ALL[0];
    var f = $("#builder");
    return {
      it: it, large: f.size.value === "large", warm: f.temp.value === "warm" && !it.cat.coldOnly,
      ice: f.ice.value, sugar: f.sugar.value, dairy: f.dairy.value,
      addons: $$("#bAddons input:checked").map(function (i) { return M.addons[+i.value]; })
    };
  }
  function lvl(id) { return M.levels.filter(function (l) { return l.id === id; })[0]; }
  function renderBuilder(shake) {
    var f = $("#builder"), it0 = ALL.filter(function (a) { return a.en === sel.value; })[0] || ALL[0];
    var warmIn = $("#bTempW");
    warmIn.disabled = !!it0.cat.coldOnly; if (it0.cat.coldOnly && warmIn.checked) $("#bTempC").checked = true;
    var s = state();
    $$("#bIce input").forEach(function (i) { i.disabled = s.warm; });

    var lines = [[(s.large ? "Large " : "Regular ") + s.it.en, s.it.price]], total = s.it.price;
    if (s.large) { lines.push(["Go large", M.extras.large]); total += M.extras.large; }
    if (s.warm) { lines.push(["Served warm", M.extras.warm]); total += M.extras.warm; }
    s.addons.forEach(function (a) { lines.push(["+ " + a.name, a.price]); total += a.price; });
    if (s.dairy) { lines.push([s.dairy, M.extras.dairy]); total += M.extras.dairy; }
    var ice = lvl(s.ice), sugar = lvl(s.sugar);
    lines.push([(s.warm ? "No ice (warm)" : ice.label + " ice " + ice.pct + "%") + ", " + sugar.label.toLowerCase() + " sugar " + sugar.pct + "%", null]);

    $("#bName").textContent = s.it.en; $("#bZh").textContent = s.it.zh;
    $("#bLines").innerHTML = lines.map(function (l, i) {
      return "<li><span>" + esc(l[0]) + "</span><span>" + (l[1] == null ? "" : (i === 0 ? money(l[1]) : "+" + Math.round(l[1] * 100) + "p")) + "</span></li>";
    }).join("");
    var tot = $("#bTotal"), txt = money(total);
    if (tot.textContent !== txt) { tot.textContent = txt; tot.classList.remove("bump"); void tot.offsetWidth; tot.classList.add("bump"); }

    /* cup drawing */
    cup.classList.toggle("is-warm", s.warm);
    cup.style.setProperty("--liq", tint(s.it));
    var foam = s.it.cat.id === "foam", topY = foam ? 108 : 86;
    $("#cupLiquid").setAttribute("y", topY); $("#cupLiquid").style.y = topY + "px";
    $("#cupFoam").style.opacity = foam ? 1 : 0;
    cup.setAttribute("aria-label", "Preview: " + s.it.en + (s.addons.length ? " with " + s.addons.map(function (a) { return a.name; }).join(", ") : ""));

    var key = s.it.en + "|" + s.addons.map(function (a) { return a.name; }).join(",") + "|" + s.ice + "|" + s.warm;
    if (key !== lastKey) {
      lastKey = key;
      var tg = $("#cupToppings"), ig = $("#cupIce"); tg.textContent = ""; ig.textContent = "";
      var n = s.it.en.toLowerCase();
      if (/brown sugar/.test(n)) for (var b = 0; b < 5; b++) {
        var bx = 62 + b * 24, p = el("path", { d: "M" + bx + " 92q" + (b % 2 ? 9 : -9) + " 60 " + (b % 2 ? -3 : 4) + " 150", fill: "none", stroke: "#7a4320", "stroke-width": 7, "stroke-linecap": "round", opacity: 0.55, "class": "top-in" });
        tg.appendChild(p);
      }
      var built = s.addons.slice();
      var auto = [["pearl-mixed", ["Pearl", "White Pearl"]], ["white pearl", ["White Pearl"]], ["pearl", ["Pearl"]], ["coconut jelly", ["Coconut Jelly"]], ["grass jelly", ["Grass Jelly"]],
        ["pudding", ["Pudding"]], ["oreo", ["Oreo"]], ["coffee jelly", ["Coffee Jelly"]], ["red bean", ["Red Bean"]], ["aloe", ["Aloe"]]];
      for (var a = 0; a < auto.length; a++) if (n.indexOf(auto[a][0]) > -1) {
        auto[a][1].forEach(function (nm) { var ad = M.addons.filter(function (x) { return x.name === nm; })[0]; if (ad && built.indexOf(ad) < 0) built.unshift(ad); });
        break;
      }
      var slot = 0, per = built.length > 3 ? 7 : built.length > 1 ? 10 : 16;
      built.forEach(function (ad, ai) {
        for (var k = 0; k < per; k++, slot++) {
          var row = Math.floor(slot / 8), col = slot % 8;
          var x = 66 + col * 12.6 + (row % 2 ? 6 : 0) + (rnd(slot + 1) - 0.5) * 5, y = 274 - row * 12.5 + (rnd(slot + 7) - 0.5) * 4, node;
          if (y < 150) break;
          if (ad.kind === "cube") node = el("rect", { x: x - 6, y: y - 6, width: 12, height: 12, rx: 2.5, fill: ad.color, stroke: "rgba(69,39,28,.35)", "stroke-width": 1, transform: "rotate(" + Math.round(rnd(slot + 3) * 50 - 25) + " " + x + " " + y + ")" });
          else if (ad.kind === "star") node = el("path", { d: "M" + x + " " + (y - 7) + "l2 4.6 5 .5-3.8 3.3 1.2 4.9-4.4-2.6-4.4 2.6 1.2-4.9-3.8-3.3 5-.5z", fill: ad.color, stroke: "#d49a15", "stroke-width": 1 });
          else if (ad.kind === "crumb") node = el("rect", { x: x - 4, y: y - 3, width: 8, height: 6, rx: 1.5, fill: ad.color, transform: "rotate(" + Math.round(rnd(slot + 3) * 90) + " " + x + " " + y + ")" });
          else if (ad.kind === "bean") node = el("ellipse", { cx: x, cy: y, rx: 6, ry: 4.2, fill: ad.color, transform: "rotate(" + Math.round(rnd(slot + 3) * 80 - 40) + " " + x + " " + y + ")" });
          else node = el("circle", { cx: x, cy: y, r: ad.kind === "pop" ? 5.6 : 6.2, fill: ad.color, stroke: "rgba(69,39,28,.3)", "stroke-width": 1 });
          var g = el("g", { "class": "top-in" }); g.style.setProperty("--d", (ai * 0.08 + k * 0.025) + "s");
          g.appendChild(node);
          if (ad.kind === "pearl" || ad.kind === "pop") g.appendChild(el("circle", { cx: x - 2, cy: y - 2, r: 1.5, fill: "rgba(255,255,255,.65)" }));
          tg.appendChild(g);
        }
      });
      if (!s.warm) {
        var cubes = { none: 0, little: 2, half: 3, standard: 5, max: 7 }[s.ice];
        for (var c = 0; c < cubes; c++) {
          var cx = 62 + (c % 4) * 26 + (c > 3 ? 12 : 0) + rnd(c + 11) * 6, cy = topY + 6 + Math.floor(c / 4) * 26 + rnd(c + 5) * 6;
          var r = el("rect", { x: cx, y: cy, width: 22, height: 22, rx: 5, "class": "ice top-in", transform: "rotate(" + Math.round(rnd(c + 2) * 40 - 20) + " " + (cx + 11) + " " + (cy + 11) + ")" });
          r.style.setProperty("--d", c * 0.05 + "s"); ig.appendChild(r);
        }
      }
    }
    if (shake && !reduce) { cup.classList.remove("is-shake"); void cup.getBoundingClientRect(); cup.classList.add("is-shake"); }
  }
  $("#builder").addEventListener("change", function (e) { renderBuilder(e.target === sel); });
  $("#builder").addEventListener("submit", function (e) { e.preventDefault(); });
  renderBuilder(false);

  function chooseDrink(name) {
    sel.value = name; renderBuilder(true);
    $("#build").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    toast(name + " is in your cup. Now make it yours.");
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-drink]"); if (b) chooseDrink(b.getAttribute("data-drink"));
  });
  $("#bCopy").addEventListener("click", function () {
    var s = state(), ice = lvl(s.ice), sugar = lvl(s.sugar), total = s.it.price + (s.large ? M.extras.large : 0) + (s.warm ? M.extras.warm : 0) + (s.dairy ? M.extras.dairy : 0);
    s.addons.forEach(function (a) { total += a.price; });
    var text = "One " + (s.large ? "large " : "regular ") + s.it.en + " (" + s.it.zh + "), " + (s.warm ? "warm" : ice.label.toLowerCase() + " ice") + ", " + sugar.label.toLowerCase() + " sugar" +
      (s.addons.length ? ", with " + s.addons.map(function (a) { return a.name.toLowerCase(); }).join(" and ") : "") + (s.dairy ? ", " + s.dairy.toLowerCase() : "") + ". About " + money(total) + ".";
    $("#bSay").textContent = "“" + text + "”";
    copyText(text, "Order copied. Read it out at the counter.");
  });

  /* ---------- tea picker ---------- */
  var teas = $(".teas");
  $("#picker").addEventListener("click", function (e) {
    var b = e.target.closest(".pick"); if (!b) return;
    var was = b.getAttribute("aria-pressed") === "true";
    $$(".pick").forEach(function (p) { p.setAttribute("aria-pressed", "false"); });
    var want = was ? [] : b.getAttribute("data-pick").split(" ");
    if (!was) b.setAttribute("aria-pressed", "true");
    teas.classList.toggle("has-pick", want.length > 0);
    $$(".tea").forEach(function (t) { t.classList.toggle("is-pick", want.indexOf(t.getAttribute("data-tea")) > -1); });
  });
  $$(".pick").forEach(function (p) { p.setAttribute("aria-pressed", "false"); });

  /* ---------- photo viewer ---------- */
  var zoom = $("#zoom");
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-zoom]"); if (!b) return;
    $("#zoomImg").src = b.getAttribute("data-zoom");
    var img = $("img", b); $("#zoomImg").alt = img ? img.alt : b.getAttribute("data-cap");
    $("#zoomCap").textContent = b.getAttribute("data-cap") || "";
    if (zoom.showModal) zoom.showModal(); else zoom.setAttribute("open", "");
  });
  $("#zoomClose").addEventListener("click", function () { zoom.close ? zoom.close() : zoom.removeAttribute("open"); });
  zoom.addEventListener("click", function (e) { if (e.target === zoom) zoom.close(); });

  /* ---------- copy phone ---------- */
  $("#copyPhone").addEventListener("click", function () { copyText(this.getAttribute("data-copy"), "Phone number copied."); });

  /* ---------- scroll reveals, nav highlight, video autoplay ---------- */
  var revealSel = ".head, .cat, .step, .cupcard, .bake, .tea, .mural, .shot, .gift, .tags, .visit__info, .hourscard, .visit__photo, .allergy, .picker";
  if ("IntersectionObserver" in window) {
    if (!reduce) {
      var vh = window.innerHeight, ro = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -8% 0px" });
      var arm = function (root) {
        $$(revealSel, root).forEach(function (n, i) {
          if (n.classList.contains("reveal") || n.getBoundingClientRect().top < vh) return;
          n.classList.add("reveal"); n.style.setProperty("--rd", (i % 4) * 0.07 + "s"); ro.observe(n);
        });
      };
      arm(document);
      setTimeout(function () { $$(".reveal:not(.in)").forEach(function (n) { if (n.getBoundingClientRect().top < window.innerHeight) n.classList.add("in"); }); }, 1200);
    }
    var links = $$(".nav a[href^='#']"), so = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle("is-here", l.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { so.observe(s); });
    var vo = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting && !reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
      });
    }, { threshold: 0.35 });
    $$("video[data-autoplay]").forEach(function (v) { vo.observe(v); });
  }
  if (reduce) $$("video[data-autoplay]").forEach(function (v) { v.controls = true; });

  /* ---------- footer paw prints ---------- */
  (function () {
    var p = $("#paws"), html = "";
    for (var i = 0; i < 14; i++) html += "<i style=\"--x:" + (4 + i * 7) + "%;--y:" + (i % 2 ? 12 : 0) + "px;--d:" + (i * 0.45) + "s\"></i>";
    p.innerHTML = html;
  })();
  $("#year").textContent = new Date().getFullYear();
})();
