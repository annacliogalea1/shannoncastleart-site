// Fade-based banner slider logic
const slider = document.getElementById('banner-slider');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const next = document.querySelector('.arrow.next');
const prev = document.querySelector('.arrow.prev');
const toggleBtn = document.getElementById('menu-toggle');
const fullscreenMenu = document.getElementById('fullscreen-menu');
const overlay = document.getElementById('overlay');
let index = 0;

updateSlide(index);
let interval = setInterval(nextSlide, 5000);

function updateSlide(position) {
  slides.forEach((slide, i) => {
    slide.style.opacity = i === position ? '1' : '0';
    slide.style.zIndex = i === position ? '2' : '1';
  });
  document.querySelector('.dot.active')?.classList.remove('active');
  dots[position].classList.add('active');
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

next.addEventListener('click', () => {
  nextSlide();
  resetInterval();
});

prev.addEventListener('click', () => {
  prevSlide();
  resetInterval();
});

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    index = i;
    updateSlide(index);
    resetInterval();
  });
});

// Touch/swipe support
let startX = 0;
let endX = 0;

slider.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
}, false);

slider.addEventListener("touchend", (e) => {
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

// Quote fade in on scroll
const quote = document.querySelector('.quote');
window.addEventListener('scroll', () => {
  const trigger = window.innerHeight * 0.85;
  const top = quote.getBoundingClientRect().top;
  if (top < trigger) {
    quote.classList.add('visible');
    quote.style.opacity = '1';
    quote.style.transform = 'translateY(0)';
  }
});

// Menu toggle logic
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

// Contact form logic
const contactForm = document.getElementById('contact-form');
const confirmation = document.getElementById('confirmation-message');
const userNameSpan = document.getElementById('user-name');

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