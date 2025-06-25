let resultCount = 0;
const count = 6; // Anzahl der maximalen Ergebnisse

// Funktion zur Suche nach Podcasts
function searchPodcasts() {
    let query = document.getElementById("searchQuery").value.trim();
    let statusMessage = document.getElementById("statusMessage");
    let results = document.getElementById("results");
    let activeSearchSystem = document.querySelector(".sidebar-search-result-container");
    let closeButton = document.getElementById("closeButton");

    if (!query) {
        results.innerHTML = '';
        statusMessage.textContent = '';
        activeSearchSystem.classList.remove("active");
        closeButton.style.display = 'none';
        resultCount = 0;
        return;
    }

    activeSearchSystem.classList.add("active");
    statusMessage.textContent = "Suche läuft...";
    results.innerHTML = '';
    closeButton.style.display = 'block';
    resultCount = 0;

    fetch(`https://api.fyyd.de/0.2/search/podcast?title=${encodeURIComponent(query)}&count=${count}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            statusMessage.textContent = `Such Status: ${response.status} ${response.statusText}`;
            return response.json();
        })
        .then(data => {
            let podcasts = data.data;

            podcasts.slice(0, count).forEach((podcast) => {
                if (resultCount >= count) return;
                let div = document.createElement('div');
                div.className = 'podcast';
                div.innerHTML = `
                    <div class="sidebar-search-result-main-container">
                        <button class="sidebar-search-result-main-button" style="position:relative;z-index:100;">
                            <div class="sidebar-search-result-main-image-container">
                                <img class="sidebar-search-result-main-image lazy" src="${podcast.layoutImageURL}" alt="Bild des Podcasts">
                            </div>
                            <div class="sidebar-search-result-main-title-container">
                                <h2 class="sidebar-search-result-main-title">${podcast.title}</h2>
                            </div>
                       </button>
                    </div>
                `;
                div.querySelector('.sidebar-search-result-main-button').addEventListener('click', () => {
                    loadPodcastDetailsAndNavigate(podcast);
                });
                results.appendChild(div);
                resultCount++;
            });

            if (resultCount === 0) {
                statusMessage.textContent = 'Keine Ergebnisse gefunden.';
            } else {
                statusMessage.textContent = `${resultCount} Ergebnisse gefunden.`;
            }
        })
        .catch(error => {
            statusMessage.textContent = 'Fehler bei der Suche: ' + error.message;
        });
}

// Funktion zum Zurücksetzen der Suche
function resetSearch() {
    document.getElementById("searchQuery").value = '';
    document.getElementById("statusMessage").textContent = '';
    document.getElementById("results").innerHTML = '';
    document.querySelector(".sidebar-search-result-container").classList.remove("active");
    document.getElementById("closeButton").style.display = 'none';
    resultCount = 0;
}

function checkScreenWidth() {
    if (window.innerWidth < 650) {
        resetSearch();
    }
}
window.addEventListener('load', checkScreenWidth);
window.addEventListener('resize', checkScreenWidth);

// Event-Listener für den "Close"-Button
document.getElementById("closeButton").addEventListener('click', resetSearch);

// Event-Listener für das Suchfeld, um den "Close"-Button anzuzeigen und die Suche auszuführen, wenn das Feld fokussiert wird
document.getElementById("searchQuery").addEventListener('focus', () => {
    document.getElementById("closeButton").style.display = 'block';
    searchPodcasts(); // Suche ausführen, wenn das Feld fokussiert wird
});

// Event-Listener für die Eingabetaste, um die Suche auszuführen
document.getElementById("searchQuery").addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchPodcasts();
    }
});
