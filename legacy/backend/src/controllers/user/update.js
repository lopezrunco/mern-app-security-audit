const { userModel } = require('../../models/user')

module.exports = (request, response) => {
    userModel
        .findOne({ _id: request.params.id })
        .then(user => {
            user.set(request.body)
            user.save().then(() => {
                response.status(200).json({
                    message: 'User info updated successfully'
                }).end()
            }).catch(error => {
                console.error(error)
                response.status(500).json({
                    message: 'Error trying to update the user info'
                })
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to update the user info'
            })
        })
}