async function loadProfileData() {
    try {
        // Zuerst prüfen, ob der Benutzer eingeloggt ist
        const loginResponse = await fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/isLoggedIn', {
            method: 'GET',
            credentials: 'include'
        });
        if (!loginResponse.ok) {
            console.log('Benutzer ist nicht eingeloggt oder Session abgelaufen.');
            const container = document.getElementById('account-administration-profildata-main-container');
            container.textContent = "Sie sind nicht eingeloggt. Bitte melden Sie sich an.";
            return;
        }
        const loginData = await loginResponse.json();
        if (!loginData.loggedIn) {
            const container = document.getElementById('account-administration-profildata-main-container');
            container.textContent = "Sie sind nicht eingeloggt.";
            return;
        }
        // Wenn der Benutzer eingeloggt ist, lade die Profil-Daten
        const userData = loginData.userData;
        const container = document.getElementById('account-administration-profildata-main-container');
        const firstnameElement = document.createElement('h1');
        firstnameElement.classList.add('account-administration-profildata-main-text');
        firstnameElement.textContent = `Vorname: ${userData.firstname}`;
        const usernameElement = document.createElement('h1');
        usernameElement.classList.add('account-administration-profildata-main-text');
        usernameElement.textContent = `Benutzername: ${userData.username}`;
        const emailElement = document.createElement('h1');
        emailElement.classList.add('account-administration-profildata-main-text');
        emailElement.textContent = `Email: ${userData.email}`;
        // Füge die Elemente zum Container hinzu
        container.appendChild(firstnameElement);
        container.appendChild(usernameElement);
        container.appendChild(emailElement);
    } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
        const container = document.getElementById('account-administration-profildata-main-container');
        container.textContent = "Fehler beim Laden der Benutzerdaten. Bitte versuchen Sie es sp\xe4ter erneut.";
    }
}

//# sourceMappingURL=public.caa828ba.js.map
