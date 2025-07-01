const express = require('express');
const { createTahunAjaran, getAllTahunAjaran, updateTahunAjaran, deleteTahunAjaran } = require('./tahunajaran.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

router.use(authMiddleware);

// GET tahun ajaran bisa diakses semua user login
router.get('/', getAllTahunAjaran);

// Endpoint lain hanya untuk SUPERADMIN dan ADMIN_TU
router.post('/', authorizeRoles(ROLES.SUPERADMIN, ROLES.ADMIN_TU), createTahunAjaran);
router.put('/:id', authorizeRoles(ROLES.SUPERADMIN, ROLES.ADMIN_TU), updateTahunAjaran);
router.delete('/:id', authorizeRoles(ROLES.SUPERADMIN, ROLES.ADMIN_TU), deleteTahunAjaran);

module.exports = router; 