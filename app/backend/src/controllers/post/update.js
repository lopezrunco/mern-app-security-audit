const { postModel } = require('../../models/post')

module.exports = (request, response) => {
    postModel
        .findOne({ _id: request.params.id })
        .then(post => {
            post.set(request.body)
            post.save().then(() => {
                response.status(200).json({
                    message: 'Post updated successfully'
                }).end()
            }).catch(error => {
                console.error(error)
                response.status(500).json({
                    message: 'Error trying to update the post'
                })
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to update the post'
            })
        })
}