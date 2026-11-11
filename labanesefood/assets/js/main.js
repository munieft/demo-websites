/* Lebanese Food — site script (vanilla JS, no frameworks) */
(() => {
  "use strict";
  const WA = "447308056702";
  const PHONE_DISPLAY = "+44 7308 056702";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    lget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    lset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const money = n => "£" + (Number.isInteger(n) ? n : n.toFixed(2));

  /* ---------- preloader (first visit in a session only) ---------- */
  const loader = $(".loader");
  if (loader) {
    if (store.get("lf-seen") || reduce) { loader.remove(); }
    else {
      store.set("lf-seen", "1");
      const done = () => { loader.classList.add("is-done"); setTimeout(() => loader.remove(), 900); };
      window.addEventListener("load", () => setTimeout(done, 900));
      setTimeout(done, 3200);
    }
  }

  /* ---------- header ---------- */
  const header = $(".site-header");
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle("is-solid", y > 40);
      const menuOpen = document.body.classList.contains("menu-open");
      header.classList.toggle("is-hidden", !menuOpen && y > 500 && y > lastY + 4);
      if (y < lastY - 4) header.classList.remove("is-hidden");
    }
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = $(".burger");
  if (burger) {
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", String(open));
      header.classList.remove("is-hidden");
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) burger.click();
    });
  }

  /* ---------- page transition curtain ---------- */
  const curtain = $(".curtain");
  if (curtain && !reduce) {
    document.addEventListener("click", e => {
      const a = e.target.closest("a");
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const href = a.getAttribute("href") || "";
      if (!/\.html(#.*)?$/.test(href) || href.startsWith("http")) return;
      const here = location.pathname.split("/").pop() || "index.html";
      if (href.split("#")[0] === here) return;
      e.preventDefault();
      curtain.classList.add("is-on");
      setTimeout(() => { location.href = href; }, 420);
    });
    window.addEventListener("pageshow", () => curtain.classList.remove("is-on"));
  }

  /* ---------- festoon string lights ---------- */
  $$(".festoon").forEach(f => {
    const build = () => {
      const w = f.clientWidth || window.innerWidth, h = f.clientHeight || 120;
      const spans = w < 600 ? 2 : w < 1100 ? 3 : 4;
      const seg = w / spans;
      let d = "", bulbs = "";
      for (let i = 0; i < spans; i++) {
        const x0 = i * seg, x1 = x0 + seg, sag = h * (0.55 + 0.15 * (i % 2));
        d += `M${x0},4 Q${x0 + seg / 2},${sag * 2 - 4} ${x1},4 `;
        const n = Math.max(5, Math.round(seg / 70));
        for (let j = 1; j < n; j++) {
          const t = j / n;
          const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * (x0 + seg / 2) + t * t * x1;
          const y = (1 - t) * (1 - t) * 4 + 2 * (1 - t) * t * (sag * 2 - 4) + t * t * 4;
          const delay = (Math.random() * 4).toFixed(2);
          bulbs += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 7}" stroke="#0a0807" stroke-width="2"/>` +
            `<circle class="bulb-glow" cx="${x}" cy="${y + 13}" r="11" style="animation-delay:${delay}s"/>` +
            `<ellipse class="bulb-core" cx="${x}" cy="${y + 13}" rx="3.6" ry="4.6"/>`;
        }
      }
      f.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><path class="wire" d="${d}"/>${bulbs}</svg>`;
    };
    build();
    let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(build, 200); });
  });

  /* ---------- rising embers (hero canvas) ---------- */
  const cv = $("#embers");
  if (cv && !reduce) {
    const ctx = cv.getContext("2d");
    let W, H, parts = [], dpr = Math.min(window.devicePixelRatio || 1, 2), running = true;
    const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const spawn = (init) => ({
      x: Math.random() * W, y: init ? Math.random() * H : H + 10,
      r: Math.random() * 2.2 + .6, vy: Math.random() * .7 + .35, vx: (Math.random() - .5) * .3,
      life: 0, max: Math.random() * 380 + 220, hue: 25 + Math.random() * 20, sway: Math.random() * 6.28
    });
    size();
    const N = W < 600 ? 38 : 80;
    for (let i = 0; i < N; i++) parts.push(spawn(true));
    window.addEventListener("resize", size);
    const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) requestAnimationFrame(tick); });
    io.observe(cv);
    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.life++; p.sway += .02;
        p.y -= p.vy; p.x += p.vx + Math.sin(p.sway) * .35;
        const a = Math.max(0, Math.sin(Math.PI * p.life / p.max)) * (0.6 + Math.random() * 0.4);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `hsla(${p.hue},100%,70%,${a})`);
        g.addColorStop(1, `hsla(${p.hue},100%,50%,0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, 6.283); ctx.fill();
        if (p.life > p.max || p.y < -20) Object.assign(p, spawn(false));
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- hero slideshow ---------- */
  const slides = $$(".hero-media img");
  if (slides.length > 1 && !reduce) {
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove("is-on");
      i = (i + 1) % slides.length;
      slides[i].classList.add("is-on");
    }, 6500);
  }

  /* ---------- reveal on scroll (content stays visible in the first frame) ---------- */
  const reveals = $$(".reveal");
  if (reveals.length && "IntersectionObserver" in window && !reduce) {
    const vh = window.innerHeight;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.remove("is-pending"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top > vh * 0.95) { el.classList.add("is-pending"); io.observe(el); }
    });
  }

  /* ---------- parallax backgrounds ---------- */
  const px = $$("[data-parallax]");
  if (px.length && !reduce) {
    const run = () => {
      const vh = window.innerHeight;
      px.forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const k = parseFloat(el.dataset.parallax) || .15;
        el.style.transform = `translate3d(0,${(r.top + r.height / 2 - vh / 2) * -k}px,0)`;
      });
    };
    window.addEventListener("scroll", () => requestAnimationFrame(run), { passive: true });
    run();
  }

  /* ---------- counters ---------- */
  const counters = $$("[data-count]");
  if (counters.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, to = parseFloat(el.dataset.count), dec = (el.dataset.count.split(".")[1] || "").length;
        const pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
        io.unobserve(el);
        if (reduce) { el.textContent = pre + to.toFixed(dec) + suf; return; }
        const t0 = performance.now(), dur = 1600;
        const step = now => {
          const k = Math.min(1, (now - t0) / dur), v = to * (1 - Math.pow(1 - k, 3));
          el.textContent = pre + v.toFixed(dec) + suf;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: .4 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------- tilt on dish cards ---------- */
  if (window.matchMedia("(hover:hover)").matches && !reduce) {
    $$("[data-tilt]").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
    const glow = $(".cursor-glow");
    if (glow) window.addEventListener("mousemove", e => { glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true });
  }

  /* ---------- lazy autoplay for videos ---------- */
  $$("video[data-autoplay]").forEach(v => {
    v.muted = true;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { const p = v.play(); if (p) p.catch(() => {}); } else v.pause(); });
    io.observe(v);
  });

  /* ---------- toast + copy ---------- */
  let toastEl;
  const toast = msg => {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.classList.remove("is-on"), 2200);
  };
  const copyText = (text, label) => {
    const fallback = () => {
      const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast(label + " copied"); } catch (e) { toast("Select the text to copy it"); }
      ta.remove();
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => toast(label + " copied"), fallback);
      else fallback();
    } catch (e) { fallback(); }
  };
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => copyText(b.dataset.copy, b.dataset.copyLabel || "Text")));
  const waLink = text => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

  /* =========================================================
     MENU — taken from the boards on the truck (all halal)
     ========================================================= */
  const MENU = [
    { id: "grill", name: "Grill", ar: "مشاوي", note: "All wraps come with salad, hummus and sauce.", items: [
      { n: "Chicken Wrap", d: "Marinated chicken thigh off the grill, rolled tight in warm flatbread with crunchy salad, hummus and garlic sauce.", m: 8, l: 10, tag: "Favourite" },
      { n: "Chicken Katsu Wrap", d: "Golden crumbed chicken with salad, hummus and sauce. Crunch in every bite.", m: 8, l: 10 },
      { n: "Lamb Wrap", d: "Spiced lamb kofta, charred and juicy, wrapped with salad, hummus and sauce.", m: 8, l: 10 },
      { n: "Mix Kebab Wrap", d: "Chicken and lamb together for the hungry. Served large only.", m: null, l: 10, tag: "Large only" },
      { n: "Chicken & Rice", d: "Grilled chicken over golden turmeric rice with salad, hummus and sauce.", m: 8, l: 10 },
      { n: "Chicken Katsu & Rice", d: "Crumbed chicken katsu on golden rice with salad, hummus and sauce.", m: 8, l: 10 },
      { n: "Lamb Kofte & Rice", d: "Hand-pressed lamb kofte skewers over rice, salad, hummus and sauce.", m: 8, l: 10 },
      { n: "Mix Kebab & Rice", d: "The full grill: chicken and lamb kofte over rice with all the trimmings.", m: null, l: 10, tag: "Large only" }
    ]},
    { id: "salad-box", name: "Salad Box", ar: "علبة سلطة", base: true, note: "All boxes come with rice or chips, salad, hummus and sauce.", items: [
      { n: "Chicken Box", d: "Charcoal-grilled chicken thighs, red cabbage, onion and tomato salad, a generous swirl of hummus.", m: 8, l: 10, tag: "Favourite" },
      { n: "Chicken Katsu Box", d: "Crisp chicken katsu with fresh salad, pickled chilli, hummus and sauce.", m: 8, l: 10 },
      { n: "Lamb Box", d: "Lamb kofte straight off the grill with salad, hummus and a drizzle of garlic sauce.", m: 8, l: 10 },
      { n: "Mix Kebab Box", d: "Chicken and lamb piled high with chilli and garlic sauces, cucumber, pickled pepper and hummus.", m: null, l: 10, tag: "Large only" }
    ]},
    { id: "chips", name: "Chips", ar: "بطاطا", note: "Served on a bed of hot chips with salad, hummus and sauce.", items: [
      { n: "Chicken & Chips", d: "Grilled chicken on golden chips with salad and garlic sauce.", m: 8, l: 10 },
      { n: "Lamb & Chips", d: "Lamb kofte over chips, salad, hummus and sauce.", m: 8, l: 10 },
      { n: "Mix Kebab & Chips", d: "Chicken and lamb over a mountain of chips. Served large only.", m: null, l: 10, tag: "Large only" },
      { n: "Chicken Katsu & Chips", d: "Crumbed chicken katsu with chips, salad and sauce. Served large only.", m: null, l: 10, tag: "Large only" }
    ]},
    { id: "vegetarian", name: "Vegetarian", ar: "نباتي", veg: true, base: true, extra: true, note: "Add extra halloumi cheese to any vegetarian dish for £1.00.", items: [
      { n: "Falafel Wrap", d: "Crisp chickpea and herb falafel, salad, hummus and tahini in warm flatbread.", m: 6, l: 7, tag: "Veg" },
      { n: "Halloumi Wrap", d: "Squeaky grilled halloumi with salad, hummus and sauce.", m: 6, l: 7, tag: "Veg" },
      { n: "Falafel & Halloumi Wrap", d: "The best of both, wrapped together with salad and hummus.", m: 7, l: 8, tag: "Veg" },
      { n: "Falafel Box", d: "Falafel over rice or chips with salad, hummus and tahini.", m: 6, l: 7, tag: "Veg", box: true },
      { n: "Halloumi Box", d: "Grilled halloumi over rice or chips with salad and hummus.", m: 6, l: 7, tag: "Veg", box: true },
      { n: "Falafel & Halloumi Box", d: "Falafel and halloumi together over rice or chips with all the trimmings.", m: 7, l: 8, tag: "Veg", box: true }
    ]}
  ];

  const menuRoot = $("#menu-root");
  if (menuRoot) {
    const plus = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
    const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    let size = store.lget("lf-size") === "M" ? "M" : "L";
    const all = {};
    MENU.forEach(c => c.items.forEach((it, i) => { it.id = c.id + "-" + i; it.cat = c; all[it.id] = it; }));

    $$(".cat-block").forEach(block => {
      const c = MENU.find(x => x.id === block.dataset.cat);
      const list = $(".items", block);
      list.innerHTML = c.items.map(it => `
        <article class="item reveal">
          <div class="item-name"><h3>${it.n}</h3>${it.tag ? `<span class="badge ${it.tag === "Veg" ? "badge--veg" : ""}">${it.tag}</span>` : ""}</div>
          <p>${it.d}</p>
          <div class="item-side">
            <div style="text-align:right"><div class="price-big" data-price="${it.id}"></div><div class="price-sub" data-psub="${it.id}"></div></div>
            <button class="add" type="button" data-add="${it.id}" aria-label="Add ${it.n} to your order">${plus}</button>
          </div>
        </article>`).join("");
    });

    const renderPrices = (bump) => {
      Object.values(all).forEach(it => {
        const el = $(`[data-price="${it.id}"]`), sub = $(`[data-psub="${it.id}"]`);
        const s = size === "M" && it.m == null ? "L" : size;
        el.textContent = money(s === "M" ? it.m : it.l);
        sub.textContent = it.m == null ? "Large" : (s === "M" ? "Medium · L " + money(it.l) : "Large · M " + money(it.m));
        if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
      });
    };
    const toggle = $(".size-toggle");
    const syncToggle = () => {
      toggle.dataset.size = size;
      $$("button", toggle).forEach(b => { const on = b.dataset.size === size; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
    };
    $$("button", toggle).forEach(b => b.addEventListener("click", () => { size = b.dataset.size; store.lset("lf-size", size); syncToggle(); renderPrices(true); }));
    syncToggle(); renderPrices(false);

    /* category tabs + scroll spy */
    const tabs = $$(".cat-tab");
    tabs.forEach(t => t.addEventListener("click", () => {
      const target = document.getElementById(t.dataset.target);
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }));
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        tabs.forEach(t => {
          const on = t.dataset.target === e.target.id;
          t.classList.toggle("is-active", on);
          if (on) t.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$(".cat-block").forEach(b => spy.observe(b));

    /* ----- order tray ----- */
    let tray = [];
    try { tray = JSON.parse(store.lget("lf-tray") || "[]").filter(l => all[l.id]); } catch (e) { tray = []; }
    const save = () => store.lset("lf-tray", JSON.stringify(tray));
    const linePrice = l => { const it = all[l.id]; return ((l.size === "M" ? it.m : it.l) + (l.halloumi ? 1 : 0)) * l.qty; };
    const body = $(".tray-body"), count = $(".fab .count"), totalEl = $("#tray-total"), fab = $(".fab");
    const needsBase = it => it.cat.id === "salad-box" || it.box;

    const renderTray = () => {
      const n = tray.reduce((a, l) => a + l.qty, 0);
      count.textContent = n;
      totalEl.textContent = money(tray.reduce((a, l) => a + linePrice(l), 0));
      $("#send-order").toggleAttribute("aria-disabled", !n);
      if (!n) {
        body.innerHTML = `<div class="tray-empty"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="10" y="22" width="44" height="30" rx="4"/><path d="M10 30h44M18 22l6-10h16l6 10"/></svg><p>Your tray is empty.<br>Tap <b>+</b> on any dish to start an order.</p></div>`;
        return;
      }
      body.innerHTML = tray.map((l, idx) => {
        const it = all[l.id];
        const sizes = it.m == null ? "" : `<div class="seg" role="group" aria-label="Size"><button type="button" data-l="${idx}" data-set="size" data-v="M" class="${l.size === "M" ? "is-active" : ""}">M ${money(it.m)}</button><button type="button" data-l="${idx}" data-set="size" data-v="L" class="${l.size === "L" ? "is-active" : ""}">L ${money(it.l)}</button></div>`;
        const base = needsBase(it) ? `<div class="seg" role="group" aria-label="Base"><button type="button" data-l="${idx}" data-set="base" data-v="Rice" class="${l.base === "Rice" ? "is-active" : ""}">Rice</button><button type="button" data-l="${idx}" data-set="base" data-v="Chips" class="${l.base === "Chips" ? "is-active" : ""}">Chips</button></div>` : "";
        const extra = it.cat.extra ? `<label class="chk"><input type="checkbox" data-l="${idx}" data-set="halloumi" ${l.halloumi ? "checked" : ""}> Extra halloumi +£1</label>` : "";
        return `<div class="line">
          <div><h4>${it.n}</h4><small>${it.m == null ? "Large" : (l.size === "M" ? "Medium" : "Large")}${needsBase(it) ? " · with " + l.base.toLowerCase() : ""}${l.halloumi ? " · extra halloumi" : ""}</small></div>
          <div class="line-price">${money(linePrice(l))}</div>
          <div class="opts">
            <div class="qty"><button type="button" data-l="${idx}" data-q="-1" aria-label="One less">−</button><span>${l.qty}</span><button type="button" data-l="${idx}" data-q="1" aria-label="One more">+</button></div>
            ${sizes}${base}${extra}
          </div></div>`;
      }).join("");
    };

    const add = id => {
      const it = all[id];
      const s = it.m == null ? "L" : size;
      const found = tray.find(l => l.id === id && l.size === s && !l.halloumi);
      if (found) found.qty++; else tray.push({ id, size: s, qty: 1, base: needsBase(it) ? "Rice" : null, halloumi: false });
      save(); renderTray();
      fab.classList.remove("wiggle"); void fab.offsetWidth; fab.classList.add("wiggle");
      toast(`${it.n} added to your tray`);
    };
    menuRoot.addEventListener("click", e => {
      const b = e.target.closest("[data-add]"); if (!b) return;
      add(b.dataset.add);
      b.classList.add("added"); b.innerHTML = check;
      setTimeout(() => { b.classList.remove("added"); b.innerHTML = plus; }, 1100);
    });
    body.addEventListener("click", e => {
      const b = e.target.closest("button[data-l]"); if (!b) return;
      const l = tray[+b.dataset.l];
      if (b.dataset.q) { l.qty += +b.dataset.q; if (l.qty <= 0) tray.splice(+b.dataset.l, 1); }
      if (b.dataset.set === "size") l.size = b.dataset.v;
      if (b.dataset.set === "base") l.base = b.dataset.v;
      save(); renderTray();
    });
    body.addEventListener("change", e => {
      const c = e.target.closest("input[data-set='halloumi']"); if (!c) return;
      tray[+c.dataset.l].halloumi = c.checked; save(); renderTray();
    });

    const orderText = () => {
      const name = $("#order-name").value.trim(), when = $("#order-when").value, notes = $("#order-notes").value.trim();
      const lines = tray.map(l => {
        const it = all[l.id];
        return `• ${l.qty} × ${it.n} (${l.size === "M" ? "Medium" : "Large"}${needsBase(it) ? ", " + l.base : ""}${l.halloumi ? ", extra halloumi" : ""}) — ${money(linePrice(l))}`;
      });
      return `Salam! I'd like to order from Lebanese Food:\n\n${lines.join("\n")}\n\nTotal: ${money(tray.reduce((a, l) => a + linePrice(l), 0))}` +
        `\nCollection: ${when}` + (name ? `\nName: ${name}` : "") + (notes ? `\nNotes: ${notes}` : "");
    };
    const openTray = () => { document.body.classList.add("tray-open"); $(".tray").setAttribute("aria-hidden", "false"); setTimeout(() => $(".tray .icon-btn").focus(), 300); };
    const closeTray = () => { document.body.classList.remove("tray-open"); $(".tray").setAttribute("aria-hidden", "true"); fab.focus(); };
    fab.addEventListener("click", openTray);
    $(".tray .icon-btn").addEventListener("click", closeTray);
    $(".tray-scrim").addEventListener("click", closeTray);
    document.addEventListener("keydown", e => { if (e.key === "Escape" && document.body.classList.contains("tray-open")) closeTray(); });
    $("#send-order").addEventListener("click", e => {
      if (!tray.length) { e.preventDefault(); toast("Add a dish first"); return; }
      e.currentTarget.href = waLink(orderText());
    });
    $("#copy-order").addEventListener("click", () => { if (!tray.length) { toast("Add a dish first"); return; } copyText(orderText(), "Order"); });
    $("#clear-order").addEventListener("click", () => { tray = []; save(); renderTray(); });
    renderTray();
  }

  /* =========================================================
     GALLERY — filters + lightbox
     ========================================================= */
  const gallery = $(".masonry");
  if (gallery) {
    const items = $$(".g-item", gallery);
    $$(".filters .cat-tab").forEach(f => f.addEventListener("click", () => {
      $$(".filters .cat-tab").forEach(x => { x.classList.toggle("is-active", x === f); x.setAttribute("aria-pressed", String(x === f)); });
      items.forEach(it => it.classList.toggle("is-out", f.dataset.filter !== "all" && it.dataset.kind !== f.dataset.filter));
    }));
    const lb = $(".lightbox"), stage = $(".lb-stage .lb-media"), cap = $(".lb-cap"), idx = $(".lb-top span");
    let cur = 0, lastFocus;
    const visible = () => items.filter(i => !i.classList.contains("is-out"));
    const show = k => {
      const v = visible(); cur = (k + v.length) % v.length;
      const it = v[cur];
      stage.innerHTML = it.dataset.video
        ? `<video src="${it.dataset.video}" controls autoplay muted loop playsinline poster="${it.dataset.full}"></video>`
        : `<img src="${it.dataset.full}" alt="${$("img", it).alt}">`;
      cap.textContent = it.dataset.caption;
      idx.textContent = String(cur + 1).padStart(2, "0") + " / " + String(v.length).padStart(2, "0");
    };
    const open = it => { lastFocus = it; show(visible().indexOf(it)); lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false"); $(".lb-close").focus(); };
    const close = () => { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); stage.innerHTML = ""; if (lastFocus) lastFocus.focus(); };
    items.forEach(it => {
      it.addEventListener("click", () => open(it));
      it.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(it); } });
    });
    $(".lb-close").addEventListener("click", close);
    $(".lb-prev").addEventListener("click", () => show(cur - 1));
    $(".lb-next").addEventListener("click", () => show(cur + 1));
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1);
    });
    let sx = null;
    lb.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); sx = null; });
  }

  /* =========================================================
     VISIT — event / catering enquiry composed for WhatsApp
     ========================================================= */
  const form = $("#enquiry");
  if (form) {
    const d = $("#enq-date");
    if (d) d.min = new Date().toISOString().slice(0, 10);
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = $("#enq-name").value.trim(), err = $("#enq-err");
      if (!name) { err.hidden = false; $("#enq-name").focus(); return; }
      err.hidden = true;
      const msg = `Salam! Enquiry for Lebanese Food:\nName: ${name}\nOccasion: ${$("#enq-type").value}\nDate: ${$("#enq-date").value || "flexible"}\nGuests: ${$("#enq-guests").value || "not sure yet"}\n${$("#enq-msg").value.trim() ? "Details: " + $("#enq-msg").value.trim() : ""}`;
      const a = $("#enq-send");
      a.href = waLink(msg);
      a.hidden = false;
      $("#enq-preview").textContent = msg;
      $("#enq-preview").hidden = false;
      $("#enq-copy").hidden = false;
      $("#enq-copy").dataset.copy = msg;
      toast("Message ready to send");
      a.focus();
    });
    $("#enq-copy").addEventListener("click", e => copyText(e.currentTarget.dataset.copy, "Message"));
  }

  /* cedar line drawing */
  const cedar = $("#cedar-art");
  if (cedar) {
    if (reduce) cedar.classList.add("is-drawn");
    else { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { cedar.classList.add("is-drawn"); io.disconnect(); } }, { threshold: .3 }); io.observe(cedar); }
  }

  /* current year */
  $$("[data-year]").forEach(y => { y.textContent = new Date().getFullYear(); });
})();
