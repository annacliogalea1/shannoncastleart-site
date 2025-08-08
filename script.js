// Fade-based banner slider logic
const slider = document.getElementById('banner-slider');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const next = document.querySelector('.arrow.next');
const prev = document.querySelector('.arrow.prev');
const toggleBtn = document.getElementById('menu-toggle');
const fullscreenMenu = document.getElementById('fullscreen-menu');
const overlay = document.getElementById('overlay');
const contactForm = document.getElementById('contact-form');
const confirmation = document.getElementById('confirmation-message');
const userNameSpan = document.getElementById('user-name');

let index = 0;
let interval; 

// Update which slide/dot is active
function updateSlide(position) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === position);
  });

  const activeDot = document.querySelector('.dot.active');
  if (activeDot) activeDot.classList.remove('active');
  if (dots[position]) dots[position].classList.add('active');
}

// Jump to a slide; if `instant`, suppress the CSS fade briefly
function goToSlide(pos, instant = false) {
  if (instant) {
    slides.forEach(s => s.classList.add('no-transition'));
  }

  index = pos;
  updateSlide(index);

  if (instant) {
    requestAnimationFrame(() => {
      slides.forEach(s => s.classList.remove('no-transition'));
    });
  }
}

// Advance one slide (with normal fade)
function nextSlide() {
  goToSlide((index + 1) % slides.length);
}

// Go back one slide (with normal fade)
function prevSlide() {
  goToSlide((index - 1 + slides.length) % slides.length);
}

// Reset the 5-second auto-rotate
function resetInterval() {
  clearInterval(interval);
  interval = setInterval(nextSlide, 5000);
}

// ——— Wire up controls ——— 
if (slides.length && dots.length === slides.length) {
  // Initialize
  updateSlide(0);
  interval = setInterval(nextSlide, 5000);

  // Arrows
  if (next) {
    next.setAttribute('tabindex', '0');
    next.addEventListener('click', () => {
      clearInterval(interval);
      goToSlide((index + 1) % slides.length, true);
      resetInterval();
    });
  }
  if (prev) {
    prev.setAttribute('tabindex', '0');
    prev.addEventListener('click', () => {
      clearInterval(interval);
      goToSlide((index - 1 + slides.length) % slides.length, true);
      resetInterval();
    });
  }

  // Dots
  dots.forEach((dot, i) => {
    dot.setAttribute('tabindex', '0');
    dot.addEventListener('click', () => {
      clearInterval(interval);
      goToSlide(i, true);
      resetInterval();
    });
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      clearInterval(interval);
      nextSlide();
      resetInterval();
    } else if (e.key === 'ArrowLeft') {
      clearInterval(interval);
      prevSlide();
      resetInterval();
    }
  });

  // Touch / swipe
  let startX = 0;
  slider?.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  slider?.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (diff > 50) {
      clearInterval(interval);
      prevSlide();
      resetInterval();
    } else if (diff < -50) {
      clearInterval(interval);
      nextSlide();
      resetInterval();
    }
  });
}

// Quote fade in on scroll
const quote = document.querySelector('.quote');
if (quote) {
  window.addEventListener('scroll', () => {
    const trigger = window.innerHeight * 0.85;
    const top = quote.getBoundingClientRect().top;
    if (top < trigger) {
      quote.classList.add('visible');
      quote.style.opacity = '1';
      quote.style.transform = 'translateY(0)';
    }
  });
}

// Menu toggle logic
if (toggleBtn && fullscreenMenu && overlay) {
  toggleBtn.addEventListener('click', () => {
    fullscreenMenu.classList.toggle('show');
    overlay.classList.toggle('show');
    toggleBtn.classList.toggle('open');
  });

  fullscreenMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      fullscreenMenu.classList.remove('show');
      overlay.classList.remove('show');
      toggleBtn.classList.remove('open');
    });
  });

  overlay.addEventListener('click', () => {
    fullscreenMenu.classList.remove('show');
    overlay.classList.remove('show');
    toggleBtn.classList.remove('open');
  });
}

// Contact form logic
if (contactForm && confirmation && userNameSpan) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userName = document.getElementById('name').value.trim();
    userNameSpan.textContent = userName || 'there';

    contactForm.style.display = 'none';
    confirmation.style.display = 'block';

    // Fade-in effect
    setTimeout(() => {
      confirmation.classList.add('visible');
    }, 50);

    // Hide message + restore form after 5 seconds
    setTimeout(() => {
      confirmation.classList.remove('visible');
      setTimeout(() => {
        confirmation.style.display = 'none';
        contactForm.reset();
        contactForm.style.display = 'flex';
      }, 600);
    }, 5000);
  });
}