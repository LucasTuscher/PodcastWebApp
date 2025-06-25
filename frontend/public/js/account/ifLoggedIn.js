async function checkLoginStatusLogoutButton() {
    try {
        // Prüfe, ob der Benutzer eingeloggt ist
        const loginResponse = await fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/isLoggedIn', {
            method: 'GET',
            credentials: 'include'
        });

        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            const logoutButton = document.getElementById('logoutButton');

            // Wenn der Benutzer eingeloggt ist, zeige den Logout-Button
            if (loginData.loggedIn) {
                logoutButton.style.display = 'inline-block'; // Zeige den Button
            } else {
                logoutButton.style.display = 'none'; // Verstecke den Button
            }
        } else {
            // Wenn der Benutzer nicht eingeloggt ist, verstecke den Button
            const logoutButton = document.getElementById('logoutButton');
            logoutButton.style.display = 'none';
        }
    } catch (error) {
        // console.error('Fehler beim Überprüfen des Login-Status:', error);
        const logoutButton = document.getElementById('logoutButton');
        logoutButton.style.display = 'none'; // Verstecke den Button im Fehlerfall
    }
}

// Rufe die Funktion auf, um den Status beim Laden der Seite zu überprüfen
checkLoginStatusLogoutButton();


async function navigateToUserOrLogin() {
    try {
        // Prüfe, ob der Benutzer eingeloggt ist
        const loginResponse = await fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/isLoggedIn', {
            method: 'GET',
            credentials: 'include'
        });

        if (loginResponse.ok) {
            const loginData = await loginResponse.json();

            if (loginData.loggedIn) {
                // Wenn der Benutzer eingeloggt ist, leite ihn zur User Admin-Seite weiter
                navigateTo('account-administration');
            } else {
                // Wenn der Benutzer nicht eingeloggt ist, leite ihn zur Login-Seite weiter
                navigateTo('login');
            }
        } else {
            // Fehler beim Abrufen des Login-Status, leite den Benutzer zur Login-Seite weiter
            // console.log("Fehler beim Abrufen des Login-Status")
            navigateTo('login');
        }
    } catch (error) {
        console.error('Fehler beim Überprüfen des Login-Status:', error);
        // Bei Fehler gehe zum Login
        navigateTo('login');
    }
}