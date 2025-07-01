// user.routes.js
const express = require('express');
const {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getParents,
  createParent,
  updateParent,
  deleteParent,
  activateParentAccount,
  deactivateParentAccount
} = require('./user.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

// Middleware proteksi & role superadmin
router.use(authMiddleware);
router.use(authorizeRoles(ROLES.SUPERADMIN, ROLES.ADMIN_TU));

// Routes untuk akun orang tua
router.get('/parents', getParents);
router.post('/parents', createParent);
router.put('/parents/:id', updateParent);
router.delete('/parents/:id', deleteParent);

// Endpoint aktif/nonaktif akun orang tua
router.patch('/parents/:id/activate', activateParentAccount);
router.patch('/parents/:id/deactivate', deactivateParentAccount);

// Routes untuk admin
router.get('/', getAdmins);
router.post('/', createAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;
