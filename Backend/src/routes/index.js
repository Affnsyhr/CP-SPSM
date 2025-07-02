const express = require('express');
const authRoutes = require('../features/auth/auth.routes');
const userRoutes = require('../features/users/user.routes');
const pendaftaranRoutes = require('../features/pendaftaran/pendaftaran.routes');
const dokumenRoutes = require('../features/dokumen/dokumen.routes');
const monitoringRoutes = require('../features/monitoring/monitoring.routes');
const orangtuaDashboardRoutes = require('../features/orangtua/dashboard.routes');
const aktivitasLogRoutes = require('../features/log/aktivitasLog.routes');
const siswaRoutes = require('../features/siswa/siswa.routes');
const programRoutes = require('../features/program/program.routes');
const timelineRoutes = require('../features/timeline/timeline.routes');
const tahunAjaranRoutes = require('../features/tahunajaran/tahunajaran.routes');
const headmasterRoutes = require('../features/headmaster/headmaster.routes');
const notifikasiService = require('../features/notifikasi/notifikasi.service');
const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/pendaftaran', pendaftaranRoutes);
router.use('/dokumen', dokumenRoutes);
router.use('/monitoring', monitoringRoutes);
router.use('/orangtua/dashboard', orangtuaDashboardRoutes);
router.use('/log', aktivitasLogRoutes);
router.use('/siswa', siswaRoutes);
router.use('/program', programRoutes);
router.use('/timeline', timelineRoutes);
router.use('/tahunajaran', tahunAjaranRoutes);
router.use('/headmaster', headmasterRoutes);
router.patch('/api/notifikasi/:notifikasi_id/baca', notifikasiService.updateStatusBacaController);
// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

module.exports = router;
