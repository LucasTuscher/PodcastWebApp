async function handleSearchClick() {
    const query = document.getElementById('podcastSearchQuery').value;
    const resultsContainer = document.querySelector('.podcast-search-result-content');

    if (!query) {
        return;
    }

    resultsContainer.innerHTML = `
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

    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.fyyd.de/0.2/search/podcast?title=${encodedQuery}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen von Podcasts: ${response.status}`);
        }

        const data = await response.json();
        const podcasts = data.data || [];

        resultsContainer.innerHTML = '';

        if (podcasts.length === 0) {
            resultsContainer.innerHTML = '<p style="color:rgb(255, 255, 255, 0.5);">Keine Podcasts gefunden.</p>';
        } else {
            podcasts.forEach((podcast, index) => {
                const podcastItem = createPodcastItem(podcast);
                if (index % 2 !== 0) {
                    podcastItem.classList.add('result-podcast-new-background');
                }

                podcastItem.addEventListener('click', () => loadPodcastDetailsAndNavigate(podcast));

                resultsContainer.appendChild(podcastItem);
            });
        }
    } catch (error) {
        console.error('Fehler beim Abrufen von Podcasts:', error);
        resultsContainer.innerHTML = '<p style="color:rgb(255, 255, 255, 0.5);">Fehler beim Laden der Podcasts. Bitte versuchen Sie es später erneut.</p>';
    }
}

function createPodcastItem(podcast) {
    const item = document.createElement('div');
    item.classList.add('podcast-search-result-podcast-item');

    const leftContainer = document.createElement('div');
    leftContainer.classList.add('podcast-search-result-podcast-left-container');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('podcast-search-result-podcast-image-container');

    const image = document.createElement('img');
    image.classList.add('podcast-search-result-podcast-image');
    image.src = podcast.layoutImageURL;
    image.alt = `Bild von ${podcast.title}`;

    imageContainer.appendChild(image);
    leftContainer.appendChild(imageContainer);

    const titleContainer = document.createElement('div');
    titleContainer.classList.add('podcast-search-result-podcast-title');

    const title = document.createElement('h1');
    title.textContent = podcast.title;

    titleContainer.appendChild(title);
    leftContainer.appendChild(titleContainer);

    item.appendChild(leftContainer);

    return item;
}