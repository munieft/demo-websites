const header=document.querySelector('.header'), menu=document.querySelector('.menu');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30));
menu.addEventListener('click',()=>document.body.classList.toggle('mobile-open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('mobile-open')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.service-grid article,.project,.steps div,.intro-grid>*,.approach-grid>*').forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=(i%4)*80+'ms';io.observe(el)});
