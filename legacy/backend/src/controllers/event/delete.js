const { eventModel } = require('../../models/event')

module.exports = (request, response) => {
    eventModel
        .findOneAndDelete({ _id: request.params.id })
        .then(() => {
            response.status(200).json({
                message: 'Event deleted succesfully.'
            }).end()
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to delete the event.'
            })

        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to delete the event'
            })
        })
}

