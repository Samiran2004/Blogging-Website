require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY

function createUserToken(user) {
    const payload = {
        _id: user._id,
        username: user.fullname,
        email: user.email,
        role: user.role
    };
    const token = jwt.sign(payload, SECRET_KEY);
    return token;
}

function tokenValidation(token) {
    const payload = jwt.verify(token, SECRET_KEY);
    return payload
}

module.exports = {
    createUserToken,
    tokenValidation
}