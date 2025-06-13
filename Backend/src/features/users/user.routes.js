// user.routes.js
const express = require('express');
const {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
} = require('./user.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

// Middleware proteksi & role superadmin
router.use(authMiddleware);
router.use(authorizeRoles(ROLES.SUPERADMIN));

// Routes
router.get('/', getAdmins);
router.post('/', createAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;
