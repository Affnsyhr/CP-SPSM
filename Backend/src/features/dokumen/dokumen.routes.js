const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadDokumen, getDokumenByPendaftaran } = require('./dokumen.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/dokumen/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }
});

// Hanya auth global
router.use(authMiddleware);

// Upload dokumen (POST /api/dokumen) - hanya ORANG_TUA
router.post(
  '/',
  authorizeRoles(ROLES.ORANG_TUA),
  upload.single('file'),
  uploadDokumen
);

// Lihat semua dokumen untuk 1 pendaftaran (GET /api/dokumen/:pendaftaran_id) - hanya ORANG_TUA
router.get(
  '/:pendaftaran_id',
  authorizeRoles(ROLES.ORANG_TUA),
  getDokumenByPendaftaran
);

// Verifikasi dokumen (PATCH /api/dokumen/:dokumen_id/verifikasi) - hanya ADMIN_TU
router.patch(
  '/:dokumen_id/verifikasi',
  authorizeRoles(ROLES.ADMIN_TU),
  require('./dokumen.controller').verifikasiDokumen
);

module.exports = router;