const mongoose = require('mongoose');
 

 

const materialSchema = new mongoose.Schema({
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

}, { timestamps: true }); 


const MaterialModel = mongoose.model('Material', materialSchema);

module.exports = MaterialModel;
