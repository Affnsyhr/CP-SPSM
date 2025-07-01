const { BadRequestError, ConflictError } = require('../../utils/errors');
const SiswaModel = require('./siswa.model');

const buatSiswa = async (orang_tua_id, data) => {
  const { nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat } = data;
  if (!nama_lengkap || !tempat_lahir || !tanggal_lahir || !jenis_kelamin || !alamat) {
    throw new BadRequestError('Semua field wajib diisi');
  }
  // Validasi: satu orang_tua_id hanya boleh punya satu siswa
  const existing = await SiswaModel.getAllSiswaByOrangTua(orang_tua_id);
  if (existing && existing.length > 0) {
    throw new BadRequestError('Anda sudah mendaftarkan siswa. Satu wali hanya boleh mendaftarkan satu siswa.');
  }
  return await SiswaModel.createSiswa({ orang_tua_id, nama_lengkap , tempat_lahir, tanggal_lahir, jenis_kelamin, alamat });
};

const getSiswaOrangTua = async (orang_tua_id) => {
  return await SiswaModel.getAllSiswaByOrangTua(orang_tua_id);
};

const getAllSiswa = async () => {
  return await SiswaModel.getAllSiswa();
};

module.exports = {
  buatSiswa,
  getSiswaOrangTua,
  getAllSiswa,
};