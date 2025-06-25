async function checkAuthStatus() {
    try {
        const response = await fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/me', {
            credentials: 'include',
            method: 'GET'
        });
        if (response.ok) {
            console.log('Authentication successfully logged in');
            return true; // Nutzer ist angemeldet
        }
    } catch (error) {
        console.error('Authentification: Fehler beim Abrufen des Auth-Status:', error);
    }
    return false; // Nutzer ist nicht angemeldet
}
async function handleNavigation() {
    const isAuthenticated = await checkAuthStatus();
    if (isAuthenticated) navigateTo('account-administration'); // Weiterleitung zur Account-Administration
    else {
        console.log('Nicht authentifiziert, Weiterleitung zum Login...');
        navigateTo('login'); // Weiterleitung zum Login
    }
}

//# sourceMappingURL=public.ed73b66f.js.map
