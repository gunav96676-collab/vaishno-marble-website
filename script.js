/* script.js
   Mobile menu, lightbox, filters, footer years, and simple animations.
   Place this file next to your HTML files and include with:
   <script defer src="script.js"></script>
*/

document.addEventListener('DOMContentLoaded', function () {
  /* ---------- footer year ---------- */
  try {
    document.querySelectorAll('#year, #yearAbout, #yearProducts, #yearContact').forEach(el => {
      if (el) el.textContent = new Date().getFullYear();
    });
  } catch (e) { console.warn('Year set failed', e); }

  /* ---------- mobile menu toggle ---------- */
  (function setupHamburgers() {
    const buttons = document.querySelectorAll('.hamburger');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // try aria-controls first
        let targetId = btn.getAttribute('aria-controls');
        let menu = targetId ? document.getElementById(targetId) : null;

        // fallback: if button id is hamburgerAbout -> mobileMenuAbout
        if (!menu && btn.id) {
          const derived = btn.id.replace(/^hamburger/i, 'mobileMenu');
          menu = document.getElementById(derived);
        }

        // fallback: any .mobile-menu on page
        if (!menu) menu = document.querySelector('.mobile-menu');

        if (!menu) return;

        const isHidden = menu.getAttribute('aria-hidden') === 'true';
        menu.setAttribute('aria-hidden', String(!isHidden));
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
      });
    });
  })();

  /* ---------- lightbox for gallery images ---------- */
  (function lightboxHandler() {
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');

    if (!lightbox || !lbImg) return;

    function open(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lightbox.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
    }
    function close() {
      lightbox.setAttribute('aria-hidden', 'true');
      lbImg.src = '';
      document.documentElement.style.overflow = '';
    }

    document.querySelectorAll('.gallery-item').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const src = btn.dataset.src || btn.getAttribute('data-src');
        const alt = (btn.querySelector('img') && btn.querySelector('img').alt) || '';
        if (src) open(src, alt);
      });
    });

    // close controls
    document.querySelectorAll('.lightbox-close').forEach(b => b.addEventListener('click', close));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  })();

  /* ---------- product filters (client-side) ---------- */
  (function productFilters() {
    const chips = document.querySelectorAll('.chip');
    const cards = document.querySelectorAll('.product-card');

    if (!chips.length || !cards.length) return;

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const filter = chip.dataset.filter || 'all';
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        cards.forEach(card => {
          if (filter === 'all') {
            card.style.display = '';
            return;
          }
          const size = card.dataset.size || '';
          card.style.display = (size === filter) ? '' : 'none';
        });
      });
    });
  })();

  /* ---------- fade-in on scroll using IntersectionObserver ---------- */
  (function fadeIn() {
    const items = document.querySelectorAll('.fade-in');
    if (!items.length) return;
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -50px 0px' });

    items.forEach(i => obs.observe(i));
  })();

  /* ---------- simple nav active highlight (based on path) ---------- */
  (function navActive() {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href && (href === path || (href === 'index.html' && path === ''))) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  })();

  /* ---------- small debug helper (prints to console if CSS loaded) ---------- */
  console.info('script.js loaded — DOM ready');
});
