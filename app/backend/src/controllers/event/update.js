const { eventModel } = require('../../models/event')

module.exports = (request, response) => {
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