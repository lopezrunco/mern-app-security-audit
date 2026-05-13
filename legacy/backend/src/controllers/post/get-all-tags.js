const { postModel } = require('../../models/post');

module.exports = (request, response) => {
    postModel
        .find({}, 'tags')
        .then(posts => {
            let allTags = []
            // Concatenate all the tags arrays in one array after filtering out falsy values
            posts.forEach(post => {
                allTags = allTags.concat(post.tags.filter((tag) => tag))
            })
            // Remove duplicates by converting to Set and back to Array
            const uniqueTags = Array.from(new Set(allTags))
            // Remove empty or whitespace tags
            filteredTags = uniqueTags.filter((tag) => tag.trim() !== '')

            response.status(200).json({
                tags: filteredTags
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to list the tags'
            })
        })
}