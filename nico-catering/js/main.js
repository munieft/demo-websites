/* ==========================================================================
   NICO CATERING LTD — site behaviour (vanilla JS, no frameworks)
   ========================================================================== */
(() => {
  "use strict";
  const doc = document.documentElement;
  doc.classList.remove("no-js");
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const WA = "447521078492";
  const EMAIL = "nicolsonray@icloud.com";
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- icons ---------- */
  const ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'
  };

  /* ---------- preloader & curtain ---------- */
  const loader = $(".loader");
  const curtain = $(".curtain");
  const viaCurtain = store.sget("nico-curtain") === "1";
  const seen = store.sget("nico-seen") === "1";
  let introDone = false;
  const startPage = () => {
    if (introDone) return; introDone = true;
    document.body.classList.remove("is-locked");
    doc.classList.add("is-ready");
    setTimeout(initReveals, 0);
  };
  if (loader) {
    if (seen || reduce) {
      loader.remove();
      if (viaCurtain && curtain && !reduce) {
        curtain.style.transition = "none";
        curtain.style.transform = "translateY(0)";
        requestAnimationFrame(() => requestAnimationFrame(() => {
          curtain.style.transition = "transform .8s cubic-bezier(.77,0,.18,1)";
          curtain.style.transform = "translateY(-100%)";
          setTimeout(() => { curtain.removeAttribute("style"); }, 900);
        }));
      }
      store.sset("nico-curtain", "0");
      startPage();
    } else {
      document.body.classList.add("is-locked");
      const finish = () => {
        loader.classList.add("is-done");
        store.sset("nico-seen", "1");
        setTimeout(startPage, 350);
        setTimeout(() => loader.remove(), 1200);
      };
      const minTime = new Promise(r => setTimeout(r, 2300));
      const loaded = new Promise(r => (document.readyState === "complete" ? r() : window.addEventListener("load", r, { once: true })));
      Promise.race([Promise.all([minTime, loaded]), new Promise(r => setTimeout(r, 4500))]).then(finish);
    }
  } else startPage();

  // internal link transitions
  document.addEventListener("click", e => {
    const a = e.target.closest("a");
    if (!a || !curtain || reduce) return;
    const href = a.getAttribute("href");
    if (!href || a.target === "_blank" || a.hasAttribute("download") || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (/^(#|mailto:|tel:|https?:|sms:|whatsapp:)/i.test(href)) return;
    if (!/\.html(#.*)?$/.test(href)) return;
    const url = new URL(href, location.href);
    if (url.pathname === location.pathname) return;
    e.preventDefault();
    closeMenu();
    curtain.classList.add("is-in");
    store.sset("nico-curtain", "1");
    setTimeout(() => { location.href = url.href; }, 680);
  });
  window.addEventListener("pageshow", ev => { if (ev.persisted && curtain) { curtain.classList.remove("is-in"); curtain.removeAttribute("style"); } });

  /* ---------- header ---------- */
  const hdr = $(".hdr");
  let lastY = 0;
  const fab = $(".fab");
  const onScrollHdr = () => {
    const y = window.scrollY;
    if (hdr) {
      hdr.classList.toggle("is-scrolled", y > 40);
      const menuOpen = doc.classList.contains("is-menu-open");
      hdr.classList.toggle("is-hidden", !menuOpen && y > 700 && y > lastY + 4);
      if (y < lastY - 4) hdr.classList.remove("is-hidden");
    }
    if (fab) fab.classList.toggle("is-on", y > 500);
    lastY = y;
  };

  /* ---------- mobile menu ---------- */
  const burger = $(".burger");
  function closeMenu() {
    doc.classList.remove("is-menu-open");
    document.body.classList.remove("is-locked");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) burger.addEventListener("click", () => {
    const open = !doc.classList.contains("is-menu-open");
    doc.classList.toggle("is-menu-open", open);
    document.body.classList.toggle("is-locked", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeMenu(); closeTray(); closeLb(); } });

  /* ---------- split text ---------- */
  $$("[data-split]").forEach(el => {
    let i = 0;
    const walk = node => {
      Array.from(node.childNodes).forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = "w";
            const s = document.createElement("span"); s.textContent = part; s.style.setProperty("--i", i++);
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains("w")) {
          if (n.tagName === "BR") return;
          if (n.matches("em,span,i,b,strong")) {
            const w = document.createElement("span"); w.className = "w";
            const s = document.createElement("span"); s.style.setProperty("--i", i++);
            n.replaceWith(w); s.appendChild(n); w.appendChild(s);
          } else walk(n);
        }
      });
    };
    walk(el);
    el.classList.add("split");
    el.setAttribute("data-reveal-split", "");
  });

  /* ---------- reveals ---------- */
  function initReveals() {
    const els = $$("[data-reveal],[data-mask],[data-reveal-split],[data-count]");
    if (!("IntersectionObserver" in window)) { els.forEach(el => { el.classList.add("is-in"); if (el.dataset.count) count(el); }); return; }
    // clip-path hides a node from IntersectionObserver, so masked nodes are watched through their parent
    const map = new Map();
    els.forEach(el => { const t = el.hasAttribute("data-mask") ? el.parentElement : el; if (!map.has(t)) map.set(t, []); map.get(t).push(el); });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        (map.get(en.target) || []).forEach(el => { el.classList.add("is-in"); if (el.dataset.count) count(el); });
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    map.forEach((_, t) => io.observe(t));
  }
  function count(el) {
    const end = parseFloat(el.dataset.count); const dec = (el.dataset.count.split(".")[1] || "").length;
    const suf = el.dataset.suffix || ""; const dur = 1800; const t0 = performance.now();
    if (reduce) { el.textContent = end.toFixed(dec) + suf; return; }
    const tick = t => { const p = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - p, 4); el.textContent = (end * e).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  /* ---------- parallax ---------- */
  const par = $$("[data-speed]");
  const runParallax = () => {
    const vh = window.innerHeight;
    par.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const c = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0,${(c * parseFloat(el.dataset.speed)).toFixed(1)}px,0)`;
    });
  };

  /* ---------- manifesto words ---------- */
  const mani = $(".manifesto");
  let maniWords = [];
  if (mani) {
    const walk = node => Array.from(node.childNodes).forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(p => { if (!p) return; if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(" ")); else { const s = document.createElement("span"); s.className = "wd"; s.textContent = p; frag.appendChild(s); } });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
    walk(mani); maniWords = $$(".wd", mani);
  }
  const runMani = () => {
    if (!mani) return;
    const r = mani.getBoundingClientRect(); const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    const n = Math.round(p * maniWords.length);
    maniWords.forEach((w, i) => w.classList.toggle("on", i < n));
  };

  /* ---------- scroll loop ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { onScrollHdr(); if (!reduce) runParallax(); runMani(); updateOccNav(); ticking = false; });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---------- hero: rotator, mouse parallax ---------- */
  const rot = $(".rotator");
  if (rot) {
    const items = $$("span", rot); let i = 0;
    items[0].classList.add("is-on");
    if (!reduce) setInterval(() => {
      const cur = items[i]; i = (i + 1) % items.length; const nxt = items[i];
      cur.classList.remove("is-on"); cur.classList.add("is-off");
      nxt.classList.remove("is-off"); nxt.classList.add("is-on");
      setTimeout(() => cur.classList.remove("is-off"), 900);
    }, 2400);
  }
  const art = $(".hero__art");
  if (art && fine && !reduce) {
    const cards = $$(".hcard", art);
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", e => { tx = (e.clientX / innerWidth - 0.5); ty = (e.clientY / innerHeight - 0.5); });
    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      cards.forEach((c, k) => { const d = (k + 1) * 14; c.style.transform = `translate3d(${(-cx * d).toFixed(2)}px,${(-cy * d).toFixed(2)}px,0)`; });
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- embers canvas ---------- */
  const cv = $(".hero__embers");
  if (cv && !reduce) {
    const ctx = cv.getContext("2d");
    let W, H, dpr, parts = [];
    const size = () => { dpr = Math.min(2, window.devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); window.addEventListener("resize", size);
    const N = Math.min(70, Math.round(innerWidth / 18));
    const mk = (init) => ({ x: Math.random() * W, y: init ? Math.random() * H : H + 20, r: Math.random() * 2.2 + 0.5, vy: Math.random() * 0.45 + 0.15, vx: (Math.random() - 0.5) * 0.25, a: Math.random() * 0.6 + 0.2, ph: Math.random() * 6.28, hue: Math.random() < 0.18 ? 1 : 0 });
    for (let k = 0; k < N; k++) parts.push(mk(true));
    let vis = true;
    new IntersectionObserver(([en]) => { vis = en.isIntersecting; }).observe(cv);
    const draw = t => {
      if (vis) {
        ctx.clearRect(0, 0, W, H);
        parts.forEach((p, k) => {
          p.y -= p.vy; p.x += p.vx + Math.sin(t / 1400 + p.ph) * 0.25;
          if (p.y < -20) parts[k] = mk(false);
          const fl = 0.55 + Math.sin(t / 300 + p.ph) * 0.45;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          const col = p.hue ? "228,92,52" : "233,196,106";
          g.addColorStop(0, `rgba(${col},${p.a * fl})`); g.addColorStop(1, `rgba(${col},0)`);
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.283); ctx.fill();
        });
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  /* ---------- cursor & magnetic ---------- */
  if (fine && !reduce) {
    const cur = document.createElement("div"); cur.className = "cursor"; cur.innerHTML = "<span>View</span>"; document.body.appendChild(cur);
    let mx = -100, my = -100, x = -100, y = -100;
    window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
    const loop = () => { x += (mx - x) * 0.2; y += (my - y) * 0.2; cur.style.transform = `translate3d(${x}px,${y}px,0)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener("mouseover", e => {
      const v = e.target.closest("[data-cursor='view']");
      const l = e.target.closest("a,button,label,summary,input,select,textarea");
      cur.classList.toggle("is-view", !!v);
      cur.classList.toggle("is-link", !v && !!l);
    });
    $$("[data-magnetic]").forEach(el => {
      el.addEventListener("mousemove", e => { const r = el.getBoundingClientRect(); const dx = e.clientX - r.left - r.width / 2; const dy = e.clientY - r.top - r.height / 2; el.style.transform = `translate(${dx * 0.22}px,${dy * 0.3}px)`; });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- horizontal scroller ---------- */
  $$(".hscroll").forEach(h => {
    const tr = $(".hscroll__track", h); const bar = $(".hscroll__bar i", h);
    const prev = $("[data-prev]", h.parentElement) || $("[data-prev]"); const next = $("[data-next]", h.parentElement) || $("[data-next]");
    const step = () => { const c = $(".dish", tr); return c ? c.getBoundingClientRect().width + 28 : 300; };
    if (prev) prev.addEventListener("click", () => tr.scrollBy({ left: -step(), behavior: "smooth" }));
    if (next) next.addEventListener("click", () => tr.scrollBy({ left: step(), behavior: "smooth" }));
    const upd = () => { if (!bar) return; const max = tr.scrollWidth - tr.clientWidth; const w = Math.max(12, (tr.clientWidth / tr.scrollWidth) * 100); bar.style.width = w + "%"; bar.style.left = (max > 0 ? (tr.scrollLeft / max) * (100 - w) : 0) + "%"; };
    tr.addEventListener("scroll", upd, { passive: true }); window.addEventListener("resize", upd); upd();
    let down = false, sx = 0, sl = 0, moved = false;
    tr.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = tr.scrollLeft; });
    window.addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; tr.classList.add("is-drag"); } tr.scrollLeft = sl - dx; });
    window.addEventListener("pointerup", () => { if (!down) return; down = false; setTimeout(() => tr.classList.remove("is-drag"), 30); });
    tr.addEventListener("click", e => { if (moved) { e.preventDefault(); moved = false; } }, true);
  });

  /* ---------- videos: play only when visible ---------- */
  $$("video[data-autoplay]").forEach(v => {
    v.muted = true; v.playsInline = true;
    if (reduce) return;
    new IntersectionObserver(([en]) => { if (en.isIntersecting) { const p = v.play(); if (p) p.catch(() => {}); } else v.pause(); }, { threshold: 0.25 }).observe(v);
  });
  $$(".vframe__toggle").forEach(b => {
    const v = $("video", b.parentElement);
    const sync = () => { b.innerHTML = v.paused ? ICON.play : ICON.pause; b.setAttribute("aria-label", v.paused ? "Play video" : "Pause video"); };
    b.addEventListener("click", () => { v.paused ? v.play() : v.pause(); });
    v.addEventListener("play", sync); v.addEventListener("pause", sync); sync();
  });

  /* ---------- open now (Sweet T's, Mon–Fri 3pm–9pm UK) ---------- */
  $$("[data-open-status]").forEach(el => {
    const upd = () => {
      let day, hr;
      try {
        const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
        day = parts.find(p => p.type === "weekday").value; const h = +parts.find(p => p.type === "hour").value; const m = +parts.find(p => p.type === "minute").value; hr = h + m / 60;
      } catch (e) { const d = new Date(); day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]; hr = d.getHours() + d.getMinutes() / 60; }
      const weekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day);
      const open = weekday && hr >= 15 && hr < 21;
      el.classList.toggle("is-open", open);
      const txt = $("span", el);
      if (open) txt.textContent = "Open now · until 9pm";
      else if (weekday && hr < 15) txt.textContent = "Opens today at 3pm";
      else txt.textContent = day === "Fri" || day === "Sat" || day === "Sun" ? "Closed · opens Monday 3pm" : "Closed · opens tomorrow 3pm";
    };
    upd(); setInterval(upd, 60000);
  });

  /* ---------- toast ---------- */
  let toastT;
  const toast = msg => {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.innerHTML = "<i></i><span></span>"; document.body.appendChild(t); }
    $("span", t).textContent = msg; t.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-on"), 2600);
  };

  /* ---------- the spread (selection tray) ---------- */
  const KEY = "nico-spread";
  let spread = store.get(KEY, []);
  if (!Array.isArray(spread)) spread = [];
  const tray = $(".tray");
  const trayList = $(".tray__list");
  const save = () => store.set(KEY, spread);
  function renderSpread(bump) {
    $$(".tray-btn__n").forEach(n => { n.textContent = spread.length; if (bump) { n.classList.remove("bump"); void n.offsetWidth; n.classList.add("bump"); } });
    $$(".add[data-id]").forEach(b => { const on = spread.some(s => s.id === b.dataset.id); b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", String(on)); b.setAttribute("aria-label", (on ? "Remove " : "Add ") + b.dataset.name + (on ? " from" : " to") + " your spread"); });
    if (trayList) {
      trayList.innerHTML = "";
      $(".tray__empty").hidden = spread.length > 0;
      $(".tray__foot").hidden = spread.length === 0;
      spread.forEach(s => {
        const li = document.createElement("li");
        li.innerHTML = `<div><b></b><small></small></div><button class="tray__rm" type="button">${ICON.plus}</button>`;
        $("b", li).textContent = s.name; $("small", li).textContent = s.cat;
        const rm = $("button", li); rm.setAttribute("aria-label", "Remove " + s.name);
        rm.addEventListener("click", () => { spread = spread.filter(x => x.id !== s.id); save(); renderSpread(); });
        trayList.appendChild(li);
      });
    }
    renderSpreadBox();
  }
  function openTray() { if (!tray) return; tray.classList.add("is-open"); tray.setAttribute("aria-hidden", "false"); document.body.classList.add("is-locked"); setTimeout(() => $(".tray__close").focus(), 300); }
  function closeTray() { if (!tray || !tray.classList.contains("is-open")) return; tray.classList.remove("is-open"); tray.setAttribute("aria-hidden", "true"); if (!doc.classList.contains("is-menu-open")) document.body.classList.remove("is-locked"); }
  $$("[data-open-tray]").forEach(b => b.addEventListener("click", () => { closeMenu(); openTray(); }));
  $$("[data-close-tray]").forEach(b => b.addEventListener("click", closeTray));
  const clr = $(".tray__clear"); if (clr) clr.addEventListener("click", () => { spread = []; save(); renderSpread(); });
  $$(".add[data-id]").forEach(b => b.addEventListener("click", () => {
    const id = b.dataset.id; const has = spread.some(s => s.id === id);
    if (has) { spread = spread.filter(s => s.id !== id); toast(b.dataset.name + " removed"); }
    else { spread.push({ id, name: b.dataset.name, cat: b.dataset.cat }); toast(b.dataset.name + " added to your spread"); }
    save(); renderSpread(!has);
  }));
  const trayWa = $("[data-tray-wa]");
  if (trayWa) trayWa.addEventListener("click", () => {
    const msg = "Hi Nico! I'd love a catering quote. Here's the spread I'm thinking of:\n" + spread.map(s => "• " + s.name).join("\n") + "\n\nEvent date: \nGuests: \nLocation: ";
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });
  function renderSpreadBox() {
    const box = $("[data-spread-box]"); if (!box) return;
    if (!spread.length) { box.innerHTML = 'Nothing picked yet. Browse <a href="menu.html">the menu</a> and tap <b>+</b> on any dish to build your spread, or just tell us what you fancy below.'; return; }
    box.innerHTML = "<span>Your spread from the menu (" + spread.length + "):</span><ul></ul>";
    const ul = $("ul", box); spread.forEach(s => { const li = document.createElement("li"); li.textContent = s.name; ul.appendChild(li); });
  }
  renderSpread();

  /* ---------- menu filtering ---------- */
  const tabs = $(".tabs");
  if (tabs) {
    const pill = $(".tabs__pill", tabs);
    const btns = $$(".tab", tabs);
    const items = $$(".mitem"); const cats = $$(".mcat"); const empty = $(".mempty");
    const search = $("#menu-search");
    let active = "all";
    const movePill = b => { pill.style.left = b.offsetLeft + "px"; pill.style.width = b.offsetWidth + "px"; };
    const apply = () => {
      const q = (search && search.value || "").trim().toLowerCase();
      let shown = 0;
      cats.forEach(c => {
        const catOk = active === "all" || c.dataset.cat === active;
        let any = 0;
        $$(".mitem", c).forEach(it => {
          const ok = catOk && (!q || it.dataset.search.includes(q));
          const was = it.classList.contains("is-hidden");
          it.classList.toggle("is-hidden", !ok);
          if (ok) { any++; if (was) { it.classList.remove("is-pop"); void it.offsetWidth; it.classList.add("is-pop"); } }
        });
        c.classList.toggle("is-hidden", !any);
        shown += any;
      });
      empty.classList.toggle("is-on", shown === 0);
    };
    btns.forEach(b => b.addEventListener("click", () => {
      btns.forEach(x => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-selected", String(x === b)); });
      active = b.dataset.filter; movePill(b); apply();
      b.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      const top = $(".menu-anchor"); if (top && window.scrollY > top.offsetTop) window.scrollTo({ top: top.offsetTop - 60, behavior: reduce ? "auto" : "smooth" });
    }));
    if (search) search.addEventListener("input", apply);
    const init = () => movePill($(".tab.is-on", tabs));
    init(); window.addEventListener("resize", init); document.fonts && document.fonts.ready.then(init);
    const hash = location.hash.replace("#", "");
    const hb = btns.find(b => b.dataset.filter === hash); if (hb) hb.click();
  }

  /* ---------- gallery & lightbox ---------- */
  const gItems = $$(".gitem");
  $$(".gf").forEach(b => b.addEventListener("click", () => {
    $$(".gf").forEach(x => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-pressed", String(x === b)); });
    const f = b.dataset.filter;
    gItems.forEach(g => { const ok = f === "all" || g.dataset.cat === f; g.classList.toggle("is-hidden", !ok); });
  }));
  const lb = $(".lb");
  let lbIdx = 0, lastFocus = null;
  const visibleG = () => gItems.filter(g => !g.classList.contains("is-hidden"));
  function showLb(i) {
    const list = visibleG(); if (!list.length) return;
    lbIdx = (i + list.length) % list.length; const g = list[lbIdx];
    const stage = $(".lb__media", lb); stage.innerHTML = "";
    const media = $("img,video", g);
    let el;
    if (media.tagName === "VIDEO") { el = document.createElement("video"); el.src = media.currentSrc || $("source", media).src; el.controls = true; el.autoplay = true; el.playsInline = true; el.muted = false; }
    else { el = document.createElement("img"); el.src = media.dataset.full || media.src; el.alt = media.alt; }
    stage.appendChild(el);
    $(".lb__cap", lb).textContent = g.dataset.caption || "";
    $(".lb__count", lb).textContent = String(lbIdx + 1).padStart(2, "0") + " / " + String(list.length).padStart(2, "0");
  }
  function openLb(g) { if (!lb) return; lastFocus = document.activeElement; showLb(visibleG().indexOf(g)); lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false"); document.body.classList.add("is-locked"); $(".lb__close", lb).focus(); }
  function closeLb() { if (!lb || !lb.classList.contains("is-open")) return; lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); $(".lb__media", lb).innerHTML = ""; document.body.classList.remove("is-locked"); if (lastFocus) lastFocus.focus(); }
  gItems.forEach(g => { g.addEventListener("click", () => openLb(g)); g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(g); } }); });
  if (lb) {
    $(".lb__close", lb).addEventListener("click", closeLb);
    $(".lb__prev", lb).addEventListener("click", () => showLb(lbIdx - 1));
    $(".lb__next", lb).addEventListener("click", () => showLb(lbIdx + 1));
    lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lb__stage")) closeLb(); });
    document.addEventListener("keydown", e => { if (!lb.classList.contains("is-open")) return; if (e.key === "ArrowLeft") showLb(lbIdx - 1); if (e.key === "ArrowRight") showLb(lbIdx + 1); });
    let sx = 0; lb.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) showLb(lbIdx + (dx < 0 ? 1 : -1)); });
  }

  /* ---------- occasions side nav ---------- */
  const occLinks = $$(".occ-nav a");
  const occBlocks = occLinks.map(a => $(a.getAttribute("href"))).filter(Boolean);
  function updateOccNav() {
    if (!occBlocks.length) return;
    let cur = occBlocks[0];
    occBlocks.forEach(b => { if (b.getBoundingClientRect().top < innerHeight * 0.4) cur = b; });
    occLinks.forEach(a => a.classList.toggle("is-on", a.getAttribute("href") === "#" + cur.id));
  }

  /* ---------- FAQ smooth accordion ---------- */
  $$(".faq details").forEach(d => {
    const s = $("summary", d); const a = $(".ans", d);
    s.addEventListener("click", e => {
      if (reduce) return;
      e.preventDefault();
      if (d.open) {
        a.style.height = a.scrollHeight + "px"; requestAnimationFrame(() => { a.style.height = "0px"; });
        setTimeout(() => { d.open = false; a.style.height = ""; }, 480);
      } else {
        d.open = true; const h = a.scrollHeight; a.style.height = "0px";
        requestAnimationFrame(() => { a.style.height = h + "px"; });
        setTimeout(() => { a.style.height = ""; }, 520);
      }
    });
  });

  /* ---------- contact / quote form ---------- */
  const form = $("#quote-form");
  if (form) {
    const range = $("#f-guests"); const out = $("#f-guests-out");
    const syncRange = () => { const v = +range.value; out.textContent = v >= 500 ? "500+" : v; range.style.setProperty("--p", ((v - range.min) / (range.max - range.min)) * 100 + "%"); };
    range.addEventListener("input", syncRange); syncRange();
    $$("select", form).forEach(s => { const f = () => s.classList.toggle("has-val", !!s.value); s.addEventListener("change", f); f(); });
    const dateIn = $("#f-date"); if (dateIn) { const t = new Date(); t.setDate(t.getDate() + 1); dateIn.min = t.toISOString().slice(0, 10); }
    // preselect occasion from ?occasion=
    const qp = new URLSearchParams(location.search).get("occasion");
    if (qp) { const r = $(`input[name="occasion"][value="${CSS.escape(qp)}"]`, form); if (r) r.checked = true; }

    const validate = () => {
      let ok = true;
      $$("[required]", form).forEach(inp => {
        const f = inp.closest(".field"); if (!f) return;
        let bad = !inp.value.trim();
        if (!bad && inp.type === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value);
        if (!bad && inp.type === "tel") bad = inp.value.replace(/\D/g, "").length < 10;
        f.classList.toggle("is-err", bad); if (bad) ok = false;
      });
      if (!ok) { const first = $(".is-err input,.is-err select,.is-err textarea", form); if (first) first.focus(); }
      return ok;
    };
    $$("input,select,textarea", form).forEach(i => i.addEventListener("input", () => { const f = i.closest(".field"); if (f) f.classList.remove("is-err"); }));
    const compose = () => {
      const fd = new FormData(form);
      const styles = fd.getAll("style");
      const dateVal = fd.get("date");
      const dateTxt = dateVal ? new Date(dateVal + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "TBC";
      const lines = [
        "Catering enquiry · Nico Catering Ltd", "",
        "Name: " + fd.get("name"),
        "Phone: " + fd.get("phone"),
        "Email: " + fd.get("email"),
        "Occasion: " + (fd.get("occasion") || "Not specified"),
        "Date: " + dateTxt,
        "Guests: " + (range.value >= 500 ? "500+" : range.value),
        "Location / venue: " + (fd.get("venue") || "TBC"),
        "Service style: " + (styles.length ? styles.join(", ") : "Open to suggestions")
      ];
      if (spread.length) lines.push("", "Dishes from the menu:", ...spread.map(s => "• " + s.name));
      const notes = (fd.get("notes") || "").trim(); if (notes) lines.push("", "Notes: " + notes);
      return { text: lines.join("\n"), subject: "Catering enquiry – " + (fd.get("occasion") || "Event") + " – " + dateTxt };
    };
    const done = how => {
      const ok = $(".form-ok"); ok.classList.add("is-on");
      $("[data-how]", ok).textContent = how;
      ok.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    };
    form.addEventListener("submit", e => {
      e.preventDefault(); if (!validate()) return;
      const m = compose();
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(m.text), "_blank", "noopener");
      done("WhatsApp has opened with your enquiry ready to send.");
    });
    $("[data-send-email]").addEventListener("click", () => {
      if (!validate()) return;
      const m = compose();
      location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(m.subject) + "&body=" + encodeURIComponent(m.text);
      done("Your email app has opened with your enquiry ready to send.");
    });
  }

  /* ---------- misc ---------- */
  onScroll();
  $$("[data-year]").forEach(e => { e.textContent = new Date().getFullYear(); });
  $$("[data-totop]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); }));
})();
