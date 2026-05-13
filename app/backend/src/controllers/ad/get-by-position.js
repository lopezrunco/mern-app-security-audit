const { adModel } = require('../../models/ad')

module.exports = (request, response) => {
    const { position } = request.params

    adModel
        .find({ position: position })
        .sort('-updatedAt')
        .then(ads => {
            if (!ads || ads.length === 0) {
                return response.status(404).json({
                    message: 'No ads found for this position'
                });
            }
            response.status(200).json({
                ads
            });
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to obtain the ads by position'
            })
        })
}