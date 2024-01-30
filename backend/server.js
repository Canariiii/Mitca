const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Multer = require('multer');
// Import routers
const userRouter = require('./routes/userRoutes');
const studentRouter = require('./routes/studentRoutes');
const instructorRouter = require('./routes/instructorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mitca', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));
app.use('/user-images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/admin', adminRoutes); 
app.use('/users', userRouter);
app.use('/students', studentRouter);
app.use('/instructors', instructorRouter);
app.use('/courses', courseRoutes);
app.use('/content', contentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof Multer.MulterError) {
    res.status(400).json({ success: false, error: err.message });
  } else {
    res.status(500).json({ success: false, error: "Something broke!" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;