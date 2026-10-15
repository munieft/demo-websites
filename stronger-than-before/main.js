(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PHONE = '447522384470';

  requestAnimationFrame(() => document.body.classList.add('loaded'));
  $('#yr').textContent = new Date().getFullYear();

  /* Quick exit: button or Esc twice */
  const leave = () => { try { history.replaceState(null, '', '/'); } catch (e) {} location.replace('https://www.bbc.co.uk/weather'); };
  $('#quickExit').addEventListener('click', leave);
  let lastEsc = 0;
  addEventListener('keydown', e => {
    if (e.key !== 'Escape' || $('#lightbox').open) return;
    const now = Date.now(); if (now - lastEsc < 600) leave(); lastEsc = now;
  });

  /* Header + mobile nav */
  const header = $('.site-header'), burger = $('#burger'), nav = $('#nav'), floatBtn = $('.float-order');
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('scrolled', y > 30);
    const orderTop = $('#order').getBoundingClientRect().top;
    floatBtn.classList.toggle('show', y > innerHeight * .8 && orderTop > innerHeight);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const setMenu = open => {
    nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* Reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .14, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });

  /* "She is…" lines light up as you scroll */
  const lines = $$('.she li');
  const lightLines = () => {
    const mid = innerHeight * .62;
    lines.forEach(li => li.classList.toggle('on', reduced || li.getBoundingClientRect().top < mid));
  };
  addEventListener('scroll', lightLines, { passive: true }); lightLines();

  /* Gentle parallax */
  const par = $$('.parallax');
  if (!reduced && par.length) {
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        par.forEach(el => { const img = el.querySelector('img'); img.style.translate = `0 ${-scrollY * el.dataset.speed}px`; });
        ticking = false;
      });
    }, { passive: true });
  }

  /* Quotes carousel */
  const qs = $$('.q'), dots = $('#qDots'); let qi = 0, qt;
  qs.forEach((q, i) => {
    const b = document.createElement('button');
    b.setAttribute('role', 'tab'); b.setAttribute('aria-label', `Quote ${i + 1}`);
    b.addEventListener('click', () => { show(i); restart(); });
    dots.appendChild(b);
  });
  const show = i => {
    qi = i;
    qs.forEach((q, k) => q.classList.toggle('is-active', k === i));
    $$('button', dots).forEach((b, k) => b.setAttribute('aria-selected', k === i));
  };
  const restart = () => { clearInterval(qt); if (!reduced) qt = setInterval(() => show((qi + 1) % qs.length), 5200); };
  show(0); restart();

  /* Lightbox */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  $$('.bake').forEach(b => b.addEventListener('click', () => {
    const img = $('img', b);
    lbImg.src = img.src; lbImg.alt = img.alt; lbCap.textContent = b.dataset.cap;
    lb.showModal();
  }));
  $('#lbClose').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });

  /* Order form → WhatsApp */
  const form = $('#orderForm'), err = $('#formErr');
  const dateIn = $('#f-date'); dateIn.min = new Date().toISOString().split('T')[0];
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form), name = (d.get('name') || '').trim();
    if (!name) { err.textContent = 'Please tell us your name so we know who to reply to.'; $('#f-name').focus(); return; }
    err.textContent = '';
    let date = d.get('date');
    if (date) date = new Date(date + 'T12:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    const msg = [
      `Hi Stronger Than Before! I'm ${name} and I'd like to order: ${d.get('bake')}.`,
      d.get('occasion') && `Occasion: ${d.get('occasion')}`,
      date && `Needed for: ${date}`,
      d.get('msg') && `Notes: ${d.get('msg')}`
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });
})();
