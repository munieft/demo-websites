/* Shaz & Shami Food — interactions (vanilla JS, no dependencies) */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Year ---------- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Nav: solid on scroll, hide on scroll-down ---------- */
  const nav = $('#nav');
  const orderbar = $('#orderbar');
  let lastY = window.scrollY;
  const onScroll = () => {
    const yNow = window.scrollY;
    nav.classList.toggle('is-scrolled', yNow > 30);
    if (!nav.classList.contains('is-open')) {
      nav.classList.toggle('is-hidden', yNow > lastY && yNow > 500);
    }
    if (orderbar) orderbar.classList.toggle('is-visible', yNow > window.innerHeight * 0.6);
    lastY = yNow;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = $('#navToggle');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  // stagger siblings
  reveals.forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', `${Math.min(i * 0.08, 0.5)}s`);
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Videos: only play while on screen ---------- */
  const vids = $$('video');
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver(entries => {
      entries.forEach(en => {
        const v = en.target;
        if (en.isIntersecting && !reduceMotion) {
          if (v.preload === 'none') v.preload = 'auto';
          const p = v.play(); if (p && p.catch) p.catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.2 });
    vids.forEach(v => vio.observe(v));
  }
  if (reduceMotion) vids.forEach(v => { v.removeAttribute('autoplay'); v.pause(); });

  /* ---------- Gentle parallax on truck photos ---------- */
  const para = $$('[data-parallax]');
  if (para.length && !reduceMotion && window.matchMedia('(min-width: 641px)').matches) {
    let ticking = false;
    const run = () => {
      const vh = window.innerHeight;
      para.forEach(el => {
        const r = el.getBoundingClientRect();
        const offset = Math.max(-40, Math.min(40, (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax)));
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(run); ticking = true; } }, { passive: true });
    run();
  }

  /* ---------- Ember particles in hero ---------- */
  const canvas = $('#embers');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, embers = [], running = true;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const count = () => Math.round(Math.min(70, Math.max(24, w / 22)));
    const spawn = (initial) => ({
      x: w * (0.35 + Math.random() * 0.65),
      y: initial ? Math.random() * h : h + 10,
      r: Math.random() * 1.8 + 0.6,
      vy: Math.random() * 0.6 + 0.25,
      vx: (Math.random() - 0.5) * 0.25,
      life: Math.random() * Math.PI * 2,
      hue: 18 + Math.random() * 26
    });
    const init = () => { resize(); embers = Array.from({ length: count() }, () => spawn(true)); };
    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const e of embers) {
        e.life += 0.03;
        e.y -= e.vy;
        e.x += e.vx + Math.sin(e.life) * 0.3;
        const a = Math.max(0, Math.min(1, e.y / h)) * (0.55 + Math.sin(e.life * 2) * 0.3);
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
        g.addColorStop(0, `hsla(${e.hue}, 95%, 62%, ${a})`);
        g.addColorStop(1, `hsla(${e.hue}, 95%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2); ctx.fill();
        if (e.y < -10) Object.assign(e, spawn(false));
      }
      requestAnimationFrame(tick);
    };
    init(); tick();
    window.addEventListener('resize', () => { resize(); });
    const hio = new IntersectionObserver(([en]) => {
      const was = running; running = en.isIntersecting;
      if (running && !was) tick();
    });
    hio.observe(canvas);
  }

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox');
  const items = $$('#galleryGrid .g');
  if (lb && items.length) {
    const img = $('.lightbox__img', lb);
    const cap = $('.lightbox__cap', lb);
    let idx = 0, lastFocus = null;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const src = items[idx].dataset.full;
      const alt = $('img', items[idx]).alt;
      img.src = src; img.alt = alt; cap.textContent = alt;
    };
    const open = (i) => {
      lastFocus = document.activeElement;
      show(i); lb.hidden = false;
      requestAnimationFrame(() => lb.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
      $('.lightbox__close', lb).focus();
    };
    const close = () => {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => { lb.hidden = true; }, 300);
      if (lastFocus) lastFocus.focus();
    };
    items.forEach((b, i) => b.addEventListener('click', () => open(i)));
    $('.lightbox__close', lb).addEventListener('click', close);
    $('.lightbox__prev', lb).addEventListener('click', () => show(idx - 1));
    $('.lightbox__next', lb).addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    window.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    // swipe
    let sx = null;
    lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }
})();
