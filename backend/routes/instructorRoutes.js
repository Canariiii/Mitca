const express = require('express');
const instructorController = require('../controllers/instructorController');
const upload = require('../multer/upload');
const instructorRouter = express.Router();

instructorRouter.route('/')
  .post(upload.single('filename'), instructorController.createInstructor)
  .get(instructorController.getInstructors);

instructorRouter.route('/:_id')
  .get(instructorController.getInstructorById)
  .put(upload.single('filename'), instructorController.updateInstructor)
  .delete(instructorController.deleteInstructor);

instructorRouter.route('/active-courses/:instructorId')
  .get(instructorController.getActiveCoursesByInstructorId);

module.exports = instructorRouter;
