const express = require('express');
const { getPendaftarPerTahunAjaran, getPendaftarPerProgramStatus, getTotalSiswa } = require('./monitoring.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

// Semua endpoint monitoring hanya untuk kepala_sekolah (bisa ditambah role lain jika perlu)
router.use(authMiddleware);
router.use(authorizeRoles(ROLES.KEPALA_SEKOLAH));

// Statistik pendaftar per tahun ajaran
router.get('/pendaftar-per-tahun', getPendaftarPerTahunAjaran);

// Statistik pendaftar per program dan status
router.get('/pendaftar-per-program', getPendaftarPerProgramStatus);

// Statistik total siswa
router.get('/total-siswa', getTotalSiswa);

module.exports = router;