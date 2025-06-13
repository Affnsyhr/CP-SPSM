const express = require('express');
const { daftarSiswa, getRiwayatPendaftaran } = require('./pendaftaran.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

// Hanya untuk role orang_tua
router.use(authMiddleware);
router.use(authorizeRoles(ROLES.ORANG_TUA));

// Endpoint daftar pendaftaran siswa
router.post('/', daftarSiswa);
// Endpoint riwayat pendaftaran siswa milik orang tua
router.get('/', getRiwayatPendaftaran);

module.exports = router;