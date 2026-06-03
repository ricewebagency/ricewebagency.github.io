const portfolioItems = [
	{
		company: "MD Compleet",
		companyColor: "#345f3f",
		eyebrow: "Buitenwerk",
		headline: "Lokale, Zaanse buitenwerk specialist in tuin, terras en veranda",
		imageUrl: "../assets/portfolio/md-compleet/hero.jpg",
		slug: "md-compleet",
		categories: ["techniek-installatie", "ondernemer"],
	},
	{
		company: "Klimazon",
		companyColor: "#325ea7",
		eyebrow: "Techniek & Installatie",
		headline: "Een betrouwbare Zaanse specialist in klimaat- en installatietechniek",
		imageUrl: "../assets/images/portfolio/portfolio-klimazon-1920-1080.png",
		slug: "klimazon",
		categories: ["techniek-installatie", "ondernemer"],
	},
	{
		company: "Proper Beauty Salon",
		companyColor: "#cfb9ab",
		eyebrow: "Beauty salon",
		headline: "Een moderne beauty salon voor prachtige nagels",
		imageUrl: "../assets/images/portfolio/portfolio-proper-beauty-salon-1920-1080.png",
		slug: "proper-beauty-salon",
		categories: ["beauty-salon", "ondernemer"],
	},
	{
		company: "Oottat Tattoo",
		companyColor: "#947239",
		eyebrow: "Creatieve sector",
		headline: "Oottat Tattoo een Zaanse studio voor custom tattoos en artistieke verhalen",
		imageUrl: "../assets/images/portfolio/portfolio-oottattattoo-1920-1080.png",
		slug: "oottat-tattoo",
		categories: ["creatieve-sector", "ondernemer"],
	},
	{
		company: "Glamour by Tink",
		companyColor: "#a36a10",
		eyebrow: "Beauty salon",
		headline: "Glamour by Tink een beauty salon en academy voor permanente make-up behandelingen",
		imageUrl: "../assets/images/portfolio/portfolio-glamourbytink-1920-1080.png",
		slug: "glamour-by-tink",
		categories: ["beauty-salon", "ondernemer"],
	},
	{
		company: "Petra's Laser & Beauty",
		companyColor: "#878787",
		eyebrow: "Beauty salon",
		headline: "Een salon gespecialiseerd in huidverbetering en persoonlijke aandacht",
		imageUrl: "../assets/images/portfolio/portfolio-petraslaserenbeauty-1920-1080.png",
		slug: "petras-laser-beauty",
		categories: ["beauty-salon", "ondernemer"],
	},
	{
		company: "Studio IEKS",
		companyColor: "#996869",
		eyebrow: "Creatieve sector",
		headline: "Studio IEKS, een creatieve studio. Lokaal uit de Zaanstreek",
		imageUrl: "../assets/images/portfolio/portfolio-studio-ieks-1920-1080.png",
		slug: "studio-ieks",
		categories: ["creatieve-sector", "ondernemer"],
	},
];

function isValidHexColor(value) {
	return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value);
}

function getPortfolioItemHref(slug) {
	const cleanPath = window.location.pathname.replace(/\/+$/, "");
	const onPortfolioOverview =
		cleanPath.endsWith("/portfolio") || cleanPath.endsWith("/portfolio/index.html");

	if (onPortfolioOverview) {
		return `./${slug}`;
	}

	return `./portfolio/${slug}`;
}

export function initPortfolio() {
	const grid = document.querySelector("[data-portfolio-grid]");
	const filterButtons = [...document.querySelectorAll("[data-portfolio-filter]")];

	if (!grid) {
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

	function renderCards(activeFilter = "all") {
		grid.replaceChildren();

		const itemsToRender =
			activeFilter === "all"
				? portfolioItems
				: portfolioItems.filter((item) => item.categories.includes(activeFilter));

		const fragment = document.createDocumentFragment();

		itemsToRender.forEach(({ company, companyColor, headline, imageUrl, slug }, index) => {
			const href = getPortfolioItemHref(slug);
			const isEvenCard = (index + 1) % 2 === 0;

			const article = document.createElement("article");
			article.className =
				"overflow-hidden rounded-[0.75rem] border border-slate-200/70 bg-[#fbfbfb] md:grid md:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:flex " +
				(isEvenCard ? "lg:flex-row-reverse" : "lg:flex-row");

			const imageLink = document.createElement("a");
			imageLink.href = href;
			imageLink.className = "block h-full w-full bg-[#e8e1dc] lg:w-1/2";

			const img = document.createElement("img");
			img.src = imageUrl;
			img.alt = company;
			img.className = "block h-full min-h-[11.5rem] w-full object-cover [overflow-clip-margin:unset] transition-transform duration-300 hover:scale-[1.03]";
			img.loading = "lazy";
			imageLink.appendChild(img);

			const textWrapper = document.createElement("div");
			textWrapper.className = "flex flex-col justify-between gap-7 px-4 py-5 sm:px-6 sm:py-7 md:px-8 lg:w-1/2";

			const content = document.createElement("div");
			content.className = "space-y-5";

			const companyLabel = document.createElement("p");
			companyLabel.className = "text-base font-black tracking-[0.12em] text-[#bba0f9]";
			companyLabel.textContent = company;
			if (typeof companyColor === "string" && isValidHexColor(companyColor)) {
				companyLabel.style.color = companyColor;
			}

			const headlineLink = document.createElement("a");
			headlineLink.href = href;
			headlineLink.className =
				"block max-w-[28rem] text-xl font-black leading-[1.12] tracking-[0.04em] text-slate-950/80 transition-colors hover:text-[#bba0f9] lg:text-[2.05rem]";
			headlineLink.textContent = headline;

			content.append(companyLabel, headlineLink);

			const ctaLink = document.createElement("a");
			ctaLink.href = href;
			ctaLink.className =
				"inline-flex items-center gap-3 text-[1.35rem] font-black tracking-[-0.03em] text-slate-900/80 transition-colors hover:text-[#bba0f9] sm:text-[1.45rem]";
			ctaLink.innerHTML =
				'<span>Bekijk deze case</span><span aria-hidden="true" class="text-[1.35em] text-[#bba0f9] leading-none">→</span>';

			textWrapper.append(content, ctaLink);
			article.append(imageLink, textWrapper);
			fragment.appendChild(article);
		});

		grid.appendChild(fragment);
	}

	filterButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const nextFilter = button.dataset.portfolioFilter || "all";
			setActiveFilterState(nextFilter);
			renderCards(nextFilter);
		});
	});

	setActiveFilterState("all");
	renderCards("all");
}
