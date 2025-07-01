const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadDokumen, getDokumenByPendaftaran, updateDokumenFile, deleteDokumen } = require('./dokumen.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

router.use(authMiddleware);

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

// Upload dokumen (POST /api/dokumen) - hanya ORANG_TUA
router.post(
  '/',
  upload.single('file'),
  uploadDokumen
);

// Endpoint baru: Lihat semua dokumen (GET /api/dokumen/all) - hanya ADMIN_TU
router.get(
  '/all',
  require('./dokumen.controller').getAllDokumen
);

// Endpoint baru: Lihat semua dokumen (GET /api/dokumen/all-admin) - hanya ADMIN_TU
router.get('/all-admin', require('./dokumen.controller').getAllDokumenAdmin);

// Lihat semua dokumen untuk 1 pendaftaran (GET /api/dokumen/:pendaftaran_id) - hanya ORANG_TUA
router.get(
  '/:pendaftaran_id',
  getDokumenByPendaftaran
);

// Verifikasi dokumen (PATCH /api/dokumen/:dokumen_id/verifikasi) - hanya ADMIN_TU
router.patch(
  '/:dokumen_id/verifikasi',
  require('./dokumen.controller').verifikasiDokumen
);

// Update dokumen file (PUT /api/dokumen/:dokumen_id) - hanya ORANG_TUA
router.put(
  '/:dokumen_id',
  upload.single('file'),
  updateDokumenFile
);

// Delete dokumen (DELETE /api/dokumen/:dokumen_id) - hanya ORANG_TUA
router.delete(
  '/:dokumen_id',
  deleteDokumen
);

module.exports = router;