const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Instructor = require('../models/instructor');
const Student = require('../models/student');
const Admin = require('../models/admin');

const jwtConfig = {
  secretKey: process.env.JWT_SECRET ? Buffer.from(process.env.JWT_SECRET, 'base64') : 'your_secret_key',
  algorithm: 'HS256',
};

const createToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, jwtConfig.secretKey, { algorithm: jwtConfig.algorithm });
};

exports.getUserFromToken = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, jwtConfig.secretKey);
    const userId = decoded._id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    newUser.filename = '';
    if (!["student", "instructor", "admin"].includes(newUser.role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }
    if (req.file) {
      newUser.filename = req.file.filename;
    }
    await newUser.save();
    const userId = newUser._id;

    if (newUser.role === 'admin') {
      const { username, password, email, phone } = req.body;
      const newAdmin = new Admin({
        user: newUser._id,
        username,
        password,
        email,
        phone,
        filename: req.body.filename,
      });
      await newAdmin.save();
    } else if (newUser.role === 'student') {
      const newStudent = new Student({
        _id: newUser._id,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        role: 'student',
        filename: req.body.filename,
        user: newUser._id,
      });
      await newStudent.save();
    } else if(newUser.role === 'instructor') {
      const newInstructor = new Instructor({
        _id: newUser._id,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        role: 'instructor',
        filename: newUser.filename,
        user: newUser._id,
      });
      await newInstructor.save();
      newRoleUser = newInstructor;
    }
    const token = createToken(newUser);
    res.status(201).json({ success: true, data: { user: newUser, token } });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Both username and password are required' });
    }
    const user = await User.findOne({ username });
    console.log('User found:', user);
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Incorrect username or password' });
    }
    if (!user._id) {
      return res.status(500).json({ success: false, error: 'User ID is missing or invalid' });
    }

    const token = createToken(user);
    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const newUser = req.body;
    newUser.filename = newUser.filename || '';
    console.log('Body received:', req.body);
    if (req.file) {
      newUser.filename = req.file.filename;
    }
    const user = await User.findByIdAndUpdate(req.params._id, newUser, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Devuelve el documento actualizado
      runValidators: true, // Ejecuta las validaciones del esquema al actualizar
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log("Deleting user with ID:", req.params._id);
    const user = await User.findByIdAndDelete(req.params._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('currentCourses');

    if (user.role === 'instructor') {
      const instructor = await Instructor.findOne({ user: userId });

      if (instructor) {
        const activeCourses = await Course.find({ instructor: instructor._id });
        user.activeCourses = activeCourses;
      } else {
        console.error('Instructor not found for the given user ID:', userId);
      } 
      if (user.role === 'student') {
        specificUserData = await Student.findOne({ user: userId });
      }
      if (specificUserData) {
        const activeCourses = await Course.find({ instructor: specificUserData._id });
        user.activeCourses = activeCourses;
      } else {
        console.error('Usuario específico no encontrado para el ID de usuario dado:', userId);
      }
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

