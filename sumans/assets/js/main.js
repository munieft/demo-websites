/* Suman's — site interactions (vanilla JS, no frameworks) */
(function(){
"use strict";
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const PHONE="447894080963";

/* ---------- Mandala generator ---------- */
function petalRing(n,r0,r1,w,attrs){let s="";for(let i=0;i<n;i++){const a=360/n*i,m=(r0+r1)/2;s+=`<path d="M0,${-r1} C${w},${-m-2} ${w},${-m+4} 0,${-r0} C${-w},${-m+4} ${-w},${-m-2} 0,${-r1}Z" transform="rotate(${a})" ${attrs}/>`}return s}
function dotRing(n,r,rad){let s="";for(let i=0;i<n;i++){const a=2*Math.PI*i/n;s+=`<circle cx="${(Math.cos(a)*r).toFixed(2)}" cy="${(Math.sin(a)*r).toFixed(2)}" r="${rad}"/>`}return s}
function mandala(){
  const st='fill="none" stroke="currentColor" stroke-width=".7"';
  return `<svg viewBox="-200 -200 400 400" aria-hidden="true"><g ${st}>
  <circle r="196"/><circle r="188" stroke-dasharray="2 4"/>
  ${petalRing(32,150,188,9,'')}${petalRing(24,112,150,10,'')}${petalRing(16,72,112,12,'')}${petalRing(12,40,72,9,'')}
  <circle r="150"/><circle r="112"/><circle r="72"/><circle r="40"/><circle r="30" stroke-dasharray="1 3"/>
  ${petalRing(8,6,30,6,'')}</g><g fill="currentColor">${dotRing(48,170,1.4)}${dotRing(24,131,1.6)}${dotRing(16,92,1.8)}<circle r="4"/></g></svg>`;
}
$$("[data-mandala]").forEach(el=>el.innerHTML=mandala());

/* ---------- Toran (festive garland) ---------- */
function toran(W){
  W=Math.max(320,Math.round(W));const n=Math.max(6,Math.round(W/48)),gap=W/n,sag=Math.min(18,W/60);
  let s=`<svg viewBox="0 0 ${W} 70" aria-hidden="true"><path d="M0,6 Q${W/4},${6+sag*2} ${W/2},6 T${W},6" fill="none" stroke="#E9A23B" stroke-width="2"/>`;
  for(let i=0;i<n;i++){const x=gap/2+i*gap,t=(x%(W/2))/(W/2),y=6+sag*2*t*(1-t)*2;const leaf=i%2===0;
    s+=`<g class="sway" style="animation-delay:${(-i*.23).toFixed(2)}s;transform-box:fill-box">`+
      (leaf?`<path d="M${x},${y} C${x+9},${y+14} ${x+7},${y+30} ${x},${y+40} C${x-7},${y+30} ${x-9},${y+14} ${x},${y}Z" fill="#3E7A4E"/><path d="M${x},${y+3} V${y+36}" stroke="#2A5A37" stroke-width=".8"/>`
           :`<line x1="${x}" y1="${y}" x2="${x}" y2="${y+16}" stroke="#E9A23B" stroke-width="1"/><circle cx="${x}" cy="${y+21}" r="6" fill="#E9A23B"/><circle cx="${x}" cy="${y+32}" r="5.2" fill="#F2C14E"/><circle cx="${x}" cy="${y+42}" r="4.3" fill="#E9A23B"/><circle cx="${x}" cy="${y+50}" r="2" fill="#B23A2E"/>`)+`</g>`}
  return s+"</svg>";
}
const torans=$$("[data-toran]");const drawT=()=>torans.forEach(el=>el.innerHTML=toran(el.clientWidth||innerWidth));drawT();
let tt;addEventListener("resize",()=>{clearTimeout(tt);tt=setTimeout(drawT,200)});

/* ---------- Preloader & page transitions ---------- */
const pre=$(".preloader"), curtain=$(".curtain");
function revealPage(){pre&&pre.classList.add("done");curtain&&curtain.classList.remove("cover");document.body.classList.add("ready")}
let seen=false;try{seen=sessionStorage.getItem("sv-seen")==="1";sessionStorage.setItem("sv-seen","1")}catch(e){}
if(pre&&seen){pre.style.transition="none";pre.classList.add("done")}
window.addEventListener("load",()=>setTimeout(revealPage,seen?50:650));
setTimeout(revealPage,3500);
window.addEventListener("pageshow",e=>{if(e.persisted)revealPage()});
document.addEventListener("click",e=>{
  const a=e.target.closest("a");if(!a||!curtain||reduce)return;
  const href=a.getAttribute("href")||"";
  if(a.target==="_blank"||e.metaKey||e.ctrlKey||e.shiftKey||!/\.html(#.*)?$/.test(href)||/^(https?:|mailto:|tel:)/.test(href))return;
  if(href.split("#")[0]===location.pathname.split("/").pop()&&href.includes("#"))return;
  e.preventDefault();curtain.classList.add("cover");document.body.classList.remove("menu-open");
  setTimeout(()=>{location.href=href},560);
});

/* ---------- Header / nav ---------- */
const header=$(".site-header"), prog=$(".progress"), toTop=$(".to-top");
let lastY=0;
function onScroll(){
  const y=scrollY;
  header&&header.classList.toggle("scrolled",y>40);
  if(header&&!document.body.classList.contains("menu-open"))header.classList.toggle("hide",y>500&&y>lastY+4);
  if(y<lastY-4&&header)header.classList.remove("hide");
  lastY=y;
  const h=document.documentElement.scrollHeight-innerHeight;prog&&(prog.style.width=(h>0?y/h*100:0)+"%");
  toTop&&toTop.classList.toggle("show",y>900);
}
addEventListener("scroll",onScroll,{passive:true});onScroll();
toTop&&toTop.addEventListener("click",()=>scrollTo({top:0,behavior:reduce?"auto":"smooth"}));
const burger=$(".burger");
burger&&burger.addEventListener("click",()=>{const o=document.body.classList.toggle("menu-open");burger.setAttribute("aria-expanded",o);header.classList.remove("hide")});
addEventListener("keydown",e=>{if(e.key==="Escape")document.body.classList.remove("menu-open")});

/* ---------- Split text ---------- */
$$("[data-split]").forEach(el=>{
  const walk=n=>{[...n.childNodes].forEach(c=>{
    if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t));return}const w=document.createElement("span");w.className="w";const i=document.createElement("span");i.textContent=t;w.appendChild(i);f.appendChild(w)});c.replaceWith(f)}
    else if(c.nodeType===1&&!c.classList.contains("w")&&c.tagName!=="BR"){if(c.classList.contains("guj-line")){const w=document.createElement("span");w.className="w";c.replaceWith(w);const i=document.createElement("span");i.appendChild(c);w.appendChild(i);w.style.display="block"}else walk(c)}
  })};walk(el);el.classList.add("split");
  $$(".w>span",el).forEach((s,i)=>s.style.transitionDelay=(i*0.06+(+el.dataset.delay||0))+"s");
});

