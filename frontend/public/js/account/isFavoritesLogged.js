async function isFavoritesLogged(podcastId) {
    try {
        // Zuerst prüfen, ob der Benutzer eingeloggt ist
        const loginResponse = await fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/isLoggedIn', {
            method: 'GET',
            credentials: 'include'
        });

        const container = document.querySelector('.podcastdetail-right-content.under-right-container');
        container.innerHTML = ''; // Container leeren

        if (!loginResponse.ok) {
            // Benutzer ist nicht eingeloggt oder Session abgelaufen
            container.innerHTML = `
                <div class="account-administration-profildata-not-logged-in">
                    <p>Sie sind nicht eingeloggt. Bitte melden Sie sich an.</p>
                </div>
            `;
            return;
        }

        const loginData = await loginResponse.json();
        if (!loginData.loggedIn) {
            // Benutzer ist nicht eingeloggt
            container.innerHTML = `
                <div class="account-administration-profildata-not-logged-in">
                    <p>Sie sind nicht eingeloggt.</p>
                </div>
            `;
            return;
        }

        // Benutzer ist eingeloggt, überprüfe Favoritenstatus
        const favoriteResponse = await fetch(`https://webengineering.ins.hs-anhalt.de:10062/auth/favorites/check/${podcastId}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!favoriteResponse.ok) {
            // Fehler beim Abrufen des Favoritenstatus
            console.error('Fehler beim Abrufen des Favoritenstatus');
            container.innerHTML = `<p>Fehler beim Überprüfen der Favoriten.</p>`;
            return;
        }

        const favoriteData = await favoriteResponse.json();
        let favoriteStatusClass = favoriteData.isFavorite ? 'fa-solid fa-star' : 'fa-regular fa-star';

        // Zeige den Favoriten-Button an
        container.innerHTML = `
            <div class="account-administration-profildata-logged-in">
                <button id="favorite-button-${podcastId}" class="podcastdetail-right-favorite-podcast-star" onclick="toggleFavorite('${podcastId}')">
                    <i id="favorite-icon-${podcastId}" class="${favoriteStatusClass}"></i>
                </button>
            </div>
        `;
    } catch (error) {
        console.error('Fehler beim Abrufen des Login- oder Favoritenstatus:', error);
        container.innerHTML = `<p>Ein Fehler ist aufgetreten.</p>`;
    }
}

async function toggleFavorite(podcastId) {
    try {
        const favoriteIcon = document.getElementById(`favorite-icon-${podcastId}`);
        let method = favoriteIcon.classList.contains('fa-regular') ? 'POST' : 'DELETE';

        let url = `https://webengineering.ins.hs-anhalt.de:10062/auth/favorites/${method === 'POST' ? 'add' : 'remove/' + podcastId}`;

        let options = {
            method: method,
            credentials: 'include'
        };

        if (method === 'POST') {
            // Für POST-Anfragen die podcastId im Request Body senden
            options.headers = {
                'Content-Type': 'application/json'
            };
            options.body = JSON.stringify({ podcastId: podcastId });
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            console.error('Fehler beim Aktualisieren des Favoritenstatus');
            return;
        }

        if (method === 'POST') {
            favoriteIcon.classList.remove('fa-regular');
            favoriteIcon.classList.add('fa-solid');
        } else {
            favoriteIcon.classList.remove('fa-solid');
            favoriteIcon.classList.add('fa-regular');
        }
    } catch (error) {
        console.error('Fehler beim Umschalten des Favoritenstatus:', error);
    }
}

/*
// Funktion zum Umschalten des Favoritenstatus
async function toggleFavorite(podcastId) {
    try {
        const favoriteIcon = document.getElementById(`favorite-icon-${podcastId}`);
        let method = favoriteIcon.classList.contains('fa-regular') ? 'POST' : 'DELETE'; // POST zum Hinzufügen, DELETE zum Entfernen

        const response = await fetch(`https://webengineering.ins.hs-anhalt.de:10062/auth/favorites/${method === 'POST' ? 'add' : 'remove'}/${podcastId}`, {
            method: method,
            credentials: 'include'
        });

        if (!response.ok) {
            console.error('Fehler beim Aktualisieren des Favoritenstatus');
            return;
        }

        // Aktualisiere das Icon basierend auf dem neuen Status
        if (method === 'POST') {
            favoriteIcon.classList.remove('fa-regular');
            favoriteIcon.classList.add('fa-solid');
        } else {
            favoriteIcon.classList.remove('fa-solid');
            favoriteIcon.classList.add('fa-regular');
        }
    } catch (error) {
        console.error('Fehler beim Umschalten des Favoritenstatus:', error);
    }
}

 */