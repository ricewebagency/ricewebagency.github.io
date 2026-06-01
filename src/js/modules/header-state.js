export function initHeaderState() {
  const header = document.querySelector("[data-site-header]");
  const headerShell = document.querySelector("[data-header-shell]");
  const headerTextTargets = [...document.querySelectorAll("[data-header-text]")];
  const headerLogo = document.querySelector("[data-header-logo]");
  const headerOutlineButtons = [...document.querySelectorAll("[data-header-outline-button]")];
  const shouldChangeTextColor = header?.dataset.changeTextColor !== "false";

  if (!header || !headerShell) {
    return;
  }

  let isCompact = false;
  let frameId = 0;

  const applyState = (compact) => {
    isCompact = compact;

    headerShell.classList.toggle("py-1", compact);
    headerShell.classList.toggle("py-3", !compact);
    headerShell.classList.toggle("lg:py-3", compact);
    headerShell.classList.toggle("lg:py-6", !compact);
    headerShell.classList.toggle("bg-white", compact);
    headerShell.classList.toggle("shadow-lg", compact);
    headerShell.classList.toggle("shadow-slate-900/10", compact);

    if (shouldChangeTextColor) {
      headerTextTargets.forEach((target) => {
        target.classList.toggle("text-black/80", compact);
        target.classList.toggle("text-[#bba0f9]", !compact);
      });
    }

    headerOutlineButtons.forEach((button) => {
      button.style.borderWidth = compact ? "1px" : "0px";
      button.style.background = compact ? "white" : "transparent";
    });

    if (headerLogo instanceof HTMLImageElement) {
      const defaultLogo = headerLogo.dataset.logoDefault;
      const compactLogo = headerLogo.dataset.logoCompact;

      headerLogo.classList.toggle("opacity-80", compact);
      headerLogo.classList.toggle("opacity-100", !compact);

      if (defaultLogo && compactLogo) {
        headerLogo.src = compact ? compactLogo : defaultLogo;
      }
    }
  };

  const updateHeader = () => {
    const shouldBeCompact = window.scrollY > 8;

    if (shouldBeCompact === isCompact) {
      return;
    }

    applyState(shouldBeCompact);
  };

  applyState(window.scrollY > 8);
  window.addEventListener(
    "scroll",
    () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateHeader();
      });
    },
    { passive: true },
  );
}