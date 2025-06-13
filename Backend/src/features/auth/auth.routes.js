const express = require('express');
const router = express.Router();
const AuthController = require('../auth/auth.controller');
const authMiddleware = require('../../middlewares/authMiddleware');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/reset-superadmin', AuthController.resetSuperadminPassword);
router.post('/reset-orangtua', AuthController.resetOrangtuaPassword);

// Protected routes (require JWT)
router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/profile', authMiddleware, AuthController.updateProfile);


module.exports = router;