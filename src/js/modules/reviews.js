export function initReviews() {
  const root = document.querySelector("[data-review-gallery]");
  const wall = root?.querySelector("[data-review-wall]");
  const triggers = root ? [...root.querySelectorAll("[data-review-trigger]")] : [];
  const card = root?.querySelector("[data-review-card]");
  const closeButton = root?.querySelector("[data-review-card-close]");
  const name = root?.querySelector("[data-review-name-display]");
  const role = root?.querySelector("[data-review-role-display]");
  const quote = root?.querySelector("[data-review-quote-display]");

  const formatReviewQuote = (value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "";
    }

    const unwrappedValue = trimmedValue.replace(/^["“”]+|["“”]+$/g, "");

    return `“${unwrappedValue}”`;
  };

  if (!root || !wall || !triggers.length || !card || !closeButton || !name || !role || !quote) {
    return;
  }

  const desktopReviewHoverQuery = window.matchMedia("(min-width: 768px)");

  const getAvatarElement = (trigger) => trigger.querySelector("[data-review-avatar]") ?? trigger;

  const clearReview = () => {
    triggers.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
    });

    root.style.paddingBottom = "0px";
    card.setAttribute("aria-hidden", "true");
    card.classList.add("pointer-events-none", "invisible", "opacity-0", "-translate-y-3");
    card.classList.remove("opacity-100", "translate-y-0");
  };

  const positionCard = (trigger) => {
    const rootRect = root.getBoundingClientRect();
    const wallRect = wall.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const avatarRect = getAvatarElement(trigger).getBoundingClientRect();
    const gap = 14;
    const viewportPadding = 12;
    const overlapOffset = Math.min(avatarRect.height * 0.7, 56);

    card.style.top = "0px";
    card.style.left = "0px";

    const cardRect = card.getBoundingClientRect();
    const triggerCenter = avatarRect.left - rootRect.left + avatarRect.width / 2;
    const minLeft = viewportPadding - rootRect.left;
    const maxLeft = window.innerWidth - viewportPadding - rootRect.left - cardRect.width;

    let left = triggerCenter - cardRect.width / 2;
    let top = avatarRect.top - rootRect.top - cardRect.height + overlapOffset;

    left = Math.max(minLeft, Math.min(left, maxLeft));

    if (top < 0) {
      top = avatarRect.top - rootRect.top + avatarRect.height / 2 - cardRect.height / 2;
    }

    if (top < 0) {
      top = triggerRect.top - rootRect.top - cardRect.height + overlapOffset;
    }

    card.style.left = `${left}px`;
    card.style.top = `${top}px`;

    const wallBottom = wallRect.bottom - rootRect.top;
    const requiredPadding = Math.max(0, top + cardRect.height - wallBottom);
    root.style.paddingBottom = `${requiredPadding}px`;
  };

  const updateReview = (trigger, scrollToCard = false) => {
    triggers.forEach((button) => {
      const isActive = button === trigger;

      button.setAttribute("aria-pressed", String(isActive));
    });

    name.textContent = trigger.dataset.reviewName ?? "";
    role.textContent = trigger.dataset.reviewRole ?? "";
    quote.textContent = formatReviewQuote(trigger.dataset.reviewQuote ?? "");

    card.setAttribute("aria-hidden", "false");
    card.classList.remove("pointer-events-none", "invisible", "opacity-0", "-translate-y-3");
    card.classList.add("opacity-100", "translate-y-0");
    positionCard(trigger);

    if (scrollToCard) {
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 0;
      const cardRect = card.getBoundingClientRect();
      const isOutOfView = cardRect.bottom > window.innerHeight || cardRect.top < headerHeight;

      if (isOutOfView) {
        const targetY = window.scrollY + cardRect.top - headerHeight - 16;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }
  };

  card.classList.add("transform-gpu", "transition-all", "duration-300", "ease-out");
  root.classList.add("transition-[padding]", "duration-300", "ease-out");

  triggers.forEach((trigger) => {
    trigger.addEventListener("pointerenter", () => {
      if (!desktopReviewHoverQuery.matches) {
        return;
      }

      updateReview(trigger);
    });

    trigger.addEventListener("click", () => {
      updateReview(trigger, true);
    });

    trigger.addEventListener("focus", () => {
      updateReview(trigger);
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        updateReview(trigger, true);
      }
    });
  });

  closeButton.addEventListener("click", () => {
    clearReview();
  });

  document.addEventListener("pointerdown", (event) => {
    const activeTrigger = triggers.find((trigger) => trigger.getAttribute("aria-pressed") === "true");

    if (!activeTrigger) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Node)) {
      return;
    }

    if (card.contains(target) || activeTrigger.contains(target)) {
      return;
    }

    clearReview();
  });

  window.addEventListener(
    "resize",
    () => {
      const activeTrigger = triggers.find((trigger) => trigger.getAttribute("aria-pressed") === "true");

      if (!activeTrigger) {
        return;
      }

      positionCard(activeTrigger);
    },
    { passive: true },
  );

  clearReview();
}