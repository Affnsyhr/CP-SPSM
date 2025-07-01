const { body, validationResult } = require('express-validator');

// Validation rules untuk login dengan email
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email harus valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
];

// Validation rules untuk login dengan username (alternatif)
const loginUsernameValidation = [
  body('username').trim().isLength({ min: 3, max: 50 }).escape().withMessage('Username minimal 3 karakter'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
];

// Validation rules untuk register
const registerValidation = [
  body('username').trim().isLength({ min: 3, max: 50 }).escape().withMessage('Username minimal 3 karakter'),
  body('email').isEmail().normalizeEmail().withMessage('Email harus valid'),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password harus minimal 8 karakter dengan huruf besar, kecil, dan angka'),
  body('nama_lengkap').trim().isLength({ min: 2, max: 100 }).escape().withMessage('Nama lengkap minimal 2 karakter'),
  body('nik').isLength({ min: 16, max: 16 }).isNumeric().withMessage('NIK harus 16 digit angka'),
  body('no_hp').matches(/^[0-9+\-\s()]+$/).withMessage('Nomor HP tidak valid'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  loginValidation,
  loginUsernameValidation,
  registerValidation,
  handleValidationErrors
};