const createToken = require('../../utils/create-token')
const { REFRESH_TOKEN_TYPE, CONSUMER_TOKEN_TYPE } = require('../../utils/token-types')

module.exports = (request, response) => {
    if (request.token.type === 'REFRESH') {
        // Add and return user token & refresh token
        const token = createToken(request.user, CONSUMER_TOKEN_TYPE, '30m')
        const refreshToken = createToken(request.user, REFRESH_TOKEN_TYPE, '3d')
        response.json({ token, refreshToken })
    } else {
        response.status(401).end()
    }
}