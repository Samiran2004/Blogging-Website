const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const { createUserToken, tokenValidation } = require('../services/userAuthentication');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/profileImage/`))
    },
    filename: function (req, file, cb) {
        const filename = file.originalname;
        cb(null, filename);
    }
});
const upload = multer({ storage: storage })

router.get('/signin', (req, res) => {
    res.render('signinPage')
});

router.get('/signup', (req, res) => {
    res.render('signupPage');
});

router.post('/signup', upload.single("profileImage") ,async (req, res) => {
    const salt = 10;
    const { fullName, email, password, userRole } = req.body;
    const hashPassword = await bcrypt.hash(password, salt);
    const checkUserExist = await User.findOne({ email: email });
    if (!checkUserExist) {
        await User.create({
            fullname: fullName,
            email: email,
            password: hashPassword,
            role: userRole,
            profile_picture: `/profileImage/${req.file.filename}`
        });
        res.redirect('/');
    } else {
        res.render('404error');
    }

});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const searchUser = await User.findOne({ email: email });
        if (!searchUser || searchUser == null) {
            res.render('signinPage', {
                error: "Incorrect Email or Password"
            })
        } else {
            const passwordCheck = await bcrypt.compare(password, searchUser.password);
            const token = await createUserToken(searchUser);

            if (passwordCheck) {
                res.cookie("token", token).redirect('/');
            } else {
                res.render('signinPage', {
                    error: "Incorrect Email or Password"
                });
            }
        }
    } else {
        res.render('signinPage', {
            error: "Incorrect Email or Password"
        })
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie("token").redirect('/');
});


module.exports = router