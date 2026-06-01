export function initMobileMenu() {
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const closeButton = mobileMenu?.querySelector("[data-menu-close]");
  const submenuToggle = mobileMenu?.querySelector("[data-mobile-submenu-toggle]");

  if (!menuButton || !mobileMenu) {
    return;
  }

  const getMenuState = () => !mobileMenu.classList.contains("hidden");

  let closeTimer = null;

  const resetAnimations = () => {
    const backdrop = mobileMenu.querySelector("[data-mobile-menu-backdrop]");
    const container = mobileMenu.querySelector("[data-mobile-menu-container]");
    const items = mobileMenu.querySelectorAll("[data-mobile-menu-item]");

    backdrop?.classList.remove("animate-menu-fade-in", "animate-menu-fade-out");
    container?.classList.remove("animate-menu-panel-in", "animate-menu-panel-out");
    items.forEach((item) => {
      item.classList.remove("animate-menu-item-in", "animate-menu-item-out");
      item.style.animationDelay = "";
    });
  };

  const animateMenuOpen = () => {
    const backdrop = mobileMenu.querySelector("[data-mobile-menu-backdrop]");
    const container = mobileMenu.querySelector("[data-mobile-menu-container]");
    const items = mobileMenu.querySelectorAll("[data-mobile-menu-item]");

    resetAnimations();
    void mobileMenu.offsetWidth; // force reflow to restart animations

    backdrop?.classList.add("animate-menu-fade-in");
    container?.classList.add("animate-menu-panel-in");

    items.forEach((item, i) => {
      item.style.animationDelay = `${50 + i * 40}ms`;
      item.classList.add("animate-menu-item-in");
    });
  };

  const animateMenuClose = (onComplete) => {
    const backdrop = mobileMenu.querySelector("[data-mobile-menu-backdrop]");
    const container = mobileMenu.querySelector("[data-mobile-menu-container]");
    const items = mobileMenu.querySelectorAll("[data-mobile-menu-item]");

    resetAnimations();
    void mobileMenu.offsetWidth;

    backdrop?.classList.add("animate-menu-fade-out");
    container?.classList.add("animate-menu-panel-out");
    items.forEach((item) => item.classList.add("animate-menu-item-out"));

    closeTimer = setTimeout(onComplete, 260);
  };

  const setMenuOpen = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Sluit menu" : "Open menu");
    menuButton.setAttribute("aria-haspopup", "dialog");
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.documentElement.classList.toggle("overflow-hidden", open);
    document.body.classList.toggle("overflow-hidden", open);

    const openIcon = menuButton.querySelector("[data-menu-open-icon]");
    const closeIcon = menuButton.querySelector("[data-menu-close-icon]");
    openIcon?.classList.toggle("hidden", open);
    closeIcon?.classList.toggle("hidden", !open);

    if (open) {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }

      mobileMenu.removeAttribute("inert");
      mobileMenu.classList.remove("hidden");
      animateMenuOpen();

      const focusTarget = closeButton ?? mobileMenu.querySelector("a, button");
      if (focusTarget instanceof HTMLElement) {
        window.setTimeout(() => {
          focusTarget.focus();
        }, 0);
      }
    } else {
      animateMenuClose(() => {
        mobileMenu.classList.add("hidden");
        mobileMenu.setAttribute("inert", "");
        resetAnimations();
        menuButton.focus();
      });
    }
  };

  // Menu button: toggle open/close
  menuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenuOpen(!getMenuState());
  });

  // Close button
  // Samsung Internet does not reliably fire 'click' on elements inside CSS-transformed
  // containers (skewY). Using touchstart (fires before transform hit-testing) for touch
  // devices, and click for mouse/desktop. A flag prevents double-firing.
  if (closeButton) {
    let closeTouchFired = false;

    closeButton.addEventListener("touchstart", (e) => {
      e.preventDefault(); // prevents synthetic click that follows
      closeTouchFired = true;
      setMenuOpen(false);
    }, { passive: false });

    closeButton.addEventListener("click", (e) => {
      if (closeTouchFired) {
        closeTouchFired = false;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      setMenuOpen(false);
    });
  }

  // Backdrop
  const backdrop = mobileMenu.querySelector("[data-mobile-menu-backdrop]");
  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target === backdrop) {
        setMenuOpen(false);
      }
    });
  }

  // Submenu toggle
  if (submenuToggle) {
    const submenuId = submenuToggle.getAttribute("aria-controls");
    const submenu = submenuId ? mobileMenu.querySelector(`#${submenuId}`) : null;

    if (submenu instanceof HTMLElement) {
      const isExpanded = submenuToggle.getAttribute("aria-expanded") === "true";
      submenu.classList.toggle("hidden", !isExpanded);
      submenu.setAttribute("aria-hidden", String(!isExpanded));
    }

    submenuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isExpanded = submenuToggle.getAttribute("aria-expanded") === "true";
      const icon = submenuToggle.querySelector("[data-mobile-submenu-icon]");

      submenuToggle.setAttribute("aria-expanded", String(!isExpanded));
      submenu?.classList.toggle("hidden", isExpanded);
      if (submenu instanceof HTMLElement) {
        submenu.setAttribute("aria-hidden", String(isExpanded));
      }
      icon?.classList.toggle("rotate-180", !isExpanded);
    });
  }

  // Close on link click (except submenu toggles)
  mobileMenu.addEventListener("click", (e) => {
    const target = e.target;
    const isLink = target.matches("a") || target.closest("a");
    const isSubmenuToggle = target.matches("[data-mobile-submenu-toggle]") || target.closest("[data-mobile-submenu-toggle]");
    
    if (isLink && !isSubmenuToggle) {
      setMenuOpen(false);
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && getMenuState()) {
      setMenuOpen(false);
    }
  });

  // Close on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && getMenuState()) {
      setMenuOpen(false);
    }
  });

  mobileMenu.setAttribute("aria-hidden", "true");
  mobileMenu.setAttribute("inert", "");
}