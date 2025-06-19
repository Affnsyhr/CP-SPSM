const { BadRequestError, ConflictError } = require('../../utils/errors');
const SiswaModel = require('./siswa.model');

const buatSiswa = async (user_id, data) => {
  const { nama_lengkap, nik, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat } = data;
  if (!nama_lengkap || !nik || !tempat_lahir || !tanggal_lahir || !jenis_kelamin || !alamat) {
    throw new BadRequestError('Semua field wajib diisi');
  }
  // Cek NIK unik
  // (opsional: tambahkan validasi NIK sudah terdaftar)
  return await SiswaModel.createSiswa({ user_id, nama_lengkap, nik, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat });
};

const getSiswaOrangTua = async (user_id) => {
  return await SiswaModel.getAllSiswaByOrangTua(user_id);
};

module.exports = {
  buatSiswa,
  getSiswaOrangTua,
};