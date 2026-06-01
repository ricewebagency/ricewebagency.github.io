export function initMarquee() {
  const marquee = document.querySelector("[data-marquee]");

  if (!(marquee instanceof HTMLElement)) {
    return;
  }

  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    marquee.classList.add("is-reduced-motion");
  }
}