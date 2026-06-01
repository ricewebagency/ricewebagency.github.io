export function initIntroOverlay() {
  const showOncePerSession = true;
  const overlay = document.querySelector("[data-intro-overlay]");
  const header = document.querySelector("[data-intro-header]");

  const revealHeader = () => {
    if (header instanceof HTMLElement) {
      header.style.transition = "";
      header.style.transform = "translateY(0)";
    }
  };

  if (!(overlay instanceof HTMLElement)) {
    revealHeader();
    return;
  }

  const root = document.documentElement;
  const body = document.body;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const shell = overlay.querySelector("[data-intro-logo-shell]");
  const logo = overlay.querySelector("[data-intro-logo]");
  const badge = overlay.querySelector("[data-intro-badge]");
  const badgeLabel = overlay.querySelector("[data-intro-badge-label]");
  const glow = overlay.querySelector("[data-intro-glow]");
  const grain = overlay.querySelector("[data-intro-grain]");
  const globe = overlay.querySelector("[data-intro-globe]");
  const rotor = overlay.querySelector("[data-intro-globe-rotor]");
  const meridians = [...overlay.querySelectorAll("[data-intro-globe-meridian]")];

  if (
    !(shell instanceof HTMLElement)
    || !(logo instanceof HTMLImageElement)
    || !(badge instanceof HTMLElement)
    || !(badgeLabel instanceof HTMLElement)
    || !(glow instanceof HTMLElement)
    || !(grain instanceof HTMLElement)
    || !(globe instanceof SVGElement)
    || !(rotor instanceof SVGGElement)
    || meridians.length !== 4
  ) {
    revealHeader();
    overlay.remove();
    return;
  }

  const sessionFlag = "rice:intro-overlay-played";
  const shouldSkip = showOncePerSession && window.sessionStorage.getItem(sessionFlag) === "1";

  if (shouldSkip) {
    revealHeader();
    overlay.remove();
    return;
  }

  const lockScroll = () => {
    body.classList.add("overflow-hidden");
  };

  const unlockScroll = () => {
    body.classList.remove("overflow-hidden");
  };

  const cleanup = () => {
    unlockScroll();
    root.classList.remove("intro-running");

    if (header instanceof HTMLElement) {
      header.style.transition = "";
    }

    if (showOncePerSession) {
      window.sessionStorage.setItem(sessionFlag, "1");
    }

    overlay.remove();
  };

  if (header instanceof HTMLElement) {
    header.style.transform = "translateY(-100%)";
  }

  const finishEarly = () => {
    if (header instanceof HTMLElement) {
      header.style.transform = "";
    }
    overlay.classList.add("pointer-events-none", "opacity-0");
    window.setTimeout(cleanup, 220);
  };

  lockScroll();
  root.classList.add("intro-running");

  if (document.hidden) {
    finishEarly();
    return;
  }

  const runReducedMotion = () => {
    logo.style.opacity = "1";
    badge.style.opacity = "1";
    badgeLabel.style.opacity = "1";
    shell.style.opacity = "1";
    shell.style.transform = "translate3d(0, 0, 0) scale3d(1, 1, 1)";
    glow.style.opacity = "0.45";
    grain.style.opacity = "0.18";

    window.setTimeout(() => {
      if (header instanceof HTMLElement) {
        header.style.transition = "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)";
        header.style.transform = "translateY(0)";
      }

      window.setTimeout(() => {
        overlay.classList.add("pointer-events-none");
        overlay.classList.add("opacity-0");
        window.setTimeout(cleanup, 280);
      }, 500);
    }, 700);
  };

  const runImmersive = () => {
    const axisRadius = 8.5;
    const phases = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];
    const period = 5100;
    const baseTilt = -11;
    const tiltVariance = 3;
    let frameId = 0;
    let stopped = false;

    const updateMeridian = (meridian, angle) => {
      const depth = Math.cos(angle);
      const radiusX = Math.max(Math.abs(depth) * axisRadius, 0.9);
      const strokeOpacity = depth >= 0 ? 0.28 + Math.abs(depth) * 0.6 : 0.12 + Math.abs(depth) * 0.2;
      const strokeWidth = depth >= 0 ? 1.15 : 0.9;

      meridian.setAttribute("rx", radiusX.toFixed(2));
      meridian.setAttribute("opacity", strokeOpacity.toFixed(2));
      meridian.setAttribute("stroke-width", strokeWidth.toFixed(2));
    };

    const render = (timestamp) => {
      if (stopped) {
        return;
      }

      const rotation = ((timestamp % period) / period) * Math.PI * 2;
      const iconTilt = baseTilt + Math.sin(rotation * 0.8) * tiltVariance;
      rotor.setAttribute("transform", `rotate(${iconTilt.toFixed(2)} 12 12)`);

      meridians.forEach((meridian, index) => {
        updateMeridian(meridian, rotation + phases[index]);
      });

      frameId = window.requestAnimationFrame(render);
    };

    shell.animate(
      [
        { transform: "translate3d(0, 14px, 0) scale3d(0.92, 0.92, 1)", opacity: 0 },
        { transform: "translate3d(0, -6px, 0) scale3d(1.02, 1.02, 1)", opacity: 1, offset: 0.52 },
        { transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)", opacity: 1 },
      ],
      {
        duration: 1120,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      },
    );

    logo.animate(
      [
        { transform: "scale3d(0.97, 0.97, 1)", opacity: 0, filter: "drop-shadow(0 0 0 rgba(187,160,249,0))" },
        {
          transform: "scale3d(1.02, 1.02, 1)",
          opacity: 1,
          filter: "drop-shadow(0 0 22px rgba(187,160,249,0.32))",
          offset: 0.6,
        },
        { transform: "scale3d(1, 1, 1)", opacity: 1, filter: "drop-shadow(0 0 8px rgba(187,160,249,0.16))" },
      ],
      {
        duration: 1800,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      },
    );

    badge.animate(
      [
        { transform: "translate3d(0, 124%, 0) scale3d(0.88, 0.3, 1)", opacity: 0 },
        { transform: "translate3d(0, -16%, 0) scale3d(1.04, 1.08, 1)", opacity: 1, offset: 0.62 },
        { transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)", opacity: 1 },
      ],
      {
        duration: 980,
        delay: 330,
        easing: "cubic-bezier(0.2, 0.9, 0.2, 1)",
        fill: "forwards",
      },
    );

    badgeLabel.animate(
      [
        { transform: "translate3d(16px, 0, 0)", opacity: 0 },
        { transform: "translate3d(-2px, 0, 0)", opacity: 1, offset: 0.72 },
        { transform: "translate3d(0, 0, 0)", opacity: 1 },
      ],
      {
        duration: 620,
        delay: 760,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      },
    );

    glow.animate(
      [
        { transform: "scale3d(0.82, 0.82, 1)", opacity: 0.14 },
        { transform: "scale3d(1.08, 1.08, 1)", opacity: 0.52, offset: 0.54 },
        { transform: "scale3d(1.22, 1.22, 1)", opacity: 0.22 },
      ],
      {
        duration: 2200,
        easing: "cubic-bezier(0.25, 0.9, 0.2, 1)",
        fill: "forwards",
      },
    );

    grain.animate(
      [
        { transform: "translate3d(-2%, -1%, 0)", opacity: 0.08 },
        { transform: "translate3d(2%, 1%, 0)", opacity: 0.14, offset: 0.5 },
        { transform: "translate3d(0, 0, 0)", opacity: 0.1 },
      ],
      {
        duration: 900,
        iterations: 5,
        easing: "steps(6, end)",
      },
    );

    frameId = window.requestAnimationFrame(render);

    window.setTimeout(() => {
      overlay.classList.add("pointer-events-none");

      if (header instanceof HTMLElement) {
        header.style.transition = "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)";
        header.style.transform = "translateY(0)";
      }

      window.setTimeout(() => {
        overlay.animate(
          [
            { opacity: 1, transform: "scale3d(1, 1, 1)", filter: "blur(0px)" },
            { opacity: 0, transform: "scale3d(1.02, 1.02, 1)", filter: "blur(5px)" },
          ],
          {
            duration: 700,
            easing: "cubic-bezier(0.35, 0, 0.25, 1)",
            fill: "forwards",
          },
        );

        window.setTimeout(() => {
          stopped = true;

          if (frameId) {
            window.cancelAnimationFrame(frameId);
          }

          cleanup();
        }, 760);
      }, 500);
    }, 2550);
  };

  if (reducedMotionQuery.matches) {
    runReducedMotion();
    return;
  }

  runImmersive();
}