/* ---------- Reveal on scroll ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.14,rootMargin:"0px 0px -6% 0px"});
function observe(root=document){$$("[data-reveal],.split,.img-reveal",root).forEach(el=>{
  if(el.dataset.stagger!==undefined){[...el.children].forEach((c,i)=>{c.setAttribute("data-reveal",c.getAttribute("data-reveal")||"");c.style.transitionDelay=(i*0.09)+"s";io.observe(c)});}
  io.observe(el)})}
observe();

/* ---------- Counters ---------- */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,end=parseFloat(el.dataset.count),dec=(el.dataset.count.split(".")[1]||"").length,suf=el.dataset.suffix||"",t0=performance.now(),d=1800;
  (function tick(t){const p=Math.min(1,(t-t0)/d),v=end*(1-Math.pow(1-p,4));el.textContent=v.toFixed(dec)+suf;if(p<1)requestAnimationFrame(tick)})(t0);cio.unobserve(el)}),{threshold:.5});
$$("[data-count]").forEach(el=>cio.observe(el));

/* ---------- Hero slideshow ---------- */
$$("[data-slides]").forEach(box=>{const s=$$(".slide",box);if(s.length<2)return;let i=0;setInterval(()=>{s[i].classList.remove("active");i=(i+1)%s.length;s[i].classList.add("active")},4200)});

