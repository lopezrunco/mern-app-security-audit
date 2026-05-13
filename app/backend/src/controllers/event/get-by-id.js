const { eventModel } = require('../../models/event')

module.exports = (request, response) => {
    eventModel
        .findOne({ _id: request.params.id })
        .then(event => {
            response.status(200).json({
                event
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to obtain the event'
            })
        })
}