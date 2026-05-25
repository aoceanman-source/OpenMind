/* ─── NAVBAR: scroll + burger ─── */
const navbar    = document.getElementById('navbar');
const navMenu   = document.getElementById('navMenu');
const navBurger = document.getElementById('navBurger');

// Create overlay for mobile menu
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

function openMenu() {
  navMenu.classList.add('open');
  navBurger.classList.add('open');
  overlay.classList.add('show');
  navBurger.setAttribute('aria-label', '關閉選單');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navMenu.classList.remove('open');
  navBurger.classList.remove('open');
  overlay.classList.remove('show');
  navBurger.setAttribute('aria-label', '開啟選單');
  document.body.style.overflow = '';
}

navBurger.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeMenu() : openMenu();
});

overlay.addEventListener('click', closeMenu);

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ─── SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll('.reveal');

revealEls.forEach((el, i) => {
  const delay = i % 4;
  if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ─── ACTIVE NAV HIGHLIGHT ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar__nav a:not(.btn)');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ─── CONTACT FORM ─── */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple client-side validation
    const name  = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#phone').value.trim();

    if (!name || !phone) {
      alert('請填寫姓名與電話。');
      return;
    }

    // Simulate form submission (replace with actual endpoint)
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '送出中…';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.style.display = 'block';
    }, 800);
  });
}

/* ─── HERO PARALLAX (subtle) ─── */
const heroBg = document.querySelector('.hero__bg img');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });
}
