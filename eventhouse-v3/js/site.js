const $=(s,p=document)=>p.querySelector(s); const $$=(s,p=document)=>[...p.querySelectorAll(s)];
window.addEventListener('load',()=>setTimeout(()=>$('.preloader')?.classList.add('hide'),350));
const nav=$('.nav'), menu=$('.menu'), links=$('.nav-links');
window.addEventListener('scroll',()=>nav?.classList.toggle('scrolled',scrollY>15));
menu?.addEventListener('click',()=>links?.classList.toggle('open'));
$$('.nav-links a').forEach(a=>a.addEventListener('click',()=>links?.classList.remove('open')));
const page=location.pathname.split('/').pop()||'index.html';
$$('.nav-links a').forEach(a=>{if(a.getAttribute('href')===page)a.classList.add('active')});
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

const lb=$('.lightbox'); const lbImg=$('.lightbox img');
$$('[data-lightbox]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();lbImg.src=a.dataset.lightbox;lb?.classList.add('open');document.body.style.overflow='hidden'}));
function closeLightbox(){lb?.classList.remove('open');document.body.style.overflow=''}
$('.lightbox-close')?.addEventListener('click',closeLightbox); lb?.addEventListener('click',e=>{if(e.target===lb)closeLightbox()}); document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});

$('.enquiry-form')?.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const name=data.get('name'),date=data.get('date'),type=data.get('type'),size=data.get('size'),message=data.get('message');const text=`Hello Eventhouse Marquee, I would like to enquire about a marquee.\n\nName: ${name}\nEvent: ${type}\nDate: ${date}\nMarquee size: ${size}\nDetails: ${message||'Please let me know availability and pricing.'}`;navigator.clipboard?.writeText(text);const note=$('.form-note'); if(note){note.textContent='Your enquiry has been prepared and copied. Please paste it into an Instagram message to @eventhouse.marquee.';note.style.color='var(--forest)'} window.open('https://www.instagram.com/eventhouse.marquee/','_blank','noopener')});
