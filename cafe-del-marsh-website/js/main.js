/* Café del Marsh — vanilla JS, no dependencies */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---------- Nav ---------- */
  var nav = $('#nav'), burger = $('#burger'), links = $('#navLinks');
  function closeNav() { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); }
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('a', links).forEach(function (a) { a.addEventListener('click', closeNav); });

  /* ---------- Scroll: sticky nav + parallax ---------- */
  var par = $$('[data-parallax]'), ticking = false, pending = $$('.reveal');
  function onScroll() {
    ticking = false;
    nav.classList.toggle('stuck', window.scrollY > 30);
    var vh = window.innerHeight;
    for (var i = pending.length - 1; i >= 0; i--) { if (pending[i].getBoundingClientRect().top < vh * 0.94) { pending[i].classList.add('in'); pending.splice(i, 1); } }
    if (reduce) return;
    par.forEach(function (el) {
      var r = el.parentNode.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = 'translate3d(0,' + (p * -46).toFixed(1) + 'px,0)';
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      var n = 0;
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.setProperty('--r', n++);
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
    /* safety net: never leave content hidden */
    window.addEventListener('load', function () { setTimeout(function () {
      reveals.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in'); });
    }, 600); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Active nav link ---------- */
  if ('IntersectionObserver' in window) {
    var map = {};
    $$('a', links).forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(map).forEach(function (k) { map[k].classList.toggle('here', k === e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = doc.getElementById(id); if (s) so.observe(s); });
  }

  /* ---------- Festoon lights + bunting ---------- */
  var BULBS = ['#ffc56b', '#ffc56b', '#fff1cf', '#ffc56b', '#ff6a5a', '#ffc56b', '#fff1cf'];
  var FLAGS = ['#e8443a', '#f3a12b', '#2f9d6a', '#3b78c4', '#a04bb5', '#f2d23c', '#ef4fc4'];
  function buildSwag(el) {
    var kind = el.getAttribute('data-swag');
    var w = el.clientWidth; if (!w) return;
    var span = kind === 'lights' ? 300 : 340;
    var n = Math.max(2, Math.round(w / span)), sw = w / n;
    var sag = kind === 'lights' ? Math.min(34, sw * 0.13) : Math.min(30, sw * 0.11);
    var per = kind === 'lights' ? Math.max(4, Math.round(sw / 46)) : Math.max(5, Math.round(sw / 40));
    var d = 'M0,2', html = '', k = 0;
    for (var i = 0; i < n; i++) {
      d += ' Q' + ((i + 0.5) * sw).toFixed(1) + ',' + (2 + 2 * sag).toFixed(1) + ' ' + ((i + 1) * sw).toFixed(1) + ',2';
      for (var j = 0; j < per; j++) {
        var t = (j + 0.5) / per;
        var x = (i + t) * sw, y = 2 + 4 * sag * t * (1 - t);
        var dur = (2.6 + ((k * 37) % 23) / 10).toFixed(1), off = (-((k * 53) % 40) / 10).toFixed(1);
        if (kind === 'lights') {
          html += '<span class="bulb" style="left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px;--c:' + BULBS[k % BULBS.length] + ';--d:' + dur + 's;--o:' + off + 's"></span>';
        } else {
          var ang = Math.atan(4 * sag * (1 - 2 * t) / sw) * 180 / Math.PI;
          html += '<span class="flag" style="left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px;--c:' + FLAGS[k % FLAGS.length] + ';--a:' + ang.toFixed(1) + 'deg;--d:' + dur + 's;--o:' + off + 's"></span>';
        }
        k++;
      }
    }
    el.innerHTML = '<svg width="' + w + '" height="' + Math.ceil(sag * 2 + 6) + '"><path d="' + d + '"/></svg>' + html;
  }
  var swags = $$('[data-swag]'), rt, lastW = 0;
  function buildAll() { if (window.innerWidth === lastW) return; lastW = window.innerWidth; swags.forEach(buildSwag); }
  buildAll();
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(buildAll, 150); });

  /* ---------- Hero: drifting warm bokeh ---------- */
  (function () {
    var c = $('#glow'); if (!c || reduce || !c.getContext) return;
    var ctx = c.getContext('2d'), W, H, dpr, pts = [], on = true, raf;
    var cols = ['255,197,107', '255,236,200', '239,79,196', '255,150,90'];
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = c.clientWidth; H = c.clientHeight;
      c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(46, W / 28));
      pts = [];
      for (var i = 0; i < count; i++) pts.push(make(true));
    }
    function make(any) {
      return { x: Math.random() * W, y: any ? Math.random() * H : H + 40, r: 6 + Math.random() * 30,
        vy: 0.08 + Math.random() * 0.3, vx: (Math.random() - 0.5) * 0.18, a: 0.05 + Math.random() * 0.16,
        ph: Math.random() * 6.28, c: cols[Math.random() < 0.12 ? 2 : (Math.random() * cols.length) | 0] };
    }
    function draw(t) {
      if (!on) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.y -= p.vy; p.x += p.vx + Math.sin(t / 2400 + p.ph) * 0.12;
        if (p.y < -50) pts[i] = p = make(false);
        var a = p.a * (0.7 + 0.3 * Math.sin(t / 900 + p.ph));
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, 'rgba(' + p.c + ',' + a.toFixed(3) + ')');
        g.addColorStop(0.6, 'rgba(' + p.c + ',' + (a * 0.55).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(' + p.c + ',0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    size(); raf = requestAnimationFrame(draw);
    window.addEventListener('resize', function () { clearTimeout(c._t); c._t = setTimeout(size, 200); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
      var vis = es[0].isIntersecting;
      if (vis && !on) { on = true; raf = requestAnimationFrame(draw); } else if (!vis) { on = false; cancelAnimationFrame(raf); }
    }).observe(c);
  })();

  /* ---------- Hero photo tilt ---------- */
  (function () {
    var box = $('[data-tilt]'); if (!box || reduce || !matchMedia('(hover:hover)').matches) return;
    var fr = $('.frame', box);
    box.addEventListener('pointermove', function (e) {
      var r = box.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      fr.style.transform = 'rotate(2.4deg) rotateY(' + (x * 12).toFixed(1) + 'deg) rotateX(' + (-y * 10).toFixed(1) + 'deg)';
    });
    box.addEventListener('pointerleave', function () { fr.style.transform = ''; });
  })();

  /* ---------- Menu tabs ---------- */
  var tabs = $$('.tab'), panels = $$('.panel');
  panels.forEach(function (p) { $$('.items li', p).forEach(function (li, i) { li.style.setProperty('--i', i); }); });
  function pick(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-on', on); t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p) { p.classList.toggle('is-on', p.id === tab.getAttribute('aria-controls')); });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.tabIndex = t.classList.contains('is-on') ? 0 : -1;
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') pick(tabs[(i + 1) % tabs.length], true);
      if (e.key === 'ArrowLeft') pick(tabs[(i - 1 + tabs.length) % tabs.length], true);
    });
  });

  /* ---------- Opening hours, live in London time ---------- */
  var HOURS = { 0: [14, 21], 1: [14, 23], 2: [14, 23], 3: [14, 23], 4: [14, 23], 5: [14, 23], 6: [14, 23] };
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function fmt(h) { return (h > 12 ? h - 12 : h) + (h >= 12 ? 'pm' : 'am'); }
  function london() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      return { day: DAYS.indexOf(o.weekday), h: (+o.hour % 24) + (+o.minute) / 60 };
    } catch (e) { var d = new Date(); return { day: d.getDay(), h: d.getHours() + d.getMinutes() / 60 }; }
  }
  function status() {
    var n = london(), today = HOURS[n.day], open = n.h >= today[0] && n.h < today[1], text;
    if (open) {
      var left = today[1] - n.h;
      text = left <= 1 ? 'Open now · last hour, closes ' + fmt(today[1]) : 'Open now · until ' + fmt(today[1]);
    } else if (n.h < today[0]) {
      text = 'Closed · opens today at ' + fmt(today[0]);
    } else {
      text = 'Closed · opens tomorrow at ' + fmt(HOURS[(n.day + 1) % 7][0]);
    }
    $$('[data-status]').forEach(function (el) {
      el.classList.toggle('open', open); el.classList.toggle('shut', !open);
      $('[data-status-text]', el).textContent = text;
    });
    $$('tr[data-day]').forEach(function (tr) { tr.classList.toggle('today', +tr.getAttribute('data-day') === n.day); });
  }
  status(); setInterval(status, 60000);

  /* ---------- Count-up ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; co.unobserve(e.target);
        var el = e.target, end = parseFloat(el.getAttribute('data-count')), dec = +(el.getAttribute('data-dec') || 0), t0;
        (function step(t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / 1400), v = end * (1 - Math.pow(1 - p, 3));
          el.textContent = v.toFixed(dec);
          if (p < 1) requestAnimationFrame(step); else el.textContent = end.toFixed(dec);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(function (el) { co.observe(el); });
  }

  /* ---------- Gallery lightbox ---------- */
  var shots = $$('.shot'), lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), cur = 0, lastFocus;
  function show(i) {
    cur = (i + shots.length) % shots.length;
    var img = $('img', shots[cur]);
    lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
    lbImg.src = img.getAttribute('src'); lbImg.alt = img.alt;
    lbCap.textContent = shots[cur].getAttribute('data-cap');
  }
  function openLb(i) { lastFocus = doc.activeElement; show(i); lb.hidden = false; doc.body.style.overflow = 'hidden'; $('#lbClose').focus(); }
  function closeLb() { lb.hidden = true; doc.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  shots.forEach(function (s, i) { s.addEventListener('click', function () { openLb(i); }); });
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', function () { show(cur - 1); });
  $('#lbNext').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  doc.addEventListener('keydown', function (e) {
    if (lb.hidden) { if (e.key === 'Escape') closeNav(); return; }
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  });

  /* ---------- Copy phone number ---------- */
  var toast = $('#toast'), tt;
  function say(msg) { toast.textContent = msg; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 2600); }
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy');
      var fail = function () { say('Our number is ' + v); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(function () { say('Number copied: ' + v); }, fail);
      else fail();
    });
  });
})();
