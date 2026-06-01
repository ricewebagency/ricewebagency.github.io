const USE_FAKE_CONTACT_SUBMIT = false;
const CONTACT_FIELD_LABELS = {
  name: "Naam",
  phone: "Telefoonnummer",
  company: "Bedrijfsnaam",
  email: "E-mailadres",
  message: "Bericht",
};

function localizeFieldNames(formData) {
  Object.entries(CONTACT_FIELD_LABELS).forEach(([originalName, localizedName]) => {
    if (!formData.has(originalName)) {
      return;
    }

    const values = formData.getAll(originalName);
    formData.delete(originalName);

    values.forEach((value) => {
      formData.append(localizedName, value);
    });
  });
}

function fillEmptyValues(formData) {
  for (const [name, value] of Array.from(formData.entries())) {
    if (typeof value === "string" && value.trim() === "") {
      formData.set(name, "(leeg)");
    }
  }
}

function createFeedbackController(root) {
  const feedbackModal = root.querySelector("[data-contact-feedback]");
  const feedbackDialog = root.querySelector("[data-contact-feedback-dialog]");
  const feedbackTitle = root.querySelector("#contact-feedback-title");
  const feedbackMessage = root.querySelector("[data-contact-feedback-message]");
  const feedbackCloseButtons = [
    ...root.querySelectorAll("[data-contact-feedback-close], [data-contact-feedback-confirm]"),
  ];

  let lastFocusedElement = null;

  const close = () => {
    if (!(feedbackModal instanceof HTMLElement) || !(feedbackDialog instanceof HTMLElement)) {
      return;
    }

    feedbackModal.classList.add("pointer-events-none", "opacity-0", "hidden");
    feedbackModal.classList.remove("flex");
    feedbackDialog.classList.add("translate-y-6");
    feedbackModal.setAttribute("aria-hidden", "true");

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  const open = ({ title, message }) => {
    if (!(feedbackModal instanceof HTMLElement) || !(feedbackDialog instanceof HTMLElement)) {
      return;
    }

    if (feedbackTitle instanceof HTMLElement) {
      feedbackTitle.textContent = title;
    }

    if (feedbackMessage instanceof HTMLElement) {
      feedbackMessage.textContent = message;
    }

    lastFocusedElement = document.activeElement;
    feedbackModal.classList.remove("hidden", "pointer-events-none", "opacity-0");
    feedbackModal.classList.add("flex");
    feedbackDialog.classList.remove("translate-y-6");
    feedbackModal.setAttribute("aria-hidden", "false");

    const closeTarget = feedbackCloseButtons[0];

    if (closeTarget instanceof HTMLElement) {
      window.setTimeout(() => {
        closeTarget.focus();
      }, 0);
    }
  };

  feedbackCloseButtons.forEach((button) => {
    button.addEventListener("click", close);
  });

  if (feedbackModal instanceof HTMLElement) {
    feedbackModal.addEventListener("click", (event) => {
      if (event.target === feedbackModal) {
        close();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (feedbackModal instanceof HTMLElement && feedbackModal.getAttribute("aria-hidden") === "false") {
      close();
    }
  });

  return { open };
}

function wireMessageForm(messageForm, feedback) {
  if (!(messageForm instanceof HTMLFormElement)) {
    return;
  }

  const submitButton = messageForm.querySelector('button[type="submit"]');

  messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(messageForm);
    const replyToValue = formData.get("email");

    if (typeof replyToValue === "string" && replyToValue.trim() !== "") {
      formData.set("replyto", replyToValue.trim());
    }

    localizeFieldNames(formData);
    fillEmptyValues(formData);

    const action = messageForm.getAttribute("action");
    const method = messageForm.getAttribute("method") ?? "POST";

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }

    try {
      if (USE_FAKE_CONTACT_SUBMIT) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, 500);
        });

        messageForm.reset();
        feedback.open({
          title: "Er is geen bericht verstuurd",
          message: "De test-modus is ingeschakeld. Dit betekent dat het formulier niet is ingediend en er is geen e-mail verstuurd.",
        });
        return;
      }

      if (!action) {
        feedback.open({
          title: "Verzenden niet mogelijk",
          message: "Het formulier kon niet worden verzonden. Probeer het later opnieuw.",
        });
        return;
      }

      const response = await fetch(action, {
        method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        messageForm.reset();
        feedback.open({
          title: "Bedankt voor je bericht!",
          message: "Je bericht is verstuurd. We nemen snel contact met je op, vrijwel altijd binnen 1 werkdag.",
        });
        return;
      }

      const errorMessage = typeof result.message === "string" && result.message
        ? result.message
        : "Het versturen van je bericht is niet gelukt. Probeer het opnieuw.";

      feedback.open({
        title: "Verzenden mislukt",
        message: errorMessage,
      });
    } catch {
      feedback.open({
        title: "Netwerkfout",
        message: "Er ging iets mis bij het versturen. Controleer je verbinding en probeer opnieuw.",
      });
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
      }
    }
  });
}

