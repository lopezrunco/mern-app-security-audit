const { lotModel } = require('../../models/lot')

module.exports = (request, response) => {
    lotModel
        .findOne({ _id: request.params.id })
        .then(lot => {
            const allowedFields = [
                'title', 
                'category', 
                'name', 
                'description', 
                'rp',
                'pedigree',
                'animals',
                'weight',
                'age',
                'class',
                'state',
                'observations',
                'race',
                'location',
                'certificate',
                'type',
                'open',
                'sold',
                'completed',
                'YTVideoSrc'
            ]
            const updateData = Object.fromEntries(Object.entries(request.body).filter(([key]) => 
                allowedFields.includes(key)
            ))

            lot.set(updateData)
            lot.save().then(() => {
                response.status(200).json({
                    message: 'Lot updated successfully'
                }).end()
            }).catch(error => {
                console.error(error)

                response.status(500).json({
                    message: 'Error trying to update the lot'
                })
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error trying to update the lot'
            })
        })
}