/* Cheeky Burger — site interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Header state */
  const header = $('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile nav */
  const toggle = $('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));
  }

  /* Reveal on scroll */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* Reels: play only when visible, with sound toggle */
  const vids = $$('video[data-autoplay]');
  const vio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) { v.play().catch(() => {}); }
      else { v.pause(); }
    });
  }, { threshold: 0.35 });
  vids.forEach(v => { v.muted = true; vio.observe(v); });
  $$('.sound').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.parentElement.querySelector('video');
      const turnOn = v.muted;
      vids.forEach(o => { o.muted = true; });
      $$('.sound').forEach(b => b.setAttribute('aria-pressed', 'false'));
      if (turnOn) { v.muted = false; v.play().catch(() => {}); btn.setAttribute('aria-pressed', 'true'); }
    });
  });

  /* Hero parallax */
  const heroImg = $('.hero-frame img');
  if (heroImg && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, 800);
      heroImg.style.transform = `scale(1.08) translateY(${y * 0.06}px)`;
    }, { passive: true });
  }

  /* Opening hours — Market Place Vauxhall (0=Sun) */
  const HOURS = {
    0: [11, 22], 1: [11, 22], 2: [11, 23], 3: [11, 23], 4: [11, 23], 5: [11, 24], 6: [11, 24]
  };
  const londonNow = () => {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    const get = t => parts.find(p => p.type === t).value;
    const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: map[get('weekday')], h: parseInt(get('hour'), 10) % 24 + parseInt(get('minute'), 10) / 60 };
  };
  const fmt = h => (h === 24 ? 'midnight' : (h > 12 ? `${h - 12}pm` : h === 12 ? '12pm' : `${h}am`));
  const now = londonNow();
  // Late-night spill from the previous day (Fri/Sat close at midnight = 24)
  const [o, c] = HOURS[now.day];
  const isOpen = now.h >= o && now.h < c;
  $$('[data-status]').forEach(el => {
    el.classList.add(isOpen ? 'open' : 'closed');
    const label = el.querySelector('span');
    if (isOpen) label.textContent = `Open now · until ${fmt(c)}`;
    else if (now.h < o) label.textContent = `Opens today ${fmt(o)}`;
    else { const n = HOURS[(now.day + 1) % 7]; label.textContent = `Closed · opens ${fmt(n[0])} tomorrow`; }
  });
  $$('.hours tr[data-day]').forEach(tr => { if (+tr.dataset.day === now.day) tr.classList.add('today'); });

  /* Lightbox */
  const lb = $('.lightbox');
  if (lb) {
    const items = $$('[data-lb]');
    const img = $('img', lb), count = $('.lb-count', lb);
    let idx = 0;
    const show = i => {
      idx = (i + items.length) % items.length;
      const src = items[idx].dataset.lb;
      img.src = src; img.alt = items[idx].querySelector('img').alt;
      count.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    };
    const open = i => { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; $('.lb-close', lb).focus(); };
    const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; items[idx].focus(); };
    items.forEach((b, i) => b.addEventListener('click', () => open(i)));
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', () => show(idx - 1));
    $('.lb-next', lb).addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    });
    let sx = 0;
    lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); });
  }

  /* Menu scrollspy */
  const mlinks = $$('.menu-nav a');
  if (mlinks.length) {
    const secs = mlinks.map(a => $(a.getAttribute('href')));
    const spy = () => {
      const y = window.scrollY + 200;
      let cur = 0;
      secs.forEach((s, i) => { if (s && s.offsetTop <= y) cur = i; });
      mlinks.forEach((a, i) => a.classList.toggle('active', i === cur));
      const active = mlinks[cur];
      const bar = active.closest('ul');
      const target = active.offsetLeft - bar.clientWidth / 2 + active.clientWidth / 2;
      if (Math.abs(bar.scrollLeft - target) > 4) bar.scrollTo({ left: target, behavior: 'smooth' });
    };
    let t; window.addEventListener('scroll', () => { cancelAnimationFrame(t); t = requestAnimationFrame(spy); }, { passive: true });
    spy();
  }

  /* Event enquiry → WhatsApp */
  const form = $('#enquiry');
  if (form) {
    const dateInput = $('#e-date', form);
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      $$('[required]', form).forEach(f => {
        const bad = !f.value.trim();
        f.classList.toggle('err', bad);
        if (bad && ok) { f.focus(); ok = false; }
      });
      if (!ok) return;
      const d = new FormData(form);
      const setup = d.get('setup') || 'Happy with either';
      const lines = [
        "Hi Cheeky Burger! I'd like to book you for an event.",
        '',
        `Name: ${d.get('name')}`,
        `Phone: ${d.get('phone')}`,
        `Event: ${d.get('type')}`,
        `Date: ${d.get('date') ? new Date(d.get('date')).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBC'}`,
        `Guests: ${d.get('guests') || 'TBC'}`,
        `Location: ${d.get('location')}`,
        `Set-up: ${setup}`
      ];
      if (d.get('notes').trim()) lines.push('', d.get('notes').trim());
      const url = `https://wa.me/447889773111?text=${encodeURIComponent(lines.join('\n'))}`;
      const msg = $('.form-msg', form);
      msg.innerHTML = `Your message is ready. <a href="${url}" target="_blank" rel="noopener" style="text-decoration:underline;font-weight:700">Open WhatsApp to send it →</a> Or call us on 07889 773111.`;
      msg.classList.add('show');
      try { window.open(url, '_blank', 'noopener'); } catch (_) {}
    });
    $$('input,select,textarea', form).forEach(f => f.addEventListener('input', () => f.classList.remove('err')));
  }

  /* Year */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
