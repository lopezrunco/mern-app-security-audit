const Joi = require('joi')
const { userModel } = require('../../models/user')

module.exports = (request, response) => {
    const schema = Joi.object({
        nickname: Joi.string()
            .regex(/^[a-zA-Z0-9,.ñÁÉÍÓÚáéíóú ]*$/)
            .optional(),
        phone: Joi.number()
            .min(0)
            .optional(),
        address: Joi.string()
            .regex(/^[a-zA-Z0-9,.ñÁÉÍÓÚáéíóú ]*$/)
            .optional(),
        telephone: Joi.number()
            .allow(null, '')
            .optional()
    })

    const validationResult = schema.validate(request.body)
    if (validationResult.error) {
        return response.status(400).json({ 
            message: 'Invalid input data provided' 
        })
    }

    userModel
        .findOne({ _id: request.params.id })
        .then(user => {
            const allowedFields = ['nickname', 'phone', 'address', 'telephone']
            const updateData = Object.fromEntries(Object.entries(request.body).filter(([key]) => 
                allowedFields.includes(key)
            ))

            user.set(updateData)
            user.save().then(() => {
                response.status(200).json({
                    message: 'User info updated successfully'
                }).end()
            }).catch(error => {
                console.error(error)
                response.status(500).json({
                    message: 'Error trying to update the user info'
                })
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to update the user info'
            })
        })
}