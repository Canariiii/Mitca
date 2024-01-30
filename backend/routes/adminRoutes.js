const express = require('express');
const adminRouter = express.Router();
const User = require('../models/user');
const {isAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');
const upload = require('../multer/upload');

adminRouter.route('/')
  .post(upload.single('filename'), adminController.createAdmin)
  .get(adminController.getAllAdmins);

adminRouter.route('/:adminId')
  .put(adminController.updateAdminById);
  
adminRouter.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error obteniendo la lista de usuarios:', error);
    res.status(500).json({ error: 'Error obteniendo la lista de usuarios' });
  }
});

adminRouter.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

adminRouter.put('/users/:userId',isAdmin, async (req, res) => {
  const userId = req.params.userId;
  const updatedUserData = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error actualizando el usuario por ID:', error);
    res.status(500).json({ error: 'Error actualizando el usuario por ID' });
  }
});

adminRouter.delete('/users/:userId', isAdmin, async (req, res) => {
  const userId = req.params.userId;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando el usuario por ID:', error);
    res.status(500).json({ error: 'Error eliminando el usuario por ID' });
  }
});

module.exports = adminRouter;
