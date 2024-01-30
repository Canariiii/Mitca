const mongoose = require('mongoose');
const Course = require('../models/course');
const Content = require('../models/content');
const Instructor = require('../models/instructor');
const contentController = require('./contentController');
const Student = require('../models/student');

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { filename } = req.file;
    const instructorUserId = req.body.instructor;
    const instructor = await Instructor.findOne({ user: instructorUserId });
    if (!instructor) {
      return res.status(404).json({ success: false, error: 'Instructor not found' });
    }
    const newCourse = new Course({
      title,
      description,
      filename,
      instructor: instructor.user,
    });
    await newCourse.save();
    console.log(instructorUserId);
    instructor.currentCourses.push(newCourse._id);
    await instructor.save();
    res.status(201).json({ success: true, data: { course: newCourse._id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate(['enrolledStudents', 'instructor']);
    console.log(courses);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId).populate({
      path: 'content',
      model: 'Content',
    });

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, description, contentId, instructorId, filename } = req.body;
    const courseIdData = await Course.findById(courseId);
    const instructorUserId = courseIdData.instructor;
    const instructor = await Instructor.findOne({ user: instructorUserId });
    if (!instructor) {
      return res.status(404).json({ success: false, error: 'Instructor not found' });
    }
    if (filename === undefined) {
      return res.status(400).json({ success: false, error: "filename is required" });
    }
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { title, description, content: contentId, instructor: instructor._id, filename },
      { new: true }
    ).populate('content').populate('instructor');
    res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateCourseById = async (req, res) => {
  console.log(req.file);
  try {
    const { title, description, instructorId } = req.body;
    const courseId = req.params.courseId;
    const contentId = req.body.contentId;
    const instructor = req.body.instructorId;
    const filename = req.file.filename;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { title, description, filename, content: contentId, instructor: instructorId },
      { new: true }
    ).populate('content').populate('instructor');

    if (!updatedCourse) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.joinCourse = async (req, res) => {
  try {
    const { studentId } = req.body;
    const courseId = req.params.courseId;
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
      { $addToSet: { joinCourses: courseId } },
      { new: true }
    );
    res.status(200).json({ success: true, data: { course, student } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
