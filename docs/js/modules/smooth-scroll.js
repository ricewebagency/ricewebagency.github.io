import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.mjs';

export function initSmoothScroll() {
  const lenis = new Lenis();

  function getHeaderOffset() {
    const header = document.querySelector('[data-site-header]');
    return header ? header.offsetHeight + 16 : 96;
  }

  function scrollToHash(hash, updateHistory = false) {
    if (!hash || hash === '#') return;

    const id = hash.startsWith('#') ? hash.slice(1) : hash;
    const target = document.getElementById(id);
    if (!target) return;

    lenis.scrollTo(target, {
      offset: -getHeaderOffset(),
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    if (updateHistory && window.location.hash !== hash) {
      history.pushState(null, '', hash);
    }
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    event.preventDefault();
    scrollToHash(href, true);
  });

  if (window.location.hash) {
    requestAnimationFrame(() => {
      scrollToHash(window.location.hash);
    });
  }

  window.addEventListener('hashchange', () => {
    scrollToHash(window.location.hash);
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}
