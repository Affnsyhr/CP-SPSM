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

module.exports = router;