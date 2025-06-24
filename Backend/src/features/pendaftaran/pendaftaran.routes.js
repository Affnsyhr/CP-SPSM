const express = require('express');
const { daftarSiswa, getRiwayatPendaftaran, getAllPendaftaran, updateStatusPendaftaran } = require('./pendaftaran.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

// Semua rute di bawah ini memerlukan login
router.use(authMiddleware);

// Endpoint daftar pendaftaran siswa (Hanya Orang Tua)
router.post('/', authorizeRoles(ROLES.ORANG_TUA), daftarSiswa);

// Endpoint riwayat pendaftaran siswa milik orang tua (Hanya Orang Tua)
router.get('/', authorizeRoles(ROLES.ORANG_TUA), getRiwayatPendaftaran);

// Endpoint untuk admin_tu: melihat semua pendaftaran (Hanya Admin TU)
router.get('/all', authorizeRoles(ROLES.ADMIN_TU), getAllPendaftaran);

// Endpoint untuk admin_tu: update status pendaftaran (Hanya Admin TU)
router.put('/:id/status', authorizeRoles(ROLES.ADMIN_TU), updateStatusPendaftaran);

module.exports = router;