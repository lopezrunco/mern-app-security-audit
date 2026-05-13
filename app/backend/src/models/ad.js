const { model, Schema } = require('mongoose')

const allowedPositions = ['news-1-left', 'news-1-right', 'news-2-left', 'news-2-right', 'news-3-left', 'news-3-right', 'news-4-left', 'news-4-right', 'news-5-left', 'news-5-right',]

const adSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true,
        enum: allowedPositions
    },
    imgUrl: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        required: false,
        trim: true
    },
    published: {
        type: Boolean,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: true
})

const adModel = model('ads', adSchema)

module.exports = {
    adSchema,
    adModel
}