/* ---------- Parallax ---------- */
const px=$$("[data-parallax]");
if(px.length&&!reduce){let tick=false;const run=()=>{px.forEach(el=>{const r=el.getBoundingClientRect(),sp=parseFloat(el.dataset.parallax)||.15,c=r.top+r.height/2-innerHeight/2;el.style.transform=`translate3d(0,${(-c*sp).toFixed(1)}px,0)`});tick=false};
  addEventListener("scroll",()=>{if(!tick){tick=true;requestAnimationFrame(run)}},{passive:true});run();}

/* ---------- Particle canvases: marigold petals & embers ---------- */
function particles(cv,type){
  const ctx=cv.getContext("2d");let W,H,dpr=Math.min(devicePixelRatio||1,2),P=[],run=true;
  const size=()=>{W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};size();addEventListener("resize",size);
  const N=type==="embers"?Math.round(W/14):Math.round(Math.min(46,W/30));
  const cols=["#E9A23B","#F2C14E","#F08A24","#B23A2E","#F6D07A"];
  const mk=(init)=>type==="embers"?{x:Math.random()*W,y:init?Math.random()*H:H+10,r:Math.random()*2.2+.6,vy:-(Math.random()*1.1+.4),vx:(Math.random()-.5)*.4,life:1,decay:Math.random()*.004+.0015,ph:Math.random()*6}
    :{x:Math.random()*W,y:init?Math.random()*H:-20,r:Math.random()*7+5,vy:Math.random()*.7+.35,vx:(Math.random()-.5)*.5,rot:Math.random()*6,vr:(Math.random()-.5)*.03,sw:Math.random()*6,c:cols[Math.random()*cols.length|0],o:Math.random()*.5+.45};
  for(let i=0;i<N;i++)P.push(mk(true));
  const vis=new IntersectionObserver(e=>{run=e[0].isIntersecting;if(run)loop()});vis.observe(cv);
  function loop(){if(!run)return;ctx.clearRect(0,0,W,H);
    P.forEach((p,i)=>{
      if(type==="embers"){p.ph+=.05;p.x+=p.vx+Math.sin(p.ph)*.3;p.y+=p.vy;p.life-=p.decay;
        if(p.life<=0||p.y<-10){P[i]=mk(false);return}
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);g.addColorStop(0,`rgba(255,200,120,${p.life})`);g.addColorStop(.35,`rgba(255,122,47,${p.life*.7})`);g.addColorStop(1,"rgba(255,80,20,0)");
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r*4,0,7);ctx.fill();}
      else{p.sw+=.02;p.x+=p.vx+Math.sin(p.sw)*.6;p.y+=p.vy;p.rot+=p.vr;if(p.y>H+20){P[i]=mk(false);return}
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(1,Math.abs(Math.cos(p.sw))*.6+.4);ctx.globalAlpha=p.o;ctx.fillStyle=p.c;
        ctx.beginPath();ctx.moveTo(0,-p.r);ctx.bezierCurveTo(p.r*.8,-p.r*.4,p.r*.6,p.r*.6,0,p.r);ctx.bezierCurveTo(-p.r*.6,p.r*.6,-p.r*.8,-p.r*.4,0,-p.r);ctx.fill();
        ctx.globalAlpha=p.o*.5;ctx.strokeStyle="#8a3b10";ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(0,-p.r*.8);ctx.lineTo(0,p.r*.8);ctx.stroke();ctx.restore();}
    });requestAnimationFrame(loop)}
  loop();
}
if(!reduce){$$("canvas[data-petals]").forEach(c=>particles(c,"petals"));$$("canvas[data-embers]").forEach(c=>particles(c,"embers"))}

