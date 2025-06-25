const htmlTag = document.querySelector(".htmlclass");
const openPodcastPlayerButton = document.querySelector(".main-podcast-player-left-container");
const podcastFullscreenOpenContainer = document.querySelector(".player-fullscreen-container");
const closeFullscreenModalIcon = document.querySelector(".player-fullscreen-close-icon");
const playerLeftContainer = document.querySelector(".main-podcast-player-left-container");
openPodcastPlayerButton.addEventListener("click", function() {
    podcastFullscreenOpenContainer.classList.add("open");
    htmlTag.classList.add("active");
});
playerLeftContainer.addEventListener("click", function() {
    podcastFullscreenOpenContainer.classList.add("open");
    htmlTag.classList.add("active");
});
closeFullscreenModalIcon.addEventListener("click", function() {
    podcastFullscreenOpenContainer.classList.remove("open");
    htmlTag.classList.remove("active");
});

//# sourceMappingURL=public.af63a0d0.js.map
