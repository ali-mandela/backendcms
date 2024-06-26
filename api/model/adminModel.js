const mongoose = require('mongoose');

const admniSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required."]
    },
    email: {
        type: String,
        required: [true, "email is required."]
    },
    password: {
        type: String,
        required: [true, "password is required."]
    },
    role: {
        type: String,
        default:"admin"
    },
}, {
    timestamps: true
});

const adminModel = mongoose.model('admin', admniSchema);

module.exports = adminModel;