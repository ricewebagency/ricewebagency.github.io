export function initBrandCarousel() {
  const root = document.querySelector("[data-brand-carousel]");
  const track = root?.querySelector("[data-brand-track]");
  const slides = root ? [...root.querySelectorAll("[data-brand-slide]")] : [];
  const prevButton = root?.querySelector("[data-brand-prev]");
  const nextButton = root?.querySelector("[data-brand-next]");
  const navButtons = root ? [...root.querySelectorAll("[data-brand-dot]")] : [];
  const counter = root?.querySelector("[data-brand-counter]");
  const status = root?.querySelector("[data-brand-status]");

  if (!root || !track || !slides.length || !prevButton || !nextButton) {
    return;
  }

  let currentIndex = 0;
  let autoplayId = null;
  const total = slides.length;
  const hasReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const update = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", index === currentIndex ? "false" : "true");
    });

    navButtons.forEach((button, index) => {
      const isActive = index === currentIndex;
      button.classList.toggle("bg-blue-600", isActive);
      button.classList.toggle("text-white", isActive);
      button.classList.toggle("border-blue-600", isActive);
      button.classList.toggle("shadow-lg", isActive);
      button.classList.toggle("shadow-blue-200/80", isActive);
      button.classList.toggle("bg-slate-50", !isActive);
      button.classList.toggle("text-slate-700", !isActive);
      button.classList.toggle("border-slate-200", !isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (counter) {
      counter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    }

    if (status) {
      const activeSlide = slides[currentIndex];
      const name = activeSlide.dataset.brandName ?? "";
      const summary = activeSlide.dataset.brandSummary ?? "";
      status.textContent = summary ? `${name} · ${summary}` : name;
    }
  };

  const goTo = (index) => {
    currentIndex = (index + total) % total;
    update();
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  const stopAutoplay = () => {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  const startAutoplay = () => {
    if (hasReducedMotion || autoplayId) {
      return;
    }

    autoplayId = window.setInterval(() => {
      next();
    }, 4200);
  };

  const handleManualNavigation = (callback) => {
    stopAutoplay();
    callback();
    startAutoplay();
  };

  navButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      handleManualNavigation(() => goTo(index));
    });
  });

  prevButton.addEventListener("click", () => {
    handleManualNavigation(prev);
  });

  nextButton.addEventListener("click", () => {
    handleManualNavigation(next);
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handleManualNavigation(prev);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      handleManualNavigation(next);
    }
  });

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget)) {
      startAutoplay();
    }
  });

  update();
  startAutoplay();
}
