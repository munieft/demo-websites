/* Vegan Garden London: interactions and animation. No libraries. */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  var hasIO = 'IntersectionObserver' in window;

  /* header turns solid after a little scroll; mobile action bar slides in */
  var head = $('.site-head'), bar = $('.actionbar');
  function onScroll() {
    var y = window.pageYOffset || doc.scrollTop;
    if (head) head.classList.toggle('is-solid', y > 30);
    if (bar) bar.classList.toggle('is-in', y > 360);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  var toggle = $('.menu-toggle');
  function setNav(open) {
    doc.classList.toggle('nav-open', open);
    if (toggle) { toggle.setAttribute('aria-expanded', open ? 'true' : 'false'); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle) toggle.addEventListener('click', function () { setNav(!doc.classList.contains('nav-open')); });
  $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 820) setNav(false); });

  /* trading days: Fri, Sat, Sun (London time) */
  var day;
  try { day = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'Europe/London' }).format(new Date()); }
  catch (e) { day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]; }
  var open = ['Fri', 'Sat', 'Sun'].indexOf(day) > -1;
  $$('[data-status]').forEach(function (el) {
    el.classList.toggle('is-open', open);
    var t = $('span', el);
    if (t) t.textContent = open ? 'At Greenwich Market today' : (day === 'Thu' ? 'Back at the market tomorrow' : 'Back at the market on Friday');
  });
  $$('.day').forEach(function (d) { if (d.getAttribute('data-d') === day) d.classList.add('today'); });

  /* scroll reveals: tag elements, stagger siblings */
  var groups = [
    ['.sec-head > *', 0], ['.split > *', 0], ['.steps > li', 1], ['.food > li', 1], ['.cake-stage', 0], ['.cake-wrap > div:last-child > *', 1],
    ['.quote-grid > li', 1], ['.quotes .note', 0], ['.visit-band', 0], ['.days .day', 2], ['.visit-band dl > div', 1],
    ['.mitems > li', 1], ['.card', 1], ['.info-list > li', 1], ['.visit-grid .btns', 0], ['.visit-grid > div:last-child', 0],
    ['.find > li', 1], ['.find', 0], ['.map', 0], ['.banner', 0], ['.section > .wrap > .h2', 0], ['.section > .wrap > .btns', 0]
  ];
  var targets = [];
  groups.forEach(function (g) {
    $$(g[0]).forEach(function (el, i) {
      if (el.classList.contains('rv')) return;
      el.classList.add('rv');
      if (g[1] === 2) el.classList.add('pop-in');
      if (g[1]) el.style.setProperty('--i', Math.min(i, 8));
      targets.push(el);
    });
  });
  if (reduce || !hasIO) {
    targets.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
    // safety net: never leave content hidden
    setTimeout(function () { targets.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add('in'); }); }, 2500);
  }

  /* count up numbers, e.g. the Google rating */
  $$('[data-count]').forEach(function (el) {
    var end = parseFloat(el.getAttribute('data-count')), dec = (el.getAttribute('data-count').split('.')[1] || '').length;
    if (reduce || !hasIO) return;
    el.textContent = (0).toFixed(dec);
    var o = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; o.disconnect();
      var t0 = null;
      function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1400); p = 1 - Math.pow(1 - p, 3); el.textContent = (end * p).toFixed(dec); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    o.observe(el);
  });

  /* cake counter: pictures change by themselves; tap or hover a name to pick one */
  var stage = $('.cake-stage');
  if (stage) {
    var figs = $$('figure', stage), btns = $$('.cake-list button'), cur = 0, timer = null, visible = true;
    function show(n) {
      cur = (n + figs.length) % figs.length;
      figs.forEach(function (f, k) { f.classList.toggle('is-active', k === cur); });
      btns.forEach(function (b, k) { b.setAttribute('aria-pressed', k === cur ? 'true' : 'false'); });
    }
    function auto() { clearInterval(timer); if (!reduce && visible) timer = setInterval(function () { show(cur + 1); }, 3800); }
    btns.forEach(function (b, k) {
      b.addEventListener('click', function () { show(k); auto(); });
      b.addEventListener('mouseenter', function () { if (window.matchMedia('(hover:hover)').matches) { show(k); auto(); } });
    });
    if (hasIO) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? auto() : clearInterval(timer); }).observe(stage);
    show(0); auto();
  }

  /* videos: muted inline autoplay for iPhone, Android and desktop; plays only on screen */
  $$('video[data-auto]').forEach(function (v) {
    v.muted = true; v.defaultMuted = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    function load() { if (!v.getAttribute('src') && v.getAttribute('data-src')) v.src = v.getAttribute('data-src'); }
    function play() { if (reduce) return; load(); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    if (hasIO) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? play() : v.pause(); }); }, { threshold: 0.15 }).observe(v);
    } else { play(); }
  });

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
