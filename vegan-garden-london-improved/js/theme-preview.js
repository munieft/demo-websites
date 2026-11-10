/* PREVIEW ONLY: a small "Try a look" picker for showing the client the four looks.
   To go live with one look: set data-theme="<look>" on <html> in each page,
   remove the data-preview attribute, and delete the <script src="js/theme-preview.js"> line. */
(function () {
  var doc = document.documentElement;
  if (!doc.hasAttribute('data-preview')) return;
  var LOOKS = [
    { id: 'garden', name: 'Market garden', note: 'Cream, olive and beetroot', sw: ['#F4ECDB', '#2C4528', '#B3245B'], meta: '#F4ECDB' },
    { id: 'blush', name: 'Bunting blush', note: 'Pastel pink, beetroot and green', sw: ['#F7E3E1', '#A11F52', '#2F6B3A'], meta: '#F7E3E1' },
    { id: 'evening', name: 'Evening market', note: 'Deep green with mustard', sw: ['#1B2618', '#F1E8D4', '#E8B64A'], meta: '#1B2618' },
    { id: 'fresh', name: 'Fresh & bright', note: 'White, tomato red, bold type', sw: ['#FBFAF6', '#1F6B3A', '#E0533A'], meta: '#FBFAF6' }
  ];
  function get() { return doc.getAttribute('data-theme') || 'garden'; }

  var css = '.tp{position:fixed;left:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:150;font-family:"Instrument Sans",system-ui,sans-serif;color:#1d1d1d}' +
    '.tp-btn{display:flex;align-items:center;gap:10px;background:#fff;border:0;border-radius:99px;padding:8px 14px 8px 8px;box-shadow:0 8px 28px -8px rgba(0,0,0,.35);font-weight:600;font-size:.85rem;color:#1d1d1d;min-height:44px}' +
    '.tp-dots{display:flex}.tp-dots i{width:20px;height:20px;border-radius:50%;border:2px solid #fff;margin-left:-6px;box-shadow:0 0 0 1px rgba(0,0,0,.08)}.tp-dots i:first-child{margin-left:0}' +
    '.tp-panel{position:absolute;left:0;bottom:56px;width:min(300px,calc(100vw - 32px));background:#fff;border-radius:18px;padding:8px;box-shadow:0 20px 50px -12px rgba(0,0,0,.4);opacity:0;visibility:hidden;transform:translateY(8px) scale(.98);transform-origin:bottom left;transition:opacity .25s,transform .3s cubic-bezier(.22,.8,.2,1),visibility .25s}' +
    '.tp.open .tp-panel{opacity:1;visibility:visible;transform:none}' +
    '.tp-panel p{margin:6px 10px 8px;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:#777;font-weight:600}' +
    '.tp-opt{display:flex;align-items:center;gap:12px;width:100%;background:none;border:0;border-radius:12px;padding:10px;text-align:left;color:#1d1d1d}' +
    '.tp-opt:hover{background:#f3f3f3}.tp-opt[aria-checked="true"]{background:#efefef}' +
    '.tp-opt b{display:block;font-size:.95rem}.tp-opt small{display:block;color:#666;font-size:.8rem}' +
    '.tp-opt .tp-dots i{width:22px;height:22px}' +
    '.tp-opt .tick{margin-left:auto;opacity:0}.tp-opt[aria-checked="true"] .tick{opacity:1}' +
    '@media (max-width:820px){.tp{bottom:calc(84px + env(safe-area-inset-bottom))}.tp-btn .tp-label{display:none}.tp-btn{padding:8px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function dots(sw) { return '<span class="tp-dots">' + sw.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span>'; }
  var wrap = document.createElement('div'); wrap.className = 'tp';
  wrap.innerHTML = '<div class="tp-panel" role="radiogroup" aria-label="Choose a look"><p>Preview a look</p>' +
    LOOKS.map(function (l) { return '<button class="tp-opt" type="button" role="radio" data-id="' + l.id + '">' + dots(l.sw) + '<span><b>' + l.name + '</b><small>' + l.note + '</small></span><svg class="tick" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5 9-10"/></svg></button>'; }).join('') +
    '</div><button class="tp-btn" type="button" aria-expanded="false"></button>';
  document.body.appendChild(wrap);
  var btn = wrap.querySelector('.tp-btn');

  function paint() {
    var id = get(), look = LOOKS.filter(function (l) { return l.id === id; })[0] || LOOKS[0];
    btn.innerHTML = dots(look.sw) + '<span class="tp-label">Look: ' + look.name + '</span>';
    btn.setAttribute('aria-label', 'Change look, current: ' + look.name);
    [].forEach.call(wrap.querySelectorAll('.tp-opt'), function (o) { o.setAttribute('aria-checked', o.getAttribute('data-id') === id ? 'true' : 'false'); });
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', look.meta);
    // keep the chosen look when moving between pages (also works when opened from files)
    [].forEach.call(document.querySelectorAll('a[href$=".html"],a[href*=".html?"],a[href*=".html#"]'), function (a) {
      var h = a.getAttribute('href').replace(/\?theme=[a-z]+/, '');
      var parts = h.split('#');
      a.setAttribute('href', parts[0] + (id === 'garden' ? '' : '?theme=' + id) + (parts[1] ? '#' + parts[1] : ''));
    });
  }
  function set(id) {
    doc.classList.add('theme-fade');
    doc.setAttribute('data-theme', id);
    try { localStorage.setItem('vg-theme', id); } catch (e) {}
    try { var u = new URL(location.href); id === 'garden' ? u.searchParams.delete('theme') : u.searchParams.set('theme', id); history.replaceState(null, '', u.toString()); } catch (e) {}
    paint();
    setTimeout(function () { doc.classList.remove('theme-fade'); }, 600);
  }
  btn.addEventListener('click', function () { var o = wrap.classList.toggle('open'); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
  [].forEach.call(wrap.querySelectorAll('.tp-opt'), function (o) { o.addEventListener('click', function () { set(o.getAttribute('data-id')); }); });
  document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) { wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
  paint();
})();
