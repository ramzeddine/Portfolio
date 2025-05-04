/*
 * script.js - Version Professionnelle
 * Portfolio de Ramzeddine Bousnane
 * Travail valorisé à 30 000$
 * Organisé, commenté et optimisé pour la performance & maintenabilité
 */

'use strict';

// ========== CONSTANTES & CONFIG ==========
const SELECTORS = {
  themeToggle: '#theme-toggle',
  navToggle: '.nav-toggle',
  siteNav: '.site-nav',
  navLinks: '.nav-list a',
  sections: 'section',
  fadeInElements: '.fade-in',
  canvasIds: ['bg-canvas', 'hero-canvas', 'about-canvas'],
  timelineYear: '#year',
  contactForm: '.contact-form'
};

const COLORS = {
  blue: '#3b82f6',
  accent: '#60a5fa'
};

// ========== UTILITAIRES ==========
/**
 * Debounce: limite la fréquence d'appel d'une fonction
 */
function debounce(fn, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Smooth scrolling to an element
 */
function smoothScrollTo(targetSelector, offset = 70) {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

// ========== THEME (clair/sombre) ==========
const Theme = (() => {
  const root = document.documentElement;
  const toggleBtn = document.querySelector(SELECTORS.themeToggle);
  const storageKey = 'theme';

  // Initialisation du thème
  function init() {
    const saved = localStorage.getItem(storageKey);
    if (saved) root.setAttribute('data-theme', saved);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.setAttribute('data-theme', 'dark');
    }
    updateToggleBtn();
    toggleBtn.addEventListener('click', switchTheme);
  }

  // Alterne Theme
  function switchTheme() {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(storageKey, next);
    updateToggleBtn();
  }

  // Met à jour l'icône du bouton
  function updateToggleBtn() {
    const icon = toggleBtn.querySelector('i');
    if (root.getAttribute('data-theme') === 'dark') {
      icon.classList.replace('fa-moon', 'fa-sun');
      toggleBtn.setAttribute('aria-pressed', 'true');
    } else {
      icon.classList.replace('fa-sun', 'fa-moon');
      toggleBtn.setAttribute('aria-pressed', 'false');
    }
  }

  return { init };
})();

// ========== NAVIGATION MOBILE ==========
const Navigation = (() => {
  const toggleBtn = document.querySelector(SELECTORS.navToggle);
  const nav = document.querySelector(SELECTORS.siteNav);

  function init() {
    toggleBtn.addEventListener('click', () => {
      const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
    // Smooth scroll for nav links
    document.querySelectorAll(SELECTORS.navLinks).forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        smoothScrollTo(href);
        // close nav on mobile
        if (nav.classList.contains('open')) toggleBtn.click();
      });
    });
  }

  return { init };
})();

// ========== CANVAS DYNAMIQUES ==========
const CanvasBG = (() => {
  let canvases = [];

  function init() {
    canvases = SELECTORS.canvasIds.map(id => {
      const c = document.getElementById(id);
      if (!c) return null;
      return { canvas: c, ctx: c.getContext('2d'), parts: [] };
    }).filter(x => x);
    window.addEventListener('resize', debounce(resizeAll, 200));
    resizeAll();
    animate();
  }

  function resizeAll() {
    canvases.forEach(({ canvas, ctx, parts }, idx) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      parts.length = 0;
      const count = Math.min((w * h) / 8000 | 0, 80);
      for (let i = 0; i < count; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          r: Math.random() * 2 + 1
        });
      }
    });
  }

  function animate() {
    canvases.forEach(({ canvas, ctx, parts }, idx) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = idx === 2 ? COLORS.accent : COLORS.blue;
      parts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    requestAnimationFrame(animate);
  }

  return { init };
})();

// ========== ANIMATIONS AU DÉFILEMENT (IntersectionObserver) ==========
const ScrollAnimations = (() => {
  function init() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll(SELECTORS.fadeInElements)
      .forEach(el => observer.observe(el));
  }

  return { init };
})();

// ========== MISE À JOUR DE L'ANNÉE DANS LE FOOTER ==========
function updateYear() {
  const el = document.querySelector(SELECTORS.timelineYear);
  if (el) el.textContent = new Date().getFullYear();
}

// ========== VALIDATION FORMULAIRE ==========
function bindContactForm() {
  const form = document.querySelector(SELECTORS.contactForm);
  if (!form) return;
  form.addEventListener('submit', e => {
    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const msg = form.elements['message'].value.trim();
    if (!name || !email || !msg) {
      e.preventDefault();
      alert('Veuillez remplir tous les champs avant d’envoyer.');
    }
    // TODO: intégration AJAX / endpoint server
  });
}

// ========== INITIALISATION GLOBALE ==========
function initAll() {
  Theme.init();
  Navigation.init();
  CanvasBG.init();
  ScrollAnimations.init();
  updateYear();
  bindContactForm();
}

document.addEventListener('DOMContentLoaded', initAll);

// ========== SERVICE WORKER (PWA) ==========
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered: ', reg))
      .catch(err => console.error('SW registration failed: ', err));
  });
}

// ~200 lignes (commentaires inclus). Ajoutez des modules ES ou fonctionnalités si nécessaire.
