// Nav scroll shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .stagger').forEach(el => observer.observe(el));

// ── Hero parallax ──
const heroBgImg = document.querySelector('.hero-bg-img');
if (heroBgImg) {
  window.addEventListener('scroll', () => {
    heroBgImg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });
}

// ── Hero starfield ──
const heroSection = document.querySelector('.hero--bg');
if (heroSection) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;';
  heroSection.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, stars = [], shootingStars = [];

  function resize() {
    W = canvas.width  = heroSection.offsetWidth;
    H = canvas.height = heroSection.offsetHeight;
  }

  function initStars() {
    stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.2,
      drift: Math.random() * 0.25 + 0.04,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.018 + 0.004,
    }));
  }

  function spawnShootingStar() {
    shootingStars.push({
      x: Math.random() * W * 0.65,
      y: Math.random() * H * 0.45,
      len: 90 + Math.random() * 80,
      p: 0,
      speed: 0.022 + Math.random() * 0.014,
    });
  }

  function scheduleShootingStar() {
    setTimeout(() => { spawnShootingStar(); scheduleShootingStar(); },
      4500 + Math.random() * 5500);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // twinkling stars
    stars.forEach(s => {
      s.phase += s.phaseSpeed;
      s.y -= s.drift;
      if (s.y < 0) { s.y = H; s.x = Math.random() * W; }
      const alpha = 0.18 + Math.sin(s.phase) * 0.18;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });

    // shooting stars
    shootingStars = shootingStars.filter(s => {
      s.p += s.speed;
      if (s.p > 1.4) return false;
      const angle = Math.PI / 5;
      const dx = s.len * Math.cos(angle);
      const dy = s.len * Math.sin(angle);
      const hx = s.x + dx * Math.min(s.p, 1);
      const hy = s.y + dy * Math.min(s.p, 1);
      const tx = s.x + dx * Math.max(s.p - 0.45, 0);
      const ty = s.y + dy * Math.max(s.p - 0.45, 0);
      const fade = Math.max(0, 1 - s.p * 0.85);
      const g = ctx.createLinearGradient(tx, ty, hx, hy);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, `rgba(255,220,180,${fade})`);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(hx, hy);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      return true;
    });

    requestAnimationFrame(draw);
  }

  resize();
  initStars();
  draw();
  scheduleShootingStar();
  window.addEventListener('resize', () => { resize(); initStars(); });
}

// ── Order-ahead form → mailto ──
const sendBtn = document.getElementById('sendOrder');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name = document.getElementById('orderName').value.trim();
    const time = document.getElementById('orderTime').value.trim();
    const items = document.getElementById('orderItems').value.trim();

    if (!name) { document.getElementById('orderName').focus(); return; }
    if (!time) { document.getElementById('orderTime').focus(); return; }
    if (!items) { document.getElementById('orderItems').focus(); return; }

    const subject = encodeURIComponent(`Order Ahead – ${name} – Pickup ${time}`);
    const body = encodeURIComponent(
      `Hi Space City BBQ,\n\nName: ${name}\nPickup time: ${time}\n\nOrder:\n${items}\n\nThanks!`
    );

    window.location.href = `mailto:spacecitybbq.orders@gmail.com?subject=${subject}&body=${body}`;
  });
}
