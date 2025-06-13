const express = require('express');
const authRoutes = require('../features/auth/auth.routes');
const userRoutes = require('../features/users/user.routes');
const pendaftaranRoutes = require('../features/pendaftaran/pendaftaran.routes');

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/pendaftaran', pendaftaranRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

module.exports = router;
