const mongoose = require('mongoose');

// Define the schema for the Quiz model
const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    options: [{
      optionText: {
        type: String,
        required: true
      },
      isCorrect: {
        type: Boolean,
        required: true
      }
    }]
  }],
  studentsAttended: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'student',
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    outof: {
      type: Number,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QuizModel = mongoose.model('Quiz', quizSchema);

module.exports = QuizModel;
