// Fade-based banner slider logic
const slider          = document.getElementById('banner-slider');
const slides          = document.querySelectorAll('.slide');
const dots            = document.querySelectorAll('.dot');
const next            = document.querySelector('.arrow.next');
const prev            = document.querySelector('.arrow.prev');

// Menu toggling elements
const toggleBtn       = document.getElementById('menu-toggle');
const fullscreenMenu  = document.getElementById('fullscreen-menu');
const overlay         = document.getElementById('overlay');

// Contact form elements
const contactForm     = document.getElementById('contact-form');
const confirmation    = document.getElementById('confirmation-message');
const userNameSpan    = document.getElementById('user-name');

let index    = 0;
let interval;

// Update active slide & dot
function updateSlide(pos) {
  slides.forEach((s, i) => s.classList.toggle('active', i === pos));
  document.querySelector('.dot.active')?.classList.remove('active');
  dots[pos]?.classList.add('active');
}

// Advance one (fade)
function nextSlide() {
  index = (index + 1) % slides.length;
  updateSlide(index);
}

// Go back one (fade)
function prevSlide() {
  index = (index - 1 + slides.length) % slides.length;
  updateSlide(index);
}

// Restart the 5s auto-rotate
function resetInterval() {
  clearInterval(interval);
  interval = setInterval(nextSlide, 5000);
}

// Wire up slider controls
if (slides.length && dots.length === slides.length) {
  updateSlide(0);
  interval = setInterval(nextSlide, 5000);

  next?.addEventListener('click', () => {
    clearInterval(interval);
    nextSlide();
    resetInterval();
  });
  prev?.addEventListener('click', () => {
    clearInterval(interval);
    prevSlide();
    resetInterval();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      index = i;
      updateSlide(i);
      resetInterval();
    });
  });

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

  let startX = 0;
  slider?.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  slider?.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) < 50) return;
    clearInterval(interval);
    diff > 0 ? prevSlide() : nextSlide();
    resetInterval();
  });
}

// Quote fade in on scroll (unchanged)
const quote = document.querySelector('.quote');
if (quote) {
  window.addEventListener('scroll', () => {
    const trigger = window.innerHeight * 0.85;
    if (quote.getBoundingClientRect().top < trigger) {
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
  fullscreenMenu.querySelectorAll('a').forEach(link => {
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
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const userName = document.getElementById('name').value.trim() || 'there';
    userNameSpan.textContent = userName;
    contactForm.style.display = 'none';
    confirmation.style.display = 'block';
    setTimeout(() => confirmation.classList.add('visible'), 50);
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