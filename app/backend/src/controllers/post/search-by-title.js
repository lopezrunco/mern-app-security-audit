const { postModel } = require("../../models/post")

module.exports = (request, response) => {
    const { title } = request.query
    const regex = new RegExp(title, 'i') // Case-insensitive search

    const pagination = {
        offset: 0,
        limit: 12
    }
    if (request.query.page && request.query.itemsPerPage) {
        pagination.offset = (request.query.page - 1) * request.query.itemsPerPage,
            pagination.limit = parseInt(request.query.itemsPerPage)
    }

    postModel
        .find({ title: regex })
        .sort('-updatedAt')
        .skip(pagination.offset)
        .limit(pagination.limit)
        .then(posts => {
            if (!posts || posts.length === 0) {
                return response.status(404).json({
                    message: 'No posts found for this title'
                });
            }
            response.status(200).json({
                posts
            });
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({
                message: 'Error trying to obtain the posts by title'
            });
        });
}