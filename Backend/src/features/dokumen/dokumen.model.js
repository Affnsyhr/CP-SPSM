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

const updateStatusVerifikasi = async ({ dokumen_id, status_verifikasi, catatan, verified_by }) => {
  const result = await db.query(
    `UPDATE dokumen_pendaftaran
     SET status_verifikasi = $1, catatan = $2, verified_by = $3, tanggal_verifikasi = NOW()
     WHERE dokumen_id = $4
     RETURNING *`,
    [status_verifikasi, catatan, verified_by, dokumen_id]
  );
  return result.rows[0];
};
const getSiswaOrangTuaByDokumenId = async (dokumen_id) => {
  const result = await db.query(
    `SELECT s.siswa_id, s.orang_tua_id
     FROM dokumen_pendaftaran d
     JOIN siswa s ON d.siswa_id = s.siswa_id
     WHERE d.dokumen_id = $1`,
    [dokumen_id]
  );
  return result.rows[0];
};

module.exports = {
  createDokumen,
  getDokumenByPendaftaran,
  updateStatusVerifikasi,
  getSiswaOrangTuaByDokumenId,
};