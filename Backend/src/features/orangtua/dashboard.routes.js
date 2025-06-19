const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');
const DashboardController = require('./dashboard.controller');
const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles(ROLES.ORANG_TUA));

// Dashboard summary untuk orang tua
router.get('/summary', DashboardController.dashboardSummary);

module.exports = router;