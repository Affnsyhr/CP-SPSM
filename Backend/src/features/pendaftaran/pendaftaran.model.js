const db = require('../../config/db');

// Membuat pendaftaran baru
const createPendaftaran = async ({ siswa_id, tahun_ajaran_id, program_id, catatan, orang_tua_id, program_jalur_id }) => {
  const result = await db.query(
    `INSERT INTO data_pendaftaran (
        siswa_id, 
        orang_tua_id, 
        id_tahunajaran, 
        program_id, 
        program_jalur_id,
        catatan, 
        tanggal_daftar
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *`,
    [siswa_id, orang_tua_id, tahun_ajaran_id, program_id, program_jalur_id, catatan]
  );
  return result.rows[0];
};

// Mendapatkan semua pendaftaran milik orang tua tertentu
const getPendaftaranByOrangTua = async (user_id) => {
  const result = await db.query(
    `SELECT dp.*, s.nama_lengkap AS nama_siswa, ta.tahun_ajaran, ps.nama_program
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

const getPendaftaranById = async (pendaftaran_id) => {
  const result = await db.query(
    'SELECT * FROM data_pendaftaran WHERE pendaftaran_id = $1',
    [pendaftaran_id]
  );
  return result.rows[0];
}

const getAllPendaftaran = async () => {
  const result = await db.query(
    `SELECT 
      dp.pendaftaran_id,
      dp.tanggal_daftar,
      dp.status_pendaftaran,
      dp.catatan,
      s.siswa_id,
      s.nama_lengkap AS nama_siswa,
      s.tempat_lahir,
      s.tanggal_lahir,
      s.jenis_kelamin,
      ot.user_id AS orang_tua_id,
      ot.nama_lengkap AS nama_orangtua,
      ot.alamat AS alamat_orangtua,
      ot.no_hp AS no_hp_orangtua,
      u.email AS email_orangtua,
      ps.program_id,
      ps.nama_program,
      ta.id_tahunajaran,
      ta.tahun_ajaran
    FROM data_pendaftaran dp
    JOIN siswa s ON dp.siswa_id = s.siswa_id
    JOIN orang_tua ot ON dp.orang_tua_id = ot.user_id
    JOIN users u ON ot.user_id = u.user_id
    JOIN program_sekolah ps ON dp.program_id = ps.program_id
    JOIN tahun_ajaran ta ON dp.id_tahunajaran = ta.id_tahunajaran
    ORDER BY dp.tanggal_daftar DESC`
  );
  return result.rows;
}

const updateStatus = async (pendaftaran_id, status_pendaftaran) => {
  const result = await db.query(
    `UPDATE data_pendaftaran SET status_pendaftaran = $1 WHERE pendaftaran_id = $2 RETURNING *`,
    [status_pendaftaran, pendaftaran_id]
  );
  return result.rows[0];
}

const deletePendaftaran = async (pendaftaran_id) => {
  const result = await db.query(
    `DELETE FROM data_pendaftaran WHERE pendaftaran_id = $1 AND status_pendaftaran = 'proses' RETURNING *`,
    [pendaftaran_id]
  );
  return result.rows[0];
};

module.exports = {
  createPendaftaran,
  getPendaftaranByOrangTua,
  getPendaftaranById,
  getAllPendaftaran,
  updateStatus,
  deletePendaftaran,
};