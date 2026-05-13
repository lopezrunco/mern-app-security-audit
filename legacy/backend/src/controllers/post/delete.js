const { postModel } = require('../../models/post')

module.exports = (request, response) => {
    postModel
        .findOneAndDelete({ _id: request.params.id })
        .then(() => {
            response.status(200).json({
                message: 'Post deleted succesfully.'
            }).end()
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to delete the post.'
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to delete the post'
            })
        })
}