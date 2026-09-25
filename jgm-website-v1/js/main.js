/* JGM Events CIC - Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  // ===== Header Scroll Effect =====
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ===== Mobile Menu =====
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.overlay');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  };

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
  }

  // ===== Scroll Animations (Intersection Observer) =====
  const animatedElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // ===== Counter Animation =====
  const counters = document.querySelectorAll('.stat-number');
  let counted = false;

  const animateCounters = () => {
    if (counted) return;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current) + (counter.dataset.suffix || '');
          requestAnimationFrame(update);
        } else {
          counter.textContent = target + (counter.dataset.suffix || '');
        }
      };
      update();
    });
    counted = true;
  };

  // Trigger counters when hero stats visible
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  // ===== Testimonials Slider =====
  const track = document.querySelector('.testimonial-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.querySelector('.slider-dots');
  
  if (track && cards.length > 0) {
    let currentSlide = 0;
    const totalSlides = cards.length;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    const goToSlide = (index) => {
      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    };

    // Auto play
    setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      goToSlide(currentSlide);
    }, 5000);
  }

  // ===== Gallery Lightbox =====
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (galleryItems.length && lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // ===== Contact Form =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;

      // Simulate send
      setTimeout(() => {
        btn.innerHTML = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #28a745, #218838)';
        contactForm.reset();
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // ===== Active Nav Link =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ===== Smooth reveal on load =====
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
});
