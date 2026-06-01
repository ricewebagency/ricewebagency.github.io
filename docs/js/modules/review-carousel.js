const REVIEWS_TOP = [
  {
    name: "Inti K.",
    company: "Studio IEKS",
    quote: "Ik twijfelde lang of een nieuwe website echt nodig was, maar dit heeft mijn bedrijf echt een boost gegeven. Alles klopt — van de uitstraling tot de manier waarop klanten nu binnenkomen.",
  },
  {
    name: "Chelsea J.",
    company: "Proper Beauty Salon",
    quote: "Rice heeft precies begrepen wat ik wilde, zonder dat ik het zelf goed kon omschrijven. Het resultaat voelt als ik, maar dan professioneel. Mijn klanten reageren er constant positief op.",
  },
  {
    name: "Boy B.",
    company: "Klimazon",
    quote: "Snelle communicatie, denken écht mee en leveren wat ze beloven. De website staat er en doet wat hij moet doen. Meer kan ik niet vragen.",
  },
  {
    name: "Rafael B.",
    company: "Marketing Partner",
    quote: "Als partner van Rice werk ik regelmatig met hun websites. De basis van de sites zijn slim opgezet, waardoor wij online advertenties en tracking snel kunnen implementeren.",
  },
];

const REVIEWS_BOTTOM = [
  {
    name: "Guido P.",
    company: "Oottat Tattoo",
    quote: "Professioneel advies, snel schakelen, sterke eigen input en vooral heel creatief. Ik ben ontzettend blij met mijn website echt WAUW!",
  },
  {
    name: "Petra V.",
    company: "Petra's Laser & Beauty",
    quote: "Ik had wel wat ideeën maar wist niet hoe ik dat moest vertalen. Rice heeft dat voor me gedaan en het ziet er geweldig uit. Klanten vinden de site nu veel fijner en boeken sneller.",
  },
  {
    name: "Marissa P.",
    company: "Glamour by Tink",
    quote: "Fijn contact, eerlijk advies en een eindresultaat waar ik trots op ben. Ze dachten mee over dingen waar ik zelf nooit aan had gedacht. Absoluut een aanrader.",
  },
  {
    name: "Rafael B.",
    company: "Marketing Partner",
    quote: "Als partner van Rice werk ik regelmatig met hun websites. De basis van de sites zijn slim opgezet, waardoor wij online advertenties en tracking snel kunnen implementeren.",
  },
];

const COPIES = 3;
const LERP_FACTOR = 0.1;
const SETTLE_THRESHOLD = 0.05;
const COLORS = ["#bba0f9", "#daf9a0"];
const MAX_SCROLL_DELTA = 28;

