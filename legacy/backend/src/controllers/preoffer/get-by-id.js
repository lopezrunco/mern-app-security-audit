const { preofferModel } = require('../../models/preoffer')

module.exports = (request, response) => {
    preofferModel
        .findOne({ _id: request.params.id })
        .then(preoffer => {
            response.status(200).json({
                preoffer
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to obtain the preoffer'
            })
        })
}