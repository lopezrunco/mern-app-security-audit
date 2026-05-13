const { lotModel } = require('../../models/lot')

module.exports = (request, response) => {
    lotModel
        .findOne({ _id: request.params.id })
        .then(lot => {
            response.status(200).json({
                lot
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to obtain the lot'
            })
        })
}