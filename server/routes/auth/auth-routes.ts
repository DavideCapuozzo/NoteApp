const {registerUser, loginUser, logoutUser, authMiddleware, googleAuth, googleCallback, refreshToken, updateUsername, updatePassword} = require('../../controllers/auth/auth-controller')
import express from 'express';

const router = express.Router();

router.post('/registration', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/refresh', refreshToken)

// Profile update routes (require authentication)
router.put('/update-username', authMiddleware, updateUsername)
router.put('/update-password', authMiddleware, updatePassword)

// Google OAuth routes
router.get('/google', googleAuth)
router.get('/google/callback', googleCallback)

router.get('/check-auth', authMiddleware, async (req:any, res:any) => {
    try {
        const userId = req.user.id;
        const user = await require('../../models/User').default.findById(userId).select('-password -refreshToken');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Authenticated user',
            user: {
                id: user._id,
                email: user.email,
                userName: user.userName,
                avatar: user.avatar,
                authProvider: user.authProvider,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Check auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data'
        });
    }
});

export default router;
