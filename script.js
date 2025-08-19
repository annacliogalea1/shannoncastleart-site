// === Lightbox Setup ===
function setupLightbox({
  gallerySelector = ".masonry-gallery img, .horizontalscroll-gallery img",
  captionSelector = "#lightbox-caption",
  fadeDuration = 300
} = {}) {
  const galleryImages = Array.from(document.querySelectorAll(gallerySelector));
  const lightbox = document.getElementById("lightbox");
  let lightboxImg = document.getElementById("lightbox-img");
  const captionEl = document.querySelector(captionSelector);
  const closeBtn = lightbox.querySelector(".close");
  const prevBtn = lightbox.querySelector(".prev");
  const nextBtn = lightbox.querySelector(".next");

  let currentImageIndex = 0;

  if (!lightbox || !lightboxImg || galleryImages.length === 0) return;

  function showImage(index) {
    const img = galleryImages[index];
    lightboxImg.src = img.src;
    setupMagnifier(lightboxImg);

    lightboxImg.replaceWith(lightboxImg.cloneNode(true));
    lightboxImg = document.getElementById("lightbox-img");
    setupMagnifier(lightboxImg);

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


function setupMagnifier(lightboxImg) {
  let magnifier = document.querySelector('.magnifier-lens');
  if (!magnifier) {
    magnifier = document.createElement('div');
    magnifier.className = 'magnifier-lens';
    document.body.appendChild(magnifier);
  }

  const zoom = 2;

  function moveLens(e) {
    const rect = lightboxImg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const backgroundX = Math.max(0, x / rect.width * 100);
    const backgroundY = Math.max(0, y / rect.height * 100);

    magnifier.style.left = `${e.pageX + 20}px`;
    magnifier.style.top = `${e.pageY + 20}px`;
    magnifier.style.backgroundImage = `url('${lightboxImg.src}')`;
    magnifier.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
    magnifier.style.backgroundPosition = `${backgroundX}% ${backgroundY}%`;
    magnifier.style.display = 'block';
  }

  lightboxImg.addEventListener('mousemove', moveLens);
  lightboxImg.addEventListener('mouseenter', () => magnifier.style.display = 'block');
  lightboxImg.addEventListener('mouseleave', () => magnifier.style.display = 'none');
}