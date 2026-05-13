const Joi = require('joi')
const { adModel } = require('../../models/ad')

module.exports = (request, response) => {
    const ad = request.body

    const schema = Joi.object({
        title: Joi.string()
            .required()
            .min(2)
            .max(50),
        position: Joi.string()
            .required()
            .min(2)
            .max(50),
        imgUrl: Joi.string()
            .required()
            .min(2)
            .max(200),
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

    const validationResult = schema.validate(ad)

    if (!validationResult.error) {
        adModel.create({
            title: ad.title,
            position: ad.position,
            imgUrl: ad.imgUrl,
            link: ad.link,
            published: ad.published,
            userId: ad.userId,
        }).then(ad => {
            response.status(200).json({
                message: 'New ad created'
            })
        }).catch(error => {
            response.status(500).json({
                message: 'Could not create the ad'
            })
        })
    } else {
        response.status(400).json({
            message: validationResult.error
        })
    }
}