const db = require('../../config/db');

const createProgram = async ({ nama_program, deskripsi, status_program, kuota_siswa, jenis_pendaftar }) => {
  const result = await db.query(
    `INSERT INTO program_sekolah (nama_program, deskripsi, status_program, kuota_siswa, jenis_pendaftar)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nama_program, deskripsi, status_program, kuota_siswa, jenis_pendaftar]
  );
  return result.rows[0];
};

const getAllPrograms = async () => {
  const result = await db.query('SELECT * FROM program_sekolah ORDER BY program_id DESC');
  return result.rows;
};

const updateProgram = async (program_id, { nama_program, deskripsi, status_program, kuota_siswa, jenis_pendaftar }) => {
  const result = await db.query(
    `UPDATE program_sekolah SET nama_program = $1, deskripsi = $2, status_program = $3, kuota_siswa = $4, jenis_pendaftar = $5 WHERE program_id = $6 RETURNING *`,
    [nama_program, deskripsi, status_program, kuota_siswa, jenis_pendaftar, program_id]
  );
  return result.rows[0];
};

const deleteProgram = async (program_id) => {
  const result = await db.query('DELETE FROM program_sekolah WHERE program_id = $1 RETURNING *', [program_id]);
  return result.rows[0];
};

module.exports = {
  createProgram,
  getAllPrograms,
  updateProgram,
  deleteProgram,
}; 