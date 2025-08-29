import { model } from "mongoose";

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({
    email:{
        type : String,
        require : true,
        unique: true,
    },
    userName:{
        type : String,
        require : true,
        unique: true
    },
    password:{
        type : String,
        require : false, // Non obbligatorio per utenti Google
    },
    googleId: {
        type: String,
        sparse: true, // Permette valori null/undefined
        unique: true
    },
    avatar: {
        type: String,
        default: null
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    role:{
        type: String,
        default: 'user'
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', UserSchema);
export default User;