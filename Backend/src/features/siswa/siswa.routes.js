const express = require('express');
const { tambahSiswa, getDaftarSiswa, getAllSiswa } = require('./siswa.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

router.use(authMiddleware);

// Tambah siswa (anak) - hanya untuk orang tua
router.post('/', authorizeRoles(ROLES.ORANG_TUA), tambahSiswa);

// Lihat daftar siswa milik orang tua - hanya untuk orang tua
router.get('/my', authorizeRoles(ROLES.ORANG_TUA), getDaftarSiswa);

// Lihat semua siswa - untuk super admin dan admin
router.get('/', authorizeRoles(ROLES.SUPERADMIN, ROLES.ADMIN_TU), getAllSiswa);

module.exports = router;