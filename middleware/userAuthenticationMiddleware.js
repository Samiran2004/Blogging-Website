const { tokenValidation } = require("../services/userAuthentication");

function validateTokenForUserAuthentication(cookieName) {
    return (req, res, next) => {
        const tokenValue = req.cookies[cookieName];
        if (!tokenValue) {
            return next();
        }
        try {
            const userPayload = tokenValidation(tokenValue);
            req.user = userPayload;
        } catch (error) { }
        return next()
    }
}

module.exports = {
    validateTokenForUserAuthentication
}