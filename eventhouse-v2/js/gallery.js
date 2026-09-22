/* =========================================================
   Eventhouse Marquee — gallery.js
   Category filter + lightbox
   ========================================================= */
(function () {
  "use strict";
  var grid = document.querySelector("[data-gallery]");
  if (!grid) return;
  var items = [].slice.call(grid.querySelectorAll(".mi"));
  var btns = document.querySelectorAll(".filters button");

  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      btns.forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
      var c = b.getAttribute("data-filter");
      items.forEach(function (it) {
        it.classList.toggle("hide", !(c === "all" || it.getAttribute("data-cat").indexOf(c) > -1));
      });
    });
  });

  var lb = document.createElement("div");
  lb.className = "lb";
  lb.innerHTML =
    '<button class="lb__c" aria-label="Close">'+ic("x")+'</button>'+
    '<button class="lb__n p" aria-label="Previous">'+ic("p")+'</button>'+
    '<img alt="Marquee photo">'+
    '<button class="lb__n x" aria-label="Next">'+ic("n")+'</button>'+
    '<div class="lb__ct"></div>';
  document.body.appendChild(lb);
  var img = lb.querySelector("img"), ct = lb.querySelector(".lb__ct"), cur = 0;

  function vis(){ return items.filter(function(i){return !i.classList.contains("hide");}); }
  function open(it){ var v=vis(); cur=v.indexOf(it); render(v); lb.classList.add("on"); document.body.style.overflow="hidden"; }
  function render(v){ var it=v[cur]; img.src=it.getAttribute("data-full"); img.alt=it.getAttribute("data-alt")||"Marquee photo"; ct.textContent=(cur+1)+" / "+v.length; }
  function move(d){ var v=vis(); cur=(cur+d+v.length)%v.length; render(v); }
  function close(){ lb.classList.remove("on"); document.body.style.overflow=""; }

  items.forEach(function(it){ it.addEventListener("click", function(){ open(it); }); });
  lb.querySelector(".lb__c").addEventListener("click", close);
  lb.querySelector(".p").addEventListener("click", function(){ move(-1); });
  lb.querySelector(".x").addEventListener("click", function(){ move(1); });
  lb.addEventListener("click", function(e){ if(e.target===lb) close(); });
  document.addEventListener("keydown", function(e){ if(!lb.classList.contains("on"))return; if(e.key==="Escape")close(); if(e.key==="ArrowLeft")move(-1); if(e.key==="ArrowRight")move(1); });
  var sx=0; lb.addEventListener("touchstart",function(e){sx=e.touches[0].clientX;},{passive:true});
  lb.addEventListener("touchend",function(e){var d=e.changedTouches[0].clientX-sx; if(Math.abs(d)>50)move(d<0?1:-1);},{passive:true});

  function ic(t){
    if(t==="x")return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    if(t==="p")return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
    return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
  }
})();
