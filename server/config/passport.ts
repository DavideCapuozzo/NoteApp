const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Verifica che le variabili d'ambiente siano configurate
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('⚠️  Google OAuth credentials not configured.');
    console.warn('⚠️  Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file');
    console.warn('⚠️  Google authentication will not work until credentials are configured');
} else {
    // Configurazione Google OAuth Strategy
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
    }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
            // Verifica se l'utente esiste già
            let existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) {
                return done(null, existingUser);
            }

            // Verifica se esiste già un utente con questa email
            existingUser = await User.findOne({ email: profile.emails[0].value });

            if (existingUser) {
                // Collega l'account Google all'utente esistente
                existingUser.googleId = profile.id;
                existingUser.authProvider = 'google';
                existingUser.avatar = profile.photos[0]?.value;
                await existingUser.save();
                return done(null, existingUser);
            }

            // Crea un nuovo utente
            const newUser = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                userName: profile.displayName || profile.emails[0].value.split('@')[0],
                avatar: profile.photos[0]?.value,
                authProvider: 'google'
            });

            await newUser.save();
            done(null, newUser);
        } catch (error) {
            done(error, null);
        }
    }));
}

// Serializzazione dell'utente
passport.serializeUser((user: any, done: any) => {
    done(null, user._id);
});

// Deserializzazione dell'utente
passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
