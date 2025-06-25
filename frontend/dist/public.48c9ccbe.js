async function changePassword(altpassword, newpassword, newpasswordConfirm) {
    try {
        const response = await fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/change-password', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                altpassword,
                newpassword,
                newpasswordConfirm
            }),
            credentials: 'include'
        });
        const data = await response.json();
        const notification = document.querySelector('.account-administration-mypassword-notifications');
        if (response.ok) {
            notification.textContent = "Passwort erfolgreich ge\xe4ndert!";
            // Eingabefelder leeren
            document.querySelector('.account-administration-mypassword-input-altpassword').value = '';
            document.querySelector('.account-administration-mypassword-input-newpassword').value = '';
            document.querySelector('.account-administration-mypassword-input-newpasswordConfirm').value = '';
            console.log("User Interaktion Log: Das Passwort wurde erfolgreich ge\xe4ndert!");
            return true; // Erfolg zurückgeben
        } else {
            console.error('Server-Fehler:', data);
            return false; // Fehler zurückgeben
        }
    } catch (error) {
        console.error('Netzwerk- oder Serverproblem:', error);
        return false; // Fehler zurückgeben
    }
}
function setPasswordChangeFormListener() {
    const form = document.querySelector('.account-administration-mypassword-form');
    const notification = document.querySelector('.account-administration-mypassword-notifications');
    const changePasswordButton = document.querySelector('.account-administration-mypassword-button-password-change');
    if (!form || !changePasswordButton) {
        console.error("Fehler: Das Passwort\xe4nderungsformular oder der Button wurde nicht gefunden.");
        return;
    }
    changePasswordButton.onclick = async function() {
        notification.textContent = ''; // Nachricht zurücksetzen
        const altpassword = form.querySelector('.account-administration-mypassword-input-altpassword')?.value;
        const newpassword = form.querySelector('.account-administration-mypassword-input-newpassword')?.value;
        const newpasswordConfirm = form.querySelector('.account-administration-mypassword-input-newpasswordConfirm')?.value;
        if (!altpassword || !newpassword || !newpasswordConfirm) {
            notification.textContent = "Bitte alle Felder ausf\xfcllen.";
            return;
        }
        if (newpassword.length < 6) {
            notification.textContent = 'Das neue Passwort muss mindestens 6 Zeichen lang sein.';
            return;
        }
        if (newpassword !== newpasswordConfirm) {
            notification.textContent = "Die neuen Passw\xf6rter stimmen nicht \xfcberein.";
            return;
        }
        try {
            const success = await changePassword(altpassword, newpassword, newpasswordConfirm);
            if (success) notification.textContent = "Passwort erfolgreich ge\xe4ndert!";
            else notification.textContent = 'Das alte Passwort ist falsch oder ein Fehler ist aufgetreten.';
        } catch (error) {
            console.error("Fehler beim \xc4ndern des Passworts:", error);
            notification.textContent = "Es gab ein Problem beim \xc4ndern des Passworts.";
        }
    };
}

//# sourceMappingURL=public.48c9ccbe.js.map
