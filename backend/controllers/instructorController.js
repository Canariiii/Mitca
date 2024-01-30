const Instructor = require('../models/instructor');
const User = require('../models/user');
const Course = require('../models/course');
const mongoose = require('mongoose');

exports.createInstructor = async (req, res) => {
  try {
    const newInstructor = new Instructor({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone,
      currentCourses: [],
    });
    await newInstructor.save();
    const newCourse = new Course({
      title: req.body.courseTitle,  
      description: req.body.courseDescription,
      instructor: newInstructor._id,
    });

    await newCourse.save();
    newInstructor.currentCourses.push(newCourse._id);
    await newInstructor.save();
    res.status(201).json({ success: true, data: newInstructor });
  } catch (error) {
    console.error('Error creating instructor:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find().populate(['coursesTaught', 'currentCourses']);
    res.status(200).json({ success: true, data: instructors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params._id).populate(['coursesTaught', 'currentCourses']);
    if (!instructor) {
      return res.status(404).json({ success: false, error: 'Instructor not found' });
    }

    if (instructor.role !== 'instructor') {
      return res.status(403).json({ success: false, error: 'Access denied. You are not an instructor.' });
    }

    res.status(200).json({ success: true, data: instructor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateInstructor = async (req, res) => {
  try {
    const updatedInstructor = req.body;
    const instructor = await Instructor.findByIdAndUpdate(req.params._id, updatedInstructor, {
      new: true,
      runValidators: true,
    }).populate(['coursesTaught', 'currentCourses']);
    if (!instructor) {
      return res.status(404).json({ success: false, error: 'Instructor not found' });
    }

    if (instructor.role !== 'instructor') {
      return res.status(403).json({ success: false, error: 'Access denied. You are not an instructor.' });
    }

    res.status(200).json({ success: true, data: instructor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params._id);
    if (!instructor) {
      return res.status(404).json({ success: false, error: 'Instructor not found' });
    }

    if (instructor.role !== 'instructor') {
      return res.status(403).json({ success: false, error: 'Access denied. You are not an instructor.' });
    }
    await User.findByIdAndUpdate(instructor.user, { $unset: { role: 1 } });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getActiveCoursesByInstructorId = async (req, res) => {
  try {
    const instructorId = req.params.instructorId;
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({ success: false, error: 'Invalid instructorId' });
    }
    const insId = mongoose.Types.ObjectId(instructorId);
    const activeCourses = await Course.find({ instructor: insId }).populate('enrolledStudents');
    res.status(200).json({ success: true, data: activeCourses });
  } catch (error) {
    console.error('Error in getActiveCoursesByInstructorId:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

