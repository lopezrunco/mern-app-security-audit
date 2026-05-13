const { postModel } = require('../../models/post')

module.exports = (request, response) => {
    const { userId, title } = request.query
    const regex = new RegExp(title, 'i') // Case-insensitive search
    const userFilter = { userId };

    const pagination = {
        offset: 0,
        limit: 12
    };
    if (request.query.page && request.query.itemsPerPage) {
        pagination.offset = (request.query.page - 1) * request.query.itemsPerPage;
        pagination.limit = parseInt(request.query.itemsPerPage);
    }

    if (title) {
        // Assigns a filter criterion to the title field within the userFilter object for the MongoDB query.
        userFilter.title = regex;
    }

    postModel
        .find(userFilter)
        .sort('-updatedAt')
        .skip(pagination.offset)
        .limit(pagination.limit)
        .then(posts => {
            if (!posts || posts.length === 0) {
                return response.status(404).json({
                    message: 'No posts found for this user ID and title'
                });
            }
            response.status(200).json({
                posts
            });
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({
                message: 'Error trying to obtain the posts by user ID and title'
            });
        });
};
