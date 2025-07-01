const SiswaService = require('./siswa.service');

const tambahSiswa = async (req, res, next) => {
  console.log('Payload siswa:', req.body);
  try {
    const orang_tua_id = req.user.user_id;
    const siswa = await SiswaService.buatSiswa(orang_tua_id, req.body);
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
    const orang_tua_id = req.user.user_id;
    const siswa = await SiswaService.getSiswaOrangTua(orang_tua_id);
    res.status(200).json({
      status: 'success',
      data: siswa,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSiswa = async (req, res, next) => {
  try {
    const siswa = await SiswaService.getAllSiswa();
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
  getAllSiswa,
};