/* ---------- Magnetic buttons & tilt ---------- */
if(matchMedia("(pointer:fine)").matches&&!reduce){
  $$(".btn,.h-controls button").forEach(b=>{b.addEventListener("mousemove",e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.3}px)`});b.addEventListener("mouseleave",()=>b.style.transform="")});
  $$("[data-tilt]").forEach(c=>{c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`});c.addEventListener("mouseleave",()=>c.style.transform="")});
  const cur=$(".cursor");if(cur){let x=0,y=0,cx=0,cy=0;addEventListener("mousemove",e=>{x=e.clientX;y=e.clientY});(function f(){cx+=(x-cx)*.18;cy+=(y-cy)*.18;cur.style.left=cx+"px";cur.style.top=cy+"px";requestAnimationFrame(f)})();
    document.addEventListener("mouseover",e=>cur.classList.toggle("big",!!e.target.closest("a,button,[data-lightbox],.mi,figure")))}
}

/* ---------- Drag-to-scroll strips ---------- */
$$("[data-drag]").forEach(el=>{let down=false,sx,sl,moved=false;
  el.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse")return;down=true;moved=false;sx=e.clientX;sl=el.scrollLeft});
  addEventListener("pointermove",e=>{if(!down)return;const d=e.clientX-sx;if(Math.abs(d)>4){moved=true;el.classList.add("dragging")}el.scrollLeft=sl-d});
  addEventListener("pointerup",()=>{if(!down)return;down=false;el.classList.remove("dragging")});
  el.addEventListener("click",e=>{if(moved){e.preventDefault();e.stopPropagation()}},true);
  const wrap=el.closest("section");if(wrap){const p=$("[data-prev]",wrap),n=$("[data-next]",wrap);const step=()=>el.firstElementChild.getBoundingClientRect().width+24;p&&p.addEventListener("click",()=>el.scrollBy({left:-step(),behavior:"smooth"}));n&&n.addEventListener("click",()=>el.scrollBy({left:step(),behavior:"smooth"}))}
});

/* ---------- Marquee duplicate ---------- */
$$(".marquee-track").forEach(t=>{t.innerHTML+=t.innerHTML});

/* ---------- Lightbox ---------- */
const lb=$(".lightbox");
if(lb){let list=[],idx=0;const img=$("img",lb),cap=$("figcaption",lb),cnt=$(".lb-count",lb);
  const show=i=>{idx=(i+list.length)%list.length;const it=list[idx];img.style.opacity=0;const n=new Image();n.onload=()=>{img.src=it.src;img.alt=it.cap;img.style.opacity=1};n.src=it.src;cap.textContent=it.cap;cnt.textContent=String(idx+1).padStart(2,"0")+" / "+String(list.length).padStart(2,"0")};
  document.addEventListener("click",e=>{const t=e.target.closest("[data-lightbox]");if(!t)return;e.preventDefault();
    const g=t.dataset.lightbox;list=$$(`[data-lightbox="${g}"]`).filter(x=>!x.closest(".out")).map(x=>({src:x.dataset.full||x.getAttribute("href"),cap:x.dataset.caption||""}));
    show(list.findIndex(x=>x.src===(t.dataset.full||t.getAttribute("href"))));lb.classList.add("open");document.body.style.overflow="hidden"});
  const close=()=>{lb.classList.remove("open");document.body.style.overflow=""};
  $(".lb-close",lb).onclick=close;$(".lb-prev",lb).onclick=()=>show(idx-1);$(".lb-next",lb).onclick=()=>show(idx+1);
  lb.addEventListener("click",e=>{if(e.target===lb)close()});
  addEventListener("keydown",e=>{if(!lb.classList.contains("open"))return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")show(idx-1);if(e.key==="ArrowRight")show(idx+1)});
  let tx=0;lb.addEventListener("touchstart",e=>tx=e.touches[0].clientX,{passive:true});lb.addEventListener("touchend",e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)show(idx+(d<0?1:-1))});
}

