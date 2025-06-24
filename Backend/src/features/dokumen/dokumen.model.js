const db = require('../../config/db');

const createDokumen = async ({ siswa_id, jenis_dokumen, nama_file }) => {
  const result = await db.query(
    `INSERT INTO dokumen_pendaftaran (siswa_id, jenis_dokumen, nama_file,  tanggal_upload)
     VALUES ($1, $2, $3,  NOW())
     RETURNING *`,
    [siswa_id, jenis_dokumen, nama_file]
  );
  return result.rows[0];
};

const getDokumenBySiswa = async (siswa_id) => {
  const result = await db.query(
    `SELECT * FROM dokumen_pendaftaran WHERE siswa_id = $1 ORDER BY tanggal_upload DESC`,
    [siswa_id]
  );
  return result.rows;
};

const getDokumenByPendaftaran = async (pendaftaran_id) => {
  const result = await db.query(
    `SELECT dp.*
     FROM dokumen_pendaftaran dp
     JOIN data_pendaftaran p ON dp.siswa_id = p.siswa_id
     WHERE p.pendaftaran_id = $1
     ORDER BY dp.tanggal_upload DESC`,
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

const updateDokumenFile = async (dokumen_id, nama_file) => {
  const result = await db.query(
    `UPDATE dokumen_pendaftaran SET nama_file = $1, tanggal_upload = NOW() WHERE dokumen_id = $2 AND status_verifikasi = 'menunggu' RETURNING *`,
    [nama_file, dokumen_id]
  );
  return result.rows[0];
};

const deleteDokumen = async (dokumen_id) => {
  const result = await db.query(
    `DELETE FROM dokumen_pendaftaran WHERE dokumen_id = $1 AND status_verifikasi = 'menunggu' RETURNING *`,
    [dokumen_id]
  );
  return result.rows[0];
};

module.exports = {
  createDokumen,
  getDokumenBySiswa,
  getDokumenByPendaftaran,
  updateStatusVerifikasi,
  getSiswaOrangTuaByDokumenId,
  updateDokumenFile,
  deleteDokumen,
};