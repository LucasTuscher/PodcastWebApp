import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; // Zum Erzeugen einer eindeutigen Session-ID

const router = express.Router();

// Registrierung
router.post('/register', async (req, res) => {
    const { firstname, username, email, password } = req.body;

    if (!firstname || !username || !email || !password) {
        return res.status(400).json({ error: 'Alle Felder müssen ausgefüllt sein!' });
    }

    const db = req.app.locals.db;
    if (!db) {
        return res.status(500).json({ error: 'Datenbankverbindung nicht verfügbar!' });
    }

    const collection = db.collection('users');
    const existingUser = await collection.findOne({ email });

    if (existingUser) {
        return res.status(400).json({ error: 'E-Mail bereits registriert!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sessionId = uuidv4(); // Erzeuge eine eindeutige Session-ID

    const result = await collection.insertOne({
        firstname,
        username,
        email,
        password: hashedPassword,
        sessionId // Speichere die Session-ID in der DB
    });

    res.status(201).json({ message: 'Registrierung erfolgreich!', userId: result.insertedId });
});

// Backend: authRoutes.js
const loginAttempts = new Map(); // Map zur Speicherung der fehlgeschlagenen Versuche

router.post('/login', async (req, res) => {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'E-Mail und Passwort müssen angegeben werden!' });
    }

    const now = Date.now();

    // Prüfe, ob der Benutzer gesperrt ist
    if (loginAttempts.has(email)) {
        let attempt = loginAttempts.get(email);
        if (attempt.lockUntil && attempt.lockUntil > now) {
            return res.status(403).json({ error: `Zu viele fehlgeschlagene Versuche. Bitte warten Sie 30 Sekunden.` });
        }
    }

    const db = req.app.locals.db;
    if (!db) {
        return res.status(500).json({ error: 'Datenbankverbindung nicht verfügbar!' });
    }

    const collection = db.collection('users');
    const existingUser = await collection.findOne({ email });

    if (!existingUser) {
        trackFailedLogin(email, res);
        return;
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
        trackFailedLogin(email, res);
        return;
    }

    // Erfolgreiche Anmeldung, Zurücksetzen der Versuche
    loginAttempts.delete(email);

    const sessionId = uuidv4();
    await collection.updateOne(
        { _id: existingUser._id },
        { $set: { sessionId } }
    );

    // Cookie-Optionen setzen
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 3600000 // 30 Tage oder 1 Stunde
    };

    res.cookie('sessionId', sessionId, cookieOptions);

    req.session.user = {
        userId: existingUser._id,
        firstname: existingUser.firstname,
        username: existingUser.username,
        email: existingUser.email
    };

    res.status(200).json({ message: 'Login erfolgreich!', userId: existingUser._id });
});

function trackFailedLogin(email, res) {
    const now = Date.now();
    if (!loginAttempts.has(email)) {
        loginAttempts.set(email, { count: 1, lockUntil: null });
    } else {
        let attempt = loginAttempts.get(email);
        attempt.count++;
        if (attempt.count >= 5) {
            attempt.lockUntil = now + 30000; // Sperre für 30 Sekunden
        }
        loginAttempts.set(email, attempt);
    }

    let attempt = loginAttempts.get(email);
    if (attempt.lockUntil && attempt.lockUntil > now) {
        // Benutzer ist noch gesperrt
        return res.status(403).json({ error: `Zu viele fehlgeschlagene Versuche. Bitte warten Sie 30 Sekunden.` });
    }

    res.status(400).json({ error: 'E-Mail oder Passwort sind falsch!' });
}

// Logout
router.post('/logout', async (req, res) => {
    const db = req.app.locals.db;
    if (!db) {
        return res.status(500).json({ error: 'Datenbankverbindung nicht verfügbar!' });
    }

    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
        return res.status(400).json({ error: 'Keine gültige Session gefunden!' });
    }

    const collection = db.collection('users');
    await collection.updateOne({ sessionId }, { $unset: { sessionId: 1 } }); // Session-ID aus der DB entfernen

    // Session und Cookie löschen
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Fehler beim Abmelden!' });
        }
        res.clearCookie('sessionId');
        res.status(200).json({ message: 'Erfolgreich abgemeldet!' });
    });
});

// Benutzerdaten abrufen
router.get('/me', async (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const db = req.app.locals.db;
    if (!db) {
        return res.status(500).json({ error: 'Datenbankverbindung nicht verfügbar!' });
    }

    const collection = db.collection('users');
    const user = await collection.findOne({ sessionId });

    if (!user) {
        return res.status(401).json({ error: 'Session ungültig oder abgelaufen' });
    }

    res.status(200).json({
        firstname: user.firstname,
        username: user.username,
        email: user.email
    });
});

// Überprüfe, ob der Benutzer eingeloggt ist
router.get('/isLoggedIn', async (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ loggedIn: false });
    }

    const db = req.app.locals.db;
    if (!db) {
        return res.status(500).json({ error: 'Datenbankverbindung nicht verfügbar!' });
    }

    const collection = db.collection('users');
    const user = await collection.findOne({ sessionId });

    if (!user) {
        return res.status(401).json({ loggedIn: false });
    }

    res.status(200).json({ loggedIn: true, userData: { firstname: user.firstname, username: user.username, email: user.email } });
});

// Benutzerdaten abrufen
router.get('/profile', async (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const db = req.app.locals.db;
    if (!db) {
        return res.status(500).json({ error: 'Datenbankverbindung nicht verfügbar!' });
    }

    const collection = db.collection('users');
    const user = await collection.findOne({ sessionId });

    if (!user) {
        return res.status(401).json({ error: 'Session ungültig oder abgelaufen' });
    }

    res.status(200).json({
        firstname: user.firstname,
        username: user.username,
        email: user.email
    });
});

