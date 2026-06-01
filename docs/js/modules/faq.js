export function initFaq() {
  const faqButtons = [...document.querySelectorAll("[data-faq-button]")];

  if (!faqButtons.length) {
    return;
  }

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest("article");
      const panel = item?.querySelector("[data-faq-panel]");
      const icon = item?.querySelector("[data-faq-icon]");
      const isOpen = panel && !panel.classList.contains("hidden");

      faqButtons.forEach((otherButton) => {
        const otherItem = otherButton.closest("article");
        const otherPanel = otherItem?.querySelector("[data-faq-panel]");
        const otherIcon = otherItem?.querySelector("[data-faq-icon]");

        otherPanel?.classList.add("hidden");
        if (otherIcon) {
          otherIcon.textContent = "+";
        }
      });

      if (!panel) {
        return;
      }

      panel.classList.toggle("hidden", isOpen);
      if (icon) {
        icon.textContent = isOpen ? "+" : "−";
      }
    });
  });
}