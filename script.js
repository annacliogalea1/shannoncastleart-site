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
let interval; // reserve the variable

function updateSlide(position) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === position);
  });

  const activeDot = document.querySelector('.dot.active');
  if (activeDot) activeDot.classList.remove('active');
  if (dots[position]) dots[position].classList.add('active');
}

function nextSlide() {
  index = (index + 1) % slides.length;
  updateSlide(index);
}

function prevSlide() {
  index = (index - 1 + slides.length) % slides.length;
  updateSlide(index);
}

function resetInterval() {
  clearInterval(interval);
  interval = setInterval(nextSlide, 5000);
}

// Initialize slider if elements exist
if (slides.length > 0 && dots.length === slides.length) {
  updateSlide(index); // set initial active slide/dot
  interval = setInterval(nextSlide, 5000);
}

// Arrow click handlers with guards
if (next) {
  next.setAttribute('tabindex', '0');
  next.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });
}

if (prev) {
  prev.setAttribute('tabindex', '0');
  prev.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });
}

// Dot click handlers
dots.forEach((dot, i) => {
  dot.setAttribute('tabindex', '0');
  dot.addEventListener('click', () => {
    index = i;
    updateSlide(index);
    resetInterval();
  });
});

// Keyboard support: left/right arrows
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    nextSlide();
    resetInterval();
  } else if (e.key === 'ArrowLeft') {
    prevSlide();
    resetInterval();
  }
});

// Touch/swipe support
let startX = 0;
let endX = 0;

if (slider) {
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, false);

  slider.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (diff > 50) {
      prevSlide();
      resetInterval();
    }
    if (diff < -50) {
      nextSlide();
      resetInterval();
    }
  }, false);
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