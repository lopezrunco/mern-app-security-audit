const { model, Schema } = require('mongoose')

const lotSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: false,
        trim: true
    },
    name: {
        type: String,
        required: false,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    rp: {
        type: Number,
        required: false,
        trim: true
    },
    pedigree: {
        type: String,
        required: false,
        trim: true
    },
    animals: {
        type: Number,
        required: false,
        trim: true
    },
    weight: {
        type: Number,
        required: false,
        trim: true
    },
    age: {
        type: String,
        required: false,
        trim: true
    },
    class: {
        type: String,
        required: false,
        trim: true
    },
    state: {
        type: String,
        required: false,
        trim: true
    },
    observations: {
        type: String,
        required: false,
        trim: true
    },
    race: {
        type: String,
        required: false,
        trim: true
    },
    location: {
        type: String,
        required: false,
        trim: true
    },
    certificate: {
        type: String,
        required: false,
        trim: true
    },
    type: {
        type: String,
        required: false,
        trim: true
    },
    open: {
        type: Boolean,
        required: true
    },
    sold: {
        type: Boolean,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    },
    YTVideoSrc: {
        type: String,
        required: false,
        trim: true
    },
    eventId: {
        type: String,
        required: true,
        trim: true
    },
})

const lotModel = model('lots', lotSchema)

module.exports = {
    lotSchema,
    lotModel
}