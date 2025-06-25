document.addEventListener("DOMContentLoaded", function() {
    let input = document.getElementById("searchQuery");
    let inputContainer = document.querySelector(".sidebar-search-content");
    input.addEventListener("focus", function() {
        inputContainer.classList.add("focused");
    });
    input.addEventListener("blur", function() {
        inputContainer.classList.remove("focused");
    });
});

//# sourceMappingURL=public.ae5d5a4c.js.map
