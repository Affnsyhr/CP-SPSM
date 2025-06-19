const db = require('../../config/db');

const createSiswa = async ({ user_id, nama_lengkap, nik, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat }) => {
  const result = await db.query(
    `INSERT INTO siswa (user_id, nama_lengkap, nik, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [user_id, nama_lengkap, nik, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat]
  );
  return result.rows[0];
};

const getAllSiswaByOrangTua = async (user_id) => {
  const result = await db.query(
    `SELECT * FROM siswa WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );
  return result.rows;
};

module.exports = {
  createSiswa,
  getAllSiswaByOrangTua,
};