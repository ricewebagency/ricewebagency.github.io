const ACTIVE_CLASSES = ['text-black', 'font-extrabold', 'border-r-4', 'border-[#daf9a0]', 'rounded-r-sm'];

export function initProcesNav() {
  const nav = document.querySelector('[data-proces-nav]');
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const sectionIds = links.map((a) => a.getAttribute('href').slice(1));
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  if (!sections.length) return;

  function setActive(id) {
    links.forEach((a) => {
      const isActive = a.getAttribute('href') === `#${id}`;
      ACTIVE_CLASSES.forEach((cls) => {
        if (isActive) a.classList.add(cls);
        else a.classList.remove(cls);
      });
    });
  }

  function update() {
    const header = document.querySelector('[data-site-header]');
    const offset = (header ? header.offsetHeight : 96) + 32;
    const scrollY = window.scrollY + offset;

    let current = sections[0].id;
    for (const section of sections) {
      if (section.offsetTop <= scrollY) {
        current = section.id;
      }
    }
    setActive(current);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}
