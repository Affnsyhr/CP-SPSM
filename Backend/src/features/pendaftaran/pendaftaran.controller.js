const PendaftaranService = require('./pendaftaran.service');
const db = require('../../config/db');
const { logAktivitas } = require('../log/aktivitasLog.service');


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
    const admin_id = req.user.user_id;
    const ip_address = req.ip;

    const updated = await PendaftaranService.updateStatusPendaftaran(id, status_pendaftaran);
     await logAktivitas({
      user_id: admin_id,
      aktivitas: `Update status pendaftaran #${id} menjadi "${status_pendaftaran}"`,
      ip_address
    });
    
    res.status(200).json({ status: 'success', message: 'Status pendaftaran diperbarui', data: updated });
  } catch (error) {
    next(error);
  }
};

const deletePendaftaran = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orang_tua_id = req.user.user_id;
    const deleted = await PendaftaranService.deletePendaftaran({ pendaftaran_id: id, orang_tua_id });
    res.json({ status: 'success', message: 'Pendaftaran berhasil dihapus', data: deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  daftarSiswa,
  getRiwayatPendaftaran,
  getAllPendaftaran,
  updateStatusPendaftaran,
  deletePendaftaran,
};