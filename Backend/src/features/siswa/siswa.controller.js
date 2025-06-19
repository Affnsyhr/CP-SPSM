const SiswaService = require('./siswa.service');

const tambahSiswa = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const siswa = await SiswaService.buatSiswa(user_id, req.body);
    res.status(201).json({
      status: 'success',
      message: 'Siswa berhasil ditambahkan',
      data: siswa,
    });
  } catch (error) {
    next(error);
  }
};

const getDaftarSiswa = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const siswa = await SiswaService.getSiswaOrangTua(user_id);
    res.status(200).json({
      status: 'success',
      data: siswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  tambahSiswa,
  getDaftarSiswa,
};