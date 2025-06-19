const db = require('../../config/db');

// Daftar siswa milik orang tua
const getSiswa = async (user_id) => {
  const result = await db.query(
    `SELECT * FROM siswa WHERE orang_tua_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );
  return result.rows;
};

// Riwayat pendaftaran anak-anak orang tua
const getPendaftaran = async (user_id) => {
  const result = await db.query(
    `SELECT dp.*, s.nama_lengkap, ta.tahun_ajaran, ps.nama_program
     FROM data_pendaftaran dp
     JOIN siswa s ON dp.siswa_id = s.siswa_id
     JOIN tahun_ajaran ta ON dp.id_tahunajaran = ta.id_tahunajaran
     JOIN program_sekolah ps ON dp.program_id = ps.program_id
     WHERE dp.orang_tua_id = $1
     ORDER BY dp.tanggal_daftar DESC`,
    [user_id]
  );
  return result.rows;
};

// Statistik dokumen anak-anak orang tua
const getDokumen = async (user_id) => {
  const result = await db.query(
    `SELECT d.*, s.nama_lengkap
     FROM dokumen_pendaftaran d
     JOIN siswa s ON d.siswa_id = s.siswa_id
     WHERE s.orang_tua_id = $1
     ORDER BY d.tanggal_upload DESC`,
    [user_id]
  );
  return result.rows;
};

// Notifikasi terbaru untuk orang tua
const getNotifikasi = async (user_id) => {
  const result = await db.query(
    `SELECT * FROM notifikasi WHERE penerima_id = $1 ORDER BY tanggal_kirim DESC LIMIT 10`,
    [user_id]
  );
  return result.rows;
};

module.exports = {
  getSiswa,
  getPendaftaran,
  getDokumen,
  getNotifikasi
};