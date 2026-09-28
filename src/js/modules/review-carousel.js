const REVIEWS_TOP = [
  {
    name: "Chelsea J.",
    company: "Proper Beauty Salon",
    quote: "Ik werk al een tijd samen met Maurice van RICE Web en ben nog steeds erg tevreden. De communicatie verloopt altijd soepel en hij reageert snel. Of het nu om kleine aanpassingen of grotere problemen gaat, hij denkt mee en lost alles vakkundig op. Maurice is betrouwbaar en komt zijn afspraken na, wat veel vertrouwen geeft. Voor mijn volgende project werk ik dan ook graag weer met RICE Web samen. Echt een aanrader als je een betrokken en professionele webpartner zoekt!!",
  },
  {
    name: "Inti K.",
    company: "Studio IEKS",
    quote: "Ik ben erg tevreden! Alles klopt, de uitstraling en de manier waarop klanten nu contact kunnen opnemen. Mooi werk, thx!",
  },
  {
    name: "Boy B.",
    company: "Klimazon",
    quote: "Super tevreden met Maurice en zijn diensten: mijn website Klimazon werkt super. Mijn tweede website is al in de maak door Maurice. Ook krijg ik snel antwoorden op mijn vragen en past hij snel dingen aan als ik hier om vroeg. Aanrader!",
  },
  {
    name: "Rafael B.",
    company: "Marketing Partner",
    quote: "Als partner van Rice werk ik regelmatig met hun websites. De basis van de sites zijn slim opgezet, waardoor wij online advertenties en tracking snel kunnen implementeren.",
  },
];

const REVIEWS_BOTTOM = [
  {
    name: "Petra V.",
    company: "Petra's Laser & Beauty",
    quote: "Maurice heeft mijn website helemaal zelf ontworpen! Ben er erg blij mee. Eventuele aanpassingen worden zo gedaan. Luisterd en denkt heel goed mee👌",
  },
  {
    name: "Marissa P.",
    company: "Glamour by Tink",
    quote: "Wij zijn ontzettend blij met onze website! Vanaf het eerste moment wordt er echt met je meegedacht en er is oog voor ieder detail. Onze wensen worden niet alleen begrepen, maar er wordt ook actief meegedacht over hoe het nog mooier en beter kan. De communicatie is fijn, persoonlijk en professioneel en het eindresultaat is precies geworden wat we voor ogen hadden. Je merkt aan alles dat er met passie en aandacht wordt gewerkt. Wij zijn supertrots op onze website en zouden Maurice onze websitebouwer dan ook aan iedereen aanraden! Echt een topper! 🙌🏼✨",
  },
  {
    name: "Rafael B.",
    company: "Marketing Partner",
    quote: "Als partner van Rice werk ik regelmatig met hun websites. De basis van de sites zijn slim opgezet, waardoor wij online advertenties en tracking snel kunnen implementeren.",
  },
  {
    name: "Guido P.",
    company: "Oottat Tattoo",
    quote: "Supertevreden over Maurice! De communicatie verloopt prettig en vlot, en hij is een leuke en betrokken gast. Ook nadat de website klaar is, staat hij snel voor je klaar als je vragen hebt. Hij maakt geen standaard websites, maar denkt creatief mee en voegt leuke extra’s toe. Absoluut een aanrader!",
  },
];

const COPIES = 3;
const LERP_FACTOR = 0.1;
const SETTLE_THRESHOLD = 0.05;
const COLORS = ["#bba0f9", "#daf9a0"];
const MAX_SCROLL_DELTA = 28;
const STAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="StarRating-module__starMd--evMQ2 StarRating-module__starFilled--eVKbd star-rating__star star-rating__star--md star-rating__star--filled h-4 w-4 shrink-0"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd"></path></svg>`;

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

  const rating = document.createElement("div");
  rating.className = "flex items-center justify-between gap-3";
  rating.setAttribute("aria-label", "5 uit 5 sterren");

  const stars = document.createElement("div");
  stars.className = "flex items-center gap-0 text-[1.1rem] leading-none text-[#fbbc04]";
  stars.innerHTML = STAR_SVG.repeat(5);

  const googleButton = document.createElement("a");
  googleButton.href = "https://www.google.com/search?sca_esv=080dae4805299e94&sxsrf=APpeQnvAbXjrG2XWWUB8OcZP4FmYm-jF3A:1790588427237&q=rice+web&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_yilqUAkovO7UP5Q3YTSSFgwhTI1PuqFmN9JAZqKPBNXrZ-tuGtX4y3W3vv7ULliIc04Tlc%3D&uds=AJ5uw1-CsN_VmOWvV4nQCD6b3IOKOc-36RflhvvHqvcO2Qk36HMPY6BDauOiEEmpvDkCqP16k_EmyBskES0R7ZIfXcwmtbwwfBla_UpD3_EvMPBVNBKyEgU&sa=X&ved=2ahUKEwj8tZPZ_ZCXAxXngf0HHUUSB_IQ3PALegQIMhAF&biw=1920&bih=911&dpr=1";
  googleButton.target = "_blank";
  googleButton.rel = "noopener noreferrer";
  googleButton.setAttribute("aria-label", "Lees reviews op Google");
  googleButton.className = "shrink-0 inline-flex items-center justify-center";

  const googleIcon = document.createElement("img");
  googleIcon.src = "./assets/icons/google-icon.svg";
  googleIcon.alt = "";
  googleIcon.setAttribute("aria-hidden", "true");
  googleIcon.className = "h-7 w-auto";

  googleButton.appendChild(googleIcon);
  rating.append(stars, googleButton);

  const quoteEl = document.createElement("blockquote");
  quoteEl.className = "line-clamp-4 text-sm leading-relaxed text-slate-700";
  quoteEl.textContent = `"${quote}"`;

  surface.append(header, quoteEl, rating);
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
