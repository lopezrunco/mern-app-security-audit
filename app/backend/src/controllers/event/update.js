const { eventModel } = require('../../models/event')

module.exports = (request, response) => {
    eventModel
        .findOne({ _id: request.params.id })
        .then(event => {
            event.set(request.body)

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