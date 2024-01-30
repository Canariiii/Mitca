const mongoose = require('mongoose');
const { Schema } = mongoose;
const student = require('../models/student');
const instructor = require('../models/instructor');
const user = require('../models/user');

const courseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true,
    match: /\.(jpg|jpeg|png|gif|webp|mp4)$/
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
