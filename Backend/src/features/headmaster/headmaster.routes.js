const express = require('express');
const {
  getDashboardSummary,
  getAllSiswa,
  getAllPendaftaran,
  getChartStatistics,
  updateStatusPendaftaran,
  exportSiswa,
  exportPendaftaran
} = require('./headmaster.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

// Semua endpoint hanya untuk kepala sekolah
router.use(authMiddleware);
router.use(authorizeRoles(ROLES.KEPALA_SEKOLAH));

// Dashboard summary
router.get('/dashboard/summary', getDashboardSummary);

// Data siswa
router.get('/students', getAllSiswa);

// Data pendaftaran
router.get('/registrations', getAllPendaftaran);

// Chart statistics
router.get('/statistics/charts', getChartStatistics);

// Update status pendaftaran
router.put('/registrations/:id/status', updateStatusPendaftaran);

// Export data
router.get('/export/students', exportSiswa);
router.get('/export/registrations', exportPendaftaran);

module.exports = router; 