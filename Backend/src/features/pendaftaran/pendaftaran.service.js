const { BadRequestError, NotFoundError } = require('../../utils/errors');
const PendaftaranModel = require('./pendaftaran.model');
const SiswaModel = require('../siswa/siswa.model');
const { sendEmail } = require('../../utils/emailService');
const db = require('../../config/db');
const ProgramModel = require('../program/program.model');

const buatPendaftaran = async ({ siswa_id, tahun_ajaran_id, program_id, catatan, orang_tua_id, program_jalur_id }) => {
  if (!siswa_id || !tahun_ajaran_id || !program_id || !orang_tua_id || !program_jalur_id) {
    throw new BadRequestError('Semua field wajib diisi');
  }
  // Validasi tambahan bisa ditambahkan di sini (misal: cek kuota, cek status, dsb)
  return await PendaftaranModel.createPendaftaran({ siswa_id, tahun_ajaran_id, program_id, catatan, orang_tua_id, program_jalur_id });
};

const getAllPendaftaran = async () => {
  return await PendaftaranModel.getAllPendaftaran();
}

const riwayatPendaftaranOrangTua = async (user_id) => {
  return await PendaftaranModel.getPendaftaranByOrangTua(user_id);
};
const getDetailPendaftaran = async ({ siswa_id, program_id, orang_tua_id }) => {
  // Ambil jalur pendaftar dari tabel program_jalur_pendaftar
  const jalurResult = await db.query(
    `SELECT jenis_pendaftar FROM program_jalur_pendaftar WHERE program_id = $1 LIMIT 1`,
    [program_id]
  );
  const jalur_pendaftaran = jalurResult.rows[0]?.jenis_pendaftar || null;

  const result = await db.query(
    `SELECT 
      s.nama_lengkap AS nama_lengkap_siswa,
      ot.nama_lengkap AS nama_lengkap_orangtua,
      ot.alamat AS alamat_orangtua,
      ot.no_hp AS no_hp_orangtua,
      ot.nik AS nik_orangtua
    FROM siswa s
    JOIN orang_tua ot ON s.orang_tua_id = ot.user_id
    WHERE s.siswa_id = $1 AND ot.user_id = $2
    LIMIT 1`,
    [siswa_id, orang_tua_id]
  );
  return { ...result.rows[0], jalur_pendaftaran };
};

const updateStatusPendaftaran = async (id, status_pendaftaran) => {
  // Ambil data pendaftaran
  const pendaftaran = await PendaftaranModel.getPendaftaranById(id);
  if (!pendaftaran) throw new NotFoundError('Pendaftaran tidak ditemukan');

  // Jika status diubah ke lulus, cek dan kurangi kuota jalur
  if (status_pendaftaran === 'lulus') {
    if (!pendaftaran.program_jalur_id) throw new BadRequestError('Jalur pendaftaran tidak ditemukan');
    // Ambil data jalur
    const jalur = await ProgramModel.getJalurById(pendaftaran.program_jalur_id);
    if (!jalur) throw new NotFoundError('Jalur tidak ditemukan');
    if (!jalur.kuota_jalur || jalur.kuota_jalur < 1) throw new BadRequestError('Kuota jalur sudah habis');
    // Kurangi kuota jalur
    await ProgramModel.decrementKuotaJalur(pendaftaran.program_jalur_id);
  }

  let updatedPendaftaran = await PendaftaranModel.updateStatus(id, status_pendaftaran);

  // Jika data lama tidak memiliki orang_tua_id, cari secara manual
  if (updatedPendaftaran && !updatedPendaftaran.orang_tua_id && updatedPendaftaran.siswa_id) {
    const siswa = await SiswaModel.getSiswaById(updatedPendaftaran.siswa_id);
    if (siswa) {
      updatedPendaftaran.orang_tua_id = siswa.orang_tua_id;
    }
  }

  // Kirim email jika lulus (DISABLED SEMENTARA)
  /*
  if (status_pendaftaran === 'lulus') {
    // Ambil data orang tua dan anak
    const result = await db.query(`
      SELECT u.email, ot.nama_lengkap AS nama_ortu, s.nama_lengkap AS nama_anak
      FROM data_pendaftaran dp
      JOIN orang_tua ot ON dp.orang_tua_id = ot.user_id
      JOIN users u ON ot.user_id = u.user_id
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
  */
  return updatedPendaftaran;
};

const deletePendaftaran = async ({ pendaftaran_id, orang_tua_id }) => {
  // Cek pendaftaran milik siapa dan status
  const pendaftaran = await PendaftaranModel.getPendaftaranById(pendaftaran_id);
  if (!pendaftaran || pendaftaran.orang_tua_id !== orang_tua_id) {
    throw new NotFoundError('Pendaftaran tidak ditemukan atau bukan milik Anda');
  }
  if (pendaftaran.status_pendaftaran !== 'proses') {
    throw new BadRequestError('Pendaftaran tidak bisa dihapus karena sudah diproses');
  }
  const deleted = await PendaftaranModel.deletePendaftaran(pendaftaran_id);
  if (!deleted) throw new BadRequestError('Pendaftaran gagal dihapus');
  return deleted;
};

module.exports = {
  buatPendaftaran,
  getAllPendaftaran,
  riwayatPendaftaranOrangTua,
  getDetailPendaftaran,
  updateStatusPendaftaran,
  deletePendaftaran,
};