async function logout() {
    try {
        const response = await fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();
        console.log("Server Antwort:", data);

        if (response.ok) {
            console.log('Erfolgreich abgemeldet.');
            window.location.reload();
        } else {
            console.log(`Fehler: ${data.error}`);
            console.error("Server-Fehler:", data);
        }
    } catch (error) {
        console.log('Fehler beim Abmelden: ' + error.message);
        console.error("Netzwerk- oder Serverproblem:", error);
    }
}