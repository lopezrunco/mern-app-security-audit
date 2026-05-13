const { model, Schema } = require('mongoose')

const allowedCategories = ['Zafras', 'Ferias', 'Pantalla', 'Equinos', 'Eventos', 'Sociales', 'Otros']

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: allowedCategories
    },
    content: {
        type: String,
        required: false,
        trim: true
    },
    headline: {
        type: String,
        required: false,
        trim: true
    },
    picture: {
        type: String,
        required: false,
        trim: true
    },
    tags: {
        type: Array,
        default: () => ([])
    },
    link: {
        type: String,
        required: false,
        trim: true
    },
    published: {
        type: Boolean,
        required: true
    },
    userId: {
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: true
})

const postModel = model('posts', postSchema)

module.exports = {
    postSchema,
    postModel
}