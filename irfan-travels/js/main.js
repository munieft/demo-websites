/* Irfan Travels Ltd — site interactions (vanilla JS) */
(function(){
  "use strict";
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PHONE="447944157746";

  /* Preloader */
  var t0pl=Date.now(),seen=false;
  try{seen=sessionStorage.getItem("it_intro")==="1"}catch(e){}
  var MIN=reduce?0:(seen?900:2900);
  function hidePre(){var p=$(".preloader");if(!p||p.classList.contains("done"))return;p.classList.add("done");document.body.classList.remove("loading");document.body.classList.add("loaded");try{sessionStorage.setItem("it_intro","1")}catch(e){}setTimeout(function(){p.remove()},1300)}
  if(seen){var pl=$(".preloader");if(pl)pl.classList.add("quick")}
  window.addEventListener("load",function(){setTimeout(hidePre,Math.max(0,MIN-(Date.now()-t0pl)))});
  setTimeout(hidePre,6000);

  /* Year */
  $$("[data-year]").forEach(function(e){e.textContent=new Date().getFullYear()});

  /* Header / progress / to-top */
  var header=$(".header"),prog=$(".progress"),top=$(".to-top"),ring=top&&$("circle",top);
  function onScroll(){
    var y=window.scrollY,h=document.documentElement.scrollHeight-innerHeight,p=h>0?y/h:0;
    if(header)header.classList.toggle("scrolled",y>60);
    if(prog)prog.style.width=(p*100)+"%";
    if(top){top.classList.toggle("show",y>600);if(ring)ring.style.strokeDashoffset=126-126*p}
    $$("[data-parallax]").forEach(function(el){
      var r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
      var s=parseFloat(el.getAttribute("data-parallax"))||.15;
      el.style.transform="translate3d(0,"+((r.top+r.height/2-innerHeight/2)*-s).toFixed(1)+"px,0)";
    });
  }
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();
  if(top)top.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"})});

  /* Mobile menu */
  var burger=$(".burger");
  if(burger)burger.addEventListener("click",function(){
    var o=document.body.classList.toggle("menu-open");burger.setAttribute("aria-expanded",o);
    $$(".drawer a.dl").forEach(function(a,i){a.style.transitionDelay=o?(0.15+i*0.06)+"s":"0s"});
  });
  $$(".drawer a").forEach(function(a){a.addEventListener("click",function(){document.body.classList.remove("menu-open")})});

  /* Split headings into animated lines (words) */
  $$("[data-split]").forEach(function(h){
    var html=h.innerHTML.split(/<br\s*\/?>/i);
    h.innerHTML=html.map(function(line){return '<span class="split-line"><span>'+line+'</span></span>'}).join("<br>");
    $$(".split-line>span",h).forEach(function(s,i){s.style.transitionDelay=(i*0.12)+"s"});
  });

  /* Reveal */
  var io="IntersectionObserver" in window?new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}});
  },{threshold:.14,rootMargin:"0px 0px -40px 0px"}):null;
  $$("[data-reveal],[data-split]").forEach(function(el){
    var d=el.getAttribute("data-delay");if(d)el.style.transitionDelay=d+"s";
    if(io)io.observe(el);else el.classList.add("in");
  });
  // stagger children
  $$("[data-stagger]").forEach(function(g){$$(":scope>*",g).forEach(function(c,i){c.setAttribute("data-reveal",c.getAttribute("data-reveal")||"");c.style.transitionDelay=(i*0.09)+"s";if(io)io.observe(c);else c.classList.add("in")})});

  /* Counters */
  function count(el){
    var to=parseFloat(el.getAttribute("data-count")),dec=(el.getAttribute("data-count").split(".")[1]||"").length,suf=el.getAttribute("data-suffix")||"",t0=null,dur=1800;
    function step(t){if(!t0)t0=t;var k=Math.min((t-t0)/dur,1),e=1-Math.pow(1-k,4);el.textContent=(to*e).toFixed(dec)+suf;if(k<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);
  }
  var cio="IntersectionObserver" in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);cio.unobserve(e.target)}})},{threshold:.5}):null;
  $$("[data-count]").forEach(function(c){if(cio)cio.observe(c);else c.textContent=c.getAttribute("data-count")});

  /* Hero slideshow */
  var slides=$$(".hero-bg .slide");
  if(slides.length){var si=0;slides[0].classList.add("on");setInterval(function(){slides[si].classList.remove("on");si=(si+1)%slides.length;slides[si].classList.add("on")},6000)}

  /* Word rotator */
  $$(".rotator").forEach(function(r){
    var w=r.getAttribute("data-words").split("|"),i=0;
    setInterval(function(){i=(i+1)%w.length;r.innerHTML="<span>"+w[i]+"</span>"},2600);
  });

  /* Tilt cards */
  if(!reduce&&matchMedia("(hover:hover)").matches){
    $$("[data-tilt]").forEach(function(c){
      c.addEventListener("mousemove",function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform="perspective(900px) rotateY("+(x*8)+"deg) rotateX("+(-y*8)+"deg) translateY(-6px)"});
      c.addEventListener("mouseleave",function(){c.style.transform=""});
    });
  }

  /* Filters */
  $$(".filters").forEach(function(f){
    var grid=$(f.getAttribute("data-target"));
    f.addEventListener("click",function(e){
      var b=e.target.closest("button");if(!b)return;
      $$("button",f).forEach(function(x){x.classList.toggle("on",x===b)});
      var k=b.getAttribute("data-f");
      $$(".dcard",grid).forEach(function(c,i){
        var show=k==="all"||(c.getAttribute("data-cat")||"").indexOf(k)>-1;
        c.classList.toggle("hide",!show);
        if(show){c.animate&&c.animate([{opacity:0,transform:"translateY(30px) scale(.96)"},{opacity:1,transform:"none"}],{duration:600,delay:i*50,easing:"cubic-bezier(.22,1,.36,1)",fill:"backwards"})}
      });
    });
  });

  /* Tabs */
  $$(".tabs").forEach(function(t){
    t.addEventListener("click",function(e){
      var b=e.target.closest(".tab-btns button");if(!b)return;
      var id=b.getAttribute("data-tab");
      $$(".tab-btns button",t).forEach(function(x){x.classList.toggle("on",x===b)});
      $$(".tab-pane",t).forEach(function(p){p.classList.toggle("on",p.id===id)});
    });
  });

  /* Accordion */
  $$(".acc button").forEach(function(b){
    b.addEventListener("click",function(){
      var a=b.parentElement,open=a.classList.contains("open");
      $$(".acc",a.parentElement).forEach(function(x){x.classList.remove("open");$("button",x).setAttribute("aria-expanded","false")});
      if(!open){a.classList.add("open");b.setAttribute("aria-expanded","true")}
    });
  });

  /* Pre-select trip type from URL hash e.g. contact.html#umrah */
  var form=$("#enquiry");
  if(form){
    var h=(location.hash||"").replace("#","");
    if(h){var r=$('input[name="trip"][value="'+h+'"]',form);if(r)r.checked=true}
    var dt=$('input[name="date"]',form);if(dt){var d=new Date();d.setDate(d.getDate()+1);dt.min=d.toISOString().slice(0,10)}
    form.addEventListener("submit",function(e){
      e.preventDefault();
      var ok=true;
      $$("[required]",form).forEach(function(i){var f=i.closest(".field");var bad=!i.value.trim()||(i.type==="email"&&!/^\S+@\S+\.\S+$/.test(i.value));if(f)f.classList.toggle("err",bad);if(bad)ok=false});
      if(!ok){var first=$(".field.err",form);if(first)first.scrollIntoView({behavior:"smooth",block:"center"});return}
      var fd=new FormData(form),g=function(k){return (fd.get(k)||"").toString().trim()};
      var trip=$('input[name="trip"]:checked',form);
      var lines=[
        "Assalamu alaikum / Hello Irfan,",
        "I'd like a quote from Irfan Travels.",
        "",
        "Trip: "+(trip?trip.parentElement.textContent.trim():"General enquiry"),
        "Name: "+g("name"),
        "Phone: "+g("phone"),
        g("email")?"Email: "+g("email"):"",
        g("from")?"Flying from: "+g("from"):"",
        g("to")?"Destination: "+g("to"):"",
        g("date")?"Preferred date: "+g("date"):"",
        g("nights")?"Duration: "+g("nights"):"",
        "Travellers: "+(g("adults")||"1")+" adult(s)"+(g("children")&&g("children")!=="0"?", "+g("children")+" child(ren)":""),
        g("budget")?"Package level: "+g("budget"):"",
        g("msg")?"\nNotes: "+g("msg"):""
      ].filter(function(l,i,a){return l!==""||(i>0&&a[i-1]!=="")});
      var text=lines.join("\n");
      var done=$(".form-done");
      $("pre",done).textContent=text;
      $(".send-wa",done).href="https://wa.me/"+PHONE+"?text="+encodeURIComponent(text);
      $(".send-mail",done).href="mailto:irfantravels@outlook.com?subject="+encodeURIComponent("Quote request – "+(trip?trip.parentElement.textContent.trim():"Travel"))+"&body="+encodeURIComponent(text);
      done.classList.add("show");
      done.scrollIntoView({behavior:"smooth",block:"center"});
    });
    $$("[required]",form).forEach(function(i){i.addEventListener("input",function(){var f=i.closest(".field");if(f)f.classList.remove("err")})});
    var back=$(".form-done .back");if(back)back.addEventListener("click",function(){$(".form-done").classList.remove("show")});
    var cp=$(".form-done .copy");if(cp)cp.addEventListener("click",function(){
      var t=$(".form-done pre").textContent;
      try{navigator.clipboard.writeText(t).then(function(){cp.textContent="Copied ✓"},function(){cp.textContent="Select text & copy"})}catch(err){cp.textContent="Select text & copy"}
    });
  }

  /* Globe */
  var cv=$("#globe");
  if(cv&&cv.getContext){
    var ctx=cv.getContext("2d"),W,H,R,dpr=Math.min(window.devicePixelRatio||1,2);
    function size(){var b=cv.getBoundingClientRect();W=b.width;H=b.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);R=Math.min(W,H)*0.42}
    size();window.addEventListener("resize",size);
    var D=Math.PI/180;
    function v(lat,lon){lat*=D;lon*=D;return [Math.cos(lat)*Math.sin(lon),Math.sin(lat),Math.cos(lat)*Math.cos(lon)]}
    var pts=[],N=1400,ga=Math.PI*(3-Math.sqrt(5));
    for(var i=0;i<N;i++){var y=1-(i/(N-1))*2,r=Math.sqrt(1-y*y),th=ga*i;pts.push([Math.cos(th)*r,y,Math.sin(th)*r])}
    var home={n:"London",p:v(51.5,-0.12)};
    var cities=[
      {n:"Makkah",p:v(21.4,39.8),c:"#f3d48a"},{n:"Madinah",p:v(24.5,39.6),c:"#f3d48a",nl:1},
      {n:"Colombo",p:v(6.9,79.9),c:"#45a6ff"},{n:"Malé",p:v(4.2,73.5),c:"#7fe0ff"},
      {n:"Dubai",p:v(25.2,55.3),c:"#9cc9ff"},{n:"Istanbul",p:v(41,29),c:"#9cc9ff"},
      {n:"Kuala Lumpur",p:v(3.1,101.7),c:"#9cc9ff"},{n:"Paris",p:v(48.9,2.35),c:"#9cc9ff",nl:1},
      {n:"Lahore",p:v(31.5,74.3),c:"#7ee0a8"},{n:"Islamabad",p:v(33.7,73.1),c:"#7ee0a8",nl:1},{n:"Delhi",p:v(28.6,77.2),c:"#ffb36b"}
    ];
    function slerp(a,b,t){var d=Math.acos(Math.max(-1,Math.min(1,a[0]*b[0]+a[1]*b[1]+a[2]*b[2]))),s=Math.sin(d);if(s<1e-6)return a;var k1=Math.sin((1-t)*d)/s,k2=Math.sin(t*d)/s;return [a[0]*k1+b[0]*k2,a[1]*k1+b[1]*k2,a[2]*k1+b[2]*k2]}
    var rot=-45*D,tilt=-18*D,drag=null,off=0,hover=-1;
    function proj(p,lift){
      var cs=Math.cos(rot),sn=Math.sin(rot),x=p[0]*cs+p[2]*sn,z=-p[0]*sn+p[2]*cs,y=p[1];
      var ct=Math.cos(tilt),st=Math.sin(tilt),y2=y*ct-z*st,z2=y*st+z*ct;
      var m=R*(lift||1);return {x:W/2+x*m,y:H/2-y2*m,z:z2};
    }
    cv.addEventListener("pointerdown",function(e){drag={x:e.clientX,r:off};cv.setPointerCapture(e.pointerId)});
    cv.addEventListener("pointermove",function(e){if(drag){off=drag.r+(e.clientX-drag.x)*0.008}});
    cv.addEventListener("pointerup",function(){drag=null});
    $$(".dest-pill").forEach(function(p,i){
      p.addEventListener("mouseenter",function(){hover=+p.getAttribute("data-city")});
      p.addEventListener("mouseleave",function(){hover=-1});
    });
    var t0=performance.now();
    function frame(now){
      var t=(now-t0)/1000;
      rot=-45*D+off+(reduce?0:Math.sin(t*0.25)*0.75);
      ctx.clearRect(0,0,W,H);
      // sphere body
      var g=ctx.createRadialGradient(W/2-R*.35,H/2-R*.35,R*.1,W/2,H/2,R);
      g.addColorStop(0,"#1f6fe5");g.addColorStop(.7,"#0c2a5e");g.addColorStop(1,"#071a3d");
      ctx.beginPath();ctx.arc(W/2,H/2,R,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      ctx.strokeStyle="rgba(69,166,255,.35)";ctx.lineWidth=1.5;ctx.stroke();
      // dots
      for(var i=0;i<pts.length;i++){var q=proj(pts[i]);if(q.z<0)continue;ctx.fillStyle="rgba(156,201,255,"+(0.15+q.z*0.55)+")";ctx.fillRect(q.x-1,q.y-1,1.8,1.8)}
      // arcs
      cities.forEach(function(c,ci){
        var hl=hover===ci,steps=48,prev=null,head=((t*0.35+ci*0.13)%1);
        ctx.lineWidth=hl?2.6:1.4;
        for(var s=0;s<=steps;s++){
          var k=s/steps,p=slerp(home.p,c.p,k),lift=1+Math.sin(Math.PI*k)*0.22,q=proj(p,lift);
          if(prev&&q.z>-0.15&&prev.z>-0.15){ctx.strokeStyle=hl?c.c:"rgba(255,255,255,"+(0.25+0.5*Math.max(0,q.z))+")";ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(q.x,q.y);ctx.stroke()}
          prev=q;
        }
        var hp=proj(slerp(home.p,c.p,head),1+Math.sin(Math.PI*head)*0.22);
        if(hp.z>-0.1){ctx.beginPath();ctx.arc(hp.x,hp.y,hl?4:2.6,0,Math.PI*2);ctx.fillStyle=c.c;ctx.shadowColor=c.c;ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0}
        var cp=proj(c.p);
        if(cp.z>0){
          var pulse=(t*1.2+ci*.3)%1;
          ctx.beginPath();ctx.arc(cp.x,cp.y,4+pulse*12,0,Math.PI*2);ctx.strokeStyle="rgba(255,255,255,"+(0.5*(1-pulse))+")";ctx.lineWidth=1;ctx.stroke();
          ctx.beginPath();ctx.arc(cp.x,cp.y,hl?5:3.5,0,Math.PI*2);ctx.fillStyle=c.c;ctx.fill();
          if(!c.nl||hl){ctx.font=(hl?"700 13px ":"600 11px ")+'"Plus Jakarta Sans",sans-serif';ctx.fillStyle="rgba(255,255,255,"+(hl?1:0.85*cp.z+0.15)+")";ctx.fillText(c.n,cp.x+8,cp.y-6)}
        }
      });
      var hq=proj(home.p);
      if(hq.z>0){ctx.beginPath();ctx.arc(hq.x,hq.y,6,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();ctx.beginPath();ctx.arc(hq.x,hq.y,3,0,Math.PI*2);ctx.fillStyle="#1453c4";ctx.fill();ctx.font='700 12px "Plus Jakarta Sans",sans-serif';ctx.fillStyle="#fff";ctx.fillText("London · Hounslow",hq.x+10,hq.y+4)}
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
