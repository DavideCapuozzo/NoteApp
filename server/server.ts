import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth/auth-routes';
import noteRouter from './routes/note/note-routes';
import mongoose from 'mongoose';



// create a database connection'
mongoose.connect('mongodb+srv://noteapp:2AkbS7kazAjQDMgL@cluster0.mzcwgzu.mongodb.net/').then(()=>console.log('MongoDB Connected')).catch((error: unknown) => console.log(error));
//devsoloweb
//3bkK56PRZWH3pH8v
//mongodb+srv://devsoloweb:3bkK56PRZWH3pH8v@cluster0.vx3osfa.mongodb.net/

const app = express()
const PORT = process.env.PORT || 5000;

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

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter)
app.use('/api/notes', noteRouter);




app.listen(PORT, ()=> console.log(`Server is now running on port ${PORT}`))