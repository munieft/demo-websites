/* Shop Brazil — site engine: layout, language, cart, checkout, motion */
(function(){
"use strict";
const WA = "447535009098";
const PHONE_DISPLAY = "07535 009098";
const MAPS = "https://www.google.com/maps/place/Shop+Brazil/@51.4612023,-0.0062772,17z/data=!4m6!3m5!1s0x4876033944a9c17d:0xc6ca61973fa9d4bf!8m2!3d51.4612023!4d-0.0062772!16s%2Fg%2F11j8mc31md?hl=en";
const DIRECTIONS = "https://www.google.com/maps/dir/?api=1&destination=51.4612023,-0.0062772";
const IG = "https://instagram.com/shopbrazil.uk";
const LINKTREE = "https://linktr.ee/shopbrazil";
const page = document.body.dataset.page || "home";
const IMG = "assets/img/";

/* ---------- storage (safe) ---------- */
const mem = {};
const store = {
  get(k){try{const v=localStorage.getItem(k);return v===null?mem[k]:v}catch(e){return mem[k]}},
  set(k,v){mem[k]=v;try{localStorage.setItem(k,v)}catch(e){}}
};

/* ---------- icons ---------- */
const I = {
  cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20.5" r="1.3"/><circle cx="17" cy="20.5" r="1.3"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.86 9.86 0 0 0 12.04 2zm0 18.15h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg>',
  ig:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  scooter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h6l2-6h-4M14 5h3l1 6M3 12h6l2 5"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="40"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
};
/* category illustrations for label tiles */
const CI = {
  carnes:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M14 22c6-12 26-14 36-4 8 8 4 22-8 26-8 3-12 10-20 8-10-2-14-18-8-30z"/><path d="M42 24c3 3 3 8-1 10" stroke-linecap="round"/><circle cx="25" cy="34" r="4"/></svg>',
  linguicas:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 40c4 8 16 10 26 6s16-14 14-24"/><path d="M18 34c4 5 12 6 19 3s11-9 10-16"/><path d="M8 42l4-2M52 22l2-5"/><path d="M26 38l2 4M36 33l3 3"/></svg>',
  churrasco:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 6c4 8 12 12 12 22a12 12 0 0 1-24 0c0-6 4-8 4-14 4 4 4 8 8 8 0-6-2-10 0-16z"/><path d="M12 46h40M18 46l-4 12M46 46l4 12M32 46v12"/></svg>',
  congelados:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M32 6v52M9.5 19l45 26M9.5 45l45-26"/><path d="M26 10l6 6 6-6M26 54l6-6 6 6M10 27l8-2-2-8M54 37l-8 2 2 8M10 37l8 2-2 8M54 27l-8-2 2-8"/></svg>',
  laticinios:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M8 40l30-22 18 10v14L26 54 8 48z"/><path d="M8 40l18 6 30-18M26 46v8"/><circle cx="36" cy="38" r="3"/><circle cx="20" cy="40" r="2"/><circle cx="46" cy="33" r="2"/></svg>',
  mercearia:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><rect x="16" y="20" width="32" height="36" rx="6"/><path d="M20 12h24v8H20z"/><path d="M16 32h32M16 46h32"/></svg>',
  lanches:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><circle cx="32" cy="32" r="22"/><circle cx="24" cy="26" r="2.5" fill="currentColor"/><circle cx="38" cy="22" r="2.5" fill="currentColor"/><circle cx="40" cy="38" r="2.5" fill="currentColor"/><circle cx="26" cy="40" r="2.5" fill="currentColor"/><circle cx="32" cy="32" r="1.5" fill="currentColor"/></svg>',
  doces:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><circle cx="32" cy="32" r="13"/><path d="M19 32L6 22v20zM45 32l13-10v20z"/><path d="M26 26c4 4 8 8 12 12" stroke-linecap="round"/></svg>',
  bebidas:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M20 12h24l-2 6v34a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V18z"/><path d="M22 26h20M22 44h20"/><path d="M28 6h8" stroke-linecap="round"/></svg>',
  casa:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M24 8h16v8l4 6v30a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V22l4-6z"/><path d="M32 30c6 4 6 12 0 14-6-2-6-10 0-14z"/></svg>'
};

/* product-specific illustrations */
const PI = {
  cafe:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 26h34v12a14 14 0 0 1-14 14h-6a14 14 0 0 1-14-14z"/><path d="M46 30h4a6 6 0 0 1 0 12h-5"/><path d="M22 8c-3 4 3 6 0 10M32 8c-3 4 3 6 0 10"/><path d="M8 58h44"/></svg>',
  choc:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><rect x="14" y="8" width="36" height="48" rx="4"/><path d="M14 20h36M14 32h36M14 44h36M32 8v48"/><path d="M40 8l10 10" stroke-linecap="round"/></svg>',
  sauce:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M26 6h12v8l4 6v34a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V20l4-6z"/><path d="M22 30h20v14H22z"/><path d="M30 34c3 2 3 6 0 7" stroke-linecap="round"/></svg>',
  pasta:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M32 8l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z"/><path d="M14 46l4 4M46 46l-4 4M22 54h20" stroke-linecap="round"/></svg>',
  acai:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M8 30h48a24 24 0 0 1-48 0z"/><circle cx="22" cy="22" r="5"/><circle cx="34" cy="18" r="5"/><circle cx="44" cy="24" r="4"/><path d="M20 40c4 3 20 3 24 0" stroke-linecap="round"/></svg>',
  chicken:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M38 10c10 0 16 8 14 18-2 8-10 12-18 10l-8 8"/><path d="M38 10c-8 0-14 6-14 14 0 4 2 8 4 10"/><path d="M26 46l-6 2-6-4 4-6 2-6 6 2"/></svg>',
  pig:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><ellipse cx="32" cy="36" rx="20" ry="16"/><path d="M16 26l-4-12 12 6M48 26l4-12-12 6"/><ellipse cx="32" cy="40" rx="7" ry="5"/><circle cx="29.5" cy="40" r="1" fill="currentColor"/><circle cx="34.5" cy="40" r="1" fill="currentColor"/><circle cx="24" cy="30" r="1.6" fill="currentColor"/><circle cx="40" cy="30" r="1.6" fill="currentColor"/></svg>',
  can:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M18 12h28v42a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z"/><path d="M20 6h24l2 6H18z"/><path d="M18 24h28M18 44h28"/><path d="M26 32c4-3 8 3 12 0" stroke-linecap="round"/></svg>',
  spirit:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M27 4h10v12c6 3 8 8 8 14v24a4 4 0 0 1-4 4H23a4 4 0 0 1-4-4V30c0-6 2-11 8-14z"/><path d="M19 34h26v14H19z"/></svg>',
  candy:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><circle cx="32" cy="32" r="13"/><path d="M19 32L6 22v20zM45 32l13-10v20z"/><path d="M26 26c4 4 8 8 12 12" stroke-linecap="round"/></svg>',
  gift:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><rect x="10" y="24" width="44" height="32" rx="3"/><path d="M8 18h48v8H8zM32 18v38"/><path d="M32 18c-4-10-16-10-14-2 1 3 8 3 14 2zM32 18c4-10 16-10 14-2-1 3-8 3-14 2z"/></svg>',
  cake:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M10 34h44v20H10z"/><path d="M10 34c0-10 10-16 22-16s22 6 22 16"/><path d="M10 42c6 4 10-4 16 0s10 4 16 0 8-4 12 0"/><path d="M32 18V8" stroke-linecap="round"/><path d="M32 4c2 2 2 4 0 4s-2-2 0-4z" fill="currentColor"/></svg>',
  cookie:CI.lanches,
  cracker:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><rect x="12" y="12" width="40" height="40" rx="5"/><g fill="currentColor"><circle cx="22" cy="22" r="2"/><circle cx="32" cy="22" r="2"/><circle cx="42" cy="22" r="2"/><circle cx="22" cy="32" r="2"/><circle cx="32" cy="32" r="2"/><circle cx="42" cy="32" r="2"/><circle cx="22" cy="42" r="2"/><circle cx="32" cy="42" r="2"/><circle cx="42" cy="42" r="2"/></g></svg>',
  chips:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M16 8h32l-3 6 3 6v28l-3 6 3 2H16l3-2-3-6V20l3-6z"/><path d="M24 30c4-6 12-6 16 0-4 6-12 6-16 0z"/></svg>',
  jar:CI.mercearia,
  shaker:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M20 22h24v30a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6z"/><path d="M22 22c0-8 4-14 10-14s10 6 10 14"/><g fill="currentColor"><circle cx="28" cy="14" r="1.4"/><circle cx="32" cy="12" r="1.4"/><circle cx="36" cy="14" r="1.4"/></g><path d="M20 34h24"/></svg>',
  flour:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M18 14c4-4 24-4 28 0l4 40a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z"/><path d="M18 14l6 6h16l6-6"/><path d="M32 30v16M26 36c2 4 4 6 6 6s4-2 6-6" stroke-linecap="round"/></svg>',
  cheese:CI.laticinios, snow:CI.congelados, flame:CI.churrasco, lotion:CI.casa, sausage:CI.linguicas, steak:CI.carnes,
  bread:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><circle cx="22" cy="36" r="12"/><circle cx="42" cy="36" r="12"/><circle cx="32" cy="22" r="12"/><path d="M26 18l3 3M36 30l3 3M18 34l3 3" stroke-linecap="round"/></svg>'
};
const RULES=[[/caf[eé]|matte/i,"cafe"],[/bis |bis$|lacta|bombons|nestl/i,"choc"],[/brigadeiro|doce de leite|goiabada|mamão|marrom|paçoca/i,"jar"],[/p[aã]o de mel|bolach[aã]o de mel|panettone|churros/i,"cake"],
  [/bala|rapadura|amendoim/i,"candy"],[/nescau|toddy/i,"jar"],[/molho|ketchup/i,"sauce"],[/macarr|massa/i,"pasta"],[/a[cç]a[ií]/i,"acai"],[/frango|coxinha da asa/i,"chicken"],
  [/porco|pernil|bacon|copa/i,"pig"],[/cacha[cç]a/i,"spirit"],[/lata|sukita|guaran/i,"can"],[/suco/i,"spirit"],[/cream cracker|água e sal|maria/i,"cracker"],[/ruffles|cheetos|batata palha/i,"chips"],
  [/polvilho doce|farofa|creme de cebola|caldinho/i,"flour"],[/sal |sal$|aji|tempero|sazón|açafrão|colorau|ricanela/i,"shaker"],[/queijo|requeij|bolinha/i,"cheese"],[/biscoito de queijo|pão de queijo/i,"bread"]];
function iconFor(p){for(const [re,k] of RULES){if(re.test(p.pt))return PI[k]}return CI[p.cat]}
const FLAGS = {
  br:'<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#009C3B"/><path d="M20 6l16 14-16 14L4 20z" fill="#FFDF00"/><circle cx="20" cy="20" r="7.5" fill="#002776"/><path d="M12.8 18.6q7.2-2.4 14.4 2.4" stroke="#fff" stroke-width="1.6" fill="none"/></svg>',
  co:'<svg viewBox="0 0 40 40"><rect width="40" height="20" fill="#FCD116"/><rect y="20" width="40" height="10" fill="#003893"/><rect y="30" width="40" height="10" fill="#CE1126"/></svg>',
  uk:'<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#012169"/><path d="M0 0l40 40M40 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0l40 40M40 0L0 40" stroke="#C8102E" stroke-width="3"/><path d="M20 0v40M0 20h40" stroke="#fff" stroke-width="12"/><path d="M20 0v40M0 20h40" stroke="#C8102E" stroke-width="7"/></svg>'
};
window.SB_ICONS = I; window.SB_FLAGS = FLAGS;

const T = (en,pt)=>`<span data-en>${en}</span><span data-pt>${pt}</span>`;
window.SB_T = T;
const lang = ()=>document.documentElement.lang==="pt"?"pt":"en";
const money = v => "£"+v.toFixed(2);

/* ---------- garland (bandeirinhas) ---------- */
function garlandSVG(){
  const cols=["#FFC72C","#00843D","#C8381E","#1C4FB0","#FBF4E6","#E2552F","#0FA457","#B03A6B"];
  let s='<svg viewBox="0 0 2400 34" preserveAspectRatio="none" aria-hidden="true"><path d="M0 4 Q 30 12 60 4 T 120 4" fill="none"/>';
  s+='<path d="M0 5 '+Array.from({length:80},(_,i)=>`Q ${i*30+15} 11 ${i*30+30} 5`).join(" ")+'" stroke="rgba(251,244,230,.45)" stroke-width="1" fill="none"/>';
  for(let i=0;i<80;i++){const x=i*30+7,c=cols[i%cols.length];
    s+=`<g class="flag" style="animation-delay:${(i%7)*-.45}s;transform-box:fill-box"><path d="M${x} 7 h16 v16 l-8 -5 l-8 5z" fill="${c}" opacity=".95"/></g>`;}
  return s+'</svg>';
}

/* ---------- layout injection ---------- */
const NAV = [
  ["index.html","home","Home","Início"],
  ["shop.html","shop","Shop","Mercado"],
  ["butchery.html","butchery","Butchery","Açougue"],
  ["culture.html","culture","Our Brazil","Nosso Brasil"],
  ["visit.html","visit","Visit & Delivery","Visite & Delivery"]
];
const onHero = document.body.hasAttribute("data-hero");
const navLinks = NAV.map(([h,k,en,pt])=>`<a href="${h}" class="${k===page?"active":""}">${T(en,pt)}</a>`).join("");
const headerHTML = `
<div class="garland" aria-hidden="true">${garlandSVG()}<div class="tick">${T("🇧🇷 Same-day express delivery across London","🇧🇷 Delivery express — você recebe no mesmo dia")}</div></div>
<header class="site-header ${onHero?"on-hero":""}" id="hdr">
  <div class="container bar">
    <a class="brand" href="index.html" aria-label="Shop Brazil home">
      <img src="${IMG}emblem.svg" alt="" width="52" height="52">
      <span class="brand-word"><b><span class="s">Shop</span><span class="z">Brazil</span></b><small><i>★★★★★</i>South American Convenience Store</small></span>
    </a>
    <nav class="nav" aria-label="Main">${navLinks}</nav>
    <div class="tools">
      <div class="lang" role="group" aria-label="Language">
        <button data-l="en"><span class="fl">${FLAGS.uk}</span>EN</button>
        <button data-l="pt"><span class="fl">${FLAGS.br}</span>PT</button>
      </div>
      <button class="cart-btn" id="cartBtn" aria-label="Open cart">${I.cart}<span class="count" id="cartCount">0</span></button>
      <button class="burger" id="burger" aria-label="Menu"><span></span></button>
    </div>
  </div>
</header>
<div class="mnav" id="mnav" aria-hidden="true">
  <button class="close" id="mclose" aria-label="Close menu">×</button>
  <nav>${navLinks}</nav>
  <div class="mfoot">
    <a class="btn wa" href="https://wa.me/${WA}" target="_blank" rel="noopener">${I.wa}${T("Order on WhatsApp","Peça no WhatsApp")}</a>
    <span>86 Lee High Rd, Lewisham, London SE13 5PT</span>
  </div>
</div>`;

const footerHTML = `
<footer class="site-footer">
  <div class="container">
    <div class="fgrid">
      <div>
        <a class="brand" href="index.html" style="color:var(--creme)"><img src="${IMG}emblem.svg" alt="" width="52" height="52"><span class="brand-word"><b><span class="s" style="color:#3BD27F">Shop</span><span class="z" style="color:var(--ouro)">Brazil</span></b><small><i>★★★★★</i>South American Convenience Store</small></span></a>
        <p class="mt-s">${T("Brazilian butcher and grocery in the heart of Lewisham. Top-quality cuts, the flavours of home and same-day delivery.","Açougue e mercado brasileiro no coração de Lewisham. Carnes de altíssima qualidade, o sabor de casa e delivery no mesmo dia.")}</p>
        <div class="flags"><span title="Brasil">${FLAGS.br}</span><span title="Colombia">${FLAGS.co}</span><span title="United Kingdom">${FLAGS.uk}</span></div>
      </div>
      <div><h5>${T("Explore","Explore")}</h5><ul>${NAV.map(([h,k,en,pt])=>`<li><a href="${h}">${T(en,pt)}</a></li>`).join("")}</ul></div>
      <div><h5>${T("Shop by aisle","Corredores")}</h5><ul>
        <li><a href="shop.html#carnes">${T("Butcher's meats","Carnes")}</a></li>
        <li><a href="shop.html#linguicas">${T("Sausages","Linguiças")}</a></li>
        <li><a href="shop.html#congelados">${T("Frozen & açaí","Congelados & açaí")}</a></li>
        <li><a href="shop.html#doces">${T("Sweets","Doces")}</a></li>
        <li><a href="shop.html#bebidas">${T("Drinks","Bebidas")}</a></li></ul></div>
      <div><h5>${T("Find us","Onde estamos")}</h5>
        <p>86 Lee High Rd<br>Lewisham, London SE13 5PT</p>
        <p class="mt-s"><a href="https://wa.me/${WA}" target="_blank" rel="noopener">WhatsApp · ${PHONE_DISPLAY}</a></p>
        <div class="socials">
          <a href="${IG}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
          <a href="https://wa.me/${WA}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa}</a>
          <a href="${MAPS}" target="_blank" rel="noopener" aria-label="Google Maps">${I.pin}</a>
          <a href="${LINKTREE}" target="_blank" rel="noopener" aria-label="Linktree">${I.link}</a>
        </div>
      </div>
    </div>
    <div class="big" aria-hidden="true">Shop Brazil</div>
    <div class="fbottom"><span>© ${new Date().getFullYear()} Shop Brazil · Lewisham, London</span><span>${T("Feito com saudade 💚💛 in South-East London","Feito com saudade 💚💛 no sudeste de Londres")}</span></div>
  </div>
</footer>
<a class="fab" href="https://wa.me/${WA}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa}</a>
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" aria-label="Cart">
  <header><h3>${T("Your basket","Sua cesta")}</h3><button id="dclose" aria-label="Close">×</button></header>
  <div class="items" id="citems"></div>
  <footer id="cfoot">
    <div class="tot"><span>${T("Subtotal","Subtotal")}</span><b id="ctotal">£0.00</b></div>
    <p class="note" id="cnote"></p>
    <button class="btn block" id="checkoutBtn">${I.wa}${T("Checkout via WhatsApp","Finalizar pelo WhatsApp")}</button>
    <a class="btn ghost block sm" href="shop.html">${T("Keep shopping","Continuar comprando")}</a>
  </footer>
</aside>
<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="mtitle">
  <div class="box">
    <div class="mh"><button id="mx" aria-label="Close">×</button><h3 id="mtitle" style="position:relative;z-index:1">${T("Almost there!","Quase lá!")}</h3><p style="position:relative;z-index:1;opacity:.85">${T("Tell us where to send your order — we confirm on WhatsApp.","Diga onde entregar — confirmamos tudo pelo WhatsApp.")}</p></div>
    <form id="cform" novalidate>
      <div class="seg">
        <label><input type="radio" name="mode" value="delivery" checked> ${I.scooter.replace('<svg','<svg width="22"')} ${T("Same-day delivery","Delivery no mesmo dia")}</label>
        <label><input type="radio" name="mode" value="collect"> ${I.pin.replace('<svg','<svg width="22"')} ${T("Collect in store","Retirar na loja")}</label>
      </div>
      <div class="row2">
        <div class="field"><label for="fn">${T("Name","Nome")}</label><input id="fn" name="name" autocomplete="name" required></div>
        <div class="field"><label for="fp">${T("Phone","Telefone")}</label><input id="fp" name="phone" type="tel" autocomplete="tel" required></div>
      </div>
      <div class="field addr-f"><label for="fa">${T("Delivery address","Endereço de entrega")}</label><input id="fa" name="address" autocomplete="street-address"></div>
      <div class="row2 addr-f">
        <div class="field"><label for="fpc">${T("Postcode","CEP / Postcode")}</label><input id="fpc" name="postcode" autocomplete="postal-code"></div>
        <div class="field"><label for="ft">${T("Preferred time","Horário preferido")}</label>
          <select id="ft" name="time"></select></div>
      </div>
      <div class="field"><label for="fno">${T("Notes for the butcher (cut thickness, seasoning…)","Observações para o açougueiro (espessura, tempero…)")}</label><textarea id="fno" name="notes" rows="2"></textarea></div>
      <div class="summary" id="csum"></div>
      <p class="err" id="cerr" hidden></p>
      <button class="btn wa block" type="submit">${I.wa}${T("Prepare WhatsApp order","Preparar pedido no WhatsApp")}</button>
    </form>
    <div class="done" id="cdone" hidden>
      <div class="tick">${I.check}</div>
      <h3>${T("Your order is ready to send","Seu pedido está pronto para enviar")}</h3>
      <p style="color:var(--cinza)">${T("Tap below to open WhatsApp with your order filled in, then press send. The team will confirm prices for weighed cuts, the delivery fee and your slot.","Toque abaixo para abrir o WhatsApp com o pedido preenchido e envie. A equipe confirma o peso das carnes, a taxa de entrega e o horário.")}</p>
      <a class="btn wa" id="waLink" href="#" target="_blank" rel="noopener">${I.wa}${T("Open WhatsApp","Abrir WhatsApp")}</a>
      <button class="btn ghost sm" id="copyOrder" type="button">${T("Copy order text","Copiar pedido")}</button>
      <pre id="orderText"></pre>
    </div>
  </div>
</div>
<div class="toast" id="toast"><i>✓</i><span id="toastTxt"></span></div>
<div class="lightbox" id="lightbox"><button aria-label="Close">×</button><img alt=""></div>`;

document.body.insertAdjacentHTML("afterbegin", headerHTML);
document.body.insertAdjacentHTML("beforeend", footerHTML);

/* ---------- language ---------- */
function setLang(l){
  document.documentElement.lang=l; store.set("sb-lang",l);
  document.querySelectorAll(".lang button").forEach(b=>b.classList.toggle("on",b.dataset.l===l));
  document.querySelectorAll("[data-ph-en]").forEach(el=>el.placeholder=el.dataset["ph"+(l==="pt"?"Pt":"En")]);
  document.title = document.body.dataset["title"+(l==="pt"?"Pt":"En")] || document.title;
  fillTimes(); renderCart();
  document.dispatchEvent(new CustomEvent("sb:lang",{detail:l}));
}
document.querySelectorAll(".lang button").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.l)));

