export function initHeaderGlobe() {
  const globeIcons = [...document.querySelectorAll("[data-header-globe]")];

  if (!globeIcons.length) {
    return;
  }

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const axisRadius = 8.5;
  const phases = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];
  const period = 7000;
  const baseTilt = -11;
  const tiltVariance = 3;

  const globes = globeIcons
    .map((icon) => {
      const rotor = icon.querySelector("[data-header-globe-rotor]");
      const meridians = [...icon.querySelectorAll("[data-globe-meridian]")];

      if (!rotor || meridians.length !== phases.length) {
        return null;
      }

      return { meridians, rotor };
    })
    .filter(Boolean);

  if (!globes.length) {
    return;
  }

  let frameId = 0;

  const updateMeridian = (meridian, angle) => {
    const depth = Math.cos(angle);
    const radiusX = Math.max(Math.abs(depth) * axisRadius, 0.9);
    const strokeOpacity = depth >= 0 ? 0.28 + Math.abs(depth) * 0.6 : 0.12 + Math.abs(depth) * 0.18;
    const strokeWidth = depth >= 0 ? 1.15 : 0.9;

    meridian.setAttribute("rx", radiusX.toFixed(2));
    meridian.setAttribute("opacity", strokeOpacity.toFixed(2));
    meridian.setAttribute("stroke-width", strokeWidth.toFixed(2));
  };

  const render = (timestamp) => {
    const rotation = ((timestamp % period) / period) * Math.PI * 2;
    const iconTilt = baseTilt + Math.sin(rotation * 0.8) * tiltVariance;

    globes.forEach((globe) => {
      globe.rotor.setAttribute("transform", `rotate(${iconTilt.toFixed(2)} 12 12)`);

      globe.meridians.forEach((meridian, index) => {
        updateMeridian(meridian, rotation + phases[index]);
      });
    });

    frameId = window.requestAnimationFrame(render);
  };

  const stop = () => {
    if (!frameId) {
      return;
    }

    window.cancelAnimationFrame(frameId);
    frameId = 0;
  };

  const start = () => {
    if (frameId || reducedMotionQuery.matches || document.hidden) {
      return;
    }

    frameId = window.requestAnimationFrame(render);
  };

  const applyStaticState = () => {
    globes.forEach((globe) => {
      globe.rotor.setAttribute("transform", `rotate(${baseTilt} 12 12)`);

      globe.meridians.forEach((meridian, index) => {
        updateMeridian(meridian, phases[index]);
      });
    });
  };

  const syncAnimationState = () => {
    stop();

    if (reducedMotionQuery.matches || document.hidden) {
      applyStaticState();
      return;
    }

    start();
  };

  applyStaticState();
  syncAnimationState();

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", syncAnimationState);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(syncAnimationState);
  }

  document.addEventListener("visibilitychange", syncAnimationState);
}