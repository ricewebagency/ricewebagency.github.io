export function initValuesCarousel() {
  const root = document.querySelector("[data-values-carousel]");
  const track = root?.querySelector("[data-values-track]");
  const viewport = root?.querySelector("[data-values-viewport]");
  const slides = root ? [...root.querySelectorAll("[data-values-slide]")] : [];
  const prevButton = root?.querySelector("[data-values-prev]");
  const nextButton = root?.querySelector("[data-values-next]");
  const dotsContainer = root?.querySelector("[data-values-dots]");

  if (!root || !track || !viewport || !slides.length || !prevButton || !nextButton || !dotsContainer) {
    return;
  }

  let currentIndex = 0;
  let maxIndex = 0;
  let slidesPerView = 1;
  let dotButtons = [];
  let isMobileViewport = false;
  let resizeFrame = 0;
  let scrollFrame = 0;
  let snapTimeout = 0;
  let carouselId = "values-carousel";

  const ensureId = (element, fallbackId) => {
    if (!(element instanceof HTMLElement)) {
      return fallbackId;
    }

    if (!element.id) {
      element.id = fallbackId;
    }

    return element.id;
  };

  const getSlidesPerView = () => {
    if (window.innerWidth >= 1024) {
      return 4;
    }

    if (window.innerWidth >= 640) {
      return 2;
    }

    return 1;
  };

  const syncViewportMode = () => {
    isMobileViewport = window.innerWidth < 640;
    viewport.classList.toggle("cursor-grab", isMobileViewport);
    viewport.classList.toggle("active:cursor-grabbing", isMobileViewport);
  };

  const buildDots = () => {
    dotsContainer.innerHTML = "";
    dotButtons = Array.from({ length: maxIndex + 1 }, (_, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "h-2.5 rounded-full bg-black/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/35";
      button.setAttribute("aria-label", `Ga naar item ${index + 1}`);
      button.setAttribute("aria-pressed", index === currentIndex ? "true" : "false");
      button.setAttribute("aria-controls", `${carouselId}-slide-${index + 1}`);
      button.addEventListener("click", () => {
        goToIndex(index, "smooth");
      });
      dotsContainer.appendChild(button);
      return button;
    });
  };

  const getSlideOffset = (slideIndex) => {
    const baseSlide = slides[0];
    const clampedIndex = Math.min(slideIndex, slides.length - 1);
    const slide = slides[clampedIndex];

    if (!(baseSlide instanceof HTMLElement) || !(slide instanceof HTMLElement)) {
      return 0;
    }

    return Math.max(slide.offsetLeft - baseSlide.offsetLeft, 0);
  };

  const getClosestIndex = () => {
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (let index = 0; index <= maxIndex; index += 1) {
      const distance = Math.abs(getSlideOffset(index) - viewport.scrollLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    }

    return closestIndex;
  };

  const updateControls = () => {
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === maxIndex;
    prevButton.setAttribute("aria-disabled", String(prevButton.disabled));
    nextButton.setAttribute("aria-disabled", String(nextButton.disabled));

    const firstVisibleIndex = currentIndex;
    const lastVisibleIndex = Math.min(currentIndex + slidesPerView - 1, slides.length - 1);

    slides.forEach((slide, index) => {
      const isVisible = index >= firstVisibleIndex && index <= lastVisibleIndex;

      slide.setAttribute("aria-hidden", String(!isVisible));
      slide.setAttribute("tabindex", isVisible ? "0" : "-1");
    });

    dotButtons.forEach((button, index) => {
      const isActive = index === currentIndex;
      button.style.width = isActive ? "2.5rem" : "0.625rem";
      button.classList.toggle("bg-black", isActive);
      button.classList.toggle("bg-black/20", !isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
      button.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const update = (behavior = "auto") => {
    const offset = getSlideOffset(currentIndex);

    if (isMobileViewport) {
      track.style.transform = "";
      viewport.scrollTo({ left: offset, behavior });
    } else {
      viewport.scrollTo({ left: 0, behavior: "auto" });
      track.style.transform = `translateX(-${offset}px)`;
    }

    updateControls();
  };

  const goToIndex = (slideIndex, behavior = "auto") => {
    currentIndex = Math.max(0, Math.min(slideIndex, maxIndex));
    update(behavior);
  };

  const scheduleSnapToNearest = () => {
    if (!isMobileViewport) {
      return;
    }

    window.clearTimeout(snapTimeout);
    snapTimeout = window.setTimeout(() => {
      const nearestIndex = getClosestIndex();

      if (Math.abs(getSlideOffset(nearestIndex) - viewport.scrollLeft) <= 2) {
        return;
      }

      goToIndex(nearestIndex, "smooth");
    }, 90);
  };

  const refresh = () => {
    syncViewportMode();
    slidesPerView = getSlidesPerView();
    maxIndex = Math.max(slides.length - slidesPerView, 0);

    if (isMobileViewport) {
      currentIndex = getClosestIndex();
    }

    currentIndex = Math.min(currentIndex, maxIndex);
    buildDots();
    update();
  };

  carouselId = ensureId(root, `values-carousel-${Math.random().toString(36).slice(2, 8)}`);
  ensureId(viewport, `${carouselId}-viewport`);
  ensureId(track, `${carouselId}-track`);

  track.setAttribute("role", "list");
  slides.forEach((slide, index) => {
    slide.setAttribute("role", "listitem");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `Stap ${index + 1} van ${slides.length}`);
    ensureId(slide, `${carouselId}-slide-${index + 1}`);
  });

  prevButton.addEventListener("click", () => {
    if (currentIndex === 0) {
      return;
    }

    goToIndex(currentIndex - 1, "smooth");
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex >= maxIndex) {
      return;
    }

    goToIndex(currentIndex + 1, "smooth");
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prevButton.click();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextButton.click();
    }
  });

  const scheduleRefresh = () => {
    if (resizeFrame) {
      return;
    }

    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      refresh();
    });
  };

  viewport.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) {
        return;
      }

      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        
        // Reset transform on desktop when manually scrolling
        if (!isMobileViewport) {
          track.style.transform = "";
        }
        
        const nextIndex = getClosestIndex();

        if (nextIndex === currentIndex) {
          return;
        }

        currentIndex = nextIndex;
        updateControls();
      });

      if (isMobileViewport) {
        scheduleSnapToNearest();
      }
    },
    { passive: true },
  );

  viewport.addEventListener("touchend", scheduleSnapToNearest, { passive: true });
  viewport.addEventListener("pointerup", scheduleSnapToNearest, { passive: true });

  window.addEventListener("resize", scheduleRefresh, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleRefresh, { passive: true });

  refresh();
}
