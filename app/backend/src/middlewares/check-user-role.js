const { userModel } = require('../models/user')

module.exports = (roles) => {
    return async (request, response, next) => {
        try {
            const user = await userModel.findById(request.user.id)
            if (!user) return response.status(401).json({
                message: 'Unauthorized'
            })
            if (!roles.includes(user.role)) {
                return response.status(403).json({
                    message: 'Forbidden access'
                })
            }
            next()
        } catch (error) {
            return response.status(500).json({
                message: 'Internal server error'
            })
        }
    }
}