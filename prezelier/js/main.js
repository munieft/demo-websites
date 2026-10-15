(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  requestAnimationFrame(() => document.body.classList.add('is-loaded'));
  $('#yr').textContent = new Date().getFullYear();

  // Nav state + mobile dock
  const nav = $('.nav'), dock = $('.dock');
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 30);
    dock.classList.toggle('is-on', y > innerHeight * 0.6);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Drawer
  const burger = $('.nav__burger'), drawer = $('#drawer');
  const setDrawer = open => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) { drawer.hidden = false; requestAnimationFrame(() => drawer.classList.add('is-open')); }
    else { drawer.classList.remove('is-open'); setTimeout(() => { if (!drawer.classList.contains('is-open')) drawer.hidden = true; }, 600); }
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', drawer).forEach(a => a.addEventListener('click', () => setDrawer(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) setDrawer(false); });

  // Reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });

  // Crossfade helper
  const swapImg = (img, src, alt) => {
    if (img.getAttribute('src') === src) return;
    const pre = new Image(); pre.src = src;
    img.classList.add('swap');
    const go = () => setTimeout(() => { img.src = src; if (alt != null) img.alt = alt; img.classList.remove('swap'); }, reduce ? 0 : 280);
    pre.decode ? pre.decode().then(go, go) : go();
  };

  // Pretzel styles
  const pzImg = $('#pz-img'), pzBtns = $$('.pretzels__list button');
  pzBtns.forEach(b => {
    const act = () => {
      pzBtns.forEach(x => x.setAttribute('aria-selected', x === b));
      swapImg(pzImg, b.dataset.img, b.dataset.alt);
    };
    b.addEventListener('click', act);
    b.addEventListener('mouseenter', act);
  });

  // Menu tabs
  const tabs = $$('.tabs [role="tab"]'), prev = $('#menu-prev');
  const showPanel = t => {
    tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
    const first = $('#' + t.getAttribute('aria-controls') + ' li[data-img]');
    if (first) activate(first);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => showPanel(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); showPanel(n); }
    });
  });
  const activate = li => {
    $$('.menu__list li.is-active').forEach(x => x.classList.remove('is-active'));
    li.classList.add('is-active');
    swapImg(prev, li.dataset.img, '');
  };
  $$('.menu__list li[data-img]').forEach(li => {
    li.addEventListener('mouseenter', () => activate(li));
    li.addEventListener('click', () => activate(li));
  });

  // Gallery: lazy videos play only in view, drag-to-scroll, arrows
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; if (!reduce) v.play().catch(() => {}); }
    else v.pause();
  }), { threshold: 0.4 });
  $$('.gallery video').forEach(v => vio.observe(v));

  const heroVid = $('.hero__arch video');
  if (reduce) heroVid.pause();
  new IntersectionObserver(([e]) => { if (reduce) return; e.isIntersecting ? heroVid.play().catch(() => {}) : heroVid.pause(); }).observe(heroVid);

  const track = $('.gallery__track');
  $$('.gallery__nav button').forEach(b => b.addEventListener('click', () =>
    track.scrollBy({ left: +b.dataset.dir * track.clientWidth * 0.7, behavior: 'smooth' })));
  let down = false, sx = 0, sl = 0, moved = false;
  track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
  addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) { moved = true; track.classList.add('is-drag'); } track.scrollLeft = sl - dx; });
  addEventListener('pointerup', () => { down = false; track.classList.remove('is-drag'); });
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * 320, behavior: 'smooth' }); }
  });

  // Gentle parallax on hero polaroid & badge
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    const stage = $('.hero__stage'), pol = $('.hero__polaroid'), badge = $('.badge');
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      pol.style.translate = `${x * -18}px ${y * -18}px`; badge.style.translate = `${x * 22}px ${y * 22}px`;
    });
    stage.addEventListener('pointerleave', () => { pol.style.translate = ''; badge.style.translate = ''; });
  }
})();
