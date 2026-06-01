export function initRevealAnimations() {
  const revealItems = [...document.querySelectorAll("[data-reveal]")];

  if (!revealItems.length) {
    return;
  }

  const supportsObserver = "IntersectionObserver" in window;

  revealItems.forEach((item, index) => {
    item.classList.add("transform-gpu");
    item.style.transitionProperty = "transform, opacity";
    item.style.transitionDuration = "700ms";
    item.style.transitionTimingFunction = "cubic-bezier(0, 0, 0.2, 1)";
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;

    if (supportsObserver) {
      item.classList.add("translate-y-6", "opacity-0");
    }
  });

  if (!supportsObserver) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.remove("translate-y-6", "opacity-0");
        entry.target.classList.add("translate-y-0", "opacity-100");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealItems.forEach((item) => observer.observe(item));
}