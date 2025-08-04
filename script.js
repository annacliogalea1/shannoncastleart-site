const bannerImages = [
  'images/banner1.jpg',
  'images/banner2.jpg',
  'images/banner3.jpg'
];

let current = 0;
const banner = document.getElementById('banner-image');

setInterval(() => {
  current = (current + 1) % bannerImages.length;
  banner.src = bannerImages[current];
}, 4000);

const toggleBtn = document.getElementById('menu-toggle');
const fullscreenMenu = document.getElementById('fullscreen-menu');
const overlay = document.getElementById('overlay');

// Toggle menu + overlay
toggleBtn.addEventListener('click', () => {
  fullscreenMenu.classList.toggle('show');
  overlay.classList.toggle('show');
  toggleBtn.classList.toggle('open');
});

// Close when clicking a link
fullscreenMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    fullscreenMenu.classList.remove('show');
    overlay.classList.remove('show');
    toggleBtn.classList.remove('open');
  });
});

// Close when clicking outside (on overlay)
overlay.addEventListener('click', () => {
  fullscreenMenu.classList.remove('show');
  overlay.classList.remove('show');
  toggleBtn.classList.remove('open');
});

const contactForm = document.getElementById('contact-form');
const confirmation = document.getElementById('confirmation-message');
const userNameSpan = document.getElementById('user-name');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page reload

  const userName = document.getElementById('name').value.trim();
  userNameSpan.textContent = userName || 'there'; // Fallback if name is blank

  contactForm.style.display = 'none';
  confirmation.style.display = 'block';

  setTimeout(() => {
    confirmation.classList.add('visible');
  }, 50);

  setTimeout(() => {
    confirmation.classList.remove('visible');
    setTimeout(() => {
      confirmation.style.display = 'none';
      contactForm.reset();
      contactForm.style.display = 'flex';
    }, 600);
  }, 5000);
});