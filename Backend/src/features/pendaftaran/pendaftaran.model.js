const db = require('../../config/db');

const createPendaftaran = async ({ siswa_id, tahun_ajaran_id, program_id, catatan }) => {
  const result = await db.query(
    `INSERT INTO pendaftaran (siswa_id, tahun_ajaran_id, program_id, catatan)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [siswa_id, tahun_ajaran_id, program_id, catatan]
  );
  return result.rows[0];
};

const getPendaftaranByOrangTua = async (user_id) => {
  // Ambil semua pendaftaran siswa milik user (orang tua)
  const result = await db.query(
    `SELECT p.*, s.nama_lengkap, t.tahun_mulai, t.tahun_selesai, pr.nama_program
     FROM pendaftaran p
     JOIN siswa s ON p.siswa_id = s.siswa_id
     JOIN tahun_ajaran t ON p.tahun_ajaran_id = t.tahun_ajaran_id
     JOIN program pr ON p.program_id = pr.program_id
     WHERE s.user_id = $1
     ORDER BY p.created_at DESC`,
    [user_id]
  );
  return result.rows;
};

module.exports = {
  createPendaftaran,
  getPendaftaranByOrangTua,
};