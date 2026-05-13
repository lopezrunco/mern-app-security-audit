const Joi = require('joi')
const { lotModel } = require('../../models/lot')

module.exports = (request, response) => {
    const lot = request.body

    const schema = Joi.object({
        title: Joi.string()
            .required()
            .min(1)
            .max(50),
        category: Joi.string()
            .allow(null, '')
            .min(1)
            .max(50),
        name: Joi.string()
            .allow(null, '')
            .min(1)
            .max(600),
        description: Joi.string()
            .allow(null, '')
            .min(1)
            .max(600),
        rp: Joi.number()
            .allow(null, ''),
        pedigree: Joi.string()
            .allow(null, '')
            .min(1)
            .max(600),
        animals: Joi.number()
            .allow(null, ''),
        weight: Joi.number()
            .allow(null, ''),
        age: Joi.string()
            .allow(null, '')
            .min(1)
            .max(50),
        class: Joi.string()
            .allow(null, '')
            .min(1)
            .max(50),
        state: Joi.string()
            .allow(null, '')
            .min(1)
            .max(50),
        observations: Joi.string()
            .allow(null, '')
            .min(1)
            .max(600),
        race: Joi.string()
            .allow(null, '')
            .min(1)
            .max(50),
        location: Joi.string()
            .allow(null, '')
            .min(1)
            .max(50),
        certificate: Joi.string()
            .allow(null, '')
            .min(1)
            .max(50),
        type: Joi.string()
            .allow(null, '')
            .min(1)
            .max(50),
        open: Joi.boolean()
            .required(),
        sold: Joi.boolean()
            .required(),
        completed: Joi.boolean()
            .required(),
        YTVideoSrc: Joi.string()
            .allow(null, '')
            .min(1)
            .max(50),
        eventId: Joi.string()
            .required()
            .alphanum()
    })

    const validationResult = schema.validate(lot)

    if (!validationResult.error) {
        lotModel.create({
            title: lot.title,
            category: lot.category,
            name: lot.name,
            description: lot.description,
            rp: lot.rp,
            pedigree: lot.pedigree,
            animals: lot.animals,
            weight: lot.weight,
            age: lot.age,
            class: lot.class,
            state: lot.state,
            observations: lot.observations,
            race: lot.race,
            location: lot.location,
            certificate: lot.certificate,
            type: lot.type,
            open: lot.open,
            sold: lot.sold,
            completed: lot.completed,
            YTVideoSrc: lot.YTVideoSrc,
            eventId: lot.eventId
        }).then(lot => {
            response.status(200).json({
                message: 'New lot created'
            })
        }).catch(error => {
            response.status(500).json({
                message: 'Could not create the new lot'
            })
        })
    } else {
        response.status(400).json({
            message: validationResult.error
        })
    }
}