const express = require('express');
const studentRouter = express.Router();
const studentController = require('../controllers/studentController');
const upload = require('../multer/upload');

studentRouter.route('/')
  .post(upload.single('filename'), studentController.createStudent)
  .get(studentController.getStudents);

studentRouter.route('/all-courses').get(studentController.getAllCourses);

studentRouter.route('/:_id')
  .get(studentController.getStudentById)
  .put(upload.single('filename'), studentController.updateStudent)
  .delete(studentController.deleteStudent);

studentRouter.route('/:studentId/update-courses')
  .put(studentController.updateStudentCourses);

studentRouter.route('/active-courses/:studentId')
  .get(studentController.getActiveCoursesStudent);

module.exports = studentRouter;