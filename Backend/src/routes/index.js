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
router.use('/programs', programRoutes);
router.use('/timeline', timelineRoutes);
router.use('/tahunajaran', tahunAjaranRoutes);
// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

module.exports = router;
