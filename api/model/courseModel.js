const mongoose = require('mongoose');

// Define the schema for the Course model
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  courseDepartment:{
    type: String,
    required: true
  },
  courseCode:{
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'professor',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student' 
  }],
  announcement:[
    {
      type:Object
    }
  ],
  materials:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material' 
  }],
  Assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment' 
  }],
  startdate:{
    type:Date,
    default:Date.now
  },quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  attendanceDetails: [{
    date: {
      type: Date,
      required: true
    },
    studentsPresent: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'student'
    }]
  }],
 
}, { timestamps: true });  

const CourseModel = mongoose.model('Course', courseSchema);

module.exports = CourseModel;


