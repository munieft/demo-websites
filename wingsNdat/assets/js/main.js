/* Wingz'N'Dat — site interactions (vanilla JS, no frameworks) */
(() => {
  'use strict';
  const WA = '447429725554';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- Preloader ---------- */
  const pre = $('.preloader');
  const finishLoad = () => {
    document.documentElement.classList.add('loaded');
    document.body.classList.add('loaded');
    if (pre) pre.classList.add('done');
  };
  let seen = false;
  try { seen = sessionStorage.getItem('wnd-seen') === '1'; sessionStorage.setItem('wnd-seen', '1'); } catch (e) {}
  if (pre && seen) { pre.style.transition = 'none'; finishLoad(); }
  else window.addEventListener('load', () => setTimeout(finishLoad, reduce ? 0 : 900));
  setTimeout(finishLoad, 3500); // safety

  /* ---------- Header ---------- */
  const header = $('.header');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 30);
      header.classList.toggle('hidden', y > 400 && y > lastY && !document.body.classList.contains('menu-open'));
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('.burger');
  if (burger) burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    document.body.classList.toggle('is-locked', open);
    burger.setAttribute('aria-expanded', open);
    $$('.mobile-nav a.m-link').forEach((a, i) => a.style.transitionDelay = open ? (0.15 + i * 0.06) + 's' : '0s');
  });

  /* ---------- Split words ---------- */
  $$('[data-split]').forEach(el => {
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span'); w.className = 'split-word';
            const i = document.createElement('span'); i.textContent = part;
            w.appendChild(i); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('split-word')) walk(n);
      });
    };
    walk(el);
    $$('.split-word', el).forEach((w, i) => w.style.setProperty('--i', i));
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'none');
  });

  /* ---------- Reveal on scroll ---------- */
  $$('[data-stagger]').forEach(p => {
    const step = parseFloat(p.dataset.stagger) || 0.08;
    [...p.children].forEach((c, i) => {
      if (!c.hasAttribute('data-reveal')) c.setAttribute('data-reveal', '');
      c.style.setProperty('--d', (i * step) + 's');
    });
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal]').forEach(el => io.observe(el));
  $$('[data-reveal="none"]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });

  /* ---------- Counters ---------- */
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, to = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
      const t0 = performance.now(), dur = 1600;
      const tick = t => {
        const p = Math.min(1, (t - t0) / dur), k = 1 - Math.pow(1 - p, 4);
        el.textContent = (to * k).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick); cio.unobserve(el);
    });
  }, { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- Embers canvas ---------- */
  $$('canvas.embers').forEach(cv => {
    if (reduce) return;
    const ctx = cv.getContext('2d');
    let W, H, parts = [], running = true, dpr = Math.min(2, window.devicePixelRatio || 1);
    const density = parseFloat(cv.dataset.density || 1);
    const size = () => {
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(110, (W * H) / 14000) * density);
      parts = Array.from({ length: n }, () => spawn(true));
    };
    const cols = ['255,209,102', '255,122,26', '226,54,27', '255,170,60'];
    const spawn = (any) => ({
      x: Math.random() * W, y: any ? Math.random() * H : H + 10,
      r: Math.random() * 2.2 + .6, vy: Math.random() * .8 + .35, vx: (Math.random() - .5) * .4,
      a: Math.random() * .6 + .3, w: Math.random() * Math.PI * 2, c: cols[(Math.random() * cols.length) | 0]
    });
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of parts) {
        p.y -= p.vy; p.w += .03; p.x += p.vx + Math.sin(p.w) * .35;
        const life = Math.max(0, p.y / H);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.c},${p.a * life})`;
        ctx.shadowBlur = 12; ctx.shadowColor = `rgba(${p.c},.9)`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        if (p.y < -10) Object.assign(p, spawn(false));
      }
      requestAnimationFrame(draw);
    };
    size(); draw();
    window.addEventListener('resize', size);
    new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was) draw(); }).observe(cv);
  });

  /* ---------- Parallax ---------- */
  const px = $$('[data-parallax]');
  if (px.length && !reduce) {
    const run = () => {
      const vh = window.innerHeight;
      px.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const s = parseFloat(el.dataset.parallax) || .1;
        el.style.transform = `translate3d(0,${((r.top + r.height / 2) - vh / 2) * -s}px,0)`;
      });
    };
    window.addEventListener('scroll', () => requestAnimationFrame(run), { passive: true }); run();
  }

  /* ---------- Tilt + magnetic + cursor ---------- */
  if (fine && !reduce) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => el.style.transform = '');
    });
    $$('.btn, .rail-nav button').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .25}px)`;
      });
      b.addEventListener('pointerleave', () => b.style.transform = '');
    });
    const cur = document.createElement('div'); cur.className = 'cursor'; document.body.appendChild(cur);
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; cur.classList.add('on'); });
    document.addEventListener('pointerleave', () => cur.classList.remove('on'));
    const loop = () => { cx += (tx - cx) * .2; cy += (ty - cy) * .2; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener('pointerover', e => cur.classList.toggle('big', !!e.target.closest('a,button,label,.dish,.masonry figure,summary')));
  }

  /* ---------- Page transitions ---------- */
  const wipe = document.createElement('div'); wipe.className = 'page-wipe'; wipe.innerHTML = '<i></i><i></i><i></i>';
  document.body.appendChild(wipe);
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || reduce) return;
    const href = a.getAttribute('href');
    if (!href || a.target === '_blank' || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || /^https?:/i.test(href) || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (!/\.html(#.*)?$/.test(href)) return;
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(() => { window.location.href = href; }, 520);
  });
  window.addEventListener('pageshow', ev => { if (ev.persisted) document.body.classList.remove('leaving'); });

  /* ---------- Rail (drag + buttons) ---------- */
  $$('.rail').forEach(rail => {
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('dragging'); });
    window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', () => { down = false; rail.classList.remove('dragging'); });
    rail.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    const id = rail.id;
    $$(`[data-rail="${id}"]`).forEach(btn => btn.addEventListener('click', () => {
      const card = rail.firstElementChild; const step = card ? card.getBoundingClientRect().width + 22 : 300;
      rail.scrollBy({ left: step * (btn.dataset.dir === 'prev' ? -1 : 1), behavior: 'smooth' });
    }));
  });

  /* ---------- Video sound toggles ---------- */
  $$('[data-sound]').forEach(btn => {
    const v = document.getElementById(btn.dataset.sound);
    const on = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>';
    const off = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m23 9-6 6M17 9l6 6"/></svg>';
    btn.innerHTML = off;
    btn.addEventListener('click', () => { v.muted = !v.muted; if (!v.muted) v.play(); btn.innerHTML = v.muted ? off : on; btn.setAttribute('aria-label', v.muted ? 'Unmute video' : 'Mute video'); });
  });
  // pause offscreen videos
  $$('video[autoplay]').forEach(v => {
    new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: .1 }).observe(v);
  });

  /* ---------- Timeline progress ---------- */
  const tlBar = $('.tl-progress');
  if (tlBar) {
    const tline = tlBar.parentElement;
    const upd = () => {
      const r = tline.getBoundingClientRect(), vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * .6 - r.top) / r.height));
      tlBar.style.height = (p * r.height) + 'px';
    };
    window.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true }); upd();
  }

  /* ---------- Year ---------- */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ==========================================================
     MENU: tabs + order tray
     ========================================================== */
  const tabs = $$('.tab');
  if (tabs.length) {
    tabs.forEach(t => t.addEventListener('click', () => {
      const target = $(t.dataset.target);
      if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 150, behavior: 'smooth' });
    }));
    const groups = $$('.menu-group');
    const gio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          tabs.forEach(t => t.classList.toggle('active', t.dataset.target === '#' + e.target.id));
          const act = $('.tab.active'); if (act) act.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    groups.forEach(g => gio.observe(g));
  }

  const trayEl = $('.tray');
  if (trayEl) {
    let cart = store.get('wnd-cart', []);
    const fab = $('.tray-fab'), list = $('.tray__list'), totalEl = $('[data-total]'), countEl = $('[data-count-items]'), warn = $('.tray__warn');
    const money = n => '£' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, '');
    const save = () => store.set('wnd-cart', cart);
    const render = () => {
      const qty = cart.reduce((s, i) => s + i.q, 0), total = cart.reduce((s, i) => s + i.q * i.p, 0);
      countEl.textContent = qty;
      fab.classList.toggle('show', qty > 0);
      totalEl.textContent = money(total);
      warn.textContent = total > 0 && total < 15 ? `Delivery minimum spend is £15 — add ${money(15 - total)} more for delivery (collection/event orders welcome).` : (total >= 20 ? 'Orders over £20 — ask about a slice of our red velvet cake & custard.' : '');
      list.innerHTML = cart.length ? cart.map((i, idx) => `
        <li><div><b>${i.n}</b><br><small>${money(i.p)} each</small></div>
        <div class="qty"><button data-q="-1" data-i="${idx}" aria-label="Remove one">−</button><span>${i.q}</span><button data-q="1" data-i="${idx}" aria-label="Add one">+</button></div></li>`).join('')
        : '<div class="tray__empty">Your tray is empty.<br>Tap <b>Add</b> on any dish to start building your order.</div>';
    };
    const add = (n, p) => {
      const f = cart.find(i => i.n === n);
      f ? f.q++ : cart.push({ n, p, q: 1 });
      save(); render();
      fab.classList.remove('bump'); void fab.offsetWidth; fab.classList.add('bump');
    };
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-add]');
      if (b) {
        let name = b.dataset.add;
        const opt = b.closest('.m-item') && $('.opt input:checked', b.closest('.m-item'));
        if (opt) name += ' — ' + opt.value;
        add(name, parseFloat(b.dataset.price));
        if (b.classList.contains('add-btn')) {
          const old = b.innerHTML; b.classList.add('added'); b.innerHTML = 'Added ✓';
          setTimeout(() => { b.classList.remove('added'); b.innerHTML = old; }, 1100);
        }
      }
      const q = e.target.closest('[data-q]');
      if (q) {
        const i = +q.dataset.i; cart[i].q += +q.dataset.q;
        if (cart[i].q <= 0) cart.splice(i, 1);
        save(); render();
      }
    });
    const open = () => { trayEl.classList.add('open'); document.body.classList.add('is-locked'); };
    const close = () => { trayEl.classList.remove('open'); document.body.classList.remove('is-locked'); };
    fab.addEventListener('click', open);
    $$('[data-close-tray]').forEach(x => x.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    $('[data-clear]').addEventListener('click', () => { cart = []; save(); render(); });
    $('[data-send]').addEventListener('click', () => {
      if (!cart.length) return;
      const pc = $('#tray-postcode').value.trim(), note = $('#tray-note').value.trim();
      const total = cart.reduce((s, i) => s + i.q * i.p, 0);
      const lines = cart.map(i => `• ${i.q} × ${i.n} (${money(i.p * i.q)})`).join('\n');
      const msg = `Hi Wingz'N'Dat! 🔥 I'd like to order:\n\n${lines}\n\nEstimated total: ${money(total)} (+ delivery fee)${pc ? `\nPostcode: ${pc}` : ''}${note ? `\nNotes: ${note}` : ''}\n\nPlease confirm availability & delivery time. Thanks!`;
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
    render();
  }

  /* ==========================================================
     GALLERY: filters + lightbox
     ========================================================== */
  const mas = $('.masonry');
  if (mas) {
    const figs = $$('figure', mas);
    $$('.filters .tab').forEach(f => f.addEventListener('click', () => {
      $$('.filters .tab').forEach(x => x.classList.toggle('active', x === f));
      const k = f.dataset.filter;
      figs.forEach(fig => fig.classList.toggle('hide', k !== 'all' && !fig.dataset.cat.includes(k)));
    }));
    const lb = $('.lightbox'), lbImg = $('img', lb), lbCap = $('.lightbox__cap', lb);
    let idx = 0;
    const visible = () => figs.filter(f => !f.classList.contains('hide'));
    const show = i => {
      const v = visible(); idx = (i + v.length) % v.length;
      const f = v[idx], img = $('img', f);
      lbImg.src = img.dataset.full || img.src; lbImg.alt = img.alt;
      lbCap.textContent = $('figcaption', f) ? $('figcaption', f).textContent : img.alt;
    };
    figs.forEach(f => {
      f.tabIndex = 0;
      const openIt = () => { show(visible().indexOf(f)); lb.classList.add('open'); document.body.classList.add('is-locked'); };
      f.addEventListener('click', openIt);
      f.addEventListener('keydown', e => { if (e.key === 'Enter') openIt(); });
    });
    const closeLb = () => { lb.classList.remove('open'); document.body.classList.remove('is-locked'); };
    $('.lb-close', lb).addEventListener('click', closeLb);
    $('.lb-prev', lb).addEventListener('click', () => show(idx - 1));
    $('.lb-next', lb).addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1);
    });
    let sx = 0;
    lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); });
  }

  /* ==========================================================
     FORMS → WhatsApp
     ========================================================== */
  const range = $('#guests');
  if (range) {
    const out = $('#guests-out');
    const upd = () => { out.textContent = range.value + (range.value == range.max ? '+' : ''); range.style.setProperty('--p', ((range.value - range.min) / (range.max - range.min) * 100) + '%'); };
    range.addEventListener('input', upd); upd();
  }
  $$('form[data-wa]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      $$('[required]', form).forEach(inp => {
        const f = inp.closest('.field'), err = $('.err', f);
        let msg = '';
        if (!inp.value.trim()) msg = 'Please fill this in.';
        else if (inp.type === 'tel' && !/^[+0-9 ()-]{10,}$/.test(inp.value.trim())) msg = 'Please enter a valid phone number.';
        else if (inp.type === 'date' && new Date(inp.value) < new Date(new Date().toDateString())) msg = 'Please choose a future date.';
        f.classList.toggle('invalid', !!msg); if (err) err.textContent = msg;
        if (msg) ok = false;
      });
      if (!ok) { const first = $('.invalid input, .invalid select, .invalid textarea', form); if (first) first.focus(); return; }
      const data = new FormData(form);
      const title = form.dataset.wa;
      const rows = [];
      for (const [k, v] of data.entries()) {
        if (!String(v).trim()) continue;
        const label = (form.querySelector(`[name="${k}"]`).closest('.field') || {}).querySelector?.('label')?.textContent || k;
        const existing = rows.find(r => r[0] === label);
        existing ? existing[1] += ', ' + v : rows.push([label, String(v)]);
      }
      const msg = `Hi Wingz'N'Dat! 👋 ${title}\n\n` + rows.map(r => `*${r[0]}:* ${r[1]}`).join('\n');
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
      const s = $('.form-success', form); if (s) s.classList.add('show');
    });
    $$('input,select,textarea', form).forEach(i => i.addEventListener('input', () => { const f = i.closest('.field'); if (f) { f.classList.remove('invalid'); const er = $('.err', f); if (er) er.textContent = ''; } }));
  });
})();
