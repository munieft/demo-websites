(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const PHONE = '447785601105';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('#yr').textContent = new Date().getFullYear();

  /* header + mobile dock */
  const header = $('.site-header'), dock = $('.dock');
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('scrolled', y > 30);
    dock.classList.toggle('show', y > innerHeight * 0.6);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu */
  const toggle = $('.menu-toggle'), nav = $('#nav');
  const setMenu = open => {
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px' });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });

  /* gold sparkles (echoing the logo's diamonds) */
  const sp = $('.sparkles');
  if (sp && !reduce) for (let i = 0; i < 18; i++) {
    const s = document.createElement('i');
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--s:${6 + Math.random() * 10}px;--d:${3 + Math.random() * 4}s;--dl:${Math.random() * 5}s`;
    sp.appendChild(s);
  }

  /* hero cake stand rotation */
  const stand = $('#stand');
  const order = ['is-front', 'is-mid', 'is-back'];
  const rotate = () => {
    const arches = $$('.arch', stand);
    arches.forEach(a => {
      const i = order.findIndex(c => a.classList.contains(c));
      a.classList.remove(order[i]);
      a.classList.add(order[(i + 2) % 3]);
    });
  };
  let standTimer = reduce ? null : setInterval(rotate, 4200);
  stand.addEventListener('click', () => { rotate(); clearInterval(standTimer); standTimer = reduce ? null : setInterval(rotate, 4200); });

  /* 11am London countdown */
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  const clock = $('#clock'), label = $('#clockLabel'), time = $('#clockTime'), note = $('#clockNote');
  const arc = $('#clockArc'), hH = $('#handH'), hM = $('#handM'), status = $('#orderStatus');
  const pad = n => String(n).padStart(2, '0');
  let open = true;
  const tick = () => {
    const p = Object.fromEntries(fmt.formatToParts(new Date()).map(x => [x.type, +x.value]));
    const secs = p.hour * 3600 + p.minute * 60 + p.second;
    const cutoff = 11 * 3600;
    hH.style.transform = `rotate(${(p.hour % 12) * 30 + p.minute * 0.5}deg)`;
    hM.style.transform = `rotate(${p.minute * 6 + p.second * 0.1}deg)`;
    open = secs < cutoff;
    clock.classList.toggle('closed', !open);
    if (open) {
      const left = cutoff - secs;
      label.textContent = 'Same-day orders close in';
      time.textContent = `${pad(Math.floor(left / 3600))}h ${pad(Math.floor(left % 3600 / 60))}m ${pad(left % 60)}s`;
      note.textContent = 'Limited slots available — message now';
      arc.style.strokeDashoffset = 289 * (1 - left / cutoff);
      status.textContent = '● Same-day orders are open until 11am (UK time).';
    } else {
      label.textContent = 'Today’s same-day cut-off has passed';
      time.textContent = 'Book for tomorrow';
      note.textContent = 'Order before 11am for same day';
      arc.style.strokeDashoffset = 0;
      status.textContent = 'It’s past 11am — message now to book tomorrow or a later date.';
    }
  };
  tick(); setInterval(tick, 1000);

  /* gallery filters */
  const tiles = $$('.tile');
  $$('.chip').forEach(chip => chip.addEventListener('click', () => {
    $$('.chip').forEach(c => { c.classList.toggle('is-on', c === chip); c.setAttribute('aria-pressed', c === chip); });
    const f = chip.dataset.filter;
    tiles.forEach(t => t.classList.toggle('is-hidden', f !== 'all' && t.dataset.cat !== f));
  }));

  /* lightbox */
  const lb = $('#lightbox'), lbImg = $('img', lb), lbCap = $('figcaption', lb);
  let idx = 0, lastFocus;
  const visible = () => tiles.filter(t => !t.classList.contains('is-hidden'));
  const show = i => {
    const v = visible(); idx = (i + v.length) % v.length;
    const t = v[idx], img = $('img', t);
    lbImg.src = t.dataset.full; lbImg.alt = img.alt; lbCap.textContent = $('.cap', t).textContent;
  };
  const openLb = t => {
    lastFocus = t; show(visible().indexOf(t));
    lb.hidden = false; requestAnimationFrame(() => lb.classList.add('open'));
    document.body.style.overflow = 'hidden'; $('.lb-close', lb).focus();
  };
  const closeLb = () => {
    lb.classList.remove('open'); document.body.style.overflow = '';
    setTimeout(() => { lb.hidden = true; }, 300); lastFocus && lastFocus.focus();
  };
  tiles.forEach(t => t.addEventListener('click', () => openLb(t)));
  $('.lb-close', lb).addEventListener('click', closeLb);
  $('.prev', lb).addEventListener('click', () => show(idx - 1));
  $('.next', lb).addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  let sx = 0;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); });

  /* WhatsApp order builder */
  const form = $('#orderForm'), preview = $('#preview'), whenSel = $('#whenSel'), dateField = $('#dateField');
  const today = new Date(); const iso = d => d.toISOString().slice(0, 10);
  $('input[type=date]', form).min = iso(today);
  const buildMsg = () => {
    const d = new FormData(form);
    const when = d.get('when') === 'today'
      ? 'today (same day)'
      : (d.get('date') ? new Date(d.get('date') + 'T12:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'a date to confirm');
    let m = `Hi Celuxe Bakes! I'd like to order ${d.get('item')} for a ${String(d.get('occasion')).toLowerCase()}, needed ${when}.`;
    if (d.get('name').trim()) m += `\nOn the cake: "${d.get('name').trim()}"`;
    if (d.get('notes').trim()) m += `\nIdeas: ${d.get('notes').trim()}`;
    if (d.get('you').trim()) m += `\n\nThanks, ${d.get('you').trim()}`;
    return m;
  };
  const refresh = () => {
    dateField.hidden = whenSel.value !== 'date';
    preview.textContent = buildMsg();
  };
  form.addEventListener('input', refresh); form.addEventListener('change', refresh); refresh();
  form.addEventListener('submit', e => {
    e.preventDefault();
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(buildMsg())}`, '_blank', 'noopener');
  });

  /* pause looping videos when off-screen */
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && !reduce) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
  }), { threshold: 0.2 });
  $$('video').forEach(v => vio.observe(v));
})();
