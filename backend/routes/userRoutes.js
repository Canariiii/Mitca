const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../multer/upload');

const userRouter = express.Router();

userRouter.post('/login', userController.login);
userRouter.route('/token').post(userController.getUserFromToken);
userRouter.put('/users/:userId', userController.updateUserById);

userRouter.route('/')
  .post(upload.single('filename'), userController.createUser)
  .get(userController.getUsers);

userRouter.route('/profile/:_id')
  .get(userController.getUserById)
  .put(upload.single('filename'), userController.updateUser);

userRouter.route('/user-preferences-form/:_id')
  .get(userController.getUserById)
  .put(upload.single('filename'), userController.updateUser);

userRouter.route('/:_id')
  .delete(userController.deleteUser);


module.exports = userRouter;
