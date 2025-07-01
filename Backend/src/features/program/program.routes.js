const express = require('express');
const { createProgram, getAllPrograms, updateProgram, deleteProgram, updateKuotaJalur } = require('./program.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { ROLES } = require('../../constants/roles');
const db = require('../../config/db');

const router = express.Router();

router.use(authMiddleware);

// Create
router.post('/', authorizeRoles(ROLES.SUPERADMIN), createProgram);
// Read all
router.get('/', authorizeRoles(ROLES.SUPERADMIN, ROLES.ORANG_TUA), getAllPrograms);
// Update
router.put('/:id', authorizeRoles(ROLES.SUPERADMIN), updateProgram);
// Delete
router.delete('/:id', authorizeRoles(ROLES.SUPERADMIN), deleteProgram);

// Endpoint jalur pendaftar
router.get('/jalur', async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT pjp.*, ps.nama_program,
        (
          SELECT COUNT(*) FROM data_pendaftaran dp
          WHERE dp.program_jalur_id = pjp.id AND dp.status_pendaftaran = 'lulus'
        ) AS filled
      FROM program_jalur_pendaftar pjp
      JOIN program_sekolah ps ON pjp.program_id = ps.program_id
    `);
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    next(err);
  }
});

// Endpoint update kuota jalur
router.put('/jalur/:id/kuota', authorizeRoles(ROLES.SUPERADMIN, ROLES.ADMIN_TU), updateKuotaJalur);

module.exports = router; 