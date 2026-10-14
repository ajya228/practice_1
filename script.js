// ===================== MOBILE NAV TOGGLE =====================
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ===================== PROJECT POP-UP + GALLERY =====================
const modal = document.getElementById('project-modal');
const modalTag = document.getElementById('modal-tag');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalYear = document.getElementById('modal-year');
const modalTools = document.getElementById('modal-tools');
const modalCta = document.getElementById('modal-cta');
const modalClose = document.getElementById('modal-close');

const galleryImage = document.getElementById('gallery-image');
const galleryPrev = document.getElementById('gallery-prev');
const galleryNext = document.getElementById('gallery-next');
const galleryCount = document.getElementById('gallery-count');
const galleryThumbs = document.getElementById('gallery-thumbs');

let images = [];
let current = 0;
let projectTitle = '';

function showImage(index, direction) {
  current = (index + images.length) % images.length;
  galleryImage.src = images[current];
  galleryImage.alt = `${projectTitle}: изображение ${current + 1} из ${images.length}`;
  galleryCount.textContent = `${current + 1} / ${images.length}`;

  galleryThumbs.querySelectorAll('button').forEach((btn, i) => {
    const active = i === current;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-current', active);
  });

  if (direction) {
    galleryImage.classList.remove('slide-next', 'slide-prev');
    void galleryImage.offsetWidth; // restart the animation
    galleryImage.classList.add(direction === 'next' ? 'slide-next' : 'slide-prev');
  }
}

function buildThumbs() {
  galleryThumbs.innerHTML = '';
  images.forEach((src, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-thumb';
    btn.setAttribute('aria-label', `Показать изображение ${i + 1}`);
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    btn.appendChild(img);
    btn.addEventListener('click', () => showImage(i, i > current ? 'next' : 'prev'));
    galleryThumbs.appendChild(btn);
  });
}

function openProject(tile) {
  projectTitle = tile.dataset.title || '';
  images = (tile.dataset.images || '').split(',').map((s) => s.trim()).filter(Boolean);

  modalTag.textContent = tile.dataset.tag || '';
  modalTitle.textContent = projectTitle;
  modalDesc.textContent = tile.dataset.desc || '';
  modalYear.textContent = tile.dataset.year || '';
  modalTools.textContent = tile.dataset.tools || '';

  const hasGallery = images.length > 0;
  galleryImage.hidden = !hasGallery;
  galleryPrev.hidden = galleryNext.hidden = images.length < 2;
  galleryThumbs.hidden = images.length < 2;

  if (hasGallery) {
    buildThumbs();
    showImage(0);
  }

  document.documentElement.classList.add('modal-open');
  modal.showModal();
}

document.querySelectorAll('.project-tile').forEach((tile) => {
  tile.addEventListener('click', () => openProject(tile));
});

galleryPrev.addEventListener('click', () => showImage(current - 1, 'prev'));
galleryNext.addEventListener('click', () => showImage(current + 1, 'next'));

document.addEventListener('keydown', (e) => {
  if (!modal.open || images.length < 2) return;
  if (e.key === 'ArrowLeft') showImage(current - 1, 'prev');
  if (e.key === 'ArrowRight') showImage(current + 1, 'next');
});

modalClose.addEventListener('click', () => modal.close());
modalCta.addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.close(); // click on the backdrop
});
modal.addEventListener('close', () => {
  document.documentElement.classList.remove('modal-open');
});

// ===================== SCROLL REVEAL =====================
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document
    .querySelectorAll('.project-grid li, .timeline li, .contact-text, .contact-form')
    .forEach((el) => {
      const position = Array.from(el.parentElement.children).indexOf(el);
      el.classList.add('reveal');
      el.style.setProperty('--d', `${(position % 3) * 0.08}s`);
      observer.observe(el);
    });
}
