const db = require('../../config/db');

const createTahunAjaran = async ({ tahun_ajaran, tanggal_mulai, tanggal_berakhir, status, created_by }) => {
  const result = await db.query(
    `INSERT INTO tahun_ajaran (tahun_ajaran, tanggal_mulai, tanggal_berakhir, status, created_by)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [tahun_ajaran, tanggal_mulai, tanggal_berakhir, status, created_by]
  );
  return result.rows[0];
};

const getAllTahunAjaran = async () => {
  const result = await db.query('SELECT * FROM tahun_ajaran ORDER BY tanggal_mulai DESC');
  return result.rows;
};

const updateTahunAjaran = async (id_tahunajaran, { tahun_ajaran, tanggal_mulai, tanggal_berakhir, status }) => {
  const result = await db.query(
    `UPDATE tahun_ajaran SET tahun_ajaran = $1, tanggal_mulai = $2, tanggal_berakhir = $3, status = $4 WHERE id_tahunajaran = $5 RETURNING *`,
    [tahun_ajaran, tanggal_mulai, tanggal_berakhir, status, id_tahunajaran]
  );
  return result.rows[0];
};

const deleteTahunAjaran = async (id_tahunajaran) => {
  const result = await db.query('DELETE FROM tahun_ajaran WHERE id_tahunajaran = $1 RETURNING *', [id_tahunajaran]);
  return result.rows[0];
};

module.exports = {
  createTahunAjaran,
  getAllTahunAjaran,
  updateTahunAjaran,
  deleteTahunAjaran,
}; 