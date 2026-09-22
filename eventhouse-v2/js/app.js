/* =========================================================
   Eventhouse Marquee — app.js
   Header, nav, reveal, counters, slider, FAQ, form,
   section dots, drag-scroll gallery, image fallback
   ========================================================= */
(function () {
  "use strict";
  var doc = document, body = doc.body;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Image fallback: broken img -> hide so .ph gradient shows */
  window.evemImgFail = function (img) { img.style.display = "none"; };
  doc.querySelectorAll(".ph img").forEach(function (img) {
    img.addEventListener("error", function () { img.style.display = "none"; });
    if (img.complete && img.naturalWidth === 0) img.style.display = "none";
  });

  /* Header */
  var hdr = doc.querySelector(".hdr");
  var hasHero = doc.querySelector(".hero,.phero");
  function onScroll(){ if(hdr) hdr.classList.toggle("solid", scrollY > (hasHero?60:10)); }
  addEventListener("scroll", onScroll, {passive:true}); onScroll();

  /* Mobile nav */
  var burger = doc.querySelector(".burger"), backdrop = doc.querySelector(".backdrop");
  function close(){ body.classList.remove("open"); if(burger) burger.setAttribute("aria-expanded","false"); }
  if(burger) burger.addEventListener("click", function(){ var o=body.classList.toggle("open"); burger.setAttribute("aria-expanded",o?"true":"false"); });
  if(backdrop) backdrop.addEventListener("click", close);
  doc.querySelectorAll(".nav a").forEach(function(a){ a.addEventListener("click", close); });
  addEventListener("keydown", function(e){ if(e.key==="Escape") close(); });

  /* Reveal */
  var rv = doc.querySelectorAll("[data-rv]");
  if(reduce || !("IntersectionObserver" in window)){ rv.forEach(function(e){e.classList.add("in");}); }
  else { var io=new IntersectionObserver(function(en){ en.forEach(function(x){ if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target);} }); },{threshold:.12,rootMargin:"0px 0px -8% 0px"}); rv.forEach(function(e){io.observe(e);}); }

  /* Counters */
  var cs = doc.querySelectorAll("[data-count]");
  function count(el){
    var t=parseFloat(el.getAttribute("data-count")), dec=(el.getAttribute("data-count").split(".")[1]||"").length;
    var suf=el.getAttribute("data-suffix")||"", dur=1600, s=null;
    if(reduce){ el.textContent=t.toFixed(dec)+suf; return; }
    function tick(n){ if(!s)s=n; var p=Math.min((n-s)/dur,1), e=1-Math.pow(1-p,3); el.textContent=(t*e).toFixed(dec)+suf; if(p<1)requestAnimationFrame(tick); }
    requestAnimationFrame(tick);
  }
  if(cs.length){ var cio=new IntersectionObserver(function(en){ en.forEach(function(x){ if(x.isIntersecting){count(x.target);cio.unobserve(x.target);} }); },{threshold:.5}); cs.forEach(function(e){cio.observe(e);}); }

  /* Testimonials */
  var qw = doc.querySelector(".quotes");
  if(qw){
    var qs=qw.querySelectorAll(".q"), dw=qw.querySelector(".qdots"), i=0, timer;
    qs.forEach(function(q,n){ var b=doc.createElement("button"); b.setAttribute("aria-label","Testimonial "+(n+1)); b.addEventListener("click", function(){ go(n); rest(); }); dw.appendChild(b); });
    var dots=dw.querySelectorAll("button");
    function go(n){ qs[i].classList.remove("on"); dots[i].classList.remove("on"); i=(n+qs.length)%qs.length; qs[i].classList.add("on"); dots[i].classList.add("on"); }
    function rest(){ clearInterval(timer); if(!reduce) timer=setInterval(function(){go(i+1);},6000); }
    go(0); rest();
    qw.addEventListener("mouseenter",function(){clearInterval(timer);}); qw.addEventListener("mouseleave",rest);
  }

  /* FAQ */
  doc.querySelectorAll(".faq__q").forEach(function(q){
    q.addEventListener("click", function(){
      var it=q.closest(".faq__i"), a=it.querySelector(".faq__a"), o=it.classList.toggle("on");
      q.setAttribute("aria-expanded", o?"true":"false"); a.style.maxHeight = o? a.scrollHeight+"px" : null;
    });
  });

  /* Contact form -> WhatsApp */
  var form = doc.querySelector("#enquiry-form");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault(); var f=form.elements;
      var msg="New marquee enquiry%0A----------------------%0A"+
        "Name: "+(f.name.value||"-")+"%0A"+
        "Phone: "+(f.phone.value||"-")+"%0A"+
        (f.email&&f.email.value?"Email: "+f.email.value+"%0A":"")+
        "Event type: "+(f.event.value||"-")+"%0A"+
        "Event date: "+(f.date.value||"-")+"%0A"+
        "Marquee size: "+(f.size.value||"-")+"%0A"+
        "Postcode / area: "+(f.postcode.value||"-")+"%0A"+
        "Details: "+(f.message.value||"-");
      open("https://wa.me/"+window.EVEM_CONFIG.whatsapp+"?text="+msg,"_blank","noopener");
      var ok=form.querySelector(".fok"); if(ok) ok.classList.add("show"); form.reset();
    });
  }

  /* Section index dots */
  var dots = doc.querySelectorAll(".dots a");
  if(dots.length){
    var secs=[].map.call(dots,function(d){ return doc.querySelector(d.getAttribute("href")); });
    var sio=new IntersectionObserver(function(en){
      en.forEach(function(x){ if(x.isIntersecting){ var id="#"+x.target.id; dots.forEach(function(d){ d.classList.toggle("on", d.getAttribute("href")===id); }); } });
    },{threshold:.5});
    secs.forEach(function(s){ if(s) sio.observe(s); });
  }

  /* Drag-scroll horizontal galleries */
  doc.querySelectorAll(".hscroll").forEach(function(el){
    var down=false, sx, sl;
    el.addEventListener("mousedown", function(e){ down=true; el.classList.add("drag"); sx=e.pageX; sl=el.scrollLeft; });
    addEventListener("mouseup", function(){ down=false; el.classList.remove("drag"); });
    el.addEventListener("mouseleave", function(){ down=false; el.classList.remove("drag"); });
    el.addEventListener("mousemove", function(e){ if(!down)return; e.preventDefault(); el.scrollLeft = sl - (e.pageX - sx)*1.4; });
  });
})();
