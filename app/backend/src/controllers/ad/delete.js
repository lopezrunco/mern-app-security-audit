const { adModel } = require('../../models/ad')

module.exports = (request, response) => {
    adModel
        .findOneAndDelete({ _id: request.params.id })
        .then(() => {
            response.status(200).json({
                message: 'Ad deleted succesfully.'
            }).end()
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to delete the ad.'
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to delete the ad'
            })
        })
}