// === Lightbox Setup ===
function setupLightbox({
  gallerySelector = ".image-gallery img, .commission-gallery img",
  captionSelector = "#lightbox-caption",
  fadeDuration = 300
} = {}) {
  const galleryImages = Array.from(document.querySelectorAll(gallerySelector));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const captionEl = document.querySelector(captionSelector);
  const closeBtn = lightbox.querySelector(".close");
  const prevBtn = lightbox.querySelector(".prev");
  const nextBtn = lightbox.querySelector(".next");

  let currentImageIndex = 0;

  if (!lightbox || !lightboxImg || galleryImages.length === 0) return;

  // ---------- Zoom Modal ----------
  let zoomModal = document.getElementById("zoom-modal");
  if (!zoomModal) {
    zoomModal = document.createElement("div");
    zoomModal.id = "zoom-modal";
    zoomModal.className = "zoom-modal";
    zoomModal.innerHTML = `
      <div class="zoom-inner">
        <button class="zoom-close" aria-label="Close zoom">×</button>
        <img id="zoom-img" alt="Zoomed detail" />
      </div>
    `;
    document.body.appendChild(zoomModal);
  }
  const zoomImg = zoomModal.querySelector("#zoom-img");
  const zoomClose = zoomModal.querySelector(".zoom-close");

  // state for zoom/pan
  let scale = 1;
  let originX = 0; // translate x
  let originY = 0; // translate y
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function applyTransform() {
    zoomImg.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
  }

  function clampPan() {
    const rect = zoomImg.getBoundingClientRect();
    const modalRect = zoomModal.getBoundingClientRect();
    const pad = 40;
    if (rect.width > modalRect.width) {
      originX = Math.min(originX, (rect.width - modalRect.width) / 2 + pad);
      originX = Math.max(originX, -((rect.width - modalRect.width) / 2 + pad));
    } else {
      originX = 0;
    }
    if (rect.height > modalRect.height) {
      originY = Math.min(originY, (rect.height - modalRect.height) / 2 + pad);
      originY = Math.max(originY, -((rect.height - modalRect.height) / 2 + pad));
    } else {
      originY = 0;
    }
  }

  function openZoom(src) {
    zoomImg.src = src;
    scale = 1.6; // initial zoom
    originX = 0;
    originY = 0;
    applyTransform();
    zoomModal.classList.add("show");
  }

  function closeZoom() {
    zoomModal.classList.remove("show");
  }

  // Wheel to zoom
  function onWheel(e) {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    const prevScale = scale;
    scale += delta > 0 ? -0.2 : 0.2;
    scale = Math.min(Math.max(scale, 1), 5);
    // Zoom toward cursor
    const rect = zoomImg.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    originX -= (cx / prevScale - cx / scale);
    originY -= (cy / prevScale - cy / scale);
    clampPan();
    applyTransform();
  }

  function onMouseDown(e) {
    if (scale === 1) return; // no drag when not zoomed
    isDragging = true;
    startX = e.clientX - originX;
    startY = e.clientY - originY;
    zoomModal.classList.add("dragging");
  }
  function onMouseMove(e) {
    if (!isDragging) return;
    originX = e.clientX - startX;
    originY = e.clientY - startY;
    clampPan();
    applyTransform();
  }
  function onMouseUp() {
    isDragging = false;
    zoomModal.classList.remove("dragging");
  }

  zoomModal.addEventListener("wheel", onWheel, { passive: false });
  zoomImg.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  zoomClose.addEventListener("click", closeZoom);
  zoomModal.addEventListener("click", (e) => {
    const inner = zoomModal.querySelector(".zoom-inner");
    if (e.target === zoomModal || (inner && !inner.contains(e.target))) {
      closeZoom();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (zoomModal.classList.contains("show") && e.key === "Escape") closeZoom();
  });

  // Hover cursor for lightbox image
  lightboxImg.style.cursor = "zoom-in";

  // Clicking the lightbox image opens the zoom modal
  lightboxImg.addEventListener("click", () => openZoom(lightboxImg.src));

  function showImage(index) {
    const img = galleryImages[index];
    lightboxImg.src = img.src;

    // Caption support
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
    showImage(currentImageIndex);
    lightbox.classList.add("show");
    lightbox.style.opacity = "0";
    setTimeout(() => (lightbox.style.opacity = "1"), 10);
  }

  function closeLightbox() {
    lightbox.style.opacity = "0";
    setTimeout(() => {
      lightbox.classList.remove("show");
    }, fadeDuration);
  }

  function changeImage(direction) {
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    showImage(currentImageIndex);
  }

  galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
  });

  closeBtn?.addEventListener("click", closeLightbox);
  prevBtn?.addEventListener("click", () => changeImage(-1));
  nextBtn?.addEventListener("click", () => changeImage(1));

  lightbox.addEventListener("click", (e) => {
  const inner = lightbox.querySelector(".lightbox-inner");
  if (e.target === lightbox || (inner && !inner.contains(e.target))) {
    closeLightbox();
  }
});

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("show")) return;

    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowRight":
        changeImage(1);
        break;
      case "ArrowLeft":
        changeImage(-1);
        break;
    }
  });
}

// === DOM READY ===
document.addEventListener("DOMContentLoaded", () => {
  setupLightbox();

  // Banner slider logic
  const slider = document.getElementById('banner-slider');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const next = document.querySelector('.arrow.next');
  const prev = document.querySelector('.arrow.prev');

  let index = 0;
  let interval;

  function updateSlide(pos) {
    slides.forEach((s, i) => s.classList.toggle('active', i === pos));
    document.querySelector('.dot.active')?.classList.remove('active');
    dots[pos]?.classList.add('active');
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

  // Quote fade-in
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

  // Menu toggle
  const toggleBtn = document.getElementById('menu-toggle');
  const fullscreenMenu = document.getElementById('fullscreen-menu');
  const overlay = document.getElementById('overlay');

  if (toggleBtn && fullscreenMenu && overlay) {
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

  // Contact form logic
  const contactForm = document.getElementById('contact-form');
  const confirmation = document.getElementById('confirmation-message');
  const userNameSpan = document.getElementById('user-name');

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
});