const mongoose = require('mongoose')
const { lotModel } = require('../../models/lot')

module.exports = (request, response) => {
    lotModel
        .find({ eventId: request.body.eventId })
        .then(lots => {
            lotModel
                .count()
                .then(count => {
                    const meta = {
                        count
                    }

                    response.status(200).json({
                        meta,
                        lots
                    })
                }).catch(error => {
                    console.error(error)

                    response.status(500).json({
                        message: 'Error trying to list the lots'
                    })
                })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to list the lots'
            })
        })
}