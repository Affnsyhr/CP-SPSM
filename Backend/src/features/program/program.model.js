const db = require('../../config/db');

const createProgram = async ({ nama_program, deskripsi, status_program, kuota_siswa }) => {
  const result = await db.query(
    `INSERT INTO program_sekolah (nama_program, deskripsi, status_program, kuota_siswa)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nama_program, deskripsi, status_program, kuota_siswa]
  );
  return result.rows[0];
};

const insertJenisPendaftar = async (program_id, jenis_pendaftar_arr) => {
  if (!Array.isArray(jenis_pendaftar_arr)) return;
  for (const jenis of jenis_pendaftar_arr) {
    await db.query(
      `INSERT INTO program_jalur_pendaftar (program_id, jenis_pendaftar) VALUES ($1, $2)`,
      [program_id, jenis]
    );
  }
};

const deleteJenisPendaftar = async (program_id) => {
  await db.query(`DELETE FROM program_jalur_pendaftar WHERE program_id = $1`, [program_id]);
};

const getJenisPendaftarByProgram = async (program_id) => {
  const result = await db.query(
    `SELECT jenis_pendaftar FROM program_jalur_pendaftar WHERE program_id = $1`,
    [program_id]
  );
  return result.rows.map(row => row.jenis_pendaftar);
};

const getAllPrograms = async () => {
  const result = await db.query('SELECT * FROM program_sekolah ORDER BY program_id DESC');
  const programs = result.rows;
  for (const program of programs) {
    program.jenis_pendaftar = await getJenisPendaftarByProgram(program.program_id);
  }
  return programs;
};

const updateProgram = async (program_id, { nama_program, deskripsi, status_program, kuota_siswa }) => {
  const result = await db.query(
    `UPDATE program_sekolah SET nama_program = $1, deskripsi = $2, status_program = $3, kuota_siswa = $4 WHERE program_id = $5 RETURNING *`,
    [nama_program, deskripsi, status_program, kuota_siswa, program_id]
  );
  return result.rows[0];
};

const deleteProgram = async (program_id) => {
  await deleteJenisPendaftar(program_id);
  const result = await db.query('DELETE FROM program_sekolah WHERE program_id = $1 RETURNING *', [program_id]);
  return result.rows[0];
};

const getJalurById = async (id) => {
  const result = await db.query('SELECT * FROM program_jalur_pendaftar WHERE id = $1', [id]);
  return result.rows[0];
};

const updateKuotaJalur = async (id, kuota_jalur) => {
  const result = await db.query('UPDATE program_jalur_pendaftar SET kuota_jalur = $1 WHERE id = $2 RETURNING *', [kuota_jalur, id]);
  return result.rows[0];
};

const decrementKuotaJalur = async (id) => {
  const result = await db.query('UPDATE program_jalur_pendaftar SET kuota_jalur = kuota_jalur - 1 WHERE id = $1 AND kuota_jalur > 0 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  createProgram,
  insertJenisPendaftar,
  deleteJenisPendaftar,
  getJenisPendaftarByProgram,
  getAllPrograms,
  updateProgram,
  deleteProgram,
  getJalurById,
  updateKuotaJalur,
  decrementKuotaJalur
}; 