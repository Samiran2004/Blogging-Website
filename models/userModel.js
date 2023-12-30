const mongoose = require('mongoose');
const {createHmac, randomBytes} = require('crypto')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String,
        default: "/images/user_def_avatar.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

module.exports = User