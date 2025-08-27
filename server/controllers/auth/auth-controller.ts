import { decode } from "punycode";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const passport = require('../../config/passport');

// register
export const registerUser = async(req:any, res:any) => {
    const {email, userName, password} = req.body;

    try{
        const checkUser = await User.findOne({email});
        if(checkUser) return res.json({success : false, message: 'User Already exists whit the same email'})
        
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            email, 
            userName, 
            password: hashPassword,
            authProvider: 'local'
        })

        await newUser.save()
        res.status(200).json({
            success: true,
            message: 'Your account is created'
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        })
    }
}

// login
export const loginUser = async(req:any, res:any) => {
    const {email, password} = req.body;

    try{
        const checkUser = await User.findOne({email});
        if(!checkUser) return res.json({success : false, message: 'User dosent exists!'})

        // Controlla se l'utente usa Google OAuth
        if(checkUser.authProvider === 'google') {
            return res.json({success : false, message: 'Please use Google login for this account'})
        }

        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password)
        if(!checkPasswordMatch) return res.json({success : false, message: 'Invalid Password!'})

        const token = jwt.sign({
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email
        }, 'CLIENT_SECRET_KEY', {expiresIn: '60m'})

        res.cookie('token', token, {httpOnly:true, secure:false}).json({
            success : true, 
            message: 'Logged in Successfully',
            user:{
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                userName: checkUser.userName,
                avatar: checkUser.avatar,
                authProvider: checkUser.authProvider
            }
        })
        
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        })
    }
}

// Google OAuth login
export const googleAuth = (req: any, res: any, next: any) => {
    // Verifica se Google OAuth è configurato
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.status(500).json({
            success: false,
            message: 'Google OAuth not configured. Please contact administrator.'
        });
    }

    passport.authenticate('google', {
        scope: ['profile', 'email']
    })(req, res, next);
};

// Google OAuth callback
export const googleCallback = async (req: any, res: any, next: any) => {
    passport.authenticate('google', async (err: any, user: any) => {
        if (err) {
            console.error('Google auth error:', err);
            return res.redirect(`${process.env.CLIENT_URL}/auth/login?error=auth_failed`);
        }

        if (!user) {
            return res.redirect(`${process.env.CLIENT_URL}/auth/login?error=auth_failed`);
        }

        try {
            // Crea il token JWT
            const token = jwt.sign({
                id: user._id,
                userId: user._id,
                email: user.email,
                username: user.username
            }, 'CLIENT_SECRET_KEY', { expiresIn: '60m' });

            // Encode user data for URL
            const userData = encodeURIComponent(JSON.stringify({
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                authProvider: user.authProvider
            }));

            // Imposta il cookie
            res.cookie('token', token, { httpOnly: true, secure: false });

            // Reindirizza al frontend con dati
            res.redirect(`${process.env.CLIENT_URL}/auth/google/callback?token=${token}&user=${userData}`);
        } catch (error) {
            console.error('Token creation error:', error);
            res.redirect(`${process.env.CLIENT_URL}/auth/login?error=token_failed`);
        }
    })(req, res, next);
};

//logout
export const logoutUser = (req:any, res:any) => {
    res.clearCookie('token').json({
        success : true, 
        message: 'Logged out Successfully',
    })
}

//auth middleware
export const authMiddleware = async(req:any, res:any, next:any) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({
        success: false,
        message: 'Unauthorised user!'
    })

    try{
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next()
    }catch(error){
        console.log(error);
        res.status(401).json({
            success: false,
            message: 'Unauthorised user!'
        })
    }
}