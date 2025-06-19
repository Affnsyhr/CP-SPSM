const express = require('express');
const { ROLES } = require('../../constants/roles');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const MonitoringController = require('./monitoring.controller');

const router = express.Router();

// Semua endpoint monitoring hanya untuk kepala_sekolah (bisa ditambah role lain jika perlu)
router.use(authMiddleware);
router.use(authorizeRoles(ROLES.KEPALA_SEKOLAH));

// Statistik jumlah pendaftaran per status
router.get('/pendaftaran', MonitoringController.statistikPendaftaran);

// Statistik jumlah siswa baru per tahun ajaran
router.get('/siswa', MonitoringController.statistikSiswa);

// Statistik dokumen masuk
router.get('/dokumen', MonitoringController.statistikDokumen);

// (Opsional) Statistik program dan tahun ajaran aktif
router.get('/program', MonitoringController.statistikProgram);
router.get('/tahunajaran', MonitoringController.statistikTahunAjaran);

module.exports = router;