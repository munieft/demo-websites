/* Vegan Garden London — interactions */
(() => {
  const doc = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* load + page transitions */
  const ready = () => requestAnimationFrame(() => doc.classList.add('is-loaded'));
  document.readyState === 'complete' ? ready() : addEventListener('load', ready);
  setTimeout(ready, 1600); // never hold the page behind the curtain
  addEventListener('pageshow', e => { if (e.persisted) { doc.classList.remove('is-leaving'); ready(); } });
  $$('a[href]').forEach(a => {
    const url = a.getAttribute('href');
    if (!url || url.startsWith('#') || url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:') || a.target === '_blank') return;
    a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || reduce) return;
      e.preventDefault();
      doc.classList.add('is-leaving');
      setTimeout(() => (location.href = url), 520);
    });
  });

  /* header: solid on scroll, hide on scroll down */
  const head = $('.site-head');
  const bar = $('.actionbar');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    head && head.classList.toggle('is-solid', y > 40);
    head && head.classList.toggle('is-hidden', y > 300 && y > lastY && !doc.classList.contains('nav-open'));
    bar && bar.classList.toggle('is-in', y > 420);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile nav */
  const toggle = $('.menu-toggle');
  toggle && toggle.addEventListener('click', () => {
    const open = doc.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && doc.classList.contains('nav-open')) toggle.click(); });

  /* trading days — Fri, Sat, Sun (London time) */
  const londonDay = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'Europe/London' }).format(new Date());
  const open = ['Fri', 'Sat', 'Sun'].includes(londonDay);
  $$('[data-status]').forEach(el => {
    el.classList.toggle('is-open', open);
    const t = $('span', el);
    if (t) t.textContent = open ? 'At Greenwich Market today' : (londonDay === 'Thu' ? 'Back at the market tomorrow' : 'Back at the market on Friday');
  });
  $$('.day').forEach(d => { if (d.dataset.d === londonDay) d.classList.add('today'); });

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
  $$('.rv,.rv-img').forEach(el => io.observe(el));

  /* marquee: clone content for seamless loop */
  $$('.marquee__track').forEach(t => { t.innerHTML += t.innerHTML; });

  /* lazy videos: play only when visible */
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { if (!v.src && v.dataset.src) v.src = v.dataset.src; if (!reduce) v.play().catch(() => {}); }
    else v.pause();
  }), { threshold: .2 });
  $$('video[data-auto]').forEach(v => vio.observe(v));

  /* parallax */
  const par = $$('[data-speed]');
  /* horizontal pinned spread */
  const spread = $('.spread');
  const track = spread && $('.spread__track', spread);
  const prog = spread && $('.spread__progress i', spread);
  const wide = () => innerWidth > 860 && !reduce;
  const sizeSpread = () => {
    if (!spread) return;
    if (!wide()) { spread.style.height = ''; return; }
    spread.style.height = (track.scrollWidth - innerWidth + innerHeight * 1.1) + 'px';
  };
  sizeSpread(); addEventListener('resize', sizeSpread); addEventListener('load', sizeSpread);

  let ticking = false;
  const frame = () => {
    ticking = false;
    const vh = innerHeight;
    if (!reduce) par.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0,${(p * parseFloat(el.dataset.speed) * 100).toFixed(1)}px,0)`;
    });
    if (spread && wide()) {
      const r = spread.getBoundingClientRect();
      const max = track.scrollWidth - innerWidth;
      const p = Math.min(1, Math.max(0, -r.top / (spread.offsetHeight - vh)));
      track.style.transform = `translate3d(${-p * max}px,0,0)`;
      if (prog) prog.style.transform = `scaleX(${p})`;
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  frame();

  /* cake counter */
  const stage = $('.cake-stage');
  if (stage) {
    const figs = $$('figure', stage), btns = $$('.cake-list button');
    let i = 0, timer;
    const show = n => {
      i = (n + figs.length) % figs.length;
      figs.forEach((f, k) => f.classList.toggle('is-active', k === i));
      btns.forEach((b, k) => b.setAttribute('aria-selected', k === i));
    };
    const auto = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => show(i + 1), 4200); };
    btns.forEach((b, k) => { b.addEventListener('click', () => { show(k); auto(); }); b.addEventListener('mouseenter', () => { show(k); auto(); }); });
    show(0); auto();
  }

  /* rotating quotes */
  const qs = $$('.quote-rot blockquote');
  if (qs.length) {
    let q = 0; qs[0].classList.add('is-active');
    if (!reduce) setInterval(() => { qs[q].classList.remove('is-active'); q = (q + 1) % qs.length; qs[q].classList.add('is-active'); }, 4600);
  }

  /* menu tabs */
  const tabs = $$('.tab');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-selected', x === t));
    const f = t.dataset.filter;
    $$('.mitem').forEach(m => m.classList.toggle('is-hidden', f !== 'all' && !m.dataset.cat.includes(f)));
  }));

  /* menu hover preview (pointer devices) */
  const prev = $('.hover-preview');
  if (prev && matchMedia('(hover:hover)').matches) {
    const img = $('img', prev);
    let x = 0, y = 0, cx = 0, cy = 0, on = false;
    $$('.mitem[data-img]').forEach(m => {
      m.addEventListener('mouseenter', () => { img.src = m.dataset.img; img.alt = ''; prev.classList.add('is-on'); on = true; });
      m.addEventListener('mouseleave', () => { prev.classList.remove('is-on'); on = false; });
    });
    addEventListener('mousemove', e => { x = e.clientX + 170; y = e.clientY; });
    const loop = () => { cx += (x - cx) * .14; cy += (y - cy) * .14; if (on) prev.style.left = cx + 'px', prev.style.top = cy + 'px'; requestAnimationFrame(loop); };
    loop();
  }

  /* plate builder — prices from the stall board */
  const builder = $('.builder');
  if (builder) {
    const sel = $('select', builder), sw = $('.switch', builder), out = $('.total b', builder), note = $('.salads-note', builder);
    const [b1, b2] = $$('.switch button', builder);
    let full = true;
    const render = () => {
      const o = sel.selectedOptions[0];
      const p = full ? o.dataset.full : o.dataset.single;
      b1.textContent = o.dataset.l1; b2.textContent = o.dataset.l2;
      out.textContent = '£' + p;
      out.classList.remove('bump'); void out.offsetWidth; out.classList.add('bump');
      note.textContent = full ? o.dataset.n2 : o.dataset.n1;
      sw.classList.toggle('is-right', full);
      b1.setAttribute('aria-pressed', !full); b2.setAttribute('aria-pressed', full);
    };
    sel.addEventListener('change', render);
    b1.addEventListener('click', () => { full = false; render(); });
    b2.addEventListener('click', () => { full = true; render(); });
    render();
  }

  /* gallery filter + lightbox */
  const gal = $('.gallery');
  if (gal) {
    const items = $$('button', gal);
    $$('.filters .tab').forEach(t => t.addEventListener('click', () => {
      $$('.filters .tab').forEach(x => x.setAttribute('aria-selected', x === t));
      items.forEach(b => b.classList.toggle('is-out', t.dataset.g !== 'all' && b.dataset.g !== t.dataset.g));
    }));
    const lb = $('.lightbox'), lbImg = $('img', lb), lbCap = $('.lb-cap', lb);
    let cur = 0, last;
    const vis = () => items.filter(b => !b.classList.contains('is-out'));
    const show = n => { const v = vis(); cur = (n + v.length) % v.length; const im = $('img', v[cur]); lbImg.src = im.src; lbImg.alt = im.alt; lbCap.textContent = im.alt; };
    const openLb = b => { last = b; show(vis().indexOf(b)); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; $('.lb-close', lb).focus(); };
    const close = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; last && last.focus(); };
    items.forEach(b => b.addEventListener('click', () => openLb(b)));
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', () => show(cur - 1));
    $('.lb-next', lb).addEventListener('click', () => show(cur + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1);
    });
  }

  $$('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
})();
