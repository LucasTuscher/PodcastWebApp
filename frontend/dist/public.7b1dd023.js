function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function getRandomPodcast() {
    const podcastInfoDiv = document.getElementById('podcastInfo');
    podcastInfoDiv.innerHTML = `
        <div class='session-renewed-container'>
            <div class='session-renewed-left-container'>
                <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
            </div>
            <div class='session-renewed-right-container'>
                <div class="loading-animation-01-container">
                    <div class="loading-animation-01-bar"></div>
                    <div class="loading-animation-01-bar"></div>
                    <div class="loading-animation-01-bar"></div>
                    <div class="loading-animation-01-bar"></div>
                    <div class="loading-animation-01-bar"></div>
                    <div class="loading-animation-01-bar"></div>
                    <div class="loading-animation-01-bar"></div>
                    <div class="loading-animation-01-bar"></div>
                </div>
            </div>
        </div>
    `;
    let podcastFound = false;
    let podcastData = null;
    while(!podcastFound){
        let randomPodcastId = getRandomInt(1, 100000);
        let apiUrl = `https://api.fyyd.de/0.2/podcast?podcast_id=${randomPodcastId}`;
        try {
            let response = await fetch(apiUrl);
            if (response.ok) {
                podcastData = await response.json();
                if (podcastData.data && podcastData.data.id) podcastFound = true;
            }
        } catch (error) {
        // Podcast wurde noch nicht gefunden (Funktion wir danach nochmal aufgerufen)
        }
    }
    if (podcastFound && podcastData) {
        podcastInfoDiv.innerHTML = `
            <div class="random-podcast-podcast-infoitem" id="podcastInfoItem">
                <div class="random-podcast-podcast-image-container">
                    <img class="random-podcast-image" src="${podcastData.data.layoutImageURL}" alt="${podcastData.data.title}">
                </div>
                <div class="random-podcast-podcast-title-container">
                    <div class="random-podcast-podcast-title-distance">
                    <h1 class="random-podcast-podcast-title">${podcastData.data.title}</h1>
                    <p class="random-podcast-podcast-desc">${podcastData.data.description}</p>
                    </div>
                </div>
            </div>
        `;
        // Event-Listener für den Klick auf das Podcast-Element hinzufügen
        document.getElementById('podcastInfoItem').addEventListener('click', function() {
            loadPodcastDetailsAndNavigateForRandom(podcastData.data);
        });
    } else podcastInfoDiv.innerHTML = "No podcast found. Please try again.";
}
// Funktion zum Laden der Podcast-Details und zur Navigation zur Detailseite
async function loadPodcastDetailsAndNavigateForRandom(podcast) {
    try {
        const episodesData = await loadEpisodes(podcast.id);
        const podcastData = {
            id: podcast.id,
            title: podcast.title,
            author: podcast.author,
            description: podcast.description,
            layoutImageURL: podcast.layoutImageURL,
            episodes: episodesData.data
        };
        navigateTo('podcastDetail', podcastData);
    } catch (error) {
        console.error('Fehler beim Laden der Episoden:', error);
    }
}
// Funktion zum Laden der Episoden eines Podcasts
async function loadEpisodes(podcastId) {
    const response = await fetch(`https://api.fyyd.de/0.2/podcast/episodes?podcast_id=${podcastId}`);
    if (!response.ok) throw new Error('Fehler beim Abrufen der Episoden-Daten: ' + response.statusText);
    return await response.json();
}

//# sourceMappingURL=public.7b1dd023.js.map
