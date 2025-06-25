import dotenv from 'dotenv';
import express from 'express';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import https from 'https';
import authRoutes from './routes/authRoutes.js';
import sessionConfig from './session-system/sessionManager.js'; // Importiere die Session-Konfiguration
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Import the cookie-parser

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10062;

// Prüfe, ob die MONGO_URI-Umgebungsvariable gesetzt ist
if (!process.env.MONGO_URI) {
    console.error("Fehler: MONGO_URI ist nicht gesetzt. Bitte überprüfe deine .env Datei.");
    process.exit(1);
}

const client = new MongoClient(process.env.MONGO_URI, {
    useUnifiedTopology: true,  // Für stabilere Verbindungen
});

// CORS-Konfigurationzeieg
const corsOptions = {
    origin: 'https://webengineering.ins.hs-anhalt.de:10061', // URL der App
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Erlaubte Methoden
    credentials: true, // Erlaubt das Senden von Cookies und anderen Anmeldeinformationen
};

app.use(cors(corsOptions)); // CORS Middleware anwenden

app.use(cookieParser()); // Use cookie-parser middleware

sessionConfig(app);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes); // Nutzt die Register- und Login-Route

// Lade SSL-Zertifikate
const privateKey = fs.readFileSync('/home/students/stnitred/ssl/server.key', 'utf8');
const certificate = fs.readFileSync('/home/students/stnitred/ssl/server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

async function startServer() {
    try {
        console.log("Starte Server...");
        await client.connect();
        console.log('Verbindung zu MongoDB hergestellt.');

        app.locals.db = client.db('testdb');

        // HTTPS-Server starten
        https.createServer(credentials, app).listen(PORT, () => {
            console.log(`Server läuft sicher auf: https://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('Fehler bei der DB-Verbindung:', err);
        process.exit(1);
    }
}

startServer().catch(err => {
    console.error("Unerwarteter Fehler beim Starten des Servers:", err);
});
