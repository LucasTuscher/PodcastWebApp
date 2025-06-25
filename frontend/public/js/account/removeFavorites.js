function removePodcastFromFavorites(podcastId) {
    fetch(`https://webengineering.ins.hs-anhalt.de:10062/auth/favorites/remove/${podcastId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Fehler:', data.error);
                alert(`Fehler: ${data.error}`);
                return;
            }

            // Entferne das gelöschte Podcast-Element aus der Anzeige
            const podcastElement = document.querySelector(`.remove-button[data-id="${podcastId}"]`).closest('.favorite-item');
            if (podcastElement) {
                podcastElement.remove();
            }

            alert('Podcast wurde aus den Favoriten entfernt.');
        })
        .catch(error => {
            console.error('Fehler beim Entfernen des Podcasts:', error);
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        });
}