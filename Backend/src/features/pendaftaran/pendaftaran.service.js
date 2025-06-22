const { BadRequestError } = require('../../utils/errors');
const PendaftaranModel = require('./pendaftaran.model');
const { sendEmail } = require('../../utils/emailService');
const db = require('../../config/db');

const buatPendaftaran = async ({ siswa_id, tahun_ajaran_id, program_id, catatan, orang_tua_id }) => {
  if (!siswa_id || !tahun_ajaran_id || !program_id || !orang_tua_id) {
    throw new BadRequestError('Semua field wajib diisi');
  }
  // Validasi tambahan bisa ditambahkan di sini (misal: cek kuota, cek status, dsb)
  return await PendaftaranModel.createPendaftaran({ siswa_id, tahun_ajaran_id, program_id, catatan, orang_tua_id});
};

const riwayatPendaftaranOrangTua = async (user_id) => {
  return await PendaftaranModel.getPendaftaranByOrangTua(user_id);
};
const getDetailPendaftaran = async ({ siswa_id, program_id, orang_tua_id }) => {
  const result = await db.query(
    `SELECT 
      s.nama_lengkap AS nama_lengkap_siswa,
      ot.nama_lengkap AS nama_lengkap_orangtua,
      ot.alamat AS alamat_orangtua,
      ot.no_hp AS no_hp_orangtua,
      ot.nik AS nik_orangtua,
      ps.jenis_pendaftar AS jalur_pendaftaran
    FROM siswa s
    JOIN orang_tua ot ON s.orang_tua_id = ot.user_id
    JOIN program_sekolah ps ON ps.program_id = $2
    WHERE s.siswa_id = $1 AND ot.user_id = $3
    LIMIT 1`,
    [siswa_id, program_id, orang_tua_id]
  );
  return result.rows[0] || {};
};

const updateStatusPendaftaran = async (id, status_pendaftaran) => {
  // ...update status di database...
  if (status_pendaftaran === 'lulus') {
    // Ambil data orang tua dan anak
    const result = await db.query(`
      SELECT u.email, up.nama_lengkap AS nama_ortu, s.nama_lengkap AS nama_anak
      FROM data_pendaftaran dp
      JOIN user_profile up ON dp.orang_tua_id = up.user_id
      JOIN users u ON up.user_id = u.user_id
      JOIN siswa s ON dp.siswa_id = s.siswa_id
      WHERE dp.pendaftaran_id = $1
    `, [id]);
    if (result.rows.length) {
      const { email, nama_ortu, nama_anak } = result.rows[0];
      await sendEmail({
        to: email,
        subject: 'Pendaftaran Diterima',
        text: `Yth. Bapak/Ibu ${nama_ortu},\nSelamat! Pendaftaran anak Anda atas nama ${nama_anak} telah diterima di sekolah kami.\nSilakan cek dashboard untuk informasi selanjutnya.`
      });
    }
  }
  // ...
};

module.exports = {
  buatPendaftaran,
  riwayatPendaftaranOrangTua,
  updateStatusPendaftaran,
  getDetailPendaftaran
};