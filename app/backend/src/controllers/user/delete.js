const { userModel } = require('../../models/user')

module.exports = (request, response) => {
    userModel
        .findOneAndDelete({ _id: request.params.id })
        .then(() => {
            response.status(200).json({
                message: 'User deleted succesfully.'
            }).end()
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to delete the user.'
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to delete the user'
            })
        })
}

