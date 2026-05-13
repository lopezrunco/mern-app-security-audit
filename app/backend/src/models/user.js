const { model, Schema } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    telephone: {
        type: Number,
        required: false,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    mfaEnabled: {
        type: Boolean,
        required: false
    },
    mfaSecret: {
        type: String,
        required: false
    }
})

userSchema.plugin(uniqueValidator)
const userModel = model('users', userSchema)

module.exports = {
    userSchema,
    userModel
}