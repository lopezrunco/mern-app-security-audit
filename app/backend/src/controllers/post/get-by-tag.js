const { postModel } = require('../../models/post');

module.exports = (request, response) => {
    const { tag } = request.params
    const pagination = {
        offset: 0,
        limit: 12
    }
    if (request.query.page && request.query.itemsPerPage) {
        pagination.offset = (request.query.page - 1) * request.query.itemsPerPage,
            pagination.limit = parseInt(request.query.itemsPerPage)
    }

    postModel
        .find({ tags: tag, published: true })
        .skip(pagination.offset)
        .limit(pagination.limit)
        .then(posts => {
            if (!posts || posts.length === 0) {
                response.status(404).json({
                    message: 'No posts found with this tag'
                })
            } else {
                response.status(200).json({
                    posts
                })
            }
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error retrieving posts by tag'
            })
        })
};