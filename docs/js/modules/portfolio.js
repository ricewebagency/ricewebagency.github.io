const portfolioItems = [
	{
		title: "Oottat Tattoo",
		subtitle: "Moderne website voor een Zaanse tattooshop",
		imageUrl: "../assets/images/portfolio/portfolio-oottattattoo-1920-1080.png",
		slug: "oottat-tattoo",
	},
	{
		title: "Studio IEKS",
		subtitle: "Uitnodigende online aanwezigheid voor een lokale artiestenstudio",
		imageUrl: "../assets/images/portfolio/portfolio-studio-ieks-1920-1080.png",
		slug: "studio-ieks",
	},
	{
		title: "Glamour by Tink",
		subtitle: "Stijlvolle website voor een PMU-salon & academy",
		imageUrl: "../assets/images/portfolio/portfolio-glamourbytink-1920-1080.png",
		slug: "glamour-by-tink",
	},
	{
		title: "Klimazon",
		subtitle: "Professionele website voor een klimaat- & zontechniekbedrijf",
		imageUrl: "../assets/images/portfolio/portfolio-klimazon-1920-1080.png",
		slug: "klimazon",
	},
	{
		title: "Petra's Laser & Beauty",
		subtitle: "Premium website voor beautybehandelingen en laserontharing",
		imageUrl: "../assets/images/portfolio/portfolio-petraslaserenbeauty-1920-1080.png",
		slug: "petras-laser-beauty",
	},
	{
		title: "Proper Beauty Salon",
		subtitle: "Verzorgde webpresentatie voor een nagelsalon",
		imageUrl: "../assets/images/portfolio/portfolio-proper-beauty-salon-1920-1080.png",
		slug: "proper-beauty-salon",
	},
];

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

	if (!grid) {
		return;
	}

	const fragment = document.createDocumentFragment();

	portfolioItems.forEach(({ title, subtitle, imageUrl, slug }) => {
		const href = getPortfolioItemHref(slug);

		const article = document.createElement("article");
		article.className = "flex flex-col gap-4";

		const imageLink = document.createElement("a");
		imageLink.href = href;
		imageLink.className = "block rounded-2xl";

		const img = document.createElement("img");
		img.src = imageUrl;
		img.alt = title;
		img.className = "block w-full h-auto rounded-t-2xl transition-opacity duration-300 hover:opacity-90";
		img.loading = "lazy";
		imageLink.appendChild(img);

		const textWrapper = document.createElement("div");
		textWrapper.className = "flex flex-col gap-1 px-1";

		const h2 = document.createElement("h2");
		h2.className = "text-3xl font-black tracking-[-0.03em] sm:text-4xl";

		const titleLink = document.createElement("a");
		titleLink.href = href;
		titleLink.textContent = title;
		titleLink.className = "text-slate-900 transition-colors duration-300 hover:text-[#bba0f9]";
		h2.appendChild(titleLink);

		const p = document.createElement("p");
		p.className = "text-sm font-medium sm:text-base";

		const subtitleLink = document.createElement("a");
		subtitleLink.href = href;
		subtitleLink.textContent = subtitle;
		subtitleLink.className = "text-slate-500 transition-colors duration-300 hover:text-slate-400";
		p.appendChild(subtitleLink);

		textWrapper.append(h2, p);
		article.append(imageLink, textWrapper);
		fragment.appendChild(article);
	});

	grid.appendChild(fragment);
}
