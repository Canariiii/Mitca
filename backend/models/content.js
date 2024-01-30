const mongoose = require('mongoose');
const Course = require('./course');
const User = require('./user'); // Importa el modelo de usuario

const contentSchema = new mongoose.Schema({
  contentType: {
    type: String,
    required: true,
  },
  contentData: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Content = mongoose.model('Content', contentSchema);
module.exports = Content;
