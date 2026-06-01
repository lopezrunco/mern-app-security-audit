const { preofferModel } = require('../../models/preoffer')

module.exports = (request, response) => {
    preofferModel
        .findOne({ _id: request.params.id })
        .then(preoffer => {
            const allowedFields = [
                'accepted'
            ]
            const updateData = Object.fromEntries(Object.entries(request.body).filter(([key]) => 
                allowedFields.includes(key)
            ))

            preoffer.set(updateData)
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