import { decode } from "punycode";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../../models/User')

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
                id: checkUser._id
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