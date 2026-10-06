/* Tim's Cafe: plain JavaScript, no libraries. */
(function () {
  'use strict';
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  doc.documentElement.classList.add('js');

  /* ---------- mobile nav ---------- */
  var nav = $('#nav'), toggle = $('#menu-toggle');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Close' : 'Menu';
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu'; }
  });

  /* ---------- ketchup scroll line + header shadow ---------- */
  var line = $('.ketchup-line'), head = $('.site-head'), ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      line.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
      head.classList.toggle('stuck', window.scrollY > 10);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- open / closed, worked out in UK time ---------- */
  var HOURS = { 0: [9, 17], 1: [8, 17], 2: [8, 17], 3: [8, 17], 4: [8, 17], 5: [8, 17], 6: [8, 17] };
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function hr(h) { return (h % 12 || 12) + (h < 12 ? 'am' : 'pm'); }
  function londonNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      return { day: DAYS.indexOf(o.weekday), mins: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function status() {
    var n = londonNow(), h = HOURS[n.day], open = n.mins >= h[0] * 60 && n.mins < h[1] * 60, short, long;
    if (open) {
      var left = h[1] * 60 - n.mins;
      short = 'Open';
      long = left <= 60 ? 'closing in ' + left + ' min' : 'until ' + hr(h[1]);
    } else if (n.mins < h[0] * 60) {
      short = 'Closed'; long = 'opens ' + hr(h[0]) + ' today';
    } else {
      short = 'Closed'; long = 'opens ' + hr(HOURS[(n.day + 1) % 7][0]) + ' tomorrow';
    }
    $$('[data-status]').forEach(function (el) {
      el.classList.toggle('is-open', open);
      $('.short', el).textContent = short;
      $('.long', el).textContent = ' ' + long;
    });
    $$('.hours tr').forEach(function (tr) { tr.classList.toggle('today', +tr.dataset.day === n.day); });
  }
  status();
  setInterval(status, 30000);

  /* ---------- things that rise into view ---------- */
  var watch = $$('.rise, .bar-head');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('seen'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    watch.forEach(function (el) { io.observe(el); });
  } else {
    watch.forEach(function (el) { el.classList.add('seen'); });
  }

  /* ---------- menu filter + search ---------- */
  var chips = $$('.chip'), search = $('#menu-search'), groups = $$('.mgroup'), none = $('#menu-none'), group = 'all';
  function norm(s) { return s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function filterMenu() {
    var q = norm(search.value), words = q ? q.split(' ') : [], shown = 0;
    groups.forEach(function (g) {
      var inGroup = group === 'all' || g.dataset.group === group, any = 0;
      $$('.mitem', g).forEach(function (it) {
        var hay = norm(it.textContent + ' ' + (it.dataset.also || '') + ' ' + g.dataset.title);
        var ok = inGroup && words.every(function (w) { return hay.indexOf(w) > -1; });
        it.classList.toggle('gone', !ok);
        if (ok) any++;
      });
      g.classList.toggle('gone', !any);
      shown += any;
    });
    none.hidden = shown > 0;
    if (!shown) $('#menu-none-q').textContent = search.value.trim() || 'that';
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      group = c.dataset.group;
      chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c); });
      filterMenu();
    });
  });
  search.addEventListener('input', filterMenu);
  $$('.quick button').forEach(function (b) {
    b.addEventListener('click', function () {
      search.value = b.dataset.q;
      group = 'all';
      chips.forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.group === 'all'); });
      filterMenu();
    });
  });
  $('#menu-reset').addEventListener('click', function () { search.value = ''; chips[0].click(); search.focus(); });

  /* ---------- build a plate ---------- */
  var EXTRAS = JSON.parse($('#extras-data').textContent);
  var counts = {}, grid = $('#extras-grid'), plate = $('#plate'), totalEl = $('#plate-total'), lineEl = $('#order-line'), said = $('#plate-said');
  var MAX_EACH = 6;
  function money(p) { return '£' + (p / 100).toFixed(2); }
  EXTRAS.forEach(function (x) {
    counts[x.id] = 0;
    var row = doc.createElement('div');
    row.className = 'extra';
    row.dataset.id = x.id;
    row.innerHTML = '<button type="button" class="pick" data-act="add" aria-label="Add ' + x.name + ' to the plate"><b>' + x.name + '</b><span>' + money(x.p) + '</span></button>' +
      '<button type="button" class="step" data-act="sub" aria-label="Take one ' + x.name + ' off">&minus;</button>' +
      '<span class="qty" aria-live="polite">0</span>' +
      '<button type="button" class="step" data-act="add" aria-label="Add one ' + x.name + '">+</button>';
    grid.appendChild(row);
  });
  function slot(i) {
    var a = i * 2.399963, r = Math.min(37, 10.5 * Math.sqrt(i));
    return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a), rot: (i * 67) % 360 };
  }
  function render(animateFrom) {
    var total = 0, words = [], i = 0;
    $$('.tok', plate).forEach(function (t) { t.remove(); });
    EXTRAS.forEach(function (x) {
      var n = counts[x.id];
      var row = $('.extra[data-id="' + x.id + '"]', grid);
      row.classList.toggle('has', n > 0);
      $('.qty', row).textContent = n;
      $('[data-act="sub"]', row).disabled = n === 0;
      $$('[data-act="add"]', row).forEach(function (b) { b.disabled = n >= MAX_EACH; });
      if (!n) return;
      total += n * x.p;
      words.push(n + '\u00a0×\u00a0' + x.name);
      for (var k = 0; k < n; k++, i++) {
        var s = slot(i), t = doc.createElement('span');
        t.className = 'tok tok-' + x.kind;
        t.style.left = s.x + '%';
        t.style.top = s.y + '%';
        t.style.setProperty('--r', s.rot + 'deg');
        if (animateFrom !== x.id || k < n - 1) t.style.animation = 'none';
        t.title = x.name;
        plate.appendChild(t);
      }
    });
    $('.plate-empty', plate).hidden = i > 0;
    totalEl.textContent = money(total);
    lineEl.textContent = words.length ? words.join(', ') : 'Nothing on the plate yet.';
    $('#plate-copy').disabled = !words.length;
    $('#plate-clear').disabled = !words.length;
    totalEl.classList.remove('bump');
    void totalEl.offsetWidth;
    totalEl.classList.add('bump');
    said.textContent = '';
  }
  function add(id) { if (counts[id] < MAX_EACH) { counts[id]++; render(id); } }
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var id = b.closest('.extra').dataset.id;
    if (b.dataset.act === 'add') add(id);
    else if (counts[id] > 0) { counts[id]--; render(); }
  });
  $('#plate-clear').addEventListener('click', function () { EXTRAS.forEach(function (x) { counts[x.id] = 0; }); render(); });
  $('#plate-copy').addEventListener('click', function () {
    var text = "Order for Tim's Cafe: " + lineEl.textContent + '. Total ' + totalEl.textContent + '.';
    function ok() { said.textContent = 'Copied. Read it out when you ring ' + $('#phone-text').textContent + '.'; }
    function manual() {
      var r = doc.createRange(); r.selectNodeContents(lineEl);
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      said.textContent = 'Your order is selected. Press copy on your keyboard.';
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, manual); else manual();
  });
  /* the + buttons next to extras on the menu drop straight onto the plate */
  $$('.leaders .add').forEach(function (b) {
    b.addEventListener('click', function () {
      add(b.dataset.id);
      $('#build').scrollIntoView();
    });
  });
  /* start with something on the plate so you can see how it works */
  counts.egg = 2; counts.bacon = 1; counts.beans = 1; counts.bubble = 1;
  render();

  /* ---------- copy the phone number ---------- */
  $$('[data-copy-phone]').forEach(function (b) {
    b.addEventListener('click', function () {
      var num = $('#phone-text').textContent, label = b.textContent;
      function done(t) { b.textContent = t; setTimeout(function () { b.textContent = label; }, 1800); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(num).then(function () { done('Copied'); }, function () { done(num); });
      else done(num);
    });
  });

  /* ---------- photo lightbox ---------- */
  var shots = $$('.shot'), lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-cap'), at = 0;
  function show(i) {
    at = (i + shots.length) % shots.length;
    var s = shots[at];
    lbImg.src = s.dataset.full;
    lbImg.alt = $('img', s).alt;
    lbCap.textContent = $('span', s).textContent;
  }
  shots.forEach(function (s, i) {
    s.addEventListener('click', function () {
      show(i);
      if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
    });
  });
  $('#lb-prev').addEventListener('click', function () { show(at - 1); });
  $('#lb-next').addEventListener('click', function () { show(at + 1); });
  $('#lb-close').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(at - 1);
    if (e.key === 'ArrowRight') show(at + 1);
  });

  $('#year').textContent = new Date().getFullYear();
})();
