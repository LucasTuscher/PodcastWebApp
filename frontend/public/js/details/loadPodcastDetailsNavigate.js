async function loadPodcastDetailsAndNavigate(podcast) {
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
        resetSearch();
    } catch (error) {
        console.error('Fehler beim Laden der Episoden:', error);
    }
}

async function loadEpisodes(podcastId) {
    const response = await fetch(`https://api.fyyd.de/0.2/podcast/episodes?podcast_id=${podcastId}`);
    if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Episoden-Daten: ' + response.statusText);
    }
    return await response.json();
}
