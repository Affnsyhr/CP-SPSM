const express = require('express');
const { createProgram, getAllPrograms, updateProgram, deleteProgram } = require('./program.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles(ROLES.SUPERADMIN));

// Create
router.post('/', createProgram);
// Read all
router.get('/', getAllPrograms);
// Update
router.put('/:id', updateProgram);
// Delete
router.delete('/:id', deleteProgram);

module.exports = router; 