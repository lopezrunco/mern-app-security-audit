const { preofferModel } = require('../../models/preoffer')

module.exports = (request, response) => {
    preofferModel
        .find({ lotId: request.body.lotId })
        .then(preoffers => {
            preofferModel
                .count()
                .then(count => {
                    const meta = {
                        count
                    }
                    response.status(200).json({
                        meta,
                        preoffers
                    })
                }).catch(error => {
                    console.error(error)
                    response.status(500).json({
                        message: 'Error trying to list the preoffers'
                    })
                })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to list the preoffers'
            })
        })
}