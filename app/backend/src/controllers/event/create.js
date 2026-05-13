const Joi = require('joi')

const youtubeUrlSchema = require('../../validators/youtubeValidator')
const { eventModel } = require('../../models/event')

module.exports = (request, response) => {
    const event = request.body

    const schema = Joi.object({
        title: Joi.string()
            .required()
            .min(2)
            .max(50),
        eventType: Joi.string()
            .allow(null, '')
            .min(2)
            .max(50),
        category: Joi.string()
            .allow(null, '')
            .min(2)
            .max(50),
        description: Joi.string()
            .allow(null, '')
            .min(2)
            .max(600),
        company: Joi.string()
            .allow(null, '')
            .min(2)
            .max(50),
        organizer: Joi.string()
            .allow(null, '')
            .min(2)
            .max(50),
        breeder: Joi.string()
            .allow(null, '')
            .min(2)
            .max(50),
        funder: Joi.string()
            .allow(null, '')
            .min(3)
            .max(50),
        location: Joi.string()
            .allow(null, '')
            .min(2)
            .max(50),
        duration: Joi.number()
            .allow(null, ''),
        startBroadcastTimestamp: Joi.date()
            .required(),
        broadcastLinkId: youtubeUrlSchema,
        externalLink: Joi.string()
            .allow(null, '')
            .min(2)
            .max(200),
        coverImgName: Joi.string()
            .allow(null, '')
            .min(2)
            .max(200),
        userId: Joi.string()
            .required()
            .alphanum()
    })

    const validationResult = schema.validate(event)

    if (!validationResult.error) {
        eventModel.create({
            title: event.title,
            eventType: event.eventType,
            category: event.category,
            description: event.description,
            company: event.company,
            organizer: event.organizer,
            breeder: event.breeder,
            funder: event.funder,
            location: event.location,
            duration: event.duration,
            startBroadcastTimestamp: event.startBroadcastTimestamp,
            broadcastLinkId: event.broadcastLinkId,
            externalLink: event.externalLink,
            coverImgName: event.coverImgName,
            userId: event.userId,
        }).then(event => {
            response.status(200).json({
                message: 'New event created'
            })
        }).catch(error => {
            response.status(500).json({
                message: 'Could not create the new event'
            })
        })
    } else {
        response.status(400).json({
            message: validationResult.error
        })
    }
}