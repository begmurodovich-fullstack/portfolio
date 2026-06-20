// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  menuBtn.innerHTML = mobileMenu.classList.contains('hidden')
    ? '<i class="fa-solid fa-bars"></i>'
    : '<i class="fa-solid fa-xmark"></i>';
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

// ===== Scroll-driven background color transition (Wow Factor) =====
const sections = document.querySelectorAll('section[data-bg]');
const root = document.documentElement;

function updateBackground() {
  const scrollPos = window.scrollY + window.innerHeight / 2;
  let current = sections[0];
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollPos) {
      current = sec;
    }
  });
  const color = current.getAttribute('data-bg');
  root.style.setProperty('--bg-color', color);
}

// ===== Reveal-on-scroll animations =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== Active nav link highlight =====
const navLinks = document.querySelectorAll('.nav-link');
function updateActiveNav() {
  const scrollPos = window.scrollY + window.innerHeight / 3;
  let currentId = '';
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollPos) currentId = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
  });
}

// Navbar glass intensity on scroll
const navbar = document.getElementById('navbar');
function updateNavbarShadow() {
  if (window.scrollY > 40) {
    navbar.classList.add('shadow-xl', 'shadow-black/30');
  } else {
    navbar.classList.remove('shadow-xl', 'shadow-black/30');
  }
}

let ticking = false;
function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateBackground();
      updateActiveNav();
      updateNavbarShadow();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', () => {
  updateBackground();
  updateActiveNav();
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add('visible');
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId.length > 1) {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    }
  });
});
