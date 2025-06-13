const { BadRequestError } = require('../../utils/errors');
const PendaftaranModel = require('./pendaftaran.model');

const buatPendaftaran = async ({ siswa_id, tahun_ajaran_id, program_id, catatan }) => {
  if (!siswa_id || !tahun_ajaran_id || !program_id) {
    throw new BadRequestError('Semua field wajib diisi');
  }
  // Validasi tambahan bisa ditambahkan di sini (misal: cek kuota, cek status, dsb)
  return await PendaftaranModel.createPendaftaran({ siswa_id, tahun_ajaran_id, program_id, catatan });
};

const riwayatPendaftaranOrangTua = async (user_id) => {
  return await PendaftaranModel.getPendaftaranByOrangTua(user_id);
};

module.exports = {
  buatPendaftaran,
  riwayatPendaftaranOrangTua,
};