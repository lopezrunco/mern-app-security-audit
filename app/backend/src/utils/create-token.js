const jwt = require('jsonwebtoken')

// Depending of the parameters, returns token or refresh token
module.exports = (user, tokenType, expiresIn) => {
    return jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        type: tokenType
    }, process.env.JWT_KEY, { expiresIn })
}