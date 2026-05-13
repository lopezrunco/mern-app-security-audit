const { lotModel } = require('../../models/lot')

module.exports = (request, response) => {
    lotModel
        .findOneAndDelete({ _id: request.params.id })
        .then(() => {
            response.status(200).json({
                message: 'Lot deleted succesfully.'
            }).end()
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to delete the lot.'
            })

        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to delete the lot'
            })
        })
}

