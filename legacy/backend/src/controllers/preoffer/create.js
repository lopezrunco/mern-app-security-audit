const Joi = require('joi')
const { preofferModel } = require('../../models/preoffer')

module.exports = (request, response) => {
    const preoffer = request.body

    const schema = Joi.object({
        userId: Joi.string()
            .alphanum()
            .required(),
        date: Joi.date()
            .required(),
        amount: Joi.number()
            .min(0)
            .required(),
        accepted: Joi.boolean()
            .required(),
        lotId: Joi.string()
            .alphanum()
            .required(),
    })

    const validationResult = schema.validate(preoffer)

    if (!validationResult.error) {
        preofferModel.create({
            userId: preoffer.userId,
            date: preoffer.date,
            amount: preoffer.amount,
            accepted: preoffer.accepted,
            lotId: preoffer.lotId
        }).then(preoffer => {
            response.status(200).json({
                message: 'New preoffer created'
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Could not create the new preoffer'
            })
        })
    } else {
        response.status(400).json({
            message: validationResult.error
        })
    }
}