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

// ─── Fullscreen Menu ───────────────────────────
const toggleBtn = document.getElementById('menu-toggle');
const fullscreenMenu = document.getElementById('fullscreen-menu');

// Toggle menu
toggleBtn.addEventListener('click', () => {
  fullscreenMenu.classList.toggle('show');
  toggleBtn.classList.toggle('open');
});

// Close menu when clicking a link
fullscreenMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    fullscreenMenu.classList.remove('show');
    toggleBtn.classList.remove('open');
  });
});

// Close when clicking outside
document.addEventListener('click', (e) => {
  const clickedInsideToggle = toggleBtn.contains(e.target);
  const clickedInsideMenu = fullscreenMenu.contains(e.target);

  if (!clickedInsideToggle && !clickedInsideMenu && fullscreenMenu.classList.contains('show')) {
    fullscreenMenu.classList.remove('show');
    toggleBtn.classList.remove('open');
  }
});
