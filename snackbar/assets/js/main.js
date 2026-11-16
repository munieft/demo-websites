/* Snack Bar Dagenham — site interactions (vanilla JS, no frameworks) */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const BIZ = {
    mobile: "447578138728",
    hours: { 1: [7, 17], 2: [7, 17], 3: [7, 17], 4: [7, 17], 5: [7, 17], 6: [7, 17], 0: null }
  };
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  /* ---------- Preloader ---------- */
  const loader = $(".loader");
  let seen = false;
  try { seen = sessionStorage.getItem("sb-seen") === "1"; sessionStorage.setItem("sb-seen", "1"); } catch (e) {}
  const minTime = seen ? 250 : 1300;
  const t0 = performance.now();
  function hideLoader() {
    const wait = Math.max(0, minTime - (performance.now() - t0));
    setTimeout(() => {
      if (loader) loader.classList.add("done");
      document.body.classList.remove("is-loading");
      document.body.classList.add("ready");
      kickReveals();
    }, wait);
  }
  if (document.readyState === "complete") hideLoader(); else window.addEventListener("load", hideLoader);
  setTimeout(hideLoader, 4000); // safety

  /* ---------- Page transitions ---------- */
  const veil = $(".veil");
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || !veil) return;
    const href = a.getAttribute("href") || "";
    if (a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || !/\.html(#.*)?$/.test(href) || href.startsWith("http")) return;
    e.preventDefault();
    veil.classList.add("on");
    setTimeout(() => { window.location.href = href; }, 480);
  });
  window.addEventListener("pageshow", () => veil && veil.classList.remove("on"));

  /* ---------- Header ---------- */
  const header = $(".header");
  const fabTop = $(".fab__top");
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle("scrolled", y > 20);
    fabTop && fabTop.classList.toggle("show", y > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  fabTop && fabTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const burger = $(".burger");
  burger && burger.addEventListener("click", () => {
    const open = document.documentElement.classList.toggle("menu-open");
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
  });
  $$(".drawer a").forEach((a) => a.addEventListener("click", () => {
    document.documentElement.classList.remove("menu-open");
    document.body.classList.remove("menu-open");
  }));

  /* ---------- Opening status (UK time) ---------- */
  function londonNow() {
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London", weekday: "short", hour: "numeric", minute: "numeric", second: "numeric", hour12: false
      }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t).value;
      const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: map[get("weekday")], h: +get("hour") % 24, m: +get("minute"), s: +get("second") };
    } catch (e) {
      const d = new Date();
      return { day: d.getDay(), h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() };
    }
  }
  function nextOpening(day) {
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      if (BIZ.hours[d]) return { d, i, h: BIZ.hours[d][0] };
    }
  }
  function status() {
    const n = londonNow();
    const hrs = BIZ.hours[n.day];
    const mins = n.h * 60 + n.m;
    if (hrs && mins >= hrs[0] * 60 && mins < hrs[1] * 60) {
      const left = hrs[1] * 60 - mins;
      const pct = ((mins - hrs[0] * 60) / ((hrs[1] - hrs[0]) * 60)) * 100;
      const l = left >= 60 ? `${Math.floor(left / 60)}h ${left % 60}m` : `${left} min`;
      return { open: true, n, pct, short: "Open now · till 5pm", long: `We're <strong>open</strong> — kitchen's on and the kettle's hot. Closing at 5pm (${l} to go).` };
    }
    const nx = hrs && mins < hrs[0] * 60 ? { d: n.day, i: 0, h: hrs[0] } : nextOpening(n.day);
    const when = nx.i === 0 ? "today" : nx.i === 1 ? "tomorrow" : DAYS[nx.d];
    return { open: false, n, pct: hrs && mins >= hrs[1] * 60 ? 100 : 0, short: `Closed · opens ${when} 7am`, long: `We're <strong>closed</strong> right now. Doors open ${when} at 7am — breakfast will be waiting.` };
  }
  function paintStatus() {
    const s = status();
    $$("[data-status]").forEach((el) => {
      el.classList.toggle("open", s.open);
      el.classList.toggle("closed", !s.open);
      const t = $("span", el); if (t) t.textContent = s.short;
    });
    const clock = $("#clock");
    if (clock) {
      const pad = (x) => String(x).padStart(2, "0");
      clock.textContent = `${pad(s.n.h)}:${pad(s.n.m)}`;
      $("#dayname").textContent = `${DAYS[s.n.day]} in Dagenham`;
      $("#statusMsg").innerHTML = s.long;
      const bar = $("#meter");
      if (bar) bar.style.width = Math.max(0, Math.min(100, s.pct)) + "%";
    }
    $$(".hours li").forEach((li) => li.classList.toggle("today", +li.dataset.day === s.n.day));
  }
  paintStatus();
  setInterval(paintStatus, 20000);

  /* ---------- Reveal on scroll ---------- */
  let io;
  function kickReveals() {
    if (io) return;
    const els = $$("[data-reveal], .split-line, .underline-scribble, [data-count]");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => { el.classList.add("in"); if (el.dataset.count) count(el); });
      return;
    }
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const d = el.dataset.delay;
        if (d) el.style.transitionDelay = d + "ms";
        el.classList.add("in");
        if (el.dataset.count) count(el);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  }
  // Stagger children
  $$("[data-stagger]").forEach((wrap) => {
    Array.from(wrap.children).forEach((c, i) => {
      c.setAttribute("data-reveal", c.getAttribute("data-reveal") || "");
      c.dataset.delay = i * (+wrap.dataset.stagger || 90);
    });
  });

  /* ---------- Counters ---------- */
  function count(el) {
    const end = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split(".")[1] || "").length;
    const dur = 1600;
    const st = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - st) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = (end * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Marquee ---------- */
  $$(".marquee__track").forEach((tr) => { tr.innerHTML += tr.innerHTML; });

  /* ---------- Parallax ---------- */
  const px = $$("[data-parallax]");
  if (px.length && !reduce) {
    let ticking = false;
    const run = () => {
      const vh = window.innerHeight;
      px.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const sp = parseFloat(el.dataset.parallax) || 0.1;
        const off = (r.top + r.height / 2 - vh / 2) * sp;
        el.style.transform = `translate3d(0,${off.toFixed(1)}px,0) scale(1.1)`;
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(run); ticking = true; } }, { passive: true });
    run();
  }
  const stage = $(".hero__stage");
  if (stage && !reduce && window.matchMedia("(pointer:fine)").matches) {
    const items = $$("[data-depth]", stage);
    stage.parentElement.addEventListener("mousemove", (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      items.forEach((it) => {
        const d = parseFloat(it.dataset.depth);
        const rot = it.dataset.rot || 0;
        it.style.transform = `translate(${(-x * d).toFixed(1)}px,${(-y * d).toFixed(1)}px) rotate(${rot}deg)`;
      });
    });
  }

  /* ---------- Autoplay videos when visible ---------- */
  const vids = $$("video[data-autoplay]");
  if (vids.length && "IntersectionObserver" in window) {
    const vio = new IntersectionObserver((ens) => ens.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) { const p = v.play(); p && p.catch(() => {}); } else v.pause();
    }), { threshold: 0.2 });
    vids.forEach((v) => { v.muted = true; vio.observe(v); });
  }

  /* ---------- Rails (drag + buttons) ---------- */
  $$(".rail").forEach((rail) => {
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add("dragging"); });
    window.addEventListener("pointermove", (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = sl - dx; });
    window.addEventListener("pointerup", () => { if (!down) return; down = false; rail.classList.remove("dragging"); });
    rail.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    const nav = document.querySelector(`[data-rail="${rail.id}"]`);
    if (nav) {
      const amt = () => rail.clientWidth * 0.8;
      $(".prev", nav).addEventListener("click", () => rail.scrollBy({ left: -amt(), behavior: "smooth" }));
      $(".next", nav).addEventListener("click", () => rail.scrollBy({ left: amt(), behavior: "smooth" }));
    }
  });

  /* ---------- Custom cursor ---------- */
  const cur = $(".cursor");
  if (cur && window.matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
    const loop = () => { cx += (x - cx) * 0.2; cy += (y - cy) * 0.2; cur.style.left = cx + "px"; cur.style.top = cy + "px"; requestAnimationFrame(loop); };
    loop();
    document.addEventListener("mouseover", (e) => cur.classList.toggle("big", !!e.target.closest("a,button,.plate,.gi,.rail__item,.mi,.polaroid")));
  } else if (cur) cur.remove();

  /* ---------- Copy buttons ---------- */
  $$("[data-copy]").forEach((b) => b.addEventListener("click", () => {
    const txt = b.dataset.copy;
    const done = () => { const o = b.textContent; b.textContent = "Copied ✓"; setTimeout(() => (b.textContent = o), 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, () => fallbackCopy(txt, done));
    else fallbackCopy(txt, done);
  }));
  function fallbackCopy(t, cb) {
    const ta = document.createElement("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); cb(); } catch (e) {}
    ta.remove();
  }

  /* ---------- Order / enquiry form → WhatsApp ---------- */
  const form = $("#orderForm");
  if (form) {
    const okBox = $(".form__ok", form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      $$("[required]", form).forEach((inp) => {
        const f = inp.closest(".field");
        const bad = !inp.value.trim() || (inp.type === "tel" && !/^[0-9 +()-]{7,}$/.test(inp.value.trim()));
        f.classList.toggle("invalid", bad);
        if (bad) valid = false;
      });
      if (!valid) return;
      const v = (n) => (form.elements[n] ? form.elements[n].value.trim() : "");
      const lines = [
        "Hi Snack Bar! 👋",
        `I'd like to ${v("type").toLowerCase()}.`,
        "",
        `Name: ${v("name")}`,
        `Phone: ${v("phone")}`,
        v("time") ? `Time: ${v("time")}` : "",
        "",
        v("message")
      ].filter((l, i, a) => !(l === "" && a[i - 1] === ""));
      const url = `https://wa.me/${BIZ.mobile}?text=${encodeURIComponent(lines.join("\n"))}`;
      const link = $("#waLink");
      if (link) link.href = url;
      okBox.classList.add("show");
      window.open(url, "_blank", "noopener");
    });
    $$("input,textarea,select", form).forEach((i) => i.addEventListener("input", () => i.closest(".field").classList.remove("invalid")));
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* =========================================================
     MENU PAGE
     ========================================================= */
  const menuRoot = $("#menuRoot");
  if (menuRoot && window.SB_MENU) {
    const ICONS = window.SB_ICONS || {};
    menuRoot.innerHTML = window.SB_MENU.map((cat, ci) => `
      <section class="menu-cat" id="${cat.id}" data-cat="${cat.id}">
        <div class="menu-cat__head" data-reveal>
          <div class="menu-cat__num">${String(ci + 1).padStart(2, "0")}</div>
          <div><span class="eyebrow">${cat.kicker}</span><h2 class="title-md">${cat.name}</h2><p>${cat.blurb}</p></div>
        </div>
        <div class="menu-grid">
          ${cat.items.map((it, i) => `
            <article class="mi" data-reveal data-delay="${(i % 4) * 70}" data-search="${(it.name + " " + it.desc + " " + (it.tags || []).join(" ")).toLowerCase()}">
              <div class="mi__img">${it.img ? `<img src="assets/img/${it.img}.jpg" alt="${it.name} at Snack Bar Dagenham" loading="lazy">` : ICONS[cat.icon] || ""}</div>
              <div>
                <div class="mi__top"><h4>${it.name}</h4><span class="mi__dots"></span></div>
                <p>${it.desc}</p>
                <div class="badges">${(it.tags || []).map((t) => `<span class="badge ${t === "Favourite" ? "badge--star" : t === "Veggie option" || t === "Vegetarian" ? "badge--v" : t === "Hot" || t === "Homemade" ? "badge--hot" : ""}">${t}</span>`).join("")}</div>
              </div>
            </article>`).join("")}
        </div>
      </section>`).join("");

    const tabs = $$(".tab");
    tabs.forEach((t) => t.addEventListener("click", () => {
      const id = t.dataset.target;
      if (id === "all") { window.scrollTo({ top: $("#menuRoot").offsetTop - 180, behavior: "smooth" }); return; }
      const sec = document.getElementById(id);
      sec && sec.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    const secs = $$(".menu-cat");
    const spy = () => {
      let cur = "all";
      secs.forEach((s) => { if (!s.classList.contains("hide") && s.getBoundingClientRect().top < 220) cur = s.id; });
      tabs.forEach((t) => t.classList.toggle("active", t.dataset.target === cur));
    };
    window.addEventListener("scroll", spy, { passive: true });
    spy();

    const search = $("#menuSearch");
    const empty = $(".menu-empty");
    search && search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      let any = false;
      secs.forEach((s) => {
        let shown = 0;
        $$(".mi", s).forEach((m) => {
          const hit = !q || m.dataset.search.includes(q);
          m.classList.toggle("hide", !hit);
          if (hit) { shown++; m.classList.add("in"); }
        });
        s.classList.toggle("hide", shown === 0);
        if (shown) any = true;
      });
      empty.classList.toggle("show", !any);
    });
    if (location.hash) { const s = document.getElementById(location.hash.slice(1)); s && setTimeout(() => s.scrollIntoView(), 600); }
  }

  /* =========================================================
     GALLERY PAGE
     ========================================================= */
  const gal = $(".masonry");
  if (gal) {
    const items = $$(".gi", gal);
    $$(".filters .tab").forEach((b) => b.addEventListener("click", () => {
      $$(".filters .tab").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      const f = b.dataset.filter;
      items.forEach((it) => {
        const show = f === "all" || it.dataset.group === f;
        it.classList.toggle("hide", !show);
        if (show) it.classList.add("in");
      });
    }));
    const lb = $(".lightbox");
    const stageEl = $(".lightbox__stage", lb);
    const cap = $(".lightbox__cap", lb);
    const cnt = $(".lightbox__count", lb);
    let idx = 0, list = [];
    const show = (i) => {
      idx = (i + list.length) % list.length;
      const it = list[idx];
      const vid = it.dataset.video;
      stageEl.innerHTML = vid
        ? `<video src="${vid}" autoplay loop muted playsinline controls></video>`
        : `<img src="${$("img", it).src}" alt="${it.dataset.caption}">`;
      cap.textContent = it.dataset.caption;
      cnt.textContent = `${idx + 1} / ${list.length}`;
    };
    const open = (it) => {
      list = items.filter((x) => !x.classList.contains("hide"));
      show(list.indexOf(it));
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; setTimeout(() => (stageEl.innerHTML = ""), 400); };
    items.forEach((it) => {
      it.tabIndex = 0;
      it.addEventListener("click", () => open(it));
      it.addEventListener("keydown", (e) => { if (e.key === "Enter") open(it); });
    });
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-prev", lb).addEventListener("click", () => show(idx - 1));
    $(".lb-next", lb).addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    let tx = 0;
    lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1)); });
  }
})();
