const Joi = require('joi')

const { eventModel } = require('../../models/event')
const youtubeUrlSchema = require('../../validators/youtubeValidator')

module.exports = (request, response) => {
    const schema = Joi.object({
        title: Joi.string()
            .optional()
            .min(2)
            .max(50),
        eventType: Joi.string()
            .allow(null, '')
            .optional()
            .min(2)
            .max(50),
        category: Joi.string()
            .allow(null, '')
            .optional()
            .min(2)
            .max(50),
        description: Joi.string()
            .allow(null, '')
            .optional()
            .min(2)
            .max(600),
        company: Joi.string()
            .allow(null, '')
            .optional()
            .min(2)
            .max(50),
        organizer: Joi.string()
            .allow(null, '')
            .optional()
            .min(2)
            .max(50),
        breeder: Joi.string()
            .allow(null, '')
            .optional()
            .min(2)
            .max(50),
        funder: Joi.string()
            .allow(null, '')
            .optional()
            .min(3)
            .max(50),
        location: Joi.string()
            .allow(null, '')
            .optional()
            .min(2)
            .max(50),
        duration: Joi.number()
            .allow(null, '')
            .optional(),
        startBroadcastTimestamp: Joi.date()
            .optional(),
        broadcastLinkId: youtubeUrlSchema, // Custom validator is already handled via its internal export rules
        externalLink: Joi.string()
            .allow(null, '')
            .optional()
            .min(2)
            .max(200),
        coverImgName: Joi.string()
            .allow(null, '')
            .optional()
            .min(2)
            .max(200)
    })

    const validationResult = schema.validate(request.body)
    if (validationResult.error) {
        return response.status(400).json({ 
            message: 'Invalid input data provided' 
        })
    }
    
    eventModel
        .findOne({ _id: request.params.id })
        .then(event => {
            const allowedFields = [
                'title', 
                'eventType', 
                'category', 
                'description', 
                'company',
                'organizer',
                'breeder',
                'funder',
                'location',
                'duration',
                'startBroadcastTimestamp',
                'broadcastLinkId',
                'externalLink',
                'coverImgName'    
            ]
            const updateData = Object.fromEntries(Object.entries(request.body).filter(([key]) => 
                allowedFields.includes(key)
            ))

            event.set(updateData)
            event.save().then(() => {
                response.status(200).json({
                    message: 'Event updated successfully'
                }).end()
            }).catch(error => {
                console.error(error)

                response.status(500).json({
                    message: 'Error trying to update the event'
                })
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to update the event'
            })
        })
}