// Passwort ändern
router.post('/change-password', async (req, res) => {
    const { altpassword, newpassword, newpasswordConfirm } = req.body;
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    if (!altpassword || !newpassword || !newpasswordConfirm) {
        return res.status(400).json({ error: 'Bitte alle Felder ausfüllen!' });
    }

    if (newpassword !== newpasswordConfirm) {
        return res.status(400).json({ error: 'Die neuen Passwörter stimmen nicht überein!' });
    }

    const db = req.app.locals.db;
    if (!db) {
        return res.status(500).json({ error: 'Datenbankverbindung nicht verfügbar!' });
    }

    const collection = db.collection('users');
    const user = await collection.findOne({ sessionId });

    if (!user) {
        return res.status(401).json({ error: 'Session ungültig oder abgelaufen' });
    }

    const passwordMatch = await bcrypt.compare(altpassword, user.password);
    if (!passwordMatch) {
        return res.status(400).json({ error: 'Altes Passwort ist falsch!' });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    await collection.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
    );

    res.status(200).json({ message: 'Passwort erfolgreich geändert!' });
});

// Favorit hinzufügen
router.post('/favorites/add', async (req, res) => {
    const { podcastId } = req.body;
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    if (!podcastId) {
        return res.status(400).json({ error: 'Podcast-ID fehlt' });
    }

    const db = req.app.locals.db;
    if (!db) {
        return res.status(500).json({ error: 'Datenbankverbindung nicht verfügbar!' });
    }

    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ sessionId });

    if (!user) {
        return res.status(401).json({ error: 'Session ungültig oder abgelaufen' });
    }

    const favoritesCollection = db.collection('favorites');
    const existingFavorite = await favoritesCollection.findOne({ userId: user._id, podcastId });

    if (existingFavorite) {
        return res.status(400).json({ error: 'Podcast bereits als Favorit gespeichert' });
    }

    try {
        await favoritesCollection.insertOne({ userId: user._id, podcastId });
        res.status(201).json({ message: 'Podcast als Favorit hinzugefügt' });
    } catch (error) {
        console.error('Fehler beim Hinzufügen des Favoriten:', error);
        res.status(500).json({ error: 'Fehler beim Speichern des Favoriten' });
    }
});

// Favorit entfernen
router.delete('/favorites/remove/:podcastId', async (req, res) => {
    const { podcastId } = req.params;
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    if (!podcastId) {
        return res.status(400).json({ error: 'Podcast-ID fehlt' });
    }

    const db = req.app.locals.db;
    if (!db) {
        return res.status(500).json({ error: 'Datenbankverbindung nicht verfügbar!' });
    }

    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ sessionId });

    if (!user) {
        return res.status(401).json({ error: 'Session ungültig oder abgelaufen' });
    }

    const favoritesCollection = db.collection('favorites');

    try {
        const result = await favoritesCollection.deleteOne({ userId: user._id, podcastId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Podcast nicht in Favoriten gefunden' });
        }
        res.status(200).json({ message: 'Podcast aus Favoriten entfernt' });
    } catch (error) {
        console.error('Fehler beim Entfernen des Favoriten:', error);
        res.status(500).json({ error: 'Fehler beim Entfernen des Favoriten' });
    }
});

// Favoriten eines Benutzers abrufen
router.get('/favorites', async (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const db = req.app.locals.db;
    if (!db) {
        return res.status(500).json({ error: 'Datenbankverbindung nicht verfügbar!' });
    }

    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ sessionId });

    if (!user) {
        return res.status(401).json({ error: 'Session ungültig oder abgelaufen' });
    }

    const favoritesCollection = db.collection('favorites');

    try {
        const favorites = await favoritesCollection.find({ userId: user._id }).toArray();
        res.status(200).json(favorites);
    } catch (error) {
        console.error('Fehler beim Abrufen der Favoriten:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Favoriten' });
    }
});

// Überprüfen, ob ein Podcast ein Favorit ist
router.get('/favorites/check/:podcastId', async (req, res) => {
    const { podcastId } = req.params;
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const db = req.app.locals.db;
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ sessionId });

    if (!user) {
        return res.status(401).json({ error: 'Session ungültig oder abgelaufen' });
    }

    const favoritesCollection = db.collection('favorites');
    const favorite = await favoritesCollection.findOne({ userId: user._id, podcastId });

    res.status(200).json({ isFavorite: !!favorite });
});

// Account löschen
router.delete('/delete', async (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const db = req.app.locals.db;
    if (!db) {
        return res.status(500).json({ error: 'Datenbankverbindung nicht verfügbar!' });
    }

    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ sessionId });

    if (!user) {
        return res.status(401).json({ error: 'Session ungültig oder abgelaufen' });
    }

    try {
        // Lösche alle Favoriten des Benutzers
        const favoritesCollection = db.collection('favorites');
        await favoritesCollection.deleteMany({ userId: user._id });

        // Lösche den Benutzer selbst
        await usersCollection.deleteOne({ _id: user._id });

        // Session und Cookie löschen
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Fehler beim Abmelden!' });
            }
            res.clearCookie('sessionId');
            res.status(200).json({ message: 'Account erfolgreich gelöscht!' });
        });
    } catch (error) {
        console.error('Fehler beim Löschen des Accounts:', error);
        res.status(500).json({ error: 'Fehler beim Löschen des Accounts' });
    }
});

export default router;