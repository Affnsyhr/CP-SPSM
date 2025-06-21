const PendaftaranService = require('./pendaftaran.service');
const db = require('../../config/db');

const daftarSiswa = async (req, res, next) => {
  try {
    const { siswa_id, tahun_ajaran_id, program_id, catatan } = req.body;
    const orang_tua_id = req.user.user_id;

    // Validasi siswa_id milik orang tua yang login
    const cekSiswa = await db.query(
      'SELECT * FROM siswa WHERE siswa_id = $1 AND orang_tua_id = $2',
      [siswa_id, orang_tua_id]
    );
    if (cekSiswa.rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Siswa tidak ditemukan atau bukan milik Anda'
      });
    }

    // Insert pendaftaran
    const data_pendaftaran = await PendaftaranService.buatPendaftaran({
      siswa_id,
      tahun_ajaran_id,
      program_id,
      catatan,
      orang_tua_id
    });

    // Ambil detail lengkap untuk response
    const detail = await PendaftaranService.getDetailPendaftaran({
      siswa_id,
      program_id,
      orang_tua_id
    });

    res.status(201).json({
      status: 'success',
      message: 'Pendaftaran berhasil',
      data: {
        ...data_pendaftaran,
        ...detail
      }
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

const updateStatusPendaftaran = async (req, res, next) => {
  try {
    const { status_pendaftaran } = req.body;
    const { id } = req.params;
    const updated = await PendaftaranService.updateStatusPendaftaran(id, status_pendaftaran);
    res.status(200).json({ status: 'success', message: 'Status pendaftaran diperbarui', data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  daftarSiswa,
  getRiwayatPendaftaran,
  getAllPendaftaran,
  updateStatusPendaftaran
};