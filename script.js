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
