function setLoginFormListener() {
    const form = document.querySelector('.login-auth-form');
    const notification = document.querySelector('.login-auth-form-notification');

    if (!form) {
        console.error("Fehler: Das Login-Formular wurde nicht gefunden.");
        return;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        notification.textContent = ""; // Nachricht zurücksetzen

        const formData = {
            email: document.querySelector('.login-auth-form-input-email')?.value.trim() || '',
            password: document.querySelector('.login-auth-form-input-password')?.value || '',
            rememberMe: document.querySelector('.login-auth-form-input-rememberMe')?.checked || false
        };

        if (!formData.email || !formData.password) {
            alert("Bitte alle Felder ausfüllen.");
            return;
        }

        try {
            const response = await fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                navigateTo('home');
                window.location.reload();
                console.log("User Interaktion Log: Nutzer hat sich erfolgreich angemeldet!");
            } else {
                console.error("Server-Fehler:", data);

                if (data.error.includes("Bitte warten Sie 30 Sekunden")) {
                    notification.textContent = data.error;
                } else {
                    alert(`Fehler: ${data.error}`);
                    console.error(`Fehler: ${data.error}`);
                }
            }
        } catch (error) {
            alert('Serverfehler: ' + error.message);
            console.error("Netzwerk- oder Serverproblem:", error);
        }
    });
}
