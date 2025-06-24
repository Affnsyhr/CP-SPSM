const express = require('express');
const { createTahunAjaran, getAllTahunAjaran, updateTahunAjaran, deleteTahunAjaran } = require('./tahunajaran.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles(ROLES.SUPERADMIN, ROLES.ADMIN_TU));

// Create
router.post('/', createTahunAjaran);
// Read all
router.get('/', getAllTahunAjaran);
// Update
router.put('/:id', updateTahunAjaran);
// Delete
router.delete('/:id', deleteTahunAjaran);

module.exports = router; 