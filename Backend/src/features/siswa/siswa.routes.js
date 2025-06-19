const express = require('express');
const { tambahSiswa, getDaftarSiswa } = require('./siswa.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles(ROLES.ORANG_TUA));

// Tambah siswa (anak)
router.post('/', tambahSiswa);
// Lihat daftar siswa milik orang tua
router.get('/', getDaftarSiswa);

module.exports = router;