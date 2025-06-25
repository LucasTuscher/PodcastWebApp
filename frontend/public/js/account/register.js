function setRegisterFormListener() {
    const form = document.querySelector('.register-auth-form');

    if (!form) {
        console.error("Fehler: Das Registrierungsformular wurde nicht gefunden.");
        return;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Verhindert das Neuladen der Seite

        // Formulardaten auslesen
        const formData = {
            firstname: document.querySelector('.register-auth-form-input-firstname')?.value.trim() || '',
            username: document.querySelector('.register-auth-form-input-username')?.value.trim() || '',
            email: document.querySelector('.register-auth-form-input-email')?.value.trim() || '',
            password: document.querySelector('.register-auth-form-input-password')?.value || '',
            passwordConfirm: document.querySelector('.register-auth-form-input-password-confirm')?.value || ''
        };

        // Debugging: Formulardaten prüfen
        console.log("Formulardaten vor dem Absenden:", JSON.stringify(formData, null, 2));

        // Client-seitige Validierung
        if (!formData.firstname || !formData.username || !formData.email || !formData.password || !formData.passwordConfirm) {
            alert("Bitte alle Felder ausfüllen.");
            return;
        }

        if (!formData.email.includes('@')) {
            alert("Bitte eine gültige E-Mail-Adresse eingeben.");
            return;
        }

        if (formData.password.length < 6) {
            alert("Das Passwort muss mindestens 6 Zeichen lang sein.");
            return;
        }

        if (formData.password !== formData.passwordConfirm) {
            alert("Die Passwörter stimmen nicht überein.");
            return;
        }

        // Anfrage an das Backend senden
        try {
            const response = await fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: formData.firstname,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();
            console.log("Server Antwort:", data);

            if (response.ok) {
                // Benutzer direkt nach der Registrierung einloggen
                alert('Registrierung erfolgreich.');

                // Login nach der Registrierung
                const loginResponse = await fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    }),
                    credentials: 'include' // Wichtig, um das Session-Cookie zu setzen
                });

                const loginData = await loginResponse.json();
                if (loginResponse.ok) {
                    alert('Login erfolgreich.');
                    navigateTo('home'); // Weiterleitung nach erfolgreichem Login
                    window.location.reload(); // Seite neu laden, um die Session zu aktualisieren
                } else {
                    alert(`Fehler: ${loginData.error}`);
                    console.error("Server-Fehler beim Login:", loginData);
                }
            } else {
                alert(`Fehler: ${data.error}`);
                console.error("Server-Fehler:", data);
            }
        } catch (error) {
            alert('Serverfehler: ' + error.message);
            console.error("Netzwerk- oder Serverproblem:", error);
        }
    });
}
