const { adModel } = require('../../models/ad')

module.exports = (request, response) => {
    adModel
        .findOne({ _id: request.params.id })
        .then(ad => {
            ad.set(request.body)
            ad.save().then(() => {
                response.status(200).json({
                    message: 'Ad updated successfully'
                }).end()
            }).catch(error => {
                console.error(error)
                response.status(500).json({
                    message: 'Error trying to update the ad'
                })
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to update the ad'
            })
        })
}