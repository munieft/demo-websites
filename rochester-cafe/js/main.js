/* The Rochester Café — interactions */
(function(){
  const doc = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header: solid on scroll, hide on scroll-down */
  const header = document.querySelector('.site-header');
  const bar = document.querySelector('.actionbar');
  let lastY = 0;
  function onScroll(){
    const y = window.scrollY;
    const solid = y > 40;
    header.classList.toggle('is-solid', solid);
    doc.classList.toggle('has-solid-header', solid && !header.classList.contains('is-hidden'));
    const hide = y > 500 && y > lastY && !doc.classList.contains('menu-open');
    header.classList.toggle('is-hidden', hide);
    if (hide) doc.classList.remove('has-solid-header');
    if (bar) bar.classList.toggle('is-up', y > 300);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* mobile drawer */
  const burger = document.querySelector('.burger');
  if (burger){
    burger.addEventListener('click', () => {
      const open = doc.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.querySelectorAll('.drawer a').forEach(a => a.addEventListener('click', () => {
      doc.classList.remove('menu-open'); document.body.style.overflow = '';
      burger.setAttribute('aria-expanded', false);
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && doc.classList.contains('menu-open')) burger.click();
    });
  }

  /* split hero wordmark into letters */
  document.querySelectorAll('[data-split]').forEach(el => {
    const text = el.textContent; el.textContent = ''; el.setAttribute('aria-label', text);
    [...text].forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'ch'; s.setAttribute('aria-hidden','true');
      s.textContent = c === ' ' ? ' ' : c;
      s.style.animationDelay = (0.25 + i * 0.06) + 's';
      el.appendChild(s);
    });
  });

  /* reveal on scroll */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, {threshold:.15, rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rv,.mask,.glowline').forEach(el => io.observe(el));

  /* videos play only in view */
  const vio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting && !reduce){ const p = v.play(); if (p) p.catch(()=>{}); }
      else v.pause();
    });
  }, {threshold:.25});
  document.querySelectorAll('video[data-inview]').forEach(v => vio.observe(v));

  /* drag-to-scroll rails */
  document.querySelectorAll('.drag').forEach(rail => {
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft;
    });
    window.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 5){ moved = true; rail.classList.add('is-dragging'); }
      rail.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', () => { down = false; rail.classList.remove('is-dragging'); });
  });

  /* breakfast switcher */
  document.querySelectorAll('[data-switch]').forEach(sw => {
    const imgs = sw.querySelectorAll('.switch__stage img');
    const items = sw.querySelectorAll('.dish');
    const badge = sw.querySelector('.switch__badge');
    let idx = 0, timer;
    function show(i){
      idx = i;
      items.forEach((d, n) => { d.classList.toggle('is-on', n === i); d.querySelector('button').setAttribute('aria-pressed', n === i); });
      imgs.forEach((im, n) => im.classList.toggle('is-on', n === i));
      if (badge) badge.textContent = items[i].querySelector('.dish__name').textContent;
    }
    function auto(){ clearInterval(timer); if (!reduce) timer = setInterval(() => show((idx + 1) % items.length), 5200); }
    items.forEach((d, n) => {
      const b = d.querySelector('button');
      b.addEventListener('click', () => { show(n); auto(); });
      b.addEventListener('mouseenter', () => { if (window.matchMedia('(hover:hover)').matches){ show(n); auto(); } });
    });
    show(0); auto();
  });

  /* lightbox */
  const lb = document.querySelector('.lightbox');
  if (lb){
    const btns = [...document.querySelectorAll('.gallery button')];
    const img = lb.querySelector('img'); const count = lb.querySelector('.lb-count');
    let cur = 0, lastFocus;
    function open(i){
      cur = (i + btns.length) % btns.length;
      const src = btns[cur].querySelector('img');
      img.src = src.currentSrc || src.src; img.alt = src.alt;
      count.textContent = (cur + 1) + ' / ' + btns.length;
      img.style.animation = 'none'; img.offsetHeight; img.style.animation = '';
    }
    btns.forEach((b, i) => b.addEventListener('click', () => {
      lastFocus = b; open(i); lb.classList.add('open'); document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    }));
    function close(){ lb.classList.remove('open'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', () => open(cur - 1));
    lb.querySelector('.lb-next').addEventListener('click', () => open(cur + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(cur - 1);
      if (e.key === 'ArrowRight') open(cur + 1);
    });
    let tx = 0;
    lb.addEventListener('touchstart', e => tx = e.touches[0].clientX, {passive:true});
    lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) open(cur + (d < 0 ? 1 : -1)); });
  }

  /* menu page: scrollspy + search */
  const cats = document.querySelectorAll('.cats a');
  if (cats.length){
    const secs = [...document.querySelectorAll('.mcat')];
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        cats.forEach(a => {
          const on = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('is-on', on);
          if (on){ const r = a.parentElement; r.scrollTo({left: a.offsetLeft - r.offsetWidth/2 + a.offsetWidth/2, behavior: reduce ? 'auto' : 'smooth'}); }
        });
      });
    }, {rootMargin:'-35% 0px -60% 0px'});
    secs.forEach(s => spy.observe(s));

    const input = document.getElementById('menu-search');
    const none = document.querySelector('.no-results');
    if (input){
      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        let total = 0;
        secs.forEach(s => {
          let n = 0;
          s.querySelectorAll('.mi').forEach(mi => {
            const hit = !q || mi.textContent.toLowerCase().includes(q);
            mi.classList.toggle('is-hidden', !hit); if (hit) n++;
          });
          s.classList.toggle('is-empty', n === 0); total += n;
        });
        none.classList.toggle('show', total === 0);
        if (q && total) { const first = secs.find(s => !s.classList.contains('is-empty')); }
      });
    }
  }

  /* year */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