/* ---------- header / menu ---------- */
const hdr=document.getElementById("hdr");
const onScroll=()=>hdr.classList.toggle("scrolled",scrollY>40);
addEventListener("scroll",onScroll,{passive:true}); onScroll();
const mnav=document.getElementById("mnav");
document.getElementById("burger").onclick=()=>{mnav.classList.add("open");mnav.setAttribute("aria-hidden","false")};
document.getElementById("mclose").onclick=()=>{mnav.classList.remove("open");mnav.setAttribute("aria-hidden","true")};

/* ---------- product card ---------- */
function media(p,small){
  const c=SB_CATS[p.cat];
  if(p.img) return `<img src="${IMG}${p.img}.webp" alt="${p.pt}" loading="lazy">`;
  const short=p.pt.split(/ [–-] /)[0];
  const v=((p.id*37)%5-2)*9, ang=150+((p.id*53)%5)*14;
  return `<div class="label" style="--bg:radial-gradient(120% 90% at ${20+(p.id*29)%60}% 0%,${shade(c.color,v+26)},transparent 60%),linear-gradient(${ang}deg,${shade(c.color,v)},${shade(c.color,v-34)});--fg:${c.fg}">
    <span class="mk">Shop Brazil</span><span class="disc">${iconFor(p)}</span>${small?"":`<span class="nm">${short}</span>`}</div>`;
}
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=(n>>16)+amt,g=((n>>8)&255)+amt,b=(n&255)+amt;
  const cl=v=>Math.max(0,Math.min(255,v));return "#"+((1<<24)+(cl(r)<<16)+(cl(g)<<8)+cl(b)).toString(16).slice(1)}
