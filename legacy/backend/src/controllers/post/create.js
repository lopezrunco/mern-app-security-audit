const Joi = require('joi')
const { postModel } = require('../../models/post')

module.exports = (request, response) => {
    const post = request.body

    const schema = Joi.object({
        title: Joi.string()
            .required()
            .min(2)
            .max(200),
        category: Joi.string()
            .required()
            .min(2)
            .max(50),
        content: Joi.string()
            .allow(null, '')
            .min(2)
            .max(15000),
        headline: Joi.string()
            .allow(null, '')
            .min(2)
            .max(500),
        picture: Joi.string()
            .allow(null, '')
            .min(2)
            .max(200),
        tags: Joi.array(),
        link: Joi.string()
            .allow(null, '')
            .min(2)
            .max(200),
        published: Joi.boolean()
            .required(),
        userId: Joi.string()
            .required()
            .alphanum()
    })

    const validationResult = schema.validate(post)

    if (!validationResult.error) {
        postModel.create({
            title: post.title,
            category: post.category,
            content: post.content,
            headline: post.headline,
            picture: post.picture,
            tags: post.tags,
            link: post.link,
            published: post.published,
            userId: post.userId,
        }).then(post => {
            response.status(200).json({
                message: 'New post created'
            })
        }).catch(error => {
            response.status(500).json({
                message: 'Could not create the post'
            })
        })
    } else {
        response.status(400).json({
            message: validationResult.error
        })
    }
}