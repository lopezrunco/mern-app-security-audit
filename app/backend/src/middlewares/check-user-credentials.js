const jwt = require('jsonwebtoken')

// By default, the middleware checks CONSUMER token type. If in the parameters exists REFRESH value, checks for REFRESH type
module.exports = (tokenType = 'CONSUMER') => {
    return (request, response, next) => {
        const token = request.headers.authorization // Obtains the authorization from the request header

        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY) // Validates the token sended by the user
            // Checks the token type
            if (decoded.type === tokenType) {
                // Inserts the user data in the request
                request.user = {
                    id: decoded.id,
                    name: decoded.name,
                    email: decoded.email,
                    role: decoded.role
                }
                // Inserts the token info in the request, so we can access to it after the middleware
                request.token = {
                    value: token,
                    type: decoded.type
                }
                next() // Calls the next middleware
            } else {
                return response.status(401).json({
                    message: 'Invalid token type'
                })
            }
        } catch (error) {
            console.error('Token error =>', error)
            return response.status(401).json({
                message: 'Invalid credentials'
            })
        }
    }
}