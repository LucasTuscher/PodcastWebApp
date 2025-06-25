function fetchCategoryPodcasts(subcategoryId) {
    return fetch('https://api.fyyd.de/0.2/categories')
        .then(response => response.json())
        .then(data => {
            console.log("API response:", data);

            if (!data || !data.data) {
                console.error("Categories data not found in the API response.");
                return [];
            }

            const foundCategory = data.data.find(category =>
                category.subcategories && category.subcategories.some(subcategory => subcategory.id === subcategoryId)
            );

            if (foundCategory) {
                const subcategory = foundCategory.subcategories.find(sub => sub.id === subcategoryId);

                if (subcategory) {
                    return fetch(`https://api.fyyd.de/0.2/category?category_id=${subcategory.id}&count=30`)
                        .then(response => response.json())
                        .then(podcastData => {
                            if (podcastData && podcastData.data && podcastData.data.podcasts) {
                                return podcastData.data.podcasts;
                            } else {
                                console.error('Podcasts data not found in the API response.');
                                return [];
                            }
                        });
                } else {
                    console.error('Subcategory not found');
                    return [];
                }
            } else {
                console.error('Main category containing the subcategory not found');
                return [];
            }
        })
        .catch(error => {
            console.error('Error fetching podcasts:', error);
            return [];
        });
}

function generateCategoryPageContent(podcasts) {
    if (!Array.isArray(podcasts) || podcasts.length === 0) {
        return '<p>Keine Podcasts gefunden.</p>';
    }

    return podcasts.map(podcast =>
        `<div class="category-podcast-item">
            <img class="category-podcast-item-image" src="${podcast.layoutImageURL}" alt="${podcast.title}" onclick='loadPodcastDetailsAndNavigate(${JSON.stringify(podcast)})'>
        </div>`
    ).join('');
}