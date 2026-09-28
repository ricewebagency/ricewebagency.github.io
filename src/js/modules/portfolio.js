export function initPortfolio() {
	const grid = document.querySelector("[data-portfolio-grid]");
	const cards = [...document.querySelectorAll("[data-portfolio-item]")];
	const filterButtons = [...document.querySelectorAll("[data-portfolio-filter]")];

	if (!grid || cards.length === 0) {
		return;
	}

	function setActiveFilterState(activeFilter) {
		filterButtons.forEach((button) => {
			const isActive = button.dataset.portfolioFilter === activeFilter;
			button.setAttribute("aria-pressed", isActive ? "true" : "false");
			button.classList.toggle("text-[#bba0f9]", isActive);
			button.classList.toggle("text-slate-900", !isActive);
		});
	}

	function applyFilter(activeFilter = "all") {
		cards.forEach((card) => {
			const categories = (card.dataset.portfolioCategories || "")
				.split(",")
				.map((value) => value.trim())
				.filter(Boolean);
			const isVisible = activeFilter === "all" || categories.includes(activeFilter);
			card.hidden = !isVisible;
			card.setAttribute("aria-hidden", isVisible ? "false" : "true");
		});
	}

	filterButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const nextFilter = button.dataset.portfolioFilter || "all";
			setActiveFilterState(nextFilter);
			applyFilter(nextFilter);
		});
	});

	setActiveFilterState("all");
	applyFilter("all");
}
