const express = require('express')
const {registerUser, loginUser, logoutUser ,authMiddleware} = require('../../controllers/auth/auth-controller')


const router = express.Router();

router.post('/registration', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/check-auth', authMiddleware, (req:any, res:any) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        message: 'Authenticated user',
        user,
    });
});

module.exports = router;