export function initUnderlinedHeading() {
  const heading = document.querySelector("[data-underlined-heading]");
  const anchor = document.querySelector("[data-underlined-heading-anchor]");
  const underline = document.querySelector("[data-underlined-heading-art]");

  if (!(heading instanceof HTMLElement) || !(anchor instanceof HTMLElement) || !(underline instanceof HTMLElement)) {
    return;
  }

  let frameId = 0;

  const getHeadingLineCount = () => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });

    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    if (!textNodes.length) {
      return 1;
    }

    const range = document.createRange();
    const firstNode = textNodes[0];
    const lastNode = textNodes.at(-1);

    if (!firstNode || !lastNode) {
      return 1;
    }

    range.setStart(firstNode, 0);
    range.setEnd(lastNode, lastNode.textContent?.length ?? 0);

    return Math.max(range.getClientRects().length, 1);
  };

  const applyUnderlineState = () => {
    const isSingleLine = getHeadingLineCount() === 1;

    underline.classList.toggle("lg:translate-x-[3.5rem]", isSingleLine);
    underline.classList.toggle("lg:-translate-x-1/2", !isSingleLine);
    underline.classList.toggle("md:translate-x-[2rem]", isSingleLine);
    underline.classList.toggle("md:-translate-x-1/2", !isSingleLine);
    anchor.classList.toggle("mx-auto", !isSingleLine);
  };

  const scheduleUpdate = () => {
    if (frameId) {
      return;
    }

    frameId = window.requestAnimationFrame(() => {
      frameId = 0;
      applyUnderlineState();
    });
  };

  applyUnderlineState();

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(heading);
  }

  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleUpdate, { passive: true });
  document.fonts?.ready.then(scheduleUpdate).catch(() => {});
}