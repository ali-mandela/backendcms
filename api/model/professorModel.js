const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
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
    }
    ,
    role: {
        type: String,
        default:"faculty"
    },
}, {
    timestamps: true
});

const professorModel = mongoose.model('professor', professorSchema);

module.exports = professorModel;