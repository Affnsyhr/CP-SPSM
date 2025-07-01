const express = require('express');
const router = express.Router();
const AuthController = require('../auth/auth.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const { loginValidation, registerValidation, handleValidationErrors } = require('../../middlewares/validation');
const { authLimiter } = require('../../middlewares/rateLimiter');

// Public routes with validation and rate limiting
router.post('/register', authLimiter, registerValidation, handleValidationErrors, AuthController.register);
router.post('/login', authLimiter, loginValidation, handleValidationErrors, AuthController.login);
router.post('/reset-superadmin', authLimiter, AuthController.resetSuperadminPassword);
router.post('/reset-orangtua', authLimiter, AuthController.resetOrangtuaPassword);

// Protected routes (require JWT)
router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/profile', authMiddleware, AuthController.updateProfile);

module.exports = router;