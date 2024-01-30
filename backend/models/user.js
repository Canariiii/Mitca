const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Student = require('./student');
const Instructor = require('./instructor');
const Admin = require('./admin');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must have 8 characters']
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Not valid email'
    }
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{9}$/.test(value);
      },
      message: 'Not valid phone'
    }
  },
  role: {
    type: String,
    required: true,
    default: 'student',
    enum: ['student', 'instructor', 'admin'], 
  },
  filename: {
    type: String,
    required: false,
    match: /\.(jpg|jpeg|png|gif|webp)$/
  },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  if (!isMatch) {
    console.log('Password does not match');
  }
  return isMatch;
};

const User = mongoose.model('User', userSchema);
module.exports = User;