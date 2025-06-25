function setActiveSidebarButton(page) {
    const sidebarButtonHome = document.querySelector(".navigator-button-home");
    const sidebarButtonFavorite = document.querySelector(".navigator-button-favorite");
    const sidebarButtonCategories = document.querySelector(".navigator-button-categories");
    const sidebarButtonExpandableSearch = document.querySelector(".navigator-button-podcastSearch");
    const sidebarButtonRandom = document.querySelector(".navigator-button-random");
    const sidebarButtonAccount = document.querySelector(".navigator-button-account");

    switch (page) {
        case "home":
            sidebarButtonHome.classList.add("active");
            sidebarButtonCategories.classList.remove("active");
            sidebarButtonExpandableSearch.classList.remove("active");
            sidebarButtonFavorite.classList.remove("active");
            sidebarButtonRandom.classList.remove("active");
            sidebarButtonAccount.classList.remove("active");
            break;
        case "login":
            sidebarButtonAccount.classList.add("active");
            sidebarButtonRandom.classList.remove("active");
            sidebarButtonExpandableSearch.classList.remove("active");
            sidebarButtonHome.classList.remove("active");
            sidebarButtonCategories.classList.remove("active");
            sidebarButtonFavorite.classList.remove("active");
            break;
        case "account-administration":
            sidebarButtonAccount.classList.add("active");
            sidebarButtonRandom.classList.remove("active");
            sidebarButtonExpandableSearch.classList.remove("active");
            sidebarButtonHome.classList.remove("active");
            sidebarButtonCategories.classList.remove("active");
            sidebarButtonFavorite.classList.remove("active");
            break;
        case "register":
            sidebarButtonAccount.classList.add("active");
            sidebarButtonRandom.classList.remove("active");
            sidebarButtonExpandableSearch.classList.remove("active");
            sidebarButtonHome.classList.remove("active");
            sidebarButtonCategories.classList.remove("active");
            sidebarButtonFavorite.classList.remove("active");
            break;
        case "favorites":
            sidebarButtonFavorite.classList.add("active");
            sidebarButtonHome.classList.remove("active");
            sidebarButtonCategories.classList.remove("active");
            sidebarButtonExpandableSearch.classList.remove("active");
            sidebarButtonRandom.classList.remove("active");
            sidebarButtonAccount.classList.remove("active");
            break;
        case "categories":
            sidebarButtonHome.classList.remove("active");
            sidebarButtonCategories.classList.add("active");
            sidebarButtonExpandableSearch.classList.remove("active");
            sidebarButtonFavorite.classList.remove("active");
            sidebarButtonRandom.classList.remove("active");
            sidebarButtonAccount.classList.remove("active");
            break;
        case "podcastSearch":
            sidebarButtonExpandableSearch.classList.add("active");
            sidebarButtonHome.classList.remove("active");
            sidebarButtonCategories.classList.remove("active");
            sidebarButtonFavorite.classList.remove("active");
            sidebarButtonRandom.classList.remove("active");
            sidebarButtonAccount.classList.remove("active");
            break;
        case "randomPodcast":
            sidebarButtonRandom.classList.add("active");
            sidebarButtonExpandableSearch.classList.remove("active");
            sidebarButtonHome.classList.remove("active");
            sidebarButtonCategories.classList.remove("active");
            sidebarButtonFavorite.classList.remove("active");
            sidebarButtonAccount.classList.remove("active");
            break;
        default:
            sidebarButtonHome.classList.remove("active");
            sidebarButtonCategories.classList.remove("active");
            sidebarButtonExpandableSearch.classList.remove("active");
            sidebarButtonFavorite.classList.remove("active");
            sidebarButtonRandom.classList.remove("active");
            sidebarButtonAccount.classList.remove("active");
    }
}