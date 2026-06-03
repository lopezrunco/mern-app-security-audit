const Joi = require('joi')
const { adModel } = require('../../models/ad')

module.exports = (request, response) => {
    const schema = Joi.object({
        title: Joi.string()
            .optional()
            .min(2)
            .max(50),
        position: Joi.string()
            .optional()
            .min(2)
            .max(50),
        imgUrl: Joi.string()
            .optional()
            .min(2)
            .max(200),
        link: Joi.string()
            .allow(null, '')
            .optional()
            .min(2)
            .max(200),
        published: Joi.boolean()
            .optional()
    })

    const validationResult = schema.validate(request.body)
    if (validationResult.error) {
        return response.status(400).json({ 
            message: 'Invalid input data provided' 
        })
    }

    adModel
        .findOne({ _id: request.params.id })
        .then(ad => {
            const allowedFields = ['title', 'position', 'imgUrl', 'link', 'published']
            const updateData = Object.fromEntries(Object.entries(request.body).filter(([key]) => 
                allowedFields.includes(key)
            ))

            ad.set(updateData)
            ad.save().then(() => {
                response.status(200).json({
                    message: 'Ad updated successfully'
                }).end()
            }).catch(error => {
                console.error(error)
                response.status(500).json({
                    message: 'Error trying to update the ad'
                })
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to update the ad'
            })
        })
}