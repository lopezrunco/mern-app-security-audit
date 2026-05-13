const { adModel } = require('../../models/ad')

module.exports = (request, response) => {
    adModel
        .findOne({ _id: request.params.id })
        .then(ad => {
            response.status(200).json({
                ad
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to obtain the ad by id'
            })
        })
}