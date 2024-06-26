const mongoose = require('mongoose');
 

const submittedBySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student' 
  },
  fileUrl:{
    type: String,
    required: true
  },
  marks:{
    type: String,
    default:0
  },
  submittedAt:{
    type:Date,
    default:Date.now()
  }

}); 

const assignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course' 
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fileUrl:{
    type: String,
    required: true
  }, 
  SubmittedBy:[
    submittedBySchema
  ]

}, { timestamps: true }); 


const AssignmentModel = mongoose.model('Assignment', assignmentSchema);

module.exports = AssignmentModel;
