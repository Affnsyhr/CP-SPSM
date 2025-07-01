const db = require('../../config/db');

const createSiswa = async ({ orang_tua_id, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin }) => {
  const result = await db.query(
    `INSERT INTO siswa (orang_tua_id, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING *`,
    [orang_tua_id, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin]
  );
  return result.rows[0];
};

const getAllSiswaByOrangTua = async (orang_tua_id) => {
  const result = await db.query(
    `SELECT * FROM siswa WHERE orang_tua_id = $1 ORDER BY created_at DESC`,
    [orang_tua_id]
  );
  return result.rows;
};

const getAllSiswa = async () => {
  const result = await db.query(
    `SELECT s.*, u.username as nama_orang_tua, u.email as email_orang_tua 
     FROM siswa s 
     LEFT JOIN users u ON s.orang_tua_id = u.user_id 
     ORDER BY s.created_at DESC`
  );
  return result.rows;
};

const getSiswaById = async (siswa_id) => {
  const result = await db.query(
    'SELECT * FROM siswa WHERE siswa_id = $1',
    [siswa_id]
  );
  return result.rows[0];
}

module.exports = {
  createSiswa,
  getAllSiswaByOrangTua,
  getAllSiswa,
  getSiswaById
};