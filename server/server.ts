import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import authRouter from './routes/auth/auth-routes';
import noteRouter from './routes/note/note-routes';
import mongoose from 'mongoose';
require('dotenv').config();

// Importa la configurazione di Passport
require('./config/passport');

// create a database connection'
mongoose.connect('mongodb+srv://noteapp:2AkbS7kazAjQDMgL@cluster0.mzcwgzu.mongodb.net/').then(()=>console.log('MongoDB Connected')).catch((error: unknown) => console.log(error));

const app = express()
const PORT = process.env.PORT || 5000;

// Configurazione sessioni per Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true solo in produzione con HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 ore
    }
}));

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials: true
    })
)

// Inizializza Passport
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter)
app.use('/api/notes', noteRouter);




app.listen(PORT, ()=> console.log(`Server is now running on port ${PORT}`))