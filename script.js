// ─────────────────────────────────────────────
// DOM Ready
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  setupLightbox();
  setupBackToTop();
  setupBannerSlider();
  setupQuoteFadeIn();
  setupMenuToggle();
  setupContactForm();
});

// ─────────────────────────────────────────────
// 1. LIGHTBOX + MAGNIFIER
// ─────────────────────────────────────────────
function setupLightbox({
  gallerySelector = ".masonry-gallery img, .horizontalscroll-gallery img",
  captionSelector = "#lightbox-caption",
  fadeDuration = 300
} = {}) {
  const galleryImages = [...document.querySelectorAll(gallerySelector)];
  const lightbox = document.getElementById("lightbox");
  let lightboxImg = document.getElementById("lightbox-img");
  const captionEl = document.querySelector(captionSelector);
  const closeBtn = lightbox?.querySelector(".close");
  const prevBtn = lightbox?.querySelector(".prev");
  const nextBtn = lightbox?.querySelector(".next");

  let currentImageIndex = 0;
  if (!lightbox || !lightboxImg || galleryImages.length === 0) return;

  function showImage(index) {
    const img = galleryImages[index];
    lightboxImg.src = img.src;

    lightboxImg.replaceWith(lightboxImg.cloneNode(true));
    lightboxImg = document.getElementById("lightbox-img");
    setupMagnifier(lightboxImg);

    const caption = img.getAttribute("data-title") || img.alt || "";
    if (captionEl) {
      captionEl.textContent = caption;
      captionEl.style.opacity = "0";
      setTimeout(() => {
        captionEl.style.opacity = "1";
      }, fadeDuration);
    }
  }

  function openLightbox(index) {
    currentImageIndex = index;
    showImage(index);
    lightbox.classList.add("show");
    lightbox.style.opacity = "0";
    setTimeout(() => (lightbox.style.opacity = "1"), 10);
  }

  function closeLightbox() {
    lightbox.style.opacity = "0";
    setTimeout(() => lightbox.classList.remove("show"), fadeDuration);
  }

  function changeImage(direction) {
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    showImage(currentImageIndex);
  }

  galleryImages.forEach((img, i) => img.addEventListener("click", () => openLightbox(i)));
  closeBtn?.addEventListener("click", closeLightbox);
  prevBtn?.addEventListener("click", () => changeImage(-1));
  nextBtn?.addEventListener("click", () => changeImage(1));

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox || !lightbox.querySelector(".lightbox-inner")?.contains(e.target)) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("show")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") changeImage(1);
    if (e.key === "ArrowLeft") changeImage(-1);
  });
}

function setupMagnifier(img) {
  let lens = document.querySelector('.magnifier-lens');
  if (!lens) {
    lens = document.createElement('div');
    lens.className = 'magnifier-lens';
    document.body.appendChild(lens);
  }

  const zoom = 2;

  img.addEventListener("mousemove", e => {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    lens.style.left = `${e.pageX + 20}px`;
    lens.style.top = `${e.pageY + 20}px`;
    lens.style.backgroundImage = `url('${img.src}')`;
    lens.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
    lens.style.backgroundPosition = `${bgX}% ${bgY}%`;
    lens.style.display = "block";
  });

  img.addEventListener("mouseleave", () => lens.style.display = "none");
}

// ─────────────────────────────────────────────
// 2. BACK TO TOP
// ─────────────────────────────────────────────
function setupBackToTop() {
  const section = document.querySelector('.back-to-top-section');
  const link = document.querySelector('.back-to-top-link');

  if (!section) return;

  window.addEventListener('scroll', () => {
    section.classList.toggle('show', window.scrollY > 300);
  });

  link?.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─────────────────────────────────────────────
// 3. BANNER SLIDER
// ─────────────────────────────────────────────
function setupBannerSlider() {
  const slider = document.getElementById('banner-slider');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const next = document.querySelector('.arrow.next');
  const prev = document.querySelector('.arrow.prev');

  if (!slider || slides.length === 0 || dots.length !== slides.length) return;

  let index = 0;
  let interval;

  const updateSlide = (i) => {
    slides.forEach((s, j) => s.classList.toggle('active', j === i));
    document.querySelector('.dot.active')?.classList.remove('active');
    dots[i]?.classList.add('active');
  };

  const nextSlide = () => updateSlide(index = (index + 1) % slides.length);
  const prevSlide = () => updateSlide(index = (index - 1 + slides.length) % slides.length);

  const resetInterval = () => {
    clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
  };

  updateSlide(0);
  interval = setInterval(nextSlide, 5000);

  next?.addEventListener('click', () => { nextSlide(); resetInterval(); });
  prev?.addEventListener('click', () => { prevSlide(); resetInterval(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { index = i; updateSlide(i); resetInterval(); });
  });

  slider.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  slider.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? prevSlide() : nextSlide();
      resetInterval();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === "ArrowRight") { nextSlide(); resetInterval(); }
    else if (e.key === "ArrowLeft") { prevSlide(); resetInterval(); }
  });
}

// ─────────────────────────────────────────────
// 4. QUOTE FADE-IN
// ─────────────────────────────────────────────
function setupQuoteFadeIn() {
  const quote = document.querySelector('.quote');
  if (!quote) return;

  window.addEventListener('scroll', () => {
    const trigger = window.innerHeight * 0.85;
    if (quote.getBoundingClientRect().top < trigger) {
      quote.classList.add('visible');
      quote.style.opacity = '1';
      quote.style.transform = 'translateY(0)';
    }
  });
}

// ─────────────────────────────────────────────
// 5. MENU TOGGLE + SUBMENUS
// ─────────────────────────────────────────────
function setupMenuToggle() {
  const toggleBtn = document.getElementById('menu-toggle');
  const fullscreenMenu = document.getElementById('fullscreen-menu');
  const overlay = document.getElementById('overlay');

  if (!toggleBtn || !fullscreenMenu || !overlay) return;

  const closeMenu = () => {
    fullscreenMenu.classList.remove('show');
    overlay.classList.remove('show');
    toggleBtn.classList.remove('open');
    fullscreenMenu.querySelectorAll('.has-submenu.open').forEach(li => {
      li.classList.remove('open');
      li.querySelector('.submenu-toggle')?.setAttribute('aria-expanded', 'false');
    });
  };

  const openMenu = () => {
    fullscreenMenu.classList.add('show');
    overlay.classList.add('show');
    toggleBtn.classList.add('open');
  };

  toggleBtn.addEventListener('click', () => {
    fullscreenMenu.classList.contains('show') ? closeMenu() : openMenu();
  });

  fullscreenMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  overlay.addEventListener('click', closeMenu);

  fullscreenMenu.querySelectorAll('.has-submenu .submenu-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const li = btn.closest('.has-submenu');
      const isOpen = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
}

// ─────────────────────────────────────────────
// 6. CONTACT FORM LOGIC
// ─────────────────────────────────────────────
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const confirmation = document.getElementById('confirmation-message');
  const userName = document.getElementById('user-name');

  if (!form || !confirmation || !userName) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name')?.value.trim() || 'there';
    userName.textContent = name;
    form.style.display = 'none';
    confirmation.style.display = 'block';
    setTimeout(() => confirmation.classList.add('visible'), 50);
    setTimeout(() => {
      confirmation.classList.remove('visible');
      setTimeout(() => {
        confirmation.style.display = 'none';
        form.reset();
        form.style.display = 'flex';
      }, 600);
    }, 5000);
  });
}