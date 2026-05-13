const { eventModel } = require('../../models/event')

module.exports = (request, response) => {

    const pagination = {
        offset: 0,
        limit: 12
    }
    if (request.query.page && request.query.itemsPerPage) {
        pagination.offset = (request.query.page - 1) * request.query.itemsPerPage,
            pagination.limit = parseInt(request.query.itemsPerPage)
    }

    eventModel
        .find()
        .sort('startBroadcastTimestamp')
        .skip(pagination.offset)
        .limit(pagination.limit)
        .then(events => {
            eventModel
                .count()
                .then(count => {
                    const meta = {
                        count
                    }

                    response.status(200).json({
                        meta,
                        events
                    })
                }).catch(error => {
                    console.error(error)

                    response.status(500).json({
                        message: 'Error trying to list the events'
                    })
                })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to list the events'
            })
        })
}