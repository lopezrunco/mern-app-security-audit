const { model, Schema } = require('mongoose')

const preofferSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    accepted: {
        type: Boolean,
        required: true
    },
    lotId: {
        type: String,
        required: true,
        trim: true
    },
})

const preofferModel = model('preoffers', preofferSchema)

module.exports = {
    preofferSchema,
    preofferModel
}