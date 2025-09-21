// ─────────────────────────────────────────────
// PAGE CONTEXT DETECTION
// ─────────────────────────────────────────────
function getPageContext() {
  return document.body?.dataset?.page || 'default';
}

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
  const lightboxInner = lightbox?.querySelector(".lightbox-inner");
  const lightboxImg = document.getElementById("lightbox-img");
  const captionEl = document.querySelector(captionSelector);
  const closeBtn = lightbox?.querySelector(".close");
  const prevBtn = lightbox?.querySelector(".prev");
  const nextBtn = lightbox?.querySelector(".next");

  let currentImageIndex = 0;
  if (!lightbox || !lightboxImg || galleryImages.length === 0) return;

  function showImage(index) {
    const img = galleryImages[index];
    lightboxImg.src = img.src;
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

  // Unified click-to-close handler with exclusions
  lightbox.addEventListener("click", (e) => {
    const isInside = e.target.closest(".lightbox-inner");
    const isArrow = e.target.closest(".prev, .next");
    const isTapZone = e.target.closest(".tap-zone");
    if (!isInside && !isArrow && !isTapZone) {
      closeLightbox();
    }
  });

  // Mobile tap-zone navigation
  const tapLeft = document.createElement("div");
  tapLeft.className = "tap-zone tap-left";
  const tapRight = document.createElement("div");
  tapRight.className = "tap-zone tap-right";

  lightboxInner?.appendChild(tapLeft);
  lightboxInner?.appendChild(tapRight);

  tapLeft.addEventListener("click", (e) => {
    e.stopPropagation();
    changeImage(-1);
  });

  tapRight.addEventListener("click", (e) => {
    e.stopPropagation();
    changeImage(1);
  });

  document.addEventListener("keydown", (e) => {
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
// 7. TABBED MENU (Selected Works / Collections / Exhibitions / Contact)
// ─────────────────────────────────────────────
function setupTabbedMenu() {
  const tabLinks = [...document.querySelectorAll('.tab-link')];
  const panels = [
    document.getElementById('selected-works'),
    document.getElementById('collections'),
    document.getElementById('exhibitions'),
    document.getElementById('contact')
  ].filter(Boolean);

  if (tabLinks.length === 0 || panels.length === 0) return;

  const byHash = (hash) => tabLinks.find(a => a.getAttribute('href') === hash);

  function activate(targetId, opts = { scroll: true }) {
    // Toggle active class + aria for tabs
    tabLinks.forEach(a => {
      const isActive = a.getAttribute('href') === `#${targetId}`;
      a.classList.toggle('is-active', isActive); 
      a.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Handle panel visibility and animations
    panels.forEach(p => {
      const show = p.id === targetId;

      if (show) {
        // Show the panel
        p.hidden = false;
        p.classList.remove('fade-in', 'showing');
        
        // Force reflow to ensure hidden attribute is processed
        p.offsetHeight;
        
        // Start fade-in animation
        p.classList.add('fade-in');
        
        // Trigger the showing class after a brief delay
        requestAnimationFrame(() => {
          p.classList.add('showing');
        });

        // Handle Selected Works grid reflow fix
        if (targetId === 'selected-works') {
          const grid = document.querySelector('#selected-works .selected-works-grid');
          if (grid) {
            grid.style.display = 'none';
            grid.offsetHeight;
            grid.style.display = '';
          }
        }
      } else {
        // Hide the panel
        p.classList.remove('showing');
        
        // Wait for transition to complete before hiding
        setTimeout(() => {
          if (!p.classList.contains('showing')) {
            p.hidden = true;
            p.classList.remove('fade-in');
          }
        }, 300);
      }
    });

    // Update URL hash without jumping
    if (history.pushState) {
      history.pushState(null, '', `#${targetId}`);
    }
  }

  // Click handling
  tabLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      activate(id);
    });
  });

  // Deep-link support and initial load
  const initialHash = window.location.hash && window.location.hash.trim();
  const initialTab = byHash(initialHash) ? initialHash.slice(1) : 'selected-works';
  activate(initialTab, { scroll: false });

  // Set initial state immediately
  activate(initial, { scroll: false });
}
 
// Instagram scroll buttons
document.querySelectorAll('.insta-arrow').forEach(btn => {
  btn.addEventListener('click', () => {
    const track = document.getElementById('instaTrack');
    const scrollAmount = 240; // adjust based on image width + margin
    track.scrollBy({
      left: btn.classList.contains('left') ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  });
});

// ─────────────────────────────────────────────
// COLLECTIONS PAGE INTERACTIVITY
// ─────────────────────────────────────────────
function setupCollectionsTabs() {
  const list = document.getElementById('collectionList');
  const buttons = list?.querySelectorAll('button');
  const galleries = document.querySelectorAll('.collection-gallery');

  if (!list || buttons.length === 0 || galleries.length === 0) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleries.forEach(g => g.classList.remove('active'));
      const target = document.getElementById(btn.dataset.target);
      if (target) {
        target.classList.add('active');

        // Reinitialize lightbox to include newly shown images
        setupLightbox({
          gallerySelector: '.collection-gallery.active img'
        });
      }
    });
  });

  // Run on page load for the default gallery
  setupLightbox({
    gallerySelector: '.collection-gallery.active img'
  });
}

// ─────────────────────────────────────────────
// Video Lightbox
// ─────────────────────────────────────────────
function setupVideoLightbox() {
  console.log("Video lightbox setup running");

  const videoWrapper = document.querySelector('.video-wrapper');
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const captionEl = document.getElementById("lightbox-caption");
  const fadeDuration = 300;

  if (!videoWrapper || !lightbox || !captionEl) {
    console.error("One or more required elements are missing");
    return;
  }

  function closeLightbox() {
    lightbox.style.opacity = "0";
    setTimeout(() => {
      lightbox.classList.remove("show", "video-mode");
      const video = lightbox.querySelector("video");
      if (video) {
        video.remove();
        const img = document.createElement("img");
        img.id = "lightbox-img";
        img.classList.add("lightbox-content");
        lightbox.insertBefore(img, captionEl);
      }
    }, fadeDuration);
  }

  videoWrapper.addEventListener("click", () => {
    console.log("Video wrapper clicked");

    const videoEl = document.createElement("video");
    videoEl.src = "images/1958 Duo-Glide Shannon Connor Castle-ForWeb.mp4";
    videoEl.controls = true;
    videoEl.autoplay = true;
    videoEl.style.maxWidth = "90vw";
    videoEl.style.maxHeight = "90vh";
    videoEl.style.display = "block";

    const current = lightbox.querySelector("img, video");
    if (current) current.remove();
    lightbox.insertBefore(videoEl, captionEl);

    captionEl.textContent = "";
    lightbox.classList.add("show", "video-mode");
    lightbox.style.opacity = "0";
    setTimeout(() => (lightbox.style.opacity = "1"), 10);
  });
}

// ─────────────────────────────────────────────
// Contact Form Logic
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const confirmation = document.getElementById('confirmation-message');

  if (form && confirmation) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // prevent real submission during testing

      // Show confirmation message
      confirmation.classList.add('show');

      // Reset the form
      form.reset();
    });
  }
});

// ─────────────────────────────────────────────
// DOM Ready
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  setupLightbox();
  setupBackToTop();
  setupBannerSlider();
  setupMenuToggle();
  setupTabbedMenu();
  setupVideoLightbox();
  setupContactForm();

  const page = getPageContext();
  if (page === 'collections') {
    setupCollectionsTabs();
  }

});