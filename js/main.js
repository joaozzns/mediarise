/* ============================================================
   MediaRise — interações da página
   ============================================================ */

/* ---------- Header scroll ---------- */
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
burger.addEventListener('click', () => document.body.classList.toggle('menu-open'));
document.querySelectorAll('#mobileMenu a').forEach(a =>
  a.addEventListener('click', () => document.body.classList.remove('menu-open'))
);

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- Counters ---------- */
const fmt = (n, dec) => dec > 0 ? n.toFixed(dec) : Math.round(n).toLocaleString('pt-BR');
const animateCount = (el) => {
  const target = parseFloat(el.dataset.count);
  const dec = (el.dataset.count.split('.')[1] || '').length;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const dur = 1500;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + fmt(target * eased, dec) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
  });
}, { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* ---------- Gauge ring ---------- */
const arc = document.getElementById('gaugeArc');
const gio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      arc.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.2,.7,.2,1)';
      arc.style.strokeDashoffset = 628 - (628 * 0.94);
      gio.unobserve(e.target);
    }
  });
}, { threshold: .5 });
if (arc) gio.observe(arc);

/* ---------- FAQ ---------- */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const a = q.nextElementSibling;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq').forEach(f => {
      f.classList.remove('open');
      f.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});

/* ---------- Card spotlight (throttle com requestAnimationFrame) ---------- */
document.querySelectorAll('.card.interactive').forEach(card => {
  let ticking = false;
  card.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      ticking = false;
    });
  }, { passive: true });
});

/* ---------- Animate hero bars on load ---------- */
addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('#bars .bar').forEach((b, i) => {
      const h = b.style.height;
      b.style.height = '0';
      setTimeout(() => { b.style.height = h; }, i * 70);
    });
  }, 300);
});