function priceHTML(p){
  if(p.price==null) return `<span class="price ask">${T("Price in store","Consulte o preço")}</span>`;
  return `<span class="price">${money(p.price)}${p.unit?`<small>/kg</small>`:""}</span>`;
}
const optEN={"Temperado":"Seasoned","Temperada":"Seasoned","Sem tempero":"Plain"};
window.SB_card = function(p){
  const c=SB_CATS[p.cat];
  return `<article class="pcard" data-id="${p.id}" data-cat="${p.cat}">
    <div class="media">${media(p)}<span class="badge">${T(c.en,c.pt)}</span></div>
    <div class="body">
      <h4>${p.pt}</h4>
      <span class="en">${T(p.en,c.pt)}</span>
      ${p.pack?`<span class="pack">${p.pack}</span>`:""}
      ${p.opts?`<div class="opt">${p.opts.map((o,i)=>`<button type="button" data-o="${o}" class="${i?"":"on"}">${T(optEN[o]||o,o)}</button>`).join("")}</div>`:""}
      <div class="foot">${priceHTML(p)}<button class="add" aria-label="Add ${p.pt} to basket">${I.plus}</button></div>
    </div></article>`;
};
document.addEventListener("click",e=>{
  const ob=e.target.closest(".opt button");
  if(ob){ob.parentElement.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b===ob));return}
  const ad=e.target.closest(".pcard .add");
  if(ad){const card=ad.closest(".pcard");const id=+card.dataset.id;
    const opt=card.querySelector(".opt .on");addToCart(id,opt?opt.dataset.o:"",ad);}
});

