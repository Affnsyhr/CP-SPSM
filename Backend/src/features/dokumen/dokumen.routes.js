const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadDokumen, getDokumenByPendaftaran } = require('./dokumen.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/dokumen/'); // Pastikan folder ini ada
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Middleware: hanya orang tua yang boleh upload
router.use(authMiddleware);
router.use(authorizeRoles(ROLES.ORANG_TUA));

// Upload dokumen (POST /api/dokumen)
router.post('/', upload.single('file'), uploadDokumen);

// Lihat semua dokumen untuk 1 pendaftaran (GET /api/dokumen/:pendaftaran_id)
router.get('/:pendaftaran_id', getDokumenByPendaftaran);
router.patch(
  '/:dokumen_id/verifikasi',
  authMiddleware,
  authorizeRoles(ROLES.ADMIN_TU),
  require('./dokumen.controller').verifikasiDokumen
);

module.exports = router;