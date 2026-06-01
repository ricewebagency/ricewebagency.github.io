export function initHeaderBadgeAnimation() {
  const badge = document.querySelector("[data-header-badge]");
  const badgeLabel = document.querySelector("[data-header-badge-label]");
  const brand = document.querySelector("[data-header-brand]");
  const logoShell = document.querySelector("[data-header-logo-shell]");

  if (
    !(badge instanceof HTMLElement)
    || !(badgeLabel instanceof HTMLElement)
    || !(brand instanceof HTMLElement)
    || !(logoShell instanceof HTMLElement)
    || typeof badge.animate !== "function"
  ) {
    return;
  }

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const visibleDelay = 4600;
  const hiddenDelay = 3200;
  const sinkDuration = 780;
  const riseDuration = 980;
  const labelRiseDelay = 420;
  const labelRiseDuration = 640;
  const logoSinkDelay = 450;
  const badgeVisibleState = {
    opacity: "1",
    transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)",
    transformOrigin: "50% 100%",
  };
  const badgeHiddenState = {
    opacity: "0",
    transform: "translate3d(0, 118%, 0) scale3d(0.88, 0.3, 1)",
    transformOrigin: "50% 100%",
  };
  const labelVisibleState = {
    opacity: "1",
    transform: "translate3d(0, 0, 0)",
  };
  const labelHiddenState = {
    opacity: "0",
    transform: "translate3d(18px, 0, 0)",
  };
  let timeoutId = 0;
  let logoTimeoutId = 0;
  let labelTimeoutId = 0;
  let sinkAnimation = null;
  let riseAnimation = null;
  let labelAnimation = null;
  let hasPlayedInitialBadgeIntro = false;
  let lastWindowWidth = window.innerWidth;
  let lastViewportWidth = Math.round(window.visualViewport?.width ?? window.innerWidth);

  const updateLogoOffset = (centerLogo) => {
    const brandWidth = brand.getBoundingClientRect().width;
    const brandHeight = brand.getBoundingClientRect().height;
    const logoWidth = logoShell.getBoundingClientRect().width;
    const logoHeight = logoShell.getBoundingClientRect().height;
    const centerOffset = Math.max((brandWidth - logoWidth) / 2, 0);
    const middleOffset = Math.max((brandHeight - logoHeight) / 2, 0);

    logoShell.style.transform = centerLogo
      ? `translate3d(${centerOffset.toFixed(2)}px, ${middleOffset.toFixed(2)}px, 0)`
      : "translate3d(0, 0, 0)";
  };

  const clearTimers = () => {
    if (!timeoutId) {
      if (logoTimeoutId) {
        window.clearTimeout(logoTimeoutId);
        logoTimeoutId = 0;
      }

      if (labelTimeoutId) {
        window.clearTimeout(labelTimeoutId);
        labelTimeoutId = 0;
      }

      return;
    }

    window.clearTimeout(timeoutId);
    timeoutId = 0;

    if (logoTimeoutId) {
      window.clearTimeout(logoTimeoutId);
      logoTimeoutId = 0;
    }

    if (labelTimeoutId) {
      window.clearTimeout(labelTimeoutId);
      labelTimeoutId = 0;
    }
  };

  const stopAnimations = () => {
    sinkAnimation?.cancel();
    riseAnimation?.cancel();
    labelAnimation?.cancel();
    sinkAnimation = null;
    riseAnimation = null;
    labelAnimation = null;
  };

  const applyBadgeState = (state) => {
    badge.style.opacity = state.opacity;
    badge.style.transform = state.transform;
    badge.style.webkitTransform = state.transform;
    badge.style.transformOrigin = state.transformOrigin;
    badge.style.backfaceVisibility = "hidden";
    badge.style.webkitBackfaceVisibility = "hidden";
    badge.style.willChange = "transform, opacity";
  };

  const applyLabelState = (state) => {
    badgeLabel.style.opacity = state.opacity;
    badgeLabel.style.transform = state.transform;
    badgeLabel.style.webkitTransform = state.transform;
    badgeLabel.style.display = "inline-block";
    badgeLabel.style.willChange = "transform, opacity";
  };

  const resetBadge = () => {
    applyBadgeState(badgeVisibleState);
    applyLabelState(labelVisibleState);
    updateLogoOffset(false);
  };

  const scheduleLabelRise = () => {
    labelTimeoutId = window.setTimeout(() => {
      labelTimeoutId = 0;

      if (document.hidden || reducedMotionQuery.matches) {
        applyLabelState(labelVisibleState);
        return;
      }

      labelAnimation = badgeLabel.animate(
        [
          { transform: "translate3d(18px, 0, 0)", opacity: 0 },
          { transform: "translate3d(-3px, 0, 0)", opacity: 1, offset: 0.72 },
          { transform: "translate3d(0, 0, 0)", opacity: 1 },
        ],
        {
          duration: labelRiseDuration,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        },
      );

      labelAnimation.addEventListener(
        "finish",
        () => {
          applyLabelState(labelVisibleState);
          labelAnimation = null;
        },
        { once: true },
      );
    }, labelRiseDelay);
  };

  const scheduleRise = () => {
    timeoutId = window.setTimeout(() => {
      if (document.hidden || reducedMotionQuery.matches) {
        resetBadge();
        return;
      }

      updateLogoOffset(false);
      applyBadgeState(badgeHiddenState);
      applyLabelState(labelHiddenState);

      riseAnimation = badge.animate(
        [
          { transform: "translate3d(0, 122%, 0) scale3d(0.9, 0.35, 1)", opacity: 0 },
          { transform: "translate3d(0, -18%, 0) scale3d(1.04, 1.1, 1)", opacity: 1, offset: 0.58 },
          { transform: "translate3d(0, 6%, 0) scale3d(0.98, 0.96, 1)", opacity: 1, offset: 0.8 },
          { transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)", opacity: 1 },
        ],
        {
          duration: riseDuration,
          easing: "cubic-bezier(0.2, 0.9, 0.2, 1)",
        },
      );

      scheduleLabelRise();

      riseAnimation.addEventListener(
        "finish",
        () => {
          applyBadgeState(badgeVisibleState);
          riseAnimation = null;
          scheduleSink();
        },
        { once: true },
      );
    }, hiddenDelay);
  };

  const scheduleSink = () => {
    timeoutId = window.setTimeout(() => {
      if (document.hidden || reducedMotionQuery.matches) {
        resetBadge();
        return;
      }

      logoTimeoutId = window.setTimeout(() => {
        updateLogoOffset(true);
        logoTimeoutId = 0;
      }, logoSinkDelay);

      applyBadgeState(badgeVisibleState);
      applyLabelState(labelVisibleState);

      sinkAnimation = badge.animate(
        [
          { transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)", opacity: 1 },
          { transform: "translate3d(0, -12%, 0) scale3d(1.03, 1.02, 1)", opacity: 1, offset: 0.22 },
          { transform: "translate3d(0, 24%, 0) scale3d(0.98, 1.04, 1)", opacity: 1, offset: 0.58 },
          { transform: "translate3d(0, 118%, 0) scale3d(0.88, 0.3, 1)", opacity: 0 },
        ],
        {
          duration: sinkDuration,
          easing: "cubic-bezier(0.55, 0, 0.75, 0.15)",
        },
      );

      sinkAnimation.addEventListener(
        "finish",
        () => {
          applyBadgeState(badgeHiddenState);
          sinkAnimation = null;
          scheduleRise();
        },
        { once: true },
      );
    }, visibleDelay);
  };

  const syncAnimationState = () => {
    clearTimers();
    stopAnimations();

    if (!hasPlayedInitialBadgeIntro) {
      applyBadgeState(badgeHiddenState);
      applyLabelState(labelHiddenState);
      updateLogoOffset(true);
      hasPlayedInitialBadgeIntro = true;

      if (document.hidden || reducedMotionQuery.matches) {
        return;
      }

      scheduleRise();
      return;
    }

    resetBadge();

    if (document.hidden || reducedMotionQuery.matches) {
      return;
    }

    scheduleSink();
  };

  const syncResizeWidths = () => {
    lastWindowWidth = window.innerWidth;
    lastViewportWidth = Math.round(window.visualViewport?.width ?? window.innerWidth);
  };

  const handleResponsiveResize = () => {
    const nextWindowWidth = window.innerWidth;
    const nextViewportWidth = Math.round(window.visualViewport?.width ?? nextWindowWidth);

    if (nextWindowWidth === lastWindowWidth && nextViewportWidth === lastViewportWidth) {
      return;
    }

    lastWindowWidth = nextWindowWidth;
    lastViewportWidth = nextViewportWidth;
    syncAnimationState();
  };

  syncResizeWidths();
  syncAnimationState();

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", syncAnimationState);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(syncAnimationState);
  }

  document.addEventListener("visibilitychange", syncAnimationState);
  window.addEventListener("resize", handleResponsiveResize, { passive: true });
  window.visualViewport?.addEventListener("resize", handleResponsiveResize, { passive: true });
}