/* ---------- cart ---------- */
let cart=[];
try{cart=JSON.parse(store.get("sb-cart")||"[]")||[]}catch(e){cart=[]}
const P=id=>SB_PRODUCTS.find(p=>p.id===id);
cart=cart.filter(i=>P(i.id));
const save=()=>store.set("sb-cart",JSON.stringify(cart));
function addToCart(id,opt,btn){
  const key=id+"|"+(opt||"");let it=cart.find(i=>i.key===key);
  if(it) it.q++; else cart.push({key,id,opt:opt||"",q:1});
  save();renderCart();fly(btn);
  if(btn){btn.classList.add("done");btn.innerHTML=I.check.replace('width="40"','width="20"');setTimeout(()=>{btn.classList.remove("done");btn.innerHTML=I.plus},1100)}
  const p=P(id);toast(lang()==="pt"?`${p.pt} adicionado à cesta`:`${p.pt} added to your basket`);
}
window.SB_add=addToCart;
function fly(btn){
  const cb=document.getElementById("cartBtn");if(!btn||!cb)return;
  const a=btn.getBoundingClientRect(),b=cb.getBoundingClientRect();
  const f=document.createElement("div");f.className="flyer";f.textContent="+1";
  f.style.left=a.left+"px";f.style.top=a.top+"px";document.body.appendChild(f);
  requestAnimationFrame(()=>{f.style.transform=`translate(${b.left-a.left}px,${b.top-a.top}px) scale(.4)`;f.style.opacity=".3"});
  setTimeout(()=>{f.remove();cb.classList.remove("bump");void cb.offsetWidth;cb.classList.add("bump")},800);
}
let tt;function toast(msg){const t=document.getElementById("toast");document.getElementById("toastTxt").textContent=msg;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),2400)}
const count=()=>cart.reduce((s,i)=>s+i.q,0);
const subtotal=()=>cart.reduce((s,i)=>s+(P(i.id).price||0)*i.q,0);
const hasUnpriced=()=>cart.some(i=>P(i.id).price==null||P(i.id).unit);
function renderCart(){
  const n=count(),cc=document.getElementById("cartCount");if(!cc)return;
  cc.textContent=n;cc.classList.toggle("show",n>0);
  const box=document.getElementById("citems"),foot=document.getElementById("cfoot");
  if(!n){box.innerHTML=`<div class="empty"><svg viewBox="0 0 64 64" fill="none" stroke="#0B3D2E" stroke-width="2.5"><path d="M8 14h6l6 30h28l6-22H18"/><circle cx="24" cy="52" r="3"/><circle cx="44" cy="52" r="3"/><path d="M30 26l8 8M38 26l-8 8" stroke="#C8381E"/></svg><h3>${T("Your basket is empty","Sua cesta está vazia")}</h3><p>${T("Picanha, pão de queijo, guaraná… the good stuff is one tap away.","Picanha, pão de queijo, guaraná… o melhor do Brasil a um toque.")}</p><a class="btn" href="shop.html">${T("Browse the shop","Ver o mercado")}</a></div>`;foot.style.display="none";return}
  foot.style.display="";
  box.innerHTML=cart.map(i=>{const p=P(i.id);return `<div class="citem" data-k="${i.key}">
    <div class="th">${media(p,true)}</div>
    <div><b>${p.pt}</b><small>${i.opt?T(optEN[i.opt]||i.opt,i.opt)+" · ":""}${p.price==null?T("price in store","consultar"):money(p.price)+(p.unit?"/kg":"")}</small><br>
    <span class="qty"><button data-d="-1" aria-label="Less">−</button><span>${i.q}</span><button data-d="1" aria-label="More">+</button></span><button class="rm">${T("Remove","Remover")}</button></div>
    <span class="lp">${p.price==null?"—":money(p.price*i.q)}</span></div>`}).join("");
  document.getElementById("ctotal").textContent=money(subtotal());
  document.getElementById("cnote").innerHTML=hasUnpriced()
    ?T("Cuts sold by the kilo are priced on the final weight; the team confirms the exact total and any delivery fee on WhatsApp.","Carnes vendidas por quilo são cobradas pelo peso final; a equipe confirma o total e a taxa de entrega no WhatsApp.")
    :T("Delivery fee and time slot are confirmed with you on WhatsApp.","Taxa de entrega e horário são confirmados com você no WhatsApp.");
}
document.getElementById("citems").addEventListener("click",e=>{
  const row=e.target.closest(".citem");if(!row)return;const it=cart.find(i=>i.key===row.dataset.k);
  if(e.target.closest(".rm")){cart=cart.filter(i=>i!==it)}
  else{const d=e.target.closest("[data-d]");if(!d)return;it.q+=+d.dataset.d;if(it.q<1)cart=cart.filter(i=>i!==it)}
  save();renderCart();
});
const drawer=document.getElementById("drawer"),scrim=document.getElementById("scrim"),modal=document.getElementById("modal");
const openCart=()=>{drawer.classList.add("open");scrim.classList.add("open")};
const closeAll=()=>{drawer.classList.remove("open");scrim.classList.remove("open");modal.classList.remove("open")};
window.SB_openCart=openCart;
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("dclose").onclick=closeAll;
scrim.onclick=closeAll;
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAll();mnav.classList.remove("open");document.getElementById("lightbox").classList.remove("open")}});

