async function deleteAccount() {
    const confirmed = window.confirm('Möchten Sie Ihren Account wirklich löschen?');
    if (!confirmed) return;

    try {
        const response = await fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/delete', {
            method: 'DELETE',
            credentials: 'include', // WICHTIG für Authentifizierung
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Ihr Account wurde erfolgreich gelöscht.');
            window.location.href = '/'; // Weiterleitung zur Startseite
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Fehler beim Löschen des Accounts');
        }
    } catch (error) {
        console.error('Fehler beim Löschen des Accounts:', error);
        alert('Ein unerwarteter Fehler ist aufgetreten');
    }
}