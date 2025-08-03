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
const dropdown  = document.getElementById('dropdown-menu');

// Toggle open/close on click
toggleBtn.addEventListener('click', () => {
  dropdown.classList.toggle('show');
  toggleBtn.classList.toggle('open');
});

// Auto-close when clicking a link
dropdown.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    dropdown.classList.remove('show');
    toggleBtn.classList.remove('open');
  });
});

// Auto-close when clicking outside
document.addEventListener('click', e => {
  if (!toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('show');
    toggleBtn.classList.remove('open');
  }
});