/* ---------- checkout ---------- */
const form=document.getElementById("cform");
function fillTimes(){
  const sel=document.getElementById("ft");if(!sel)return;const v=sel.value;
  const o=lang()==="pt"
    ?["O mais rápido possível","Hoje — manhã","Hoje — tarde","Hoje — noite","Amanhã"]
    :["As soon as possible","Today — morning","Today — afternoon","Today — evening","Tomorrow"];
  sel.innerHTML=o.map((t,i)=>`<option value="${i}">${t}</option>`).join("");if(v)sel.value=v;
}
function toggleAddr(){const del=form.mode.value==="delivery";form.querySelectorAll(".addr-f").forEach(el=>el.style.display=del?"":"none")}
form.addEventListener("change",e=>{if(e.target.name==="mode")toggleAddr()});
document.getElementById("checkoutBtn").onclick=()=>{
  drawer.classList.remove("open");modal.classList.add("open");scrim.classList.add("open");
  form.hidden=false;document.getElementById("cdone").hidden=true;toggleAddr();
  document.getElementById("csum").innerHTML=cart.map(i=>{const p=P(i.id);return `<div><span>${i.q} × ${p.pt}${i.opt?" ("+i.opt+")":""}</span><span>${p.price==null?"—":money(p.price*i.q)}</span></div>`}).join("")+
   `<div class="t"><span>${T("Subtotal","Subtotal")}</span><span>${money(subtotal())}</span></div>`;
};
document.getElementById("mx").onclick=closeAll;
form.addEventListener("submit",e=>{
  e.preventDefault();
  const pt=lang()==="pt",del=form.mode.value==="delivery",err=document.getElementById("cerr");
  const need=[form.name,form.phone].concat(del?[form.address,form.postcode]:[]);
  const miss=need.filter(f=>!f.value.trim());
  if(miss.length){err.hidden=false;err.textContent=pt?"Por favor preencha os campos obrigatórios.":"Please fill in the required fields.";miss[0].focus();return}
  err.hidden=true;
  const lines=[];
  lines.push(pt?"Olá Shop Brazil! Gostaria de fazer um pedido 🇧🇷":"Hello Shop Brazil! I'd like to place an order 🇧🇷");lines.push("");
  cart.forEach(i=>{const p=P(i.id);lines.push(`• ${i.q} × ${p.pt}${i.opt?" ("+i.opt+")":""}${p.pack?" ["+p.pack+"]":""} — ${p.price==null?(pt?"preço a confirmar":"price to confirm"):money(p.price*i.q)+(p.unit?(pt?" (por kg)":" (per kg)"):"")}`)});
  lines.push("");lines.push(`${pt?"Subtotal estimado":"Estimated subtotal"}: ${money(subtotal())}`);
  lines.push(`${pt?"Modo":"Mode"}: ${del?(pt?"Delivery no mesmo dia":"Same-day delivery"):(pt?"Retirar na loja":"Collect in store")}`);
  lines.push(`${pt?"Nome":"Name"}: ${form.name.value.trim()}`);lines.push(`${pt?"Telefone":"Phone"}: ${form.phone.value.trim()}`);
  if(del){lines.push(`${pt?"Endereço":"Address"}: ${form.address.value.trim()}, ${form.postcode.value.trim().toUpperCase()}`);lines.push(`${pt?"Horário":"Time"}: ${form.time.options[form.time.selectedIndex].text}`)}
  if(form.notes.value.trim())lines.push(`${pt?"Obs":"Notes"}: ${form.notes.value.trim()}`);
  const txt=lines.join("\n");
  document.getElementById("orderText").textContent=txt;
  document.getElementById("waLink").href=`https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
  form.hidden=true;document.getElementById("cdone").hidden=false;
});
document.getElementById("copyOrder").onclick=async(e)=>{
  try{await navigator.clipboard.writeText(document.getElementById("orderText").textContent);e.target.closest("button").innerHTML=T("Copied ✓","Copiado ✓")}catch(_){toast(lang()==="pt"?"Selecione o texto abaixo para copiar":"Select the text below to copy")}
};

/* ---------- motion ---------- */
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target)}}),{threshold:.14,rootMargin:"0px 0px -40px 0px"});
window.SB_reveal=root=>(root||document).querySelectorAll(".rv:not(.in)").forEach(el=>io.observe(el));
SB_reveal();
// counters
const co=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const el=en.target,to=parseFloat(el.dataset.count),dec=(el.dataset.count.split(".")[1]||"").length,suf=el.dataset.suffix||"";let t0=null;
  const step=t=>{t0=t0||t;const k=Math.min(1,(t-t0)/1600),e=1-Math.pow(1-k,3);el.textContent=(to*e).toFixed(dec)+suf;if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step);co.unobserve(el)}),{threshold:.6});
document.querySelectorAll("[data-count]").forEach(el=>co.observe(el));
// play videos only when visible
const vo=new IntersectionObserver(es=>es.forEach(en=>{const v=en.target;if(en.isIntersecting){const p=v.play();if(p&&p.catch)p.catch(()=>{})}else v.pause()}),{threshold:.2});
document.querySelectorAll("video[data-auto]").forEach(v=>{v.muted=true;v.playsInline=true;vo.observe(v)});
// marquee duplicate
document.querySelectorAll(".marquee .track").forEach(t=>t.innerHTML+=t.innerHTML);
// lightbox
const lb=document.getElementById("lightbox");
document.addEventListener("click",e=>{const f=e.target.closest(".gallery figure");if(f){lb.querySelector("img").src=f.querySelector("img").src;lb.classList.add("open")}});
lb.addEventListener("click",()=>lb.classList.remove("open"));
// embers
document.querySelectorAll(".embers").forEach(box=>{for(let i=0;i<26;i++){const s=document.createElement("i");s.style.left=Math.random()*100+"%";s.style.animationDuration=6+Math.random()*8+"s";s.style.animationDelay=-Math.random()*12+"s";const z=2+Math.random()*4;s.style.width=s.style.height=z+"px";box.appendChild(s)}});
// parallax
const px=[...document.querySelectorAll("[data-parallax]")];
if(px.length&&!matchMedia("(prefers-reduced-motion:reduce)").matches){addEventListener("scroll",()=>{px.forEach(el=>{const r=el.getBoundingClientRect(),k=parseFloat(el.dataset.parallax);el.style.transform=`translateY(${(r.top+r.height/2-innerHeight/2)*-k}px)`})},{passive:true})}
// flags & icons
document.querySelectorAll("[data-flag]").forEach(el=>el.innerHTML=FLAGS[el.dataset.flag]);
document.querySelectorAll("[data-icon]").forEach(el=>el.innerHTML=I[el.dataset.icon]);
document.querySelectorAll("[data-ci]").forEach(el=>el.innerHTML=CI[el.dataset.ci]);
// product mounts: <div data-products="1,2,3">
document.querySelectorAll("[data-products]").forEach(el=>{el.innerHTML=el.dataset.products.split(",").map(id=>SB_card(P(+id))).join("")});
document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>{b.dataset.add.split(",").forEach(id=>addToCart(+id,"",b));openCart()}));
document.querySelectorAll("[data-scroll]").forEach(b=>b.addEventListener("click",()=>{const s=document.getElementById(b.dataset.target);s.scrollBy({left:(+b.dataset.scroll)*s.clientWidth*.8,behavior:"smooth"})}));

/* ---------- init ---------- */
setLang(store.get("sb-lang")||((navigator.language||"").toLowerCase().startsWith("pt")?"pt":"en"));
const ld=document.querySelector(".loader");
const hideL=()=>ld&&ld.classList.add("gone");
if(document.readyState==="complete")setTimeout(hideL,250);else addEventListener("load",()=>setTimeout(hideL,250));
setTimeout(hideL,2500);
})();
