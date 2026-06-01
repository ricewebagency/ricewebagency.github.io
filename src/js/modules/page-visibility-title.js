export function initPageVisibilityTitle(options = {}) {
	if (typeof document === "undefined") {
		return;
	}

	const hiddenTitle = options.hiddenTitle ?? "Psst.. Website laten bouwen?";
	const delayToHiddenMs = Number.isFinite(options.delayToHiddenMs) ? Math.max(0, options.delayToHiddenMs) : 7500;
	const delayToOriginalMs = Number.isFinite(options.delayToOriginalMs) ? Math.max(0, options.delayToOriginalMs) : 1000;
	const originalTitle = document.title;
	let activeTimer = null;

	const clearActiveTimer = () => {
		if (!activeTimer) {
			return;
		}

		window.clearTimeout(activeTimer);
		activeTimer = null;
	};

	const scheduleHidden = () => {
		activeTimer = window.setTimeout(() => {
			document.title = hiddenTitle;
			activeTimer = window.setTimeout(scheduleOriginal, delayToOriginalMs);
		}, delayToHiddenMs);
	};

	const scheduleOriginal = () => {
		activeTimer = window.setTimeout(() => {
			document.title = originalTitle;
			scheduleHidden();
		}, 0);
	};

	document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			clearActiveTimer();
			scheduleHidden();
			return;
		}

		clearActiveTimer();
		document.title = originalTitle;
	});
}
