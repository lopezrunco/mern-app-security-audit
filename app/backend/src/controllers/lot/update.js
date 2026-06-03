const Joi = require('joi')
const { lotModel } = require('../../models/lot')

module.exports = (request, response) => {
    const schema = Joi.object({
        title: Joi.string()
            .optional()
            .min(1)
            .max(50),
        category: Joi.string()
            .allow(null, '')
            .optional()
            .min(1)
            .max(50),
        name: Joi.string()
            .allow(null, '')
            .optional()
            .min(1)
            .max(600),
        description: Joi.string()
            .allow(null, '')
            .optional()
            .min(1)
            .max(600),
        rp: Joi.number()
            .allow(null, '')
            .optional(),
        pedigree: Joi.string()
            .allow(null, '')
            .optional()
            .min(1)
            .max(600),
        animals: Joi.number()
            .allow(null, '')
            .optional(),
        weight: Joi.number()
            .allow(null, '')
            .optional(),
        age: Joi.string()
            .allow(null, '')
            .optional()
            .min(1)
            .max(50),
        class: Joi.string()
            .allow(null, '')
            .optional()
            .min(1)
            .max(50),
        state: Joi.string()
            .allow(null, '')
            .optional()
            .min(1)
            .max(50),
        observations: Joi.string()
            .allow(null, '')
            .optional()
            .min(1)
            .max(600),
        race: Joi.string()
            .allow(null, '')
            .optional()
            .min(1)
            .max(50),
        location: Joi.string()
            .allow(null, '')
            .optional()
            .min(1)
            .max(50),
        certificate: Joi.string()
            .allow(null, '')
            .optional()
            .min(1)
            .max(50),
        type: Joi.string()
            .allow(null, '')
            .optional()
            .min(1)
            .max(50),
        open: Joi.boolean()
            .optional(),
        sold: Joi.boolean()
            .optional(),
        completed: Joi.boolean()
            .optional(),
        YTVideoSrc: Joi.string()
            .allow(null, '')
            .optional()
            .min(1)
            .max(50)
    })

    const validationResult = schema.validate(request.body)
    if (validationResult.error) {
        return response.status(400).json({ 
            message: 'Invalid input data provided' 
        })
    }

    lotModel
        .findOne({ _id: request.params.id })
        .then(lot => {
            const allowedFields = [
                'title', 
                'category', 
                'name', 
                'description', 
                'rp',
                'pedigree',
                'animals',
                'weight',
                'age',
                'class',
                'state',
                'observations',
                'race',
                'location',
                'certificate',
                'type',
                'open',
                'sold',
                'completed',
                'YTVideoSrc'
            ]
            const updateData = Object.fromEntries(Object.entries(request.body).filter(([key]) => 
                allowedFields.includes(key)
            ))

            lot.set(updateData)
            lot.save().then(() => {
                response.status(200).json({
                    message: 'Lot updated successfully'
                }).end()
            }).catch(error => {
                console.error(error)

                response.status(500).json({
                    message: 'Error trying to update the lot'
                })
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to update the lot'
            })
        })
}