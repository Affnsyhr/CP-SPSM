const { BadRequestError, ConflictError } = require('../../utils/errors');
const SiswaModel = require('./siswa.model');

const buatSiswa = async (orang_tua_id, data) => {
  const { nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat } = data;
  if (!nama_lengkap || !tempat_lahir || !tanggal_lahir || !jenis_kelamin || !alamat) {
    throw new BadRequestError('Semua field wajib diisi');
  }
  return await SiswaModel.createSiswa({ orang_tua_id, nama_lengkap , tempat_lahir, tanggal_lahir, jenis_kelamin, alamat });
};

const getSiswaOrangTua = async (orang_tua_id) => {
  return await SiswaModel.getAllSiswaByOrangTua(orang_tua_id);
};

module.exports = {
  buatSiswa,
  getSiswaOrangTua,
};