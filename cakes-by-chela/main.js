(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('#yr').textContent = new Date().getFullYear();

  /* nav */
  const nav = $('.nav'), burger = $('#burger'), links = $('#navLinks'), mbar = $('.mbar');
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 30);
    mbar.classList.toggle('show', y > innerHeight * 0.6);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const setMenu = open => {
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* reveal */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });

  /* hero word swap + arch crossfade */
  const words = ['birthday', 'milestone', 'christening', 'little one', 'celebration'];
  const w = $('#swapWord'); let wi = 0;
  const imgs = $$('#heroArch img'); let ii = 0;
  if (!reduce) setInterval(() => {
    w.classList.add('out');
    setTimeout(() => { wi = (wi + 1) % words.length; w.textContent = words[wi]; w.classList.remove('out'); }, 450);
    imgs[ii].classList.remove('is-on'); ii = (ii + 1) % imgs.length; imgs[ii].classList.add('is-on');
  }, 3200);

  /* duplicate marquee for seamless loop */
  const track = $('.track'); track.innerHTML += track.innerHTML;
  $$('span', track).slice(track.children.length / 2).forEach(s => s.setAttribute('aria-hidden', 'true'));

  /* gentle parallax for polaroids */
  const par = $$('[data-depth]');
  if (!reduce && matchMedia('(min-width: 641px)').matches) {
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        par.forEach(el => {
          const r = el.getBoundingClientRect();
          const off = (r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.depth);
          el.style.translate = `0 ${off.toFixed(1)}px`;
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* videos: play only in view */
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && !reduce) { v.play().catch(() => {}); } else v.pause();
  }), { threshold: 0.35 });
  $$('video').forEach(v => vio.observe(v));

  /* gallery filter */
  const chips = $$('.chip'), figs = $$('#grid figure');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => { x.classList.toggle('is-on', x === c); x.setAttribute('aria-selected', x === c); });
    const f = c.dataset.f;
    figs.forEach((fig, i) => {
      const show = f === 'all' || fig.dataset.c.split(' ').includes(f);
      fig.classList.toggle('hide', !show);
      fig.classList.remove('pop');
      if (show) { void fig.offsetWidth; fig.style.animationDelay = (i % 8) * 40 + 'ms'; fig.classList.add('pop'); }
    });
  }));

  /* lightbox */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  let cur = 0;
  const visible = () => figs.filter(f => !f.classList.contains('hide'));
  const show = i => {
    const list = visible(); cur = (i + list.length) % list.length;
    const im = $('img', list[cur]);
    lbImg.src = im.src; lbImg.alt = im.alt; lbCap.textContent = $('figcaption', list[cur]).textContent;
  };
  figs.forEach(f => {
    f.tabIndex = 0; f.setAttribute('role', 'button');
    const open = () => { show(visible().indexOf(f)); lb.showModal(); };
    f.addEventListener('click', open);
    f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  $('#lbClose').addEventListener('click', () => lb.close());
  $('#lbPrev').addEventListener('click', () => show(cur - 1));
  $('#lbNext').addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
  let sx = 0;
  lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });

  /* treats menu */
  const tImg = $('#treatImg'), tItems = $$('#treatList li');
  const pick = li => {
    if (li.classList.contains('is-on')) return;
    tItems.forEach(x => x.classList.toggle('is-on', x === li));
    tImg.classList.add('swapping');
    const n = new Image(); n.src = li.dataset.img;
    n.onload = () => setTimeout(() => { tImg.src = n.src; tImg.alt = li.dataset.alt; tImg.classList.remove('swapping'); }, 180);
  };
  tItems.forEach(li => {
    li.addEventListener('mouseenter', () => pick(li));
    $('button', li).addEventListener('click', () => pick(li));
    $('button', li).addEventListener('focus', () => pick(li));
  });

  /* enquiry form → message */
  const form = $('#enqForm'), msg = $('#formMsg');
  const dIn = form.date; dIn.min = new Date().toISOString().split('T')[0];
  const build = () => {
    const d = new FormData(form); let ok = true;
    ['name', 'date', 'idea'].forEach(k => {
      const el = form[k], bad = !String(d.get(k) || '').trim();
      el.classList.toggle('err', bad); if (bad) ok = false;
    });
    if (!ok) { msg.textContent = 'Please add your name, the date and a little about your idea.'; return null; }
    const date = new Date(d.get('date')).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
    return [
      `Hi Chela! I'd love to order a cake.`,
      `Name: ${d.get('name')}`,
      `Occasion: ${d.get('occasion')}`,
      `Date: ${date}`,
      d.get('who') && `On the cake: ${d.get('who')}`,
      d.get('guests') && `Guests: ${d.get('guests')}`,
      `Idea: ${d.get('idea')}`
    ].filter(Boolean).join('\n');
  };
  form.addEventListener('submit', e => {
    e.preventDefault(); const t = build(); if (!t) return;
    const sep = /iPhone|iPad|Mac/.test(navigator.userAgent) ? '&' : '?';
    msg.textContent = 'Opening your messages app…';
    location.href = `sms:+447791391783${sep}body=${encodeURIComponent(t)}`;
  });
  $('#copyBtn').addEventListener('click', async () => {
    const t = build(); if (!t) return;
    try { await navigator.clipboard.writeText(t); msg.textContent = 'Copied! Paste it into a DM to @cakesbychela.'; }
    catch { msg.textContent = 'Couldn’t copy automatically — please copy your details manually.'; return; }
    setTimeout(() => window.open('https://www.instagram.com/cakesbychela/', '_blank', 'noopener'), 700);
  });
  form.addEventListener('input', e => e.target.classList.remove('err'));
})();
