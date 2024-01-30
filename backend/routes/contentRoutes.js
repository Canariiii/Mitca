const express = require('express');
const contentController = require('../controllers/contentController');
const upload = require('../multer/upload');

const contentRouter = express.Router();

contentRouter.route("/")
  .post(upload.single('file'), contentController.createContent)
  .get(contentController.getContentAll);

contentRouter.get('/content/:courseId', contentController.getContentByCourse);

contentRouter.put('/:courseId', contentController.updateOrAddContent);

contentRouter.delete('/:contentId', contentController.deleteContent);


module.exports = contentRouter;
