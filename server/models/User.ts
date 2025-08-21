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
        require : true,
    },
    role:{
        type: String,
        default: 'user'
    }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;