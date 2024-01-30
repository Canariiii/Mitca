const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Acceso no autorizado' });
};

module.exports = { isAdmin };