/* ---------- Gallery filters ---------- */
const gf=$("[data-gallery-filters]");
if(gf){gf.addEventListener("click",e=>{const b=e.target.closest("[data-f]");if(!b)return;$$(".tab",gf).forEach(x=>x.classList.toggle("active",x===b));const f=b.dataset.f;
  $$(".masonry figure").forEach((fig,i)=>{const show=f==="all"||fig.dataset.cat.split(" ").includes(f);fig.classList.toggle("out",!show);if(show){fig.style.opacity=0;fig.style.transform="translateY(20px)";setTimeout(()=>{fig.style.opacity=1;fig.style.transform=""},30+i*25)}})})}

/* ---------- Autoplay videos only when visible ---------- */
const vio=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){const p=v.play();p&&p.catch(()=>{})}else v.pause()}),{threshold:.25});
$$("video[data-autoplay]").forEach(v=>{v.muted=true;vio.observe(v)});

/* ---------- Menu page ---------- */
const menuRoot=$("#menu-root");
let picked=store.get("sv-picked",[]);
const tray=$(".tray");
function syncTray(){if(!tray)return;const c=$(".count",tray);c.textContent=picked.length;c.classList.remove("bump");void c.offsetWidth;c.classList.add("bump");tray.classList.toggle("show",picked.length>0);store.set("sv-picked",picked)}
if(menuRoot&&window.SUMANS_MENU){
  const M=window.SUMANS_MENU;const plus='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>';
  const tabs=$("#menu-tabs");
  tabs.innerHTML='<button class="tab active" data-go="all">All<small>'+M.reduce((a,c)=>a+c.items.length,0)+'</small></button>'+M.map(c=>`<button class="tab" data-go="${c.id}">${c.name}<small>${c.items.length}</small></button>`).join("");
  menuRoot.innerHTML=M.map((c,ci)=>`<section class="menu-cat" id="${c.id}">
    <div class="menu-cat-head" data-reveal><div class="cat-img img-reveal"><img src="assets/img/${c.img}-sm.webp" alt="${c.name} by Suman's" loading="lazy"></div>
    <div><span class="guj">${c.guj}</span><h2>${c.name}</h2><p>${c.blurb}</p></div></div>
    <div class="menu-list">${c.items.map(([n,d,b])=>{const key=c.id+"|"+n;const badges=(b||[]).map(x=>`<span class="badge ${x==="faradi"?"fast":""}">${x==="faradi"?"Fasting":"Seasonal"}</span>`).join("");
      return `<div class="mi${picked.includes(key)?" picked":""}" data-key="${key}" data-name="${n.toLowerCase()} ${(d||"").toLowerCase()} ${c.name.toLowerCase()}"><div class="nm">${n}${d?`<small>${d}</small>`:""}</div>${badges}<button class="add" aria-label="Add ${n} to my menu">${plus}</button></div>`}).join("")}</div></section>`).join("");
  observe(menuRoot);
  menuRoot.addEventListener("click",e=>{const b=e.target.closest(".add");if(!b)return;const mi=b.closest(".mi"),k=mi.dataset.key;
    if(picked.includes(k))picked=picked.filter(x=>x!==k);else picked.push(k);mi.classList.toggle("picked");syncTray()});
  tabs.addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(!b)return;$$(".tab",tabs).forEach(x=>x.classList.toggle("active",x===b));
    const id=b.dataset.go;const target=id==="all"?menuRoot:$("#"+id);const y=target.getBoundingClientRect().top+scrollY-(id==="all"?220:150);scrollTo({top:y,behavior:reduce?"auto":"smooth"})});
  const secs=$$(".menu-cat");const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const b=$(`[data-go="${e.target.id}"]`,tabs);if(b){$$(".tab",tabs).forEach(x=>x.classList.toggle("active",x===b));b.scrollIntoView({block:"nearest",inline:"center",behavior:"smooth"})}}}),{rootMargin:"-45% 0px -50% 0px"});secs.forEach(s=>sio.observe(s));
  const q=$("#menu-search");q.addEventListener("input",()=>{const v=q.value.trim().toLowerCase();let any=0;
    secs.forEach(s=>{let n=0;$$(".mi",s).forEach(mi=>{const ok=!v||mi.dataset.name.includes(v);mi.classList.toggle("hidden",!ok);if(ok)n++});s.style.display=n?"":"none";any+=n;if(v)$$("[data-reveal]",s).forEach(x=>x.classList.add("in"))});
    $(".menu-empty").style.display=any?"none":"block"});
  syncTray();
}
if(tray){$(".clear",tray).addEventListener("click",()=>{picked=[];$$(".mi.picked").forEach(m=>m.classList.remove("picked"));syncTray()})}
const nasto=$("#nasto-grid");if(nasto&&window.SUMANS_NASTO)nasto.innerHTML=window.SUMANS_NASTO.map(([n,p])=>`<div class="nasto"><b>${n}</b><span>${p}</span></div>`).join("");

