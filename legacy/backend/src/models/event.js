const { model, Schema } = require('mongoose')

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    eventType: {
        type: String,
        required: false,
        trim: true
    },
    category: {
        type: String,
        required: false,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    company: {
        type: String,
        required: false,
        trim: true
    },
    organizer: {
        type: String,
        required: false,
        trim: true
    },
    breeder: {
        type: String,
        required: false,
        trim: true
    },
    funder: {
        type: String,
        required: false,
        trim: true
    },
    location: {
        type: String,
        required: false,
        trim: true
    },
    duration: {
        type: Number,
        required: false,
        trim: true
    },
    startBroadcastTimestamp: {
        type: Date,
        required: true,
    },
    broadcastLinkId: {
        type: String,
        required: false,
        trim: true
    },
    externalLink: {
        type: String,
        required: false,
        trim: true
    },
    coverImgName: {
        type: String,
        required: false,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        trim: true
    },
})

const eventModel = model('events', eventSchema)

module.exports = {
    eventSchema,
    eventModel
}