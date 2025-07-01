const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');
const db = require('../../config/db');
const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles(ROLES.SUPERADMIN, ROLES.ADMIN_TU));

// Endpoint: GET /api/log
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM aktivitas_log ORDER BY timestamp DESC LIMIT 100');
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    next(err);
  }
});

// Endpoint: POST /api/log
router.post('/', async (req, res, next) => {
  try {
    const { aktivitas } = req.body;
    const user_id = req.user.user_id;
    const ip_address = req.ip;
    const log = await require('./aktivitasLog.service').logAktivitas({ user_id, aktivitas, ip_address });
    res.status(201).json({ status: 'success', message: 'Log aktivitas berhasil dibuat', data: log });
  } catch (err) {
    next(err);
  }
});

module.exports = router;