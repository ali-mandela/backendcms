const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date:[{
        type:String,
        default:[]
    }],
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student', 
        required: true
    },
   
}, { timestamps: true }); 

const AttendanceModel = mongoose.model('Attendance', attendanceSchema);

module.exports = AttendanceModel;