function getScrollSpeedMultiplier() {
  if (window.matchMedia("(max-width: 640px)").matches) {
    return 0.08;
  }

  if (window.matchMedia("(max-width: 1024px)").matches) {
    return 0.11;
  }

  return 0.14;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function createCard({ name, company, quote, color }) {
  const oppositeColor = color === COLORS[0] ? COLORS[1] : COLORS[0];
  
  const article = document.createElement("article");
  article.className =
    "flex-shrink-0 w-[17rem] sm:w-[18.75rem] rounded-lg bg-slate-50 skew-x-[-4deg] select-none";
  article.style.boxShadow = `0 4px 16px ${oppositeColor}40`;

  const surface = document.createElement("div");
  surface.className =
    "pt-8 px-5 pb-8 flex flex-col gap-3 skew-x-[4deg]";
  article.appendChild(surface);

  const header = document.createElement("div");
  header.className = "flex items-center gap-3";

  const avatar = document.createElement("div");
  avatar.className =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold leading-none text-slate-950";
  avatar.style.backgroundColor = color;
  avatar.textContent = getInitials(name);
  avatar.setAttribute("aria-hidden", "true");

  const meta = document.createElement("div");

  const nameEl = document.createElement("p");
  nameEl.className = "text-sm font-semibold leading-tight text-slate-950";
  nameEl.textContent = name;

  const roleEl = document.createElement("p");
  roleEl.className = "text-xs leading-tight text-slate-500";
  roleEl.textContent = company;

  meta.append(nameEl, roleEl);
  header.append(avatar, meta);

  const quoteEl = document.createElement("blockquote");
  quoteEl.className = "text-sm leading-relaxed text-slate-700";
  quoteEl.textContent = `"${quote}"`;

  surface.append(header, quoteEl);
  return article;
}

function buildTrack(trackEl, reviews) {
  let cardIndex = 0;
  
  for (let i = 0; i < COPIES; i++) {
    reviews.forEach((review) => {
      const avatarColor = COLORS[cardIndex % 2];
      trackEl.appendChild(createCard({ ...review, color: avatarColor }));
      cardIndex++;
    });
  }
}

function measureSetWidth(trackEl, reviewCount) {
  const totalChildren = trackEl.children.length;

  if (totalChildren === 0 || reviewCount === 0) {
    return 0;
  }

  const gap = parseFloat(getComputedStyle(trackEl).gap) || 16;
  let width = 0;

  for (let i = 0; i < reviewCount; i++) {
    width += trackEl.children[i].offsetWidth;
  }

  width += gap * (reviewCount - 1) + gap;

  return width;
}

export function initReviewCarousel() {
  const section = document.querySelector("[data-review-carousel]");

  if (!section) {
    return;
  }

  const rows = [...section.querySelectorAll("[data-review-row]")];

  if (!rows.length) {
    return;
  }

  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  rows.forEach((row, index) => {
    const track = row.querySelector("[data-review-track]");

    if (!track) {
      return;
    }

    const reviews = index === 0 ? REVIEWS_TOP : REVIEWS_BOTTOM;
    buildTrack(track, reviews);
  });

  if (prefersReducedMotion) {
    return;
  }

  const rowStates = rows
    .map((row, index) => {
      const track = row.querySelector("[data-review-track]");

      if (!track) {
        return null;
      }

      const reviews = index === 0 ? REVIEWS_TOP : REVIEWS_BOTTOM;
      const direction = row.dataset.direction === "right" ? 1 : -1;
      const setWidth = measureSetWidth(track, reviews.length);

      if (setWidth <= 0) {
        return null;
      }

      // First row (direction -1) starts at beginning, second row (direction 1) starts at end
      const initialScrollLeft = direction === 1 
        ? 2 * setWidth - row.offsetWidth
        : setWidth;
      row.scrollLeft = initialScrollLeft;

      return {
        row,
        track,
        direction,
        setWidth,
        reviewCount: reviews.length,
        currentScrollLeft: initialScrollLeft,
        targetScrollLeft: initialScrollLeft,
        isDragging: false,
        isVisible: false,
      };
    })
    .filter(Boolean);

  if (!rowStates.length) {
    return;
  }

  let lastScrollY = window.scrollY;
  let animationFrameId = 0;

  // Keep currentScrollLeft in the middle third [setWidth, 2*setWidth) for seamless looping.
  const wrapScrollLeft = (state) => {
    while (state.currentScrollLeft >= 2 * state.setWidth) {
      state.currentScrollLeft -= state.setWidth;
      state.targetScrollLeft -= state.setWidth;
    }

    while (state.currentScrollLeft < state.setWidth) {
      state.currentScrollLeft += state.setWidth;
      state.targetScrollLeft += state.setWidth;
    }
  };

  const loop = () => {
    let stillMoving = false;

    rowStates.forEach((state) => {
      if (!state.isVisible || state.isDragging) {
        return;
      }

      const next = lerp(state.currentScrollLeft, state.targetScrollLeft, LERP_FACTOR);
      const settled = Math.abs(next - state.targetScrollLeft) < SETTLE_THRESHOLD;
      state.currentScrollLeft = settled ? state.targetScrollLeft : next;

      wrapScrollLeft(state);

      state.row.scrollLeft = state.currentScrollLeft;

      if (!settled) {
        stillMoving = true;
      }
    });

    animationFrameId = stillMoving ? window.requestAnimationFrame(loop) : 0;
  };

  const requestUpdate = () => {
    if (animationFrameId) {
      return;
    }

    animationFrameId = window.requestAnimationFrame(loop);
  };

  // When the user finishes a drag, sync JS state with the row's new scrollLeft
  // so the parallax resumes smoothly from wherever they left off.
  const syncAfterDrag = (state) => {
    state.isDragging = false;
    state.currentScrollLeft = state.row.scrollLeft;
    state.targetScrollLeft = state.row.scrollLeft;
    wrapScrollLeft(state);
    state.row.scrollLeft = state.currentScrollLeft;
    requestUpdate();
  };

  rowStates.forEach((state) => {
    state.row.addEventListener("pointerdown", () => {
      state.isDragging = true;
    });
  });

  window.addEventListener("pointerup", () => {
    rowStates.forEach((state) => {
      if (state.isDragging) syncAfterDrag(state);
    });
  });

  window.addEventListener("pointercancel", () => {
    rowStates.forEach((state) => {
      if (state.isDragging) syncAfterDrag(state);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const state = rowStates.find(({ row }) => row === entry.target);

        if (!state) {
          return;
        }

        state.isVisible = entry.isIntersecting;
      });

      requestUpdate();
    },
    { root: null, rootMargin: "200px 0px" },
  );

  rows.forEach((row) => observer.observe(row));

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      const normalizedDelta = Math.max(
        -MAX_SCROLL_DELTA,
        Math.min(MAX_SCROLL_DELTA, delta),
      );
      const speedMultiplier = getScrollSpeedMultiplier();
      lastScrollY = currentScrollY;

      // direction -1 ("left"): scrollLeft increases on scroll down.
      // direction  1 ("right"): scrollLeft decreases on scroll down.
      rowStates.forEach((state) => {
        if (state.isVisible) {
          state.targetScrollLeft +=
            normalizedDelta * -state.direction * speedMultiplier;
        }
      });

      requestUpdate();
    },
    { passive: true },
  );

  window.addEventListener(
    "resize",
    () => {
      rowStates.forEach((state) => {
        state.setWidth = measureSetWidth(state.track, state.reviewCount);
      });
    },
    { passive: true },
  );
}
