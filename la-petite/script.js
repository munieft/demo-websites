/* La Petite Boulangerie, Cheam */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }

  /* ---------- open now, in Cheam time ---------- */
  // [open, close] in minutes from midnight; index 0 = Sunday
  var HOURS = [[480, 960], [420, 1020], [420, 1020], [420, 1020], [420, 1020], [420, 1020], [420, 1020]];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function clock(m) { var h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return h + (mm ? ':' + ('0' + mm).slice(-2) : '') + ap; }
  function londonNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      return { day: DAYS.indexOf(o.weekday), mins: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) { var d = new Date(); return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() }; }
  }
  function updateStatus() {
    var n = londonNow(); if (n.day < 0) return;
    var today = HOURS[n.day], state, text;
    if (n.mins >= today[0] && n.mins < today[1]) {
      var left = today[1] - n.mins; state = 'open';
      text = left <= 45 ? 'Open, closing at ' + clock(today[1]) : 'Open now until ' + clock(today[1]);
    } else if (n.mins < today[0]) { state = 'closed'; text = 'Closed, opens ' + clock(today[0]) + ' today'; }
    else { var t = (n.day + 1) % 7; state = 'closed'; text = 'Closed, opens ' + clock(HOURS[t][0]) + ' ' + DAYS[t]; }
    $$('[data-status]').forEach(function (el) { el.dataset.state = state; $('span', el).textContent = text; });
    $$('.hours tr').forEach(function (tr) { tr.classList.toggle('today', +tr.dataset.day === n.day); });
  }
  updateStatus(); setInterval(updateStatus, 30000);

  /* ---------- menu boards: tabs + search ---------- */
  var boards = $$('.board'), tabs = $$('.tab'), search = $('#menu-search'), boardsEl = $('.boards'), noMatch = $('.no-match');
  var current = 'breakfast';
  $$('.item').forEach(function (it) {
    $$('.item-name, .item-desc', it).forEach(function (el) { el.dataset.raw = el.textContent; });
    it.dataset.text = it.textContent.toLowerCase();
  });
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function paint(el, q) {
    var raw = el.dataset.raw, i = q ? raw.toLowerCase().indexOf(q) : -1;
    el.innerHTML = i < 0 ? esc(raw) : esc(raw.slice(0, i)) + '<mark>' + esc(raw.slice(i, i + q.length)) + '</mark>' + esc(raw.slice(i + q.length));
  }
  function replay(b) { if (reduce) return; b.style.animation = 'none'; $$('.scribble path', b).forEach(function (p) { p.style.animation = 'none'; }); void b.offsetWidth; b.style.animation = ''; $$('.scribble path', b).forEach(function (p) { p.style.animation = ''; }); }
  function render() {
    var q = (search.value || '').trim().toLowerCase(), any = false;
    boards.forEach(function (b) {
      var show;
      if (q) {
        var hits = 0;
        $$('.item', b).forEach(function (it) { var hit = it.dataset.text.indexOf(q) > -1; it.hidden = !hit; if (hit) hits++; $$('.item-name, .item-desc', it).forEach(function (el) { paint(el, q); }); });
        $$('.group', b).forEach(function (g) { g.hidden = !$$('.item', g).some(function (it) { return !it.hidden; }); });
        show = hits > 0;
      } else {
        $$('.item, .group', b).forEach(function (el) { el.hidden = false; });
        $$('.item-name, .item-desc', b).forEach(function (el) { paint(el, ''); });
        show = current === 'all' || b.dataset.board === current;
      }
      if (show && b.hidden) replay(b);
      b.hidden = !show; if (show) any = true;
    });
    var visible = boards.filter(function (b) { return !b.hidden; });
    boards.forEach(function (b) { b.classList.toggle('solo', visible.length === 1); });
    boardsEl.classList.toggle('one', visible.length === 1);
    noMatch.hidden = any;
    if (!any) $('b', noMatch).textContent = search.value.trim();
    tabs.forEach(function (t) { t.setAttribute('aria-pressed', String(!q && t.dataset.tab === current)); });
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { current = t.dataset.tab; search.value = ''; boards.forEach(function (b) { b.hidden = true; }); render(); });
  });
  search.addEventListener('input', render);
  render();

  /* ---------- gallery lightbox ---------- */
  var shots = $$('.shot'), lb = $('#lightbox'), lbImg = $('img', lb), lbCap = $('.lb-cap', lb), at = 0;
  function show(i) { at = (i + shots.length) % shots.length; var im = $('img', shots[at]); lbImg.src = im.src; lbImg.alt = im.alt; lbCap.textContent = $('span', shots[at]).textContent; }
  shots.forEach(function (s, i) { s.addEventListener('click', function () { show(i); if (lb.showModal) lb.showModal(); else lb.setAttribute('open', ''); }); });
  $('.lb-prev', lb).addEventListener('click', function () { show(at - 1); });
  $('.lb-next', lb).addEventListener('click', function () { show(at + 1); });
  $('.lb-close', lb).addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(at - 1); if (e.key === 'ArrowRight') show(at + 1); });

  /* ---------- copy phone number ---------- */
  $$('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var num = btn.dataset.copy, label = btn.textContent;
      function done(ok) { btn.textContent = ok ? 'Copied' : 'Select the number to copy'; setTimeout(function () { btn.textContent = label; }, 2200); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(num).then(function () { done(true); }, function () { done(false); });
      else done(false);
    });
  });

  /* ---------- review count ticks up once ---------- */
  var count = $('[data-count]');
  if (count && !reduce) {
    var target = +count.dataset.count, t0 = null;
    count.textContent = '0';
    requestAnimationFrame(function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1400); count.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); });
  }

  /* ---------- reveal on scroll + nav highlight ---------- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { el.classList.add('in'); }); }, 6000);
    var links = $$('.nav a');
    var so = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { so.observe(s); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- hero photo leans with the pointer ---------- */
  var hp = $('.hero-photo');
  if (hp && !reduce && window.matchMedia('(hover: hover)').matches) {
    var sign = $('.sign');
    window.addEventListener('pointermove', function (e) {
      var x = e.clientX / window.innerWidth - .5, y = e.clientY / window.innerHeight - .5;
      hp.style.transform = 'translate(' + (x * -10).toFixed(1) + 'px,' + (y * -8).toFixed(1) + 'px)';
      sign.style.translate = (x * 8).toFixed(1) + 'px ' + (y * 6).toFixed(1) + 'px';
    }, { passive: true });
  }

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
