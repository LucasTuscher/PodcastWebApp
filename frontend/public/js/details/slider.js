async function loadSlider() {
    const scriptStartTime = performance.now();

    const sliderContainer = document.querySelector('.main-body-main_page-slider-container');
    const slider = document.querySelector('.slider');
    const loading = document.querySelector('.loading');

    if (!sliderContainer || !slider || !loading) {
        console.error("Slider-Elemente nicht gefunden im DOM.");
        return;
    }

    const count = 12;

    loading.style.display = 'block';
    sliderContainer.style.display = 'none';

    slider.innerHTML = '';

    try {
        const fetchStartTime = performance.now();
        const response = await fetch(`https://api.fyyd.de/0.2/podcast/latest?count=${count}&language=de`);
        const fetchEndTime = performance.now();
        const fetchDuration = fetchEndTime - fetchStartTime;

        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Podcast-Daten: ' + response.statusText);
        }

        const data = await response.json();

        const loadEpisodes = async (podcastId) => {
            const episodesFetchStartTime = performance.now();
            const response = await fetch(`https://api.fyyd.de/0.2/podcast/episodes?podcast_id=${podcastId}`);
            const episodesFetchEndTime = performance.now();
            const episodesFetchDuration = episodesFetchEndTime - episodesFetchStartTime;

            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der Episoden-Daten: ' + response.statusText);
            }
            return await response.json();
        };

        const loadPodcastDetails = async (podcast) => {
            try {
                const episodesData = await loadEpisodes(podcast.id);
                return {
                    id: podcast.id,
                    title: podcast.title,
                    author: podcast.author,
                    description: podcast.description,
                    layoutImageURL: podcast.layoutImageURL,
                    episodes: episodesData.data
                };
            } catch (error) {
                console.error('Fehler beim Laden der Episoden:', error);
                return {
                    id: podcast.id,
                    title: podcast.title,
                    author: podcast.author,
                    description: podcast.description,
                    layoutImageURL: podcast.layoutImageURL,
                    episodes: []
                };
            }
        };

        const addPodcastImageToSlider = async (podcast) => {
            const img = document.createElement('img');
            img.classList.add('slider-image');
            img.src = podcast.layoutImageURL;
            img.alt = podcast.title;
            img.loading = 'lazy';
            img.dataset.podcast = JSON.stringify(await loadPodcastDetails(podcast));

            img.addEventListener('click', () => {
                try {
                    const podcastData = JSON.parse(img.dataset.podcast);
                    navigateTo('podcastDetail', podcastData);
                } catch (parseError) {
                    console.error('Fehler beim Parsen der Podcast-Daten:', parseError);
                }
            });

            slider.appendChild(img);
        };

        const sliderStartTime = performance.now();

        const podcastPromises = data.data.map(addPodcastImageToSlider);
        await Promise.all(podcastPromises);

        const sliderEndTime = performance.now();
        const sliderDuration = sliderEndTime - sliderStartTime;


        loading.style.display = 'none';
        sliderContainer.style.display = 'block';

        document.querySelectorAll('.progress-bar').forEach(calculateProgressBar);

        window.addEventListener('resize', debounce(() => {
            document.querySelectorAll('.progress-bar').forEach(calculateProgressBar);
        }, 250));

    } catch (error) {
        console.error('Fehler:', error);
    } finally {
        const scriptEndTime = performance.now();
        const scriptDuration = scriptEndTime - scriptStartTime;
    }
}

function calculateProgressBar(progressBar) {
    progressBar.innerHTML = "";
    const slider = progressBar.closest(".main-body-main_page-slider-container").querySelector(".slider");
    const itemCount = slider.children.length;
    if (itemCount === 0) return; // Prevent error if no children

    const itemsPerScreen = getItemsPerScreen(slider);
    let sliderIndex = parseInt(getComputedStyle(slider).getPropertyValue("--slider-index"));
    const progressBarItemCount = Math.ceil(itemCount / itemsPerScreen);

    if (sliderIndex >= progressBarItemCount) {
        slider.style.setProperty("--slider-index", progressBarItemCount - 1);
        sliderIndex = progressBarItemCount - 1;
    }

    for (let i = 0; i < progressBarItemCount; i++) {
        const barItem = document.createElement("div");
        barItem.classList.add("progress-item");
        if (i === sliderIndex) {
            barItem.classList.add("active");
        }
        progressBar.append(barItem);
    }
}

function getItemsPerScreen(slider) {
    if (slider.children.length === 0) return 1; // Default value if no children
    const itemWidth = slider.children[0].getBoundingClientRect().width;
    const sliderWidth = slider.getBoundingClientRect().width;
    return Math.floor(sliderWidth / itemWidth);
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

document.addEventListener("click", e => {
    let handle;
    if (e.target.matches(".handle")) {
        handle = e.target;
    } else {
        handle = e.target.closest(".handle");
    }
    if (handle != null) onHandleClick(handle);
});

function onHandleClick(handle) {
    const progressBar = handle.closest(".main-body-main_page-slider-container").querySelector(".progress-bar");
    const slider = handle.closest(".main-body-main_page-slider-container").querySelector(".slider");
    let sliderIndex = parseInt(getComputedStyle(slider).getPropertyValue("--slider-index"));
    const itemsPerScreen = getItemsPerScreen(slider);
    const itemCount = slider.children.length;
    const progressBarItemCount = Math.ceil(itemCount / itemsPerScreen);

    if (handle.classList.contains("left-handle")) {
        sliderIndex = (sliderIndex - 1 + progressBarItemCount) % progressBarItemCount;
    }

    if (handle.classList.contains("right-handle")) {
        sliderIndex = (sliderIndex + 1) % progressBarItemCount;
    }

    slider.style.setProperty("--slider-index", sliderIndex);

    // Update the classes for the progress items
    progressBar.querySelectorAll(".progress-item").forEach((item, index) => {
        if (index === sliderIndex) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}