/* ---------- Contact form ---------- */
const form=$("#enquiry");
if(form){
  const pb=$(".picked-box"),pl=$(".pb-list");
  const names=picked.map(k=>k.split("|")[1]);
  if(names.length){pb.classList.add("show");pl.innerHTML=names.map(n=>`<span>${n}</span>`).join("");$("#pb-n").textContent=names.length}
  $("#pb-clear")&&$("#pb-clear").addEventListener("click",()=>{picked=[];store.set("sv-picked",[]);pb.classList.remove("show")});
  const today=new Date();today.setDate(today.getDate()+1);const d=$("#f-date");d&&(d.min=today.toISOString().slice(0,10));
  const hmap={weddings:"wedding",receptions:"reception",parties:"party"};const pre=location.hash.replace("#","");
  if(pre==="pizza"){form.elements.pizza.checked=true}else if(pre){const r=$("#t-"+(hmap[pre]||pre),form);r&&(r.checked=true)}
  form.addEventListener("submit",e=>{e.preventDefault();let ok=true;
    $$("[required]",form).forEach(i=>{const f=i.closest(".field");const bad=!i.value.trim()||(i.type==="email"&&!/^\S+@\S+\.\S+$/.test(i.value))||(i.type==="tel"&&i.value.replace(/\D/g,"").length<7);f.classList.toggle("invalid",bad);if(bad)ok=false});
    if(!ok){const f=$(".invalid",form);f&&f.scrollIntoView({behavior:"smooth",block:"center"});return}
    const v=n=>(form.elements[n]&&form.elements[n].value||"").trim();const type=(form.querySelector('input[name="type"]:checked')||{}).value||"Event";
    const sel=store.get("sv-picked",[]).map(k=>k.split("|")[1]);
    const msg=`Hello Suman's, I'd like a catering quote.\n\nName: ${v("name")}\nPhone: ${v("phone")}\nEmail: ${v("email")}\nOccasion: ${type}\nDate: ${v("date")||"TBC"}\nGuests: ${v("guests")||"TBC"}\nVenue / town: ${v("venue")||"TBC"}\nService style: ${v("service")}\nLive wood-fired pizza: ${form.elements.pizza.checked?"Yes please":"No"}\n${sel.length?`\nDishes I'm interested in (${sel.length}):\n- ${sel.join("\n- ")}\n`:""}\nMessage: ${v("message")||"-"}`;
    const res=$(".result");$("pre",res).textContent=msg;
    $("#r-wa").href=`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
    $("#r-mail").href=`mailto:info@svfoods.co.uk?subject=${encodeURIComponent("Catering enquiry – "+type+(v("date")?" – "+v("date"):""))}&body=${encodeURIComponent(msg)}`;
    res.classList.add("show");res.scrollIntoView({behavior:"smooth",block:"center"});
    $("#r-copy").onclick=async()=>{try{await navigator.clipboard.writeText(msg);$("#r-copy").textContent="Copied ✓"}catch(err){$("#r-copy").textContent="Select & copy above"}};
  });
  $$("input,select,textarea",form).forEach(i=>i.addEventListener("input",()=>i.closest(".field")&&i.closest(".field").classList.remove("invalid")));
}

/* ---------- Year ---------- */
$$("[data-year]").forEach(e=>e.textContent=new Date().getFullYear());
})();