function createFilloutLoader(root) {
  const filloutContainer = root.querySelector("[data-fillout-container]");
  let isLoaded = false;
  let pendingLoad = null;

  const ensureFilloutLoaded = () => {
    if (!(filloutContainer instanceof HTMLElement)) {
      return Promise.resolve();
    }

    if (isLoaded) {
      return Promise.resolve();
    }

    if (pendingLoad) {
      return pendingLoad;
    }

    pendingLoad = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src="https://server.fillout.com/embed/v1/"]');

      if (existingScript instanceof HTMLScriptElement) {
        isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://server.fillout.com/embed/v1/";
      script.async = true;
      script.onload = () => {
        isLoaded = true;
        resolve();
      };
      script.onerror = () => {
        pendingLoad = null;
        reject(new Error("Fillout script failed to load"));
      };

      document.head.appendChild(script);
    });

    return pendingLoad;
  };

  return { ensureFilloutLoaded };
}

function wireTabs({ tabs, panels, onTabActivated }) {
  const activateTab = (tabName) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.contactTab === tabName;

      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      tab.classList.toggle("text-slate-950", isActive);
      tab.classList.toggle("text-slate-500", !isActive);
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.contactPanel === tabName;

      panel.classList.toggle("hidden", !isActive);
      panel.classList.toggle("block", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });

    if (typeof onTabActivated === "function") {
      onTabActivated(tabName);
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(tab.dataset.contactTab);
    });

    tab.addEventListener("keydown", (event) => {
      const currentIndex = tabs.indexOf(tab);

      if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % tabs.length;
        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex].dataset.contactTab);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const previousIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        tabs[previousIndex].focus();
        activateTab(tabs[previousIndex].dataset.contactTab);
      }

      if (event.key === "Home") {
        event.preventDefault();
        tabs[0].focus();
        activateTab(tabs[0].dataset.contactTab);
      }

      if (event.key === "End") {
        event.preventDefault();
        const lastIndex = tabs.length - 1;
        tabs[lastIndex].focus();
        activateTab(tabs[lastIndex].dataset.contactTab);
      }
    });

    if (index === 0 && !tab.hasAttribute("data-contact-default")) {
      tab.setAttribute("data-contact-default", "");
    }
  });

  const defaultTab = tabs.find((tab) => tab.hasAttribute("data-contact-default")) ?? tabs[0];
  activateTab(defaultTab.dataset.contactTab);

  document.querySelectorAll("[data-contact-open]").forEach((link) => {
    link.addEventListener("click", () => {
      const tabName = link.dataset.contactOpen;

      if (tabName) {
        activateTab(tabName);
      }
    });
  });
}

export function initContactTabs() {
  const root = document.querySelector("[data-contact-switcher]");

  if (!(root instanceof HTMLElement)) {
    return;
  }

  const tabs = [...root.querySelectorAll("[data-contact-tab]")];
  const panels = [...root.querySelectorAll("[data-contact-panel]")];

  if (!tabs.length || !panels.length) {
    return;
  }

  const feedback = createFeedbackController(root);
  const messageForm = root.querySelector("[data-contact-message-form]") ?? root.querySelector("form");
  const { ensureFilloutLoaded } = createFilloutLoader(root);

  wireMessageForm(messageForm, feedback);
  wireTabs({
    tabs,
    panels,
    onTabActivated: (tabName) => {
      if (tabName === "call") {
        ensureFilloutLoaded().catch(() => {
          // Keep interaction responsive even if the external script is blocked.
        });
      }
    },
  });
}
