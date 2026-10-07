/* 21 SID Tarot & Coffee — site behaviour. No dependencies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '447587654796';

  /* ---------- header ---------- */
  var head = $('.site-head');
  var burger = $('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) burger.click();
    });
  }
  var fab = $('.wa-fab');
  function onScroll() {
    var y = window.scrollY;
    if (head) head.classList.toggle('is-stuck', y > 8);
    if (fab) fab.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- opening hours, in London time ---------- */
  // [open, close] in minutes from midnight; index 0 = Sunday
  var HOURS = [[600, 1020], [480, 1080], [480, 1080], [480, 1080], [480, 1080], [480, 1080], [480, 1110]];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function londonNow() {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    return { day: DAYS.indexOf(o.weekday), mins: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
  }
  function fmt(m) {
    var h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return h + (mm ? '.' + (mm < 10 ? '0' : '') + mm : '') + ap;
  }
  function status() {
    var n = londonNow(), t = HOURS[n.day], open = n.mins >= t[0] && n.mins < t[1], text, long;
    if (open) {
      text = 'Open'; long = 'until ' + fmt(t[1]);
    } else if (n.mins < t[0]) {
      text = 'Closed'; long = 'opens ' + fmt(t[0]);
    } else {
      var nx = (n.day + 1) % 7;
      text = 'Closed'; long = 'opens ' + fmt(HOURS[nx][0]) + ' ' + DAYS[nx].slice(0, 3);
    }
    $$('.status').forEach(function (el) {
      el.classList.toggle('is-open', open);
      el.classList.toggle('is-closed', !open);
      el.innerHTML = '<i></i><span>' + text + '<span class="long">, ' + long + '</span></span>';
    });
    $$('[data-today-hours]').forEach(function (el) { el.textContent = fmt(t[0]) + ' to ' + fmt(t[1]); });
    $$('.hours tr[data-day]').forEach(function (tr) { tr.classList.toggle('today', tr.dataset.day.split(',').indexOf(String(n.day)) > -1); });
  }
  status();
  setInterval(status, 60000);

  /* ---------- reveal on scroll ---------- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- marquees: duplicate the run so it loops seamlessly ---------- */
  $$('.marquee .track').forEach(function (t) {
    t.innerHTML += t.innerHTML;
    $$('span', t).slice($$('span', t).length / 2).forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });
  });

  /* ---------- the wall hands follow the cursor a little ---------- */
  var hero = $('.hero');
  if (hero && !reduce && window.matchMedia('(pointer:fine)').matches) {
    var hands = $$('.wall-hand', hero);
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
      hands.forEach(function (h, i) {
        var d = (i % 3 + 1) * 14;
        h.style.transform = 'translate(' + (-dx * d) + 'px,' + (-dy * d) + 'px)';
      });
    });
  }

  /* ---------- tilt ---------- */
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    $$('.tilt').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + x * 9 + 'deg) rotateX(' + -y * 9 + 'deg)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- drag to scroll the photo strips ---------- */
  $$('.strip, .posters').forEach(function (s) {
    var down = false, sx = 0, sl = 0, moved = 0;
    s.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = s.scrollLeft; });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      moved = Math.abs(e.clientX - sx);
      if (moved > 4) s.classList.add('dragging');
      s.scrollLeft = sl - (e.clientX - sx);
    });
    window.addEventListener('pointerup', function () { down = false; setTimeout(function () { s.classList.remove('dragging'); }, 0); });
    s.addEventListener('click', function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  });

  /* ---------- pull a card ---------- */
  // Tarot de Marseille names and numbering (IIII, VIIII, XIIII, XVIIII as on the old decks).
  var DECK = [
    ['', 'Le Mat', 'The Fool', 'Step off the kerb before the plan is finished. Today rewards the first move, not the tidy one.', 'Espresso', 'Standing at the counter, bag still on your shoulder.'],
    ['I', 'Le Bateleur', 'The Magician', 'Everything you need is already on the table. Start with what is in front of you.', 'Flat white', 'Small, exact, all the tools in one cup.'],
    ['II', 'La Papesse', 'The High Priestess', 'You know more than you are saying. Sit with it a little longer before you speak.', 'Pot of tea', 'It takes its time, and so should you.'],
    ['III', 'L’Impératrice', 'The Empress', 'Something is ready to be made. Feed it properly.', 'A slice of cake', 'Whichever one is under the glass dome. Laura baked it.'],
    ['IIII', 'L’Empereur', 'The Emperor', 'Put a structure around the idea and it will hold. Decide, then stop re-deciding.', 'Americano', 'Black, plain, no negotiations.'],
    ['V', 'Le Pape', 'The Hierophant', 'Ask someone who has done it before. Listening counts as work today.', 'Cappuccino', 'The classic, done the way it has always been done.'],
    ['VI', 'L’Amoureux', 'The Lover', 'A choice, and your heart already has an opinion. Hear it out.', 'Two cookies', 'Sea salt and chocolate. Share one, or don’t.'],
    ['VII', 'Le Chariot', 'The Chariot', 'You are already moving. Keep both hands on it and go.', 'Coffee to go', 'In a takeaway cup, heading for London Fields.'],
    ['VIII', 'La Justice', 'Justice', 'Weigh it honestly. The fair answer and the comfortable answer may differ.', 'Cortado', 'Equal parts coffee and milk. Balanced on purpose.'],
    ['VIIII', 'L’Hermite', 'The Hermit', 'Take the lamp and go and look for yourself. Company can wait an hour.', 'Golden latte', 'At the corner table, phone face down.'],
    ['X', 'La Roue de Fortune', 'The Wheel of Fortune', 'It is turning whether you push or not. Find out what today brought.', 'Pasta of the day', 'Ask at the counter. It changes, which is the point.'],
    ['XI', 'La Force', 'Strength', 'Gentle hands, firm grip. You can hold the lion’s mouth without shouting.', 'Moka', 'Coffee and chocolate, soft and strong at once.'],
    ['XII', 'Le Pendu', 'The Hanged Man', 'Stop pushing and look at it upside down. The pause is doing something.', 'Iced latte', 'Hot drink, turned on its head.'],
    ['XIII', 'L’Arcane sans nom', 'The card with no name', 'Clear the field. Something has finished, and that makes room.', 'Dirty chai', 'One thing ends where the other begins.'],
    ['XIIII', 'Tempérance', 'Temperance', 'Pour slowly from one cup to the other. Mix, don’t rush.', 'Matcha', 'Whisked calm, hot or over ice.'],
    ['XV', 'Le Diable', 'The Devil', 'Name the thing you want. It has less of a hold on you once it is said out loud.', 'A brownie', 'Dark, dense, and you were going to anyway.'],
    ['XVI', 'La Maison Dieu', 'The Tower', 'The roof comes off and the light gets in. Let the old shape go.', 'A spritz', 'It is on the board for a reason. Celebrate the rubble.'],
    ['XVII', 'L’Étoile', 'The Star', 'Give without counting for a day. You are in the right place.', 'Fresh orange juice', 'Squeezed, bright, nothing added.'],
    ['XVIII', 'La Lune', 'The Moon', 'Not everything is clear yet, and it does not have to be. Feel your way.', 'Chai latte', 'Warm spice for foggy heads.'],
    ['XVIIII', 'Le Soleil', 'The Sun', 'Stand in the open and let people see you. It is a good day to be found.', 'Banana smoothie', 'Sunshine in a cup. Peanut if you are feeling bold.'],
    ['XX', 'Le Jugement', 'Judgement', 'That is your name being called. Answer it.', 'Macchiato', 'A short, sharp wake-up.'],
    ['XXI', 'Le Monde', 'The World', 'A circle closes. Dance in the middle of it before the next one starts.', 'Whatever you like', 'Twenty-one is the house number. Order the lot.']
  ];
  var COL = ['#d3301f', '#2b5aa6', '#e9b520', '#2f8a57'];
  var BG = ['#f6e7b6', '#f8cbd9', '#dbe8ee', '#e6edc8'];

  function emblem(n) {
    // n rays for card n: numerology you can count.
    var c = COL[n % 4], c2 = COL[(n + 1) % 4], s = '<svg viewBox="-100 -100 200 200" role="img" aria-label="Emblem with ' + n + ' rays">';
    s += '<circle r="92" fill="none" stroke="#161312" stroke-width="1.5" stroke-dasharray="2 5"/>';
    for (var i = 0; i < n; i++) {
      var a = (i / n) * 360, long = i % 2 === 0 || n < 6;
      s += '<path transform="rotate(' + a + ')" d="M-' + (n > 14 ? 5 : 8) + ' -34 L0 -' + (long ? 84 : 62) + ' L' + (n > 14 ? 5 : 8) + ' -34Z" fill="' + (i % 2 ? c2 : c) + '" stroke="#161312" stroke-width="1.5" stroke-linejoin="round"/>';
    }
    s += '<circle r="32" fill="#fffdf8" stroke="#161312" stroke-width="2"/>';
    if (n === 0) {
      s += '<circle r="60" fill="none" stroke="' + c + '" stroke-width="5"/><circle cx="52" cy="-52" r="9" fill="' + c2 + '" stroke="#161312" stroke-width="1.5"/>';
    }
    s += '<path d="M-13 -5 q6 -7 12 0 M3 -5 q6 -7 12 0" fill="none" stroke="#161312" stroke-width="2" stroke-linecap="round"/><path d="M-10 9 q10 9 20 0" fill="none" stroke="#161312" stroke-width="2" stroke-linecap="round"/>';
    return s + '</svg>';
  }

  var fan = $('.fan');
  if (fan) {
    var reveal = $('.reveal'), big = $('.bigcard'), hint = $('.fan-hint');
    var order = DECK.map(function (_, i) { return i; });
    function shuffle() { for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; } }
    function lay() {
      shuffle();
      fan.classList.remove('is-picked');
      fan.innerHTML = '';
      var N = window.innerWidth < 640 ? 11 : 22, spreadDeg = window.innerWidth < 640 ? 62 : 78;
      for (var i = 0; i < N; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'card-back';
        b.style.setProperty('--a', (-spreadDeg / 2 + (spreadDeg / (N - 1)) * i) + 'deg');
        b.style.setProperty('--i', i);
        b.setAttribute('aria-label', 'Face-down card ' + (i + 1) + ' of ' + N);
        b.dataset.card = order[i];
        fan.appendChild(b);
      }
    }
    function show(idx) {
      var c = DECK[idx];
      $('.num', big).textContent = c[0] || ' ';
      $('.ttl', big).textContent = c[1];
      $('.art', big).innerHTML = emblem(idx);
      $('.art', big).style.setProperty('--cardbg', BG[idx % 4]);
      $('.r-en', reveal).textContent = c[2] + (c[0] ? ', card ' + c[0] : ', the card with no number');
      $('.r-name', reveal).textContent = c[1];
      $('.says', reveal).textContent = c[3];
      $('.r-drink', reveal).textContent = c[4];
      $('.r-why', reveal).textContent = c[5];
      reveal.hidden = false;
      big.classList.remove('flipped');
      void big.offsetWidth;
      setTimeout(function () { big.classList.add('flipped'); }, 60);
      if (hint) hint.hidden = true;
      setTimeout(function () { reveal.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); $('.reading', reveal).focus({ preventScroll: true }); }, 80);
    }
    fan.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || fan.classList.contains('is-picked')) return;
      b.classList.add('picked');
      fan.classList.add('is-picked');
      show(+b.dataset.card);
    });
    var again = $('[data-again]');
    if (again) again.addEventListener('click', function () {
      reveal.hidden = true; if (hint) hint.hidden = false; lay();
      fan.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
    lay();
  }

  /* ---------- menu filter ---------- */
  var chips = $$('.chip[data-filter]');
  if (chips.length) {
    var secs = $$('.menu-sec');
    chips.forEach(function (ch) {
      ch.addEventListener('click', function () {
        var f = ch.dataset.filter;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === ch); });
        secs.forEach(function (s) { s.classList.add('swap'); });
        setTimeout(function () {
          secs.forEach(function (s) {
            s.hidden = !(f === 'all' || s.dataset.cat === f);
            void s.offsetWidth;
            s.classList.remove('swap');
            $$('.rv', s).forEach(function (r) { r.classList.add('in'); });
          });
          var top = $('#menu-top');
          if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
        }, reduce ? 0 : 260);
      });
    });
  }

  /* ---------- what's on: dated events drop off once they have passed ---------- */
  var EVENTS = [
    {
      date: '2026-10-08T21:30:00+01:00', d: '8', m: 'Oct', day: 'Thursday',
      title: 'Tarot for Beginners',
      text: 'Introduction to numerology, the Fool’s Journey and a Q&A, with tea and biscuits. 6.30 to 9.30pm at 21 SID, hosted with The Psychedelic Society. £37, or £32 low income.',
      url: 'https://dandelion.events/e/p9yqe', cta: 'Get a ticket'
    }
  ];
  $$('[data-events]').forEach(function (ul) {
    var now = Date.now(), live = EVENTS.filter(function (e) { return new Date(e.date).getTime() > now; });
    if (!live.length) {
      ul.outerHTML = '<p class="events-empty">No dated events on sale this minute. New nights are announced on Instagram first, and the ticket links live on Linktree.</p>';
      return;
    }
    ul.innerHTML = live.map(function (e) {
      return '<li><div class="date"><span>' + e.day.slice(0, 3) + '</span><b>' + e.d + '</b><span>' + e.m + '</span></div><div><h3>' + e.title + '</h3><p>' + e.text + '</p></div><a class="btn btn--light" href="' + e.url + '" target="_blank" rel="noopener">' + e.cta + '</a></li>';
    }).join('');
  });

  /* ---------- lightbox ---------- */
  var shots = $$('[data-full]');
  if (shots.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Photo viewer');
    lb.innerHTML = '<button class="x" aria-label="Close">×</button><button class="arr prev" aria-label="Previous photo">‹</button><div><img alt=""><p></p></div><button class="arr next" aria-label="Next photo">›</button>';
    document.body.appendChild(lb);
    var cur = 0, last = null, group = shots;
    function open(i) {
      cur = (i + group.length) % group.length;
      var el = group[cur];
      $('img', lb).src = el.dataset.full;
      $('img', lb).alt = el.dataset.cap || '';
      $('p', lb).textContent = el.dataset.cap || '';
      lb.classList.add('open');
      $('.x', lb).focus();
    }
    function close() { lb.classList.remove('open'); if (last) last.focus(); }
    shots.forEach(function (el) {
      el.addEventListener('click', function () {
        last = el;
        group = $$('[data-full]', el.parentNode.closest('.gallery, .posters') || document);
        open(group.indexOf(el));
      });
    });
    $('.x', lb).addEventListener('click', close);
    $('.prev', lb).addEventListener('click', function () { open(cur - 1); });
    $('.next', lb).addEventListener('click', function () { open(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(cur - 1);
      if (e.key === 'ArrowRight') open(cur + 1);
    });
  }

  /* ---------- video pause/play ---------- */
  $$('.vid').forEach(function (v) {
    var vid = $('video', v), btn = $('.toggle', v);
    if (!vid || !btn) return;
    if (reduce) { vid.removeAttribute('autoplay'); vid.pause(); }
    function sync() { btn.textContent = vid.paused ? '▶' : '❙❙'; btn.setAttribute('aria-label', vid.paused ? 'Play video' : 'Pause video'); }
    btn.addEventListener('click', function () { if (vid.paused) vid.play(); else vid.pause(); });
    vid.addEventListener('play', sync); vid.addEventListener('pause', sync); sync();
    if ('IntersectionObserver' in window && !reduce) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) vid.play().catch(function () {}); else vid.pause(); }); }, { threshold: 0.25 }).observe(vid);
    }
  });

  /* ---------- message builder: writes the WhatsApp message for you ---------- */
  var form = $('#msg-form');
  if (form) {
    var pre = new URLSearchParams(location.search).get('about');
    if (pre) { var r0 = $('input[name=about][value="' + pre + '"]', form); if (r0) r0.checked = true; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim(), err = $('.err', form);
      if (!name) { err.textContent = 'Add your name so Laura knows who is writing.'; form.elements.name.focus(); return; }
      err.textContent = '';
      var about = form.elements.about.value, lang = form.elements.lang.value, note = form.elements.note.value.trim();
      var it = lang === 'Italiano';
      var msg = (it ? 'Ciao Laura, sono ' : 'Hi Laura, this is ') + name + '. ' +
        (it ? 'Ti scrivo per: ' : 'I’m writing about: ') + about + '. ' +
        (it ? 'Lingua: ' : 'Language: ') + lang + '.' + (note ? '\n\n' + note : '') +
        (it ? '\n\n(inviato dal sito 21 SID)' : '\n\n(sent from the 21 SID website)');
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  /* current year */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
