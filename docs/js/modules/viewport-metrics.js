export function initViewportMetrics() {
  const header = document.querySelector("[data-site-header]");
  const root = document.documentElement;

  const updateMetrics = () => {
    if (header) {
      root.style.setProperty("--header-height", `${header.offsetHeight}px`);
    }
  };

  updateMetrics();

  if (header && "ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(updateMetrics);
    resizeObserver.observe(header);
  }

  window.addEventListener("resize", updateMetrics, { passive: true });
  window.visualViewport?.addEventListener("resize", updateMetrics, { passive: true });
}