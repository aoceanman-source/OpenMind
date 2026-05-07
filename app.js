/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
const scrollThreshold = 40;

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > scrollThreshold);
}, { passive: true });

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll(
  '.pain-card, .service-item, .step, .result-card, .promise-card, .testimonial-card, .faq-item'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Counter animation ── */
const counters = document.querySelectorAll('.counter');
let countersStarted = false;

const startCounters = () => {
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
};

const counterSection = document.querySelector('.results');
if (counterSection) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      startCounters();
    }
  }, { threshold: 0.3 }).observe(counterSection);
}

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const answer = btn.nextElementSibling;

    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });

    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

/* ── Contact form ── */
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }
  });

  if (!valid) return;

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = '送出中…';
  btn.disabled = true;

  setTimeout(() => {
    form.innerHTML = `
      <div class="form-success show">
        <p style="font-size:2.5rem;margin-bottom:16px">🎉</p>
        <h3>已收到你的訊息！</h3>
        <p>我會在 24 小時內主動聯絡你，<br>期待和你聊聊怎麼幫你省時間！</p>
      </div>
    `;
  }, 1000);
});
