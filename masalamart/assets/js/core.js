/* Masala Mart — shared core: data store, cart, layout, product cards, animations */
(function () {
  const D = window.MM_DEFAULTS;
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => '£' + (Math.round(n * 100) / 100).toFixed(2);
  const pence = n => n < 1 ? Math.round(n * 100) + 'p' : money(n);

  /* ---------- Data store (swap for API later) ---------- */
  const Store = {
    _cache: null,
    load() {
      if (this._cache) return this._cache;
      let db = LS.get('mm_db', null);
      if (!db || db.version !== D.version) db = JSON.parse(JSON.stringify(D));
      db.settings = Object.assign({}, D.settings, db.settings);
      return (this._cache = db);
    },
    save(db) { this._cache = db; if (!LS.set('mm_db', db)) MM.toast('Storage full — try smaller images', 'warn'); window.dispatchEvent(new Event('mm:data')); },
    reset() { try { localStorage.removeItem('mm_db'); } catch (e) {} this._cache = null; return this.load(); },
    get settings() { return this.load().settings; },
    get categories() { return this.load().categories; },
    get products() { return this.load().products.filter(p => !p.hidden); },
    allProducts() { return this.load().products; },
    product(id) { return this.load().products.find(p => p.id === id); },
    cat(id) { return this.load().categories.find(c => c.id === id) || { name: id, icon: '🛒', hue: 30 }; },
    orders() { return LS.get('mm_orders', []); },
    saveOrders(o) { LS.set('mm_orders', o); }
  };

  /* ---------- Cart ---------- */
  const Cart = {
    items() { return LS.get('mm_cart', {}); },
    member() { return LS.get('mm_member', false); },
    setMember(v) { LS.set('mm_member', !!v); this.emit(); },
    set(id, qty) {
      const c = this.items(); const p = Store.product(id); if (!p) return;
      qty = Math.max(0, Math.min(qty, p.stock ?? 99));
      if (qty) c[id] = qty; else delete c[id];
      LS.set('mm_cart', c); this.emit();
    },
    add(id, n = 1) { this.set(id, (this.items()[id] || 0) + n); },
    clear() { LS.set('mm_cart', {}); this.emit(); },
    unitPrice(p) { return this.member() && p.mm ? p.mm : p.price; },
    line(p, qty) {
      const u = this.unitPrice(p); let total = u * qty;
      if (p.offer && p.offer.qty > 1) total = Math.floor(qty / p.offer.qty) * p.offer.price + (qty % p.offer.qty) * u;
      return { unit: u, total: Math.round(total * 100) / 100, full: Math.round(p.price * qty * 100) / 100 };
    },
    lines() {
      return Object.entries(this.items()).map(([id, qty]) => { const p = Store.product(id); return p ? Object.assign({ p, qty }, this.line(p, qty)) : null; }).filter(Boolean);
    },
    totals() {
      const lines = this.lines();
      const sub = lines.reduce((a, l) => a + l.total, 0), full = lines.reduce((a, l) => a + l.full, 0);
      return { lines, count: lines.reduce((a, l) => a + l.qty, 0), sub: Math.round(sub * 100) / 100, saved: Math.round((full - sub) * 100) / 100 };
    },
    emit() { window.dispatchEvent(new Event('mm:cart')); }
  };

  /* ---------- Placeholder product art (until admin uploads a photo) ---------- */
  function art(p) {
    const c = Store.cat(p.cat), h = c.hue;
    const words = p.name.replace(/\(.*?\)/g, '').trim().split(/\s+/); const lines = []; let cur = '';
    words.forEach(w => { if ((cur + ' ' + w).trim().length > 13) { if (cur) lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
    if (cur) lines.push(cur);
    const t = lines.slice(0, 3).map((l, i) => `<text x="200" y="${232 + i * 34 - (lines.length - 1) * 14}" text-anchor="middle" font-family="Georgia,serif" font-size="30" font-weight="700" fill="#fff">${esc(l)}</text>`).join('');
    const petals = Array.from({ length: 12 }, (_, i) => `<ellipse cx="200" cy="96" rx="9" ry="22" fill="hsl(${h + 30},90%,70%)" opacity=".55" transform="rotate(${i * 30} 200 130)"/>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},70%,45%)"/><stop offset="1" stop-color="hsl(${h + 20},75%,28%)"/></linearGradient><radialGradient id="bg"><stop offset="0" stop-color="hsl(${h},60%,97%)"/><stop offset="1" stop-color="hsl(${h},45%,90%)"/></radialGradient></defs><rect width="400" height="400" fill="url(#bg)"/><circle cx="200" cy="200" r="170" fill="none" stroke="hsl(${h},40%,80%)" stroke-dasharray="2 8" stroke-width="3"/><path d="M110 70 Q200 50 290 70 L305 330 Q200 352 95 330 Z" fill="url(#g)"/><path d="M110 70 Q200 50 290 70 L292 98 Q200 80 108 98Z" fill="#000" opacity=".18"/>${petals}<circle cx="200" cy="130" r="16" fill="#ffd25e"/><text x="200" y="138" text-anchor="middle" font-family="Arial" font-weight="900" font-size="15" fill="#b3141a">MM</text>${t}<rect x="140" y="292" width="120" height="26" rx="13" fill="#fff" opacity=".92"/><text x="200" y="310" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="hsl(${h},60%,30%)">${esc(p.unit || '')}</text><path d="M95 330 Q200 352 305 330" stroke="#fff" stroke-opacity=".25" stroke-width="4" fill="none"/></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  const img = p => p.img || art(p);

  /* ---------- Product card ---------- */
  function card(p) {
    const qty = Cart.items()[p.id] || 0; const out = (p.stock ?? 1) <= 0;
    const mm = p.mm ? `<span class="pc-mm">MM Card ${pence(p.mm)}</span>` : '';
    const was = p.was ? `<s>${pence(p.was)}</s>` : '';
    return `<article class="pc reveal" data-id="${p.id}">
      <button class="pc-img" data-quick="${p.id}" aria-label="View ${esc(p.name)}"><img src="${img(p)}" alt="${esc(p.name)}" loading="lazy">
        ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}${p.offer ? `<span class="pc-offer">${esc(p.offer.label)}</span>` : ''}</button>
      <div class="pc-body"><span class="pc-cat">${esc(Store.cat(p.cat).name)}</span>
        <h3 class="pc-name" data-quick="${p.id}">${esc(p.name)}</h3><span class="pc-unit">${esc(p.unit || '')}</span>
        <div class="pc-foot"><div class="pc-price"><b>${pence(p.price)}</b>${was}${mm}</div>
        ${out ? '<span class="pc-out">Out of stock</span>' : qtyCtl(p.id, qty)}</div></div></article>`;
  }
  function qtyCtl(id, qty) {
    return qty ? `<div class="qty" data-id="${id}"><button data-dec aria-label="Less">−</button><span>${qty}</span><button data-inc aria-label="More">+</button></div>`
      : `<button class="add" data-add="${id}" aria-label="Add to basket"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><span>Add</span></button>`;
  }
  function refreshCards() {
    $$('.pc').forEach(el => { const id = el.dataset.id, q = Cart.items()[id] || 0; const f = el.querySelector('.qty,.add'); if (f) f.outerHTML = qtyCtl(id, q); });
  }

  /* ---------- Layout ---------- */
  const NAV = [['index.html', 'Home'], ['shop.html', 'Shop'], ['shop.html#offers', 'Offers'], ['store.html', 'Our Store'], ['store.html#catering', 'Catering']];
  function layout() {
    const s = Store.settings, page = document.body.dataset.page;
    const head = $('#site-header');
    if (head) head.outerHTML = `
    <div class="toran" aria-hidden="true"></div>
    <div class="ticker"><div class="ticker-track"><span>${esc(s.announcement)}</span><span>${esc(s.announcement)}</span></div></div>
    <header class="hdr"><div class="wrap hdr-in">
      <a href="index.html" class="brand"><img src="assets/img/logo.jpg" alt="Masala Mart logo"><span><b>Masala Mart</b><small>Barnet · Est. on the High Street</small></span></a>
      <nav class="nav"><button class="nav-x" type="button" aria-label="Close menu">×</button>${NAV.map(([h, t]) => `<a href="${h}" class="${(page === h.split('.')[0] && !h.includes('#')) ? 'on' : ''}">${t}</a>`).join('')}<form class="nav-search" role="search"><input name="q" placeholder="Search products…" aria-label="Search products"></form><div class="nav-info"><span data-open></span><a href="tel:+${esc(s.whatsapp)}">📞 ${esc(s.phone)}</a><span>📍 ${esc(s.address)}</span></div></nav>
      <form class="hsearch" role="search"><input name="q" placeholder="Search atta, jeera, paneer…" aria-label="Search products"><button aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg></button></form>
      <span class="open-pill" data-open></span>
      <button class="cart-btn" data-cart aria-label="Open basket"><svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg><i data-count>0</i></button>
      <button class="burger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div></header>
    <div class="drawer-bg"></div>
    <aside class="drawer" aria-label="Basket"><div class="dr-head"><h3>Your Basket</h3><button class="x" data-close aria-label="Close">×</button></div><div class="dr-body"></div><div class="dr-foot"></div></aside>
    <div class="modal" id="quick"><div class="modal-card"></div></div>
    <div class="toasts"></div>`;
    const foot = $('#site-footer');
    if (foot) foot.outerHTML = `<footer class="ftr"><div class="mandala-bg"></div><div class="wrap ftr-grid">
      <div><img src="assets/img/logo.jpg" class="ftr-logo" alt="Masala Mart"><p>${esc(s.tagline)}. Fresh produce, spices, snacks, mithai and festive essentials — on Barnet High Street.</p>
        <div class="social"><a href="https://www.instagram.com/${esc(s.instagram)}/" target="_blank" rel="noopener">Instagram @${esc(s.instagram)}</a><a href="https://wa.me/${esc(s.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a></div></div>
      <div><h4>Shop</h4>${Store.categories.slice(0, 7).map(c => `<a href="shop.html#c-${c.id}">${esc(c.name)}</a>`).join('')}</div>
      <div><h4>Visit</h4><p>${esc(s.address)}</p><p>Tel: <a href="tel:+${esc(s.whatsapp)}">${esc(s.phone)}</a></p><div class="hours-mini" data-hours></div></div>
      <div><h4>Masala Mart</h4><a href="store.html">Our Story</a><a href="store.html#catering">Suman's Pure Veg Catering</a><a href="store.html#visit">Find Us</a><a href="cart.html">Basket & Checkout</a><a href="admin.html">Store Admin</a></div>
    </div><div class="wrap ftr-base"><span>© ${new Date().getFullYear()} Masala Mart, Barnet. Pure vegetarian • Shop local.</span><span>शुभ लाभ · Made with love on the High Street</span></div></footer>`;

    // events
    $('.nav-x')?.addEventListener('click', () => document.body.classList.remove('nav-open'));
    $('.nav-search')?.addEventListener('submit', e => { e.preventDefault(); const q = e.target.q.value.trim(); document.body.classList.remove('nav-open'); location.href = 'shop.html' + (q ? '#q-' + encodeURIComponent(q) : ''); });
    $('.hsearch')?.addEventListener('submit', e => { e.preventDefault(); const q = e.target.q.value.trim(); location.href = 'shop.html' + (q ? '#q-' + encodeURIComponent(q) : ''); });
    $('.burger')?.addEventListener('click', () => document.body.classList.toggle('nav-open'));
    $$('.nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('nav-open')));
    $('[data-cart]')?.addEventListener('click', openDrawer);
    $('.drawer-bg')?.addEventListener('click', closeDrawer);
    $('[data-close]')?.addEventListener('click', closeDrawer);
    $('#quick')?.addEventListener('click', e => { if (e.target.id === 'quick' || e.target.closest('[data-mclose]')) $('#quick').classList.remove('show'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); $('#quick')?.classList.remove('show'); } });
    window.addEventListener('scroll', () => document.body.classList.toggle('scrolled', scrollY > 30), { passive: true });

    // delegated cart controls
    document.addEventListener('click', e => {
      const a = e.target.closest('[data-add]'); if (a) { Cart.add(a.dataset.add); fly(a); toast(`Added ${Store.product(a.dataset.add).name}`); return; }
      const q = e.target.closest('.qty'); if (q && e.target.closest('button')) { const id = q.dataset.id, n = Cart.items()[id] || 0; Cart.set(id, e.target.closest('[data-inc]') ? n + 1 : n - 1); return; }
      const v = e.target.closest('[data-quick]'); if (v) quick(v.dataset.quick);
    });
    window.addEventListener('mm:cart', () => { renderCount(); renderDrawer(); refreshCards(); refreshQuick(); });
    renderCount(); renderDrawer(); openStatus(); setInterval(openStatus, 60000);
  }

  function renderCount() { const n = Cart.totals().count; $$('[data-count]').forEach(el => { el.textContent = n; el.classList.toggle('has', n > 0); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }); }
  function openDrawer() { renderDrawer(); document.body.classList.add('drawer-open'); }
  function closeDrawer() { document.body.classList.remove('drawer-open', 'nav-open'); }
  function renderDrawer() {
    const b = $('.dr-body'), f = $('.dr-foot'); if (!b) return; const t = Cart.totals();
    if (!t.lines.length) { b.innerHTML = `<div class="empty"><div class="empty-ico">🛍️</div><p>Your basket is empty.</p><a class="btn" href="shop.html">Start shopping</a></div>`; f.innerHTML = ''; return; }
    b.innerHTML = t.lines.map(l => `<div class="dl"><img src="${img(l.p)}" alt=""><div><b>${esc(l.p.name)}</b><small>${esc(l.p.unit || '')} · ${pence(l.unit)}${l.p.offer ? ' · ' + esc(l.p.offer.label) : ''}</small>${qtyCtl(l.p.id, l.qty)}</div><strong>${money(l.total)}</strong></div>`).join('');
    f.innerHTML = `${t.saved > 0 ? `<div class="saved">You're saving ${money(t.saved)} 🎉</div>` : ''}<div class="row"><span>Subtotal</span><b>${money(t.sub)}</b></div><a class="btn btn-full" href="cart.html">Checkout · ${money(t.sub)}</a><button class="link" data-close2>Continue shopping</button>`;
    f.querySelector('[data-close2]').onclick = closeDrawer;
  }

  /* ---------- Quick view ---------- */
  let quickId = null;
  function quick(id) {
    const p = Store.product(id); if (!p) return; quickId = id; const m = $('#quick'); if (!m) return;
    const related = Store.products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    m.querySelector('.modal-card').innerHTML = `<button class="x" data-mclose aria-label="Close">×</button>
      <div class="qv"><div class="qv-img"><img src="${img(p)}" alt="${esc(p.name)}">${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}</div>
      <div class="qv-info"><span class="pc-cat">${Store.cat(p.cat).icon} ${esc(Store.cat(p.cat).name)}</span><h2>${esc(p.name)}</h2><p class="muted">${esc(p.unit || '')}</p>
      <div class="qv-price"><b>${pence(p.price)}</b>${p.was ? `<s>${pence(p.was)}</s>` : ''}${p.mm ? `<span class="pc-mm">MM Card ${pence(p.mm)}</span>` : ''}</div>
      ${p.offer ? `<div class="offer-strip">🎁 ${esc(p.offer.label)} — applied automatically in your basket</div>` : ''}
      <p>${esc(p.desc || '')}</p><div class="qv-ctl" data-qv></div>
      <ul class="ticks"><li>Pure vegetarian store</li><li>Click & Collect from Barnet High Street</li><li>Local delivery across EN4–EN6, N2–N20</li></ul>
      ${related.length ? `<h4>You may also like</h4><div class="qv-rel">${related.map(r => `<button data-quick="${r.id}"><img src="${img(r)}" alt=""><span>${esc(r.name)}</span><b>${pence(r.price)}</b></button>`).join('')}</div>` : ''}</div></div>`;
    refreshQuick(); m.classList.add('show');
  }
  function refreshQuick() { const c = $('[data-qv]'); if (c && quickId) { const p = Store.product(quickId); c.innerHTML = (p.stock ?? 1) <= 0 ? '<span class="pc-out">Out of stock</span>' : qtyCtl(quickId, Cart.items()[quickId] || 0); } }

  /* ---------- Misc UI ---------- */
  function toast(msg, type = '') {
    const box = $('.toasts'); if (!box) return; const t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = msg; box.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2200); setTimeout(() => t.remove(), 2700);
  }
  function fly(btn) {
    const cart = $('[data-cart]'), card = btn.closest('.pc'), im = card?.querySelector('img'); if (!cart || !im) return;
    const a = im.getBoundingClientRect(), b = cart.getBoundingClientRect(); const g = im.cloneNode(); g.className = 'flyer';
    Object.assign(g.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' }); document.body.appendChild(g);
    requestAnimationFrame(() => Object.assign(g.style, { transform: `translate(${b.left - a.left + b.width / 2 - a.width / 2}px,${b.top - a.top + b.height / 2 - a.height / 2}px) scale(.08)`, opacity: .4 }));
    setTimeout(() => g.remove(), 800);
  }
  function londonNow() { const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' })); return d; }
  function status() {
    const H = Store.settings.hours, n = londonNow(), day = n.getDay(), mins = n.getHours() * 60 + n.getMinutes();
    const toM = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const [o, c] = H[day] || []; const fmt = t => { let [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return h + (m ? ':' + String(m).padStart(2, '0') : '') + ap; };
    if (o && mins >= toM(o) && mins < toM(c)) return { open: true, text: `Open now · until ${fmt(c)}` };
    for (let i = 0; i < 7; i++) { const d = (day + i) % 7, h = H[d]; if (!h) continue; if (i === 0 && mins < toM(h[0])) return { open: false, text: `Closed · opens ${fmt(h[0])}` }; if (i > 0) return { open: false, text: `Closed · opens ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]} ${fmt(h[0])}` }; }
    return { open: false, text: 'Closed' };
  }
  function hoursTable() {
    const H = Store.settings.hours, today = londonNow().getDay(); const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const fmt = t => { let [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return h + ':' + String(m).padStart(2, '0') + ap; };
    return [1, 2, 3, 4, 5, 6, 0].map(d => `<div class="${d === today ? 'today' : ''}"><span>${names[d]}</span><b>${H[d] ? fmt(H[d][0]) + ' – ' + fmt(H[d][1]) : 'Closed'}</b></div>`).join('');
  }
  function openStatus() { const s = status(); $$('[data-open]').forEach(el => { el.textContent = s.text; el.classList.toggle('closed', !s.open); }); $$('[data-hours]').forEach(el => el.innerHTML = hoursTable()); }

  function reveal() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    const scan = () => $$('.reveal:not(.in)').forEach((el, i) => { el.style.transitionDelay = (i % 6) * 60 + 'ms'; io.observe(el); });
    scan(); new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  }

  /* Falling marigold petals */
  function petals(canvas) {
    if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d'); let W, H, P = [];
    const cols = ['#ffb627', '#ff8c1a', '#f5a300', '#e3171b', '#ffd25e'];
    const size = () => { W = canvas.width = canvas.offsetWidth * devicePixelRatio; H = canvas.height = canvas.offsetHeight * devicePixelRatio; };
    size(); addEventListener('resize', size);
    for (let i = 0; i < 34; i++) P.push({ x: Math.random() * W, y: Math.random() * H, r: (4 + Math.random() * 7) * devicePixelRatio, s: .3 + Math.random() * .8, a: Math.random() * 6, w: .01 + Math.random() * .02, c: cols[i % cols.length] });
    (function tick() {
      ctx.clearRect(0, 0, W, H);
      P.forEach(p => { p.y += p.s * devicePixelRatio; p.a += p.w; p.x += Math.sin(p.a) * .6; if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.globalAlpha = .75; ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .5, 0, 0, 7); ctx.fill(); ctx.restore(); });
      requestAnimationFrame(tick);
    })();
  }

  window.MM = { Store, Cart, LS, $, $$, esc, money, pence, img, art, card, quick, toast, status, hoursTable, petals, openDrawer };
  document.addEventListener('DOMContentLoaded', () => { layout(); reveal(); });
})();
