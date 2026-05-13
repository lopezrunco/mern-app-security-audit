const { preofferModel } = require('../../models/preoffer')

module.exports = (request, response) => {
    preofferModel
        .findOne({ _id: request.params.id })
        .then(preoffer => {
            preoffer.set(request.body)

            preoffer.save()
            .then(() => {
                response.status(200).json({
                    message: 'Preoffer updated'
                })
            }).catch(error => {
                console.error(error)

                response.status(500).json({
                    message: 'Error trying to update the preoffer'
                })
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to update the preoffer'
            })
        })
}