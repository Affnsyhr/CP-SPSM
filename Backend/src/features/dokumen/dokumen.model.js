const db = require('../../config/db');

const createDokumen = async ({ pendaftaran_id, jenis_dokumen, nama_file, path_file }) => {
  const result = await db.query(
    `INSERT INTO dokumen (pendaftaran_id, jenis_dokumen, nama_file, path_file)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [pendaftaran_id, jenis_dokumen, nama_file, path_file]
  );
  return result.rows[0];
};

const getDokumenByPendaftaran = async (pendaftaran_id) => {
  const result = await db.query(
    `SELECT * FROM dokumen WHERE pendaftaran_id = $1 ORDER BY created_at DESC`,
    [pendaftaran_id]
  );
  return result.rows;
};

module.exports = {
  createDokumen,
  getDokumenByPendaftaran,
};