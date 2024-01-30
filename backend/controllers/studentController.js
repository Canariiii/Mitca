const  Student  = require('../models/student');
const Course = require('../models/course');
const mongoose = require('mongoose');

exports.createStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json({ success: true, data: { newStudent: { ...newStudent.toObject() } } });
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find();
    res.status(200).json({ success: true, data: allCourses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('joinedCourses');
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params._id).populate('joinedCourses');
    if (!student) {
      return res.status(404).json({ success: false, error: 'Estudiante no encontrado' });
    }

    if (student.role !== 'student') {
      return res.status(403).json({ success: false, error: 'Acceso denegado. No eres un estudiante.' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const updatedStudent = req.body;
    const studentId = req.params._id;
    const student = await Student.findByIdAndUpdate(studentId, updatedStudent, {
      new: true,
      runValidators: true,
    }).populate('joinedCourses');
    if (!student) {
      return res.status(404).json({ success: false, error: 'Estudiante no encontrado' });
    }
    if (student.role !== 'student') {
      return res.status(403).json({ success: false, error: 'Acceso denegado. No eres un estudiante.' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.joinCourse = async (req, res) => {
  try {
    const { studentId } = req.body;
    const courseId = req.params.courseId;
    console.log('Student ID:', studentId);
    console.log('Course ID:', courseId);
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    if (course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({ success: false, error: 'Student is already enrolled in the course' });
    }
    course.enrolledStudents.push(studentId);
    await course.save();
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $addToSet: { joinCourses: mongoose.Types.ObjectId(courseId) } },
      { new: true }
    ).populate('joinCourses');
    console.log('Updated Student:', student);
    res.status(200).json({ success: true, data: { course, student } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params._id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Estudiante no encontrado' });
    }
    if (student.role !== 'student') {
      return res.status(403).json({ success: false, error: 'Acceso denegado. No eres un estudiante.' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateStudentCourses = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const courseId = req.body.courseId;
    const shouldRemove = req.body.remove || false; 
    let updateQuery;
    if (shouldRemove) {
      updateQuery = { $pull: { joinCourses: courseId } };
    } else {
      updateQuery = { $addToSet: { joinCourses: courseId } };
    }
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateQuery,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedStudent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.getActiveCoursesStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, error: 'Invalid studentId' });
    }
    const activeCourses = await Course.find({ enrolledStudents: mongoose.Types.ObjectId(studentId) });
    console.log('Active Courses:', activeCourses);
    res.status(200).json({ success: true, data: activeCourses });
  } catch (error) {
    console.error('Error in getActiveCoursesByInstructorId:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};



