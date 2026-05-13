const { postModel } = require('../../models/post')

module.exports = (request, response) => {
    const { category } = request.params
    const pagination = {
        offset: 0,
        limit: 12
    }
    if (request.query.page && request.query.itemsPerPage) {
        pagination.offset = (request.query.page - 1) * request.query.itemsPerPage,
            pagination.limit = parseInt(request.query.itemsPerPage)
    }

    postModel
        .find({ category: category, published: true })
        .sort('-updatedAt')
        .skip(pagination.offset)
        .limit(pagination.limit)
        .then(posts => {
            if (!posts || posts.length === 0) {
                return response.status(404).json({
                    message: 'No published posts found for this category'
                });
            }
            response.status(200).json({
                posts
            });
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to obtain the published posts by category'
            })
        })
}