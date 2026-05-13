const { postModel } = require('../../models/post')

module.exports = (request, response) => {
    postModel
        .findOne({ _id: request.params.id })
        .then(post => {
            response.status(200).json({
                post
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to obtain the post by id'
            })
        })
}