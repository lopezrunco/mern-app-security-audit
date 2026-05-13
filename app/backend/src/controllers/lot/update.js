const { lotModel } = require('../../models/lot')

module.exports = (request, response) => {
    lotModel
        .findOne({ _id: request.params.id })
        .then(lot => {
            lot.set(request.body)

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