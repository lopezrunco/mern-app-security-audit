module.exports = (roles) => { // Wrap a function inside another to pass role as a parameter
    return (request, response, next) => {
        const userRole = request.headers['userrole']

        if (userRole) {
            const roleMatches = roles.find(role => role === userRole)

            if (roleMatches) {
                next()
            } else {
                return response.status(403).json({
                    message: 'Forbidden access'
                })
            }
        } else {
            return response.status(401).json({
                message: 'Invalid credentials'
            })
        }
    }
}