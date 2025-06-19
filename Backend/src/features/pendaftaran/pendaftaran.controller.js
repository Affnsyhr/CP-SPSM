const PendaftaranService = require('./pendaftaran.service');

const daftarSiswa = async (req, res, next) => {
  try {
    const { siswa_id, tahun_ajaran_id, program_id, catatan } = req.body;
    // Pastikan user hanya bisa mendaftarkan siswa miliknya (opsional: validasi siswa_id milik req.user.user_id)
    const pendaftaran = await PendaftaranService.buatPendaftaran({
      siswa_id,
      tahun_ajaran_id,
      program_id,
      catatan,
    });
    res.status(201).json({
      status: 'success',
      message: 'Pendaftaran berhasil',
      data: pendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

const getRiwayatPendaftaran = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const riwayat = await PendaftaranService.riwayatPendaftaranOrangTua(user_id);
    res.status(200).json({
      status: 'success',
      data: riwayat,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPendaftaran = async (req, res, next) => {
  try {
    const data = await PendaftaranService.getAllPendaftaran();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  daftarSiswa,
  getRiwayatPendaftaran,
};