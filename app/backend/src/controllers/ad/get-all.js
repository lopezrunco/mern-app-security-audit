const { adModel } = require('../../models/ad')

module.exports = (request, response) => {
    const pagination = {
        offset: 0,
        limit: 12
    }
    if (request.query.page && request.query.itemsPerPage) {
        pagination.offset = (request.query.page - 1) * request.query.itemsPerPage,
            pagination.limit = parseInt(request.query.itemsPerPage)
    }

    adModel
        .find()
        .sort('-updatedAt')
        .skip(pagination.offset)
        .limit(pagination.limit)
        .then(ads => {
            adModel
                .count()
                .then(count => {
                    const meta = {
                        count
                    }
                    response.status(200).json({
                        meta,
                        ads
                    })
                }).catch(error => {
                    console.error(error)
                    response.status(500).json({
                        message: 'Error trying to list the ads'
                    })
                })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to list the ads'
            })
        })
}