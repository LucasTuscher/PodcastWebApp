
const openResponsiveButton = document.getElementById("openResponsiveButton");
const responsiveSidebarContainer = document.getElementById("responsiveSidebarContainer");
const closeResponsiveMenuIcon = document.getElementById("closeResponsiveMenuIcon");
const responsiveMenuBackground = document.querySelector(".responsive-navigation-background-container");
const htmlTagHidden = document.querySelector(".htmlclass");

openResponsiveButton.addEventListener("click", function() {
    responsiveSidebarContainer.classList.add("opensidebar");
    responsiveMenuBackground.classList.add("active");
    htmlTagHidden.classList.add("active");
})

closeResponsiveMenuIcon.addEventListener("click", function() {
    responsiveSidebarContainer.classList.remove("opensidebar");
    responsiveMenuBackground.classList.remove("active");
    htmlTagHidden.classList.remove("active");
})

document.addEventListener("DOMContentLoaded", (event) => {
    function sekundenanzeige() {
        if (window.matchMedia("(min-width:768px)").matches) {
            //Bildschirm ist mind. 768px breit
            responsiveSidebarContainer.classList.remove("opensidebar");
            responsiveMenuBackground.classList.remove("active");
            htmlTagHidden.classList.remove("active");
        } else {
             //Bildschirm ist kleiner als 768px
        }
    }
    setInterval(sekundenanzeige, 190);
});