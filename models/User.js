const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user']
    },
    department: {
        type: String
    },
    createdTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedTime: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model("User", userSchema)