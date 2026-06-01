export function initHeroVideo() {
  const heroVideo = document.querySelector("[data-hero-video]");
  const heroOverlay = document.querySelector("[data-hero-overlay]");

  /*
  if (heroOverlay instanceof HTMLElement) {
    requestAnimationFrame(() => {
      heroOverlay.classList.remove("bg-[#09001ea3]");
      heroOverlay.classList.add("bg-[#00000091]");
    });
  }
  */

  if (!(heroVideo instanceof HTMLVideoElement)) {
    return;
  }

  const setPlaybackRate = () => {
    heroVideo.playbackRate = 3;
    heroVideo.defaultPlaybackRate = 3;
  };

  setPlaybackRate();
  heroVideo.addEventListener("loadedmetadata", setPlaybackRate);
}