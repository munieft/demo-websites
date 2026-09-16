const nav = document.querySelector('.nav nav');
const hamburger = document.querySelector('.hamb');
const header = document.querySelector('.nav');

hamburger?.addEventListener('click', () => nav?.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach((a) => {
  a.addEventListener('click', () => nav?.classList.remove('open'));
});

// Header responds subtly to scroll.
const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Staggered reveal as sections enter the viewport.
const revealTargets = document.querySelectorAll(
  '.intro > div, .section-head, .service, .gallery-top, .g, .quote blockquote, .story-image, .story-copy, .reviews-head, .review-card, .cta-inner'
);
revealTargets.forEach((el, index) => {
  el.classList.add('reveal');
  if (index % 4 === 1) el.classList.add('delay-1');
  if (index % 4 === 2) el.classList.add('delay-2');
  if (index % 4 === 3) el.classList.add('delay-3');
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('visible'));
}

// Gentle pointer movement on the hero balloons: subtle, not gimmicky.
const heroArt = document.querySelector('.hero-art');
const orbs = heroArt ? [...heroArt.querySelectorAll('.orb')] : [];
heroArt?.addEventListener('pointermove', (event) => {
  const rect = heroArt.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  orbs.forEach((orb, i) => {
    const depth = (i + 1) * 4;
    orb.style.marginLeft = `${x * depth}px`;
    orb.style.marginTop = `${y * depth}px`;
  });
});
heroArt?.addEventListener('pointerleave', () => {
  orbs.forEach((orb) => { orb.style.marginLeft = ''; orb.style.marginTop = ''; });
});

// Make the marquee genuinely continuous by duplicating its content once.
const marquee = document.querySelector('.marquee div');
if (marquee && !marquee.dataset.duplicated) {
  marquee.innerHTML += ` <span>✦</span> ${marquee.textContent}`;
  marquee.dataset.duplicated = 'true';
}
