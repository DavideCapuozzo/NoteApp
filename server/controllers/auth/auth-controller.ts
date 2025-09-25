import { decode } from "punycode";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import User from '../../models/User';
import passport from '../../config/passport';

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

        // Genera access token (durata breve)
        const accessToken = jwt.sign({
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email
        }, 'CLIENT_SECRET_KEY', {expiresIn: '15m'}) // Ridotto a 15 minuti

        // Genera refresh token (durata lunga)
        const refreshToken = jwt.sign({
            id: checkUser._id
        }, 'REFRESH_SECRET_KEY', {expiresIn: '7d'}) // 7 giorni

        // Salva il refresh token nel database
        await User.findByIdAndUpdate(checkUser._id, { refreshToken });

        res.cookie('token', accessToken, {httpOnly:true, secure:false})
           .cookie('refreshToken', refreshToken, {httpOnly:true, secure:false})
           .json({
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
            // Genera access token (durata breve)
            const accessToken = jwt.sign({
                id: user._id,
                role: user.role,
                email: user.email
            }, 'CLIENT_SECRET_KEY', { expiresIn: '15m' });

            // Genera refresh token (durata lunga)
            const refreshToken = jwt.sign({
                id: user._id
            }, 'REFRESH_SECRET_KEY', { expiresIn: '7d' });

            // Salva il refresh token nel database
            await User.findByIdAndUpdate(user._id, { refreshToken });

            // Encode user data for URL
            const userData = encodeURIComponent(JSON.stringify({
                _id: user._id,
                userName: user.userName,
                email: user.email,
                avatar: user.avatar,
                authProvider: user.authProvider
            }));

            // Imposta i cookie
            res.cookie('token', accessToken, { httpOnly: true, secure: false })
               .cookie('refreshToken', refreshToken, { httpOnly: true, secure: false });

            // Reindirizza al frontend con dati
            res.redirect(`${process.env.CLIENT_URL}/auth/google/callback?token=${accessToken}&user=${userData}`);
        } catch (error) {
            console.error('Token creation error:', error);
            res.redirect(`${process.env.CLIENT_URL}/auth/login?error=token_failed`);
        }
    })(req, res, next);
};

//logout
export const logoutUser = (req:any, res:any) => {
    res.clearCookie('token')
       .clearCookie('refreshToken')
       .json({
        success : true, 
        message: 'Logged out Successfully',
    })
}

// Refresh token endpoint
export const refreshToken = async (req: any, res: any) => {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Refresh token not provided'
        });
    }

    try {
        // Verifica il refresh token
        const decoded = jwt.verify(refreshToken, 'REFRESH_SECRET_KEY');
        
        // Trova l'utente e verifica che il refresh token corrisponda
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Genera nuovo access token
        const newAccessToken = jwt.sign({
            id: user._id,
            role: user.role,
            email: user.email
        }, 'CLIENT_SECRET_KEY', {expiresIn: '15m'});

        // Opzionalmente, genera anche un nuovo refresh token
        const newRefreshToken = jwt.sign({
            id: user._id
        }, 'REFRESH_SECRET_KEY', {expiresIn: '7d'});

        // Aggiorna il refresh token nel database
        await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

        res.cookie('token', newAccessToken, {httpOnly: true, secure: false})
           .cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: false})
           .json({
            success: true,
            message: 'Token refreshed successfully',
            user: {
                email: user.email,
                role: user.role,
                id: user._id,
                userName: user.userName,
                avatar: user.avatar,
                authProvider: user.authProvider
            }
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
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
    }catch(error: any){
        console.log(error);
        
        // Se il token è scaduto, indica che il client dovrebbe usare il refresh token
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }
        
        res.status(401).json({
            success: false,
            message: 'Unauthorised user!'
        })
    }
}

// update username
export const updateUsername = async(req:any, res:any) => {
    const { username } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verifica se l'utente è registrato localmente
        if (user.authProvider !== 'local') {
            return res.status(403).json({
                success: false,
                message: 'Cannot update username for non-local accounts'
            });
        }

        // Verifica se il nuovo username è già in uso
        const existingUser = await User.findOne({ userName: username, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }

        // Aggiorna l'username
        await User.findByIdAndUpdate(userId, { userName: username });

        const updatedUser = await User.findById(userId).select('-password -refreshToken');
        
        res.status(200).json({
            success: true,
            message: 'Username updated successfully',
            user: {
                _id: updatedUser._id,
                userName: updatedUser.userName,
                email: updatedUser.email,
                authProvider: updatedUser.authProvider,
                avatar: updatedUser.avatar
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        });
    }
}

// update password
export const updatePassword = async(req:any, res:any) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verifica se l'utente è registrato localmente
        if (user.authProvider !== 'local') {
            return res.status(403).json({
                success: false,
                message: 'Cannot update password for non-local accounts'
            });
        }

        // Verifica la password attuale
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash della nuova password
        const hashNewPassword = await bcrypt.hash(newPassword, 12);

        // Aggiorna la password
        await User.findByIdAndUpdate(userId, { password: hashNewPassword });
        
        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        });
    }
}