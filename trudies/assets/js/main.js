(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav state + mobile dock */
  const nav = $('.nav'), dock = $('.dock');
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    dock.classList.toggle('show', y > innerHeight * 0.6);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* drawer */
  const toggle = $('.nav__toggle'), drawer = $('#drawer');
  const setDrawer = open => {
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setDrawer(drawer.hidden));
  $$('a', drawer).forEach(a => a.addEventListener('click', () => setDrawer(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) setDrawer(false); });

  /* hero cake carousel */
  const plates = $$('.hero__plate img'), cap = $('.hero__caption');
  const caps = ['Boho & pampas', 'Buttercream blooms', 'Vintage ruffles', 'Big numbers', 'Lemon & roses', 'Swan & florals'];
  let hi = 0;
  if (!reduce) setInterval(() => {
    plates[hi].classList.remove('is-on');
    hi = (hi + 1) % plates.length;
    plates[hi].loading = 'eager';
    plates[hi].classList.add('is-on');
    cap.style.opacity = 0;
    setTimeout(() => { cap.textContent = caps[hi]; cap.style.opacity = 1; }, 400);
  }, 3800);

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.15, rootMargin: '0px 0px -40px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* menu tabs */
  const tabs = $$('[role="tab"]');
  const select = t => {
    tabs.forEach(x => {
      const on = x === t;
      x.setAttribute('aria-selected', on);
      x.tabIndex = on ? 0 : -1;
      const p = $('#' + x.getAttribute('aria-controls'));
      p.hidden = !on; p.classList.toggle('is-on', on);
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const n = tabs[(i + d + tabs.length) % tabs.length]; select(n); n.focus();
    });
  });

  /* gallery */
  const G = [
    ['boho-floral', 'cakes', 'Boho pampas & pearls'],
    ['cupcakes-autumn-blooms', 'cupcakes', 'A dozen in bloom'],
    ['dino-jose', 'themed', 'Dino for Jose, age 3'],
    ['vintage-ruffle-pink', 'cakes', 'Vintage pink ruffles'],
    ['cinnamon-rolls', 'treats', 'Iced cinnamon rolls'],
    ['floral-crown', 'cakes', 'Buttercream flower crown'],
    ['cupcakes-gold-m', 'cupcakes', 'Cream & gold cupcakes'],
    ['gym-forty', 'themed', 'Gym-themed 40th'],
    ['sixty-gold-bubbles', 'cakes', '60 in gold'],
    ['unicorn-biscuits', 'treats', 'Unicorn biscuits'],
    ['half-half-sage', 'cakes', 'Sage & mocha florals'],
    ['teddy-train', 'themed', 'Choo-choo for Teddy'],
    ['cupcakes-teal', 'cupcakes', 'Teal swirls'],
    ['wild-forty', 'cakes', 'Wild 40'],
    ['blondies', 'treats', 'Pistachio blondies'],
    ['sports-aspen', 'themed', 'Sports for Aspen'],
    ['lemon-roses', 'cakes', 'Lemon & roses'],
    ['cupcakes-sunflower', 'cupcakes', 'Sunflowers & gold'],
    ['wedding-three-tier', 'cakes', 'Three-tier wedding'],
    ['football-pitch', 'themed', 'Football pitch for Kai'],
    ['cookie-box', 'treats', 'Cookie box'],
    ['swan-floral', 'cakes', 'Swan & florals'],
    ['cupcakes-pink-gold', 'cupcakes', 'Pink roses & gold script'],
    ['bear-humza', 'themed', 'Little bear, first birthday'],
    ['sage-botanical', 'cakes', 'Tall sage botanical'],
    ['halloween-biscuits', 'treats', 'Halloween biscuits'],
    ['lashes-elena', 'cakes', 'Lashes & roses for Elena'],
    ['cupcakes-lilac-forty', 'cupcakes', 'Lilac 40th set'],
    ['fairy-garden', 'themed', 'Fairy garden'],
    ['gold-drip-millie', 'cakes', 'Caramel drip for Millie'],
    ['treat-box', 'treats', 'Treat box'],
    ['vintage-ruffle-coral', 'cakes', 'Coral ruffles'],
    ['car-tom', 'themed', 'Race car for Tom, 30'],
    ['cupcakes-floral-dozen', 'cupcakes', 'Pastel bouquet'],
    ['grey-floral-drip', 'cakes', 'Grey drip & florals'],
    ['bow-vintage', 'cakes', 'Ribbons & bows'],
    ['cupcakes-biscoff', 'cupcakes', 'Biscoff cupcakes'],
    ['blue-drip', 'cakes', 'Blue drip'],
    ['cookies', 'treats', 'Fresh cookies'],
    ['pastel-drip', 'cakes', 'Pastel drip'],
    ['cupcakes-eighty-box', 'cupcakes', '80th cupcake box'],
    ['makeup-cake', 'themed', 'Make-up bag cake'],
    ['tall-floral-teal', 'cakes', 'Tall teal florals'],
    ['cupcakes-barber', 'themed', "Barber's cupcakes"],
    ['biscoff-birthday', 'cakes', 'Biscoff birthday'],
    ['chocolate-fingers', 'cakes', 'Chocolate finger cake'],
    ['cupcakes-mint-gold', 'cupcakes', 'Mint & gold'],
    ['sunflower-navy', 'cakes', 'Sunflower & navy'],
    ['cupcakes-pink-swirl', 'cupcakes', 'Pink swirls'],
    ['unicorn-olivia', 'themed', 'Unicorn for Olivia'],
    ['cupcake-filling', 'cupcakes', 'Filled centre'],
    ['cupcakes-dozen-sage', 'cupcakes', 'Sage & cream dozen']
  ];
  const grid = $('#masonry'), more = $('#more');
  let filter = 'all', shown = 16, list = [];
  const render = () => {
    list = G.filter(g => filter === 'all' || g[1] === filter);
    grid.innerHTML = '';
    list.slice(0, shown).forEach(([f, , c], i) => {
      const b = document.createElement('button');
      b.dataset.cap = c; b.dataset.i = i;
      b.setAttribute('aria-label', 'Open photo: ' + c);
      b.style.animationDelay = (i % 8) * 40 + 'ms';
      b.innerHTML = `<img src="assets/img/${f}.jpg" alt="${c}" loading="lazy">`;
      grid.appendChild(b);
    });
    more.parentElement.hidden = shown >= list.length;
  };
  $$('.filters button').forEach(b => b.addEventListener('click', () => {
    $$('.filters button').forEach(x => x.classList.toggle('is-on', x === b));
    filter = b.dataset.f; shown = 16; render();
  }));
  more.addEventListener('click', () => { shown += 16; render(); });
  render();

  /* lightbox */
  const lb = $('#lightbox'), lbImg = $('img', lb), lbCap = $('figcaption', lb);
  let li = 0;
  const show = i => {
    li = (i + list.length) % list.length;
    const [f, , c] = list[li];
    lbImg.src = `assets/img/${f}.jpg`; lbImg.alt = c; lbCap.textContent = c;
  };
  grid.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    show(+b.dataset.i); lb.showModal();
  });
  $('.lightbox__x').addEventListener('click', () => lb.close());
  $('.prev', lb).addEventListener('click', () => show(li - 1));
  $('.next', lb).addEventListener('click', () => show(li + 1));
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(li - 1);
    if (e.key === 'ArrowRight') show(li + 1);
  });
  let tx = 0;
  lb.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => {
    const d = e.changedTouches[0].clientX - tx;
    if (Math.abs(d) > 50) show(li + (d < 0 ? 1 : -1));
  });

  /* reel autoplay when visible */
  const vid = $('.reel video');
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !reduce) { vid.preload = 'auto'; vid.play().catch(() => {}); } else vid.pause();
  }, { threshold: 0.4 }).observe(vid);

  /* prefill order type from CTAs */
  const radios = $$('input[name="what"]');
  $$('[data-pick]').forEach(a => a.addEventListener('click', () => {
    const v = a.dataset.pick;
    const r = radios.find(r => r.value === v);
    if (r) r.checked = true;
    else if (v) { const idea = $('#f-idea'); if (!idea.value) idea.value = v === 'Trudie designs it' ? 'Surprise me! Here is a bit about who it is for: ' : 'My idea: '; }
  }));

  /* order form -> WhatsApp */
  const form = $('#orderForm'), err = $('.form__err');
  const date = $('#f-date');
  date.min = new Date().toISOString().split('T')[0];
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const bad = [];
    [['name', '#f-name'], ['date', '#f-date']].forEach(([k, s]) => {
      const ok = d[k] && d[k].trim();
      $(s).classList.toggle('bad', !ok); if (!ok) bad.push(k);
    });
    if (bad.length) { err.textContent = 'Please add your name and the date you need it.'; $(bad[0] === 'name' ? '#f-name' : '#f-date').focus(); return; }
    err.textContent = '';
    const nice = new Date(d.date + 'T12:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const msg = `Hi Trudie! I'd like to place an order.\n\n` + [
      `Name: ${d.name}`,
      `Order: ${d.what}`,
      d.occasion && `Occasion: ${d.occasion}`,
      `Date needed: ${nice}`,
      d.qty && `Serves / quantity: ${d.qty}`,
      d.idea && `Idea: ${d.idea}`
    ].filter(Boolean).join('\n');
    window.open('https://wa.me/447840968168?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  $('#yr').textContent = new Date().getFullYear();
})();
