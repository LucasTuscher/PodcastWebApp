import session from 'express-session';

const sessionConfig = (app) => {
    app.use(session({
        secret: process.env.SESSION_SECRET || 'meinSuperGeheimesPasswort',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production', // In Produktion aktivieren
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 3600000 // 1 Stunde
        }
    }));
};

export default sessionConfig;