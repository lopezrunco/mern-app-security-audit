const { preofferModel } = require('../../models/preoffer')

module.exports = (request, response) => {
    preofferModel
        .findOneAndDelete({ _id: request.params.id })
        .then(() => {
            response.status(200).json({
                message: 'Preoffer deleted succesfully.'
            }).end()
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to delete the preoffer.'
            })

        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to delete the preoffer'
            })
        })
}

