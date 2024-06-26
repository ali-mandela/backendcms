const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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
        default: "student"
    },
    MyCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, {timestamps: true});

const studentModel = mongoose.model('student', studentSchema);

module.exports = studentModel;