async function deleteAccount() {
    const confirmed = window.confirm("M\xf6chten Sie Ihren Account wirklich l\xf6schen?");
    if (!confirmed) return;
    try {
        const response = await fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/delete', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            alert("Ihr Account wurde erfolgreich gel\xf6scht.");
            window.location.href = '/'; // Weiterleitung zur Startseite
        } else {
            const errorData = await response.json();
            alert(errorData.error || "Fehler beim L\xf6schen des Accounts");
        }
    } catch (error) {
        console.error("Fehler beim L\xf6schen des Accounts:", error);
        alert('Ein unerwarteter Fehler ist aufgetreten');
    }
}

//# sourceMappingURL=public.a42454ba.js.map
