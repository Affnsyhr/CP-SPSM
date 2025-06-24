const express = require('express');
const { createTimeline, getAllTimeline, updateTimeline, deleteTimeline } = require('./timeline.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles(ROLES.SUPERADMIN, ROLES.ADMIN_TU));

// Create
router.post('/', createTimeline);
// Read all
router.get('/', getAllTimeline);
// Update
router.put('/:id', updateTimeline);
// Delete
router.delete('/:id', deleteTimeline);

module.exports = router; 