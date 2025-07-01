const DokumenService = require('./dokumen.service');
const { logAktivitas } = require('../log/aktivitasLog.service');

// Sinkronkan dengan ENUM di schema.sql
const allowedJenisDokumen = ['akta_kelahiran', 'kartu_keluarga', 'ijazah', 'foto', 'lainnya'];

const uploadDokumen = async (req, res, next) => {
  try {
    const { pendaftaran_id, jenis_dokumen } = req.body;
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'File dokumen wajib diupload' });
    }
    const dokumen = await DokumenService.uploadDokumen({
      pendaftaran_id,
      jenis_dokumen,
      nama_file: req.file.filename,
    });
    res.status(201).json({
      status: 'success',
      message: 'Dokumen berhasil diupload',
      // data: dokumen,
    });
  } catch (error) {
    next(error);
  }
};

const getDokumenByPendaftaran = async (req, res, next) => {
  try {
    const { pendaftaran_id } = req.params;
    const dokumen = await DokumenService.getDokumenByPendaftaran(pendaftaran_id);
    res.status(200).json({
      status: 'success',
      data: dokumen,
    });
  } catch (error) {
    next(error);
  }
};
const verifikasiDokumen = async (req, res, next) => {
  try {
    const { dokumen_id } = req.params;
    let { status_verifikasi, catatan } = req.body;
    const verified_by = req.user.user_id;
    const admin_name = req.user.username;
    const ip_address = req.ip;

    if (catatan) {
      catatan = `[Verifikator: ${admin_name}] ${catatan}`;
    } else {
      catatan = `[Verifikator: ${admin_name}]`;
    }

    const dokumen = await DokumenService.verifikasiDokumen({ dokumen_id, status_verifikasi, catatan, verified_by });

    // Log aktivitas admin
    await logAktivitas({
      user_id: verified_by,
      aktivitas: `Verifikasi dokumen #${dokumen_id} menjadi "${status_verifikasi}"`,
      ip_address
    });

    res.json({ status: 'success', message: 'Status dokumen diperbarui', data: dokumen });
  } catch (err) { next(err); }
};

const updateDokumenFile = async (req, res, next) => {
  try {
    const { dokumen_id } = req.params;
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'File dokumen wajib diupload' });
    }
    const orang_tua_id = req.user.user_id;
    const updated = await DokumenService.updateDokumenFile({ dokumen_id, orang_tua_id, nama_file: req.file.filename });
    res.json({ status: 'success', message: 'File dokumen berhasil diganti', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteDokumen = async (req, res, next) => {
  try {
    const { dokumen_id } = req.params;
    const orang_tua_id = req.user.user_id;
    const deleted = await DokumenService.deleteDokumen({ dokumen_id, orang_tua_id });
    res.json({ status: 'success', message: 'Dokumen berhasil dihapus', data: deleted });
  } catch (err) {
    next(err);
  }
};

const getAllDokumen = async (req, res, next) => {
  try {
    const db = require('../../config/db');
    const result = await db.query(`
      SELECT d.dokumen_id, d.jenis_dokumen, d.nama_file, d.status_verifikasi, d.tanggal_upload, d.catatan,
             s.nama_lengkap AS nama_siswa, s.siswa_id, p.pendaftaran_id
      FROM dokumen_pendaftaran d
      JOIN siswa s ON d.siswa_id = s.siswa_id
      JOIN data_pendaftaran p ON s.siswa_id = p.siswa_id
      ORDER BY d.tanggal_upload DESC
    `);
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    next(err);
  }
};

const getAllDokumenAdmin = async (req, res, next) => {
  try {
    if (req.user?.role_id !== 3) {
      return res.status(403).json({ status: 'error', message: 'Akses hanya untuk admin TU' });
    }
    const db = require('../../config/db');
    const result = await db.query(`
      SELECT d.dokumen_id, d.jenis_dokumen, d.nama_file, d.status_verifikasi, d.tanggal_upload, d.catatan,
             s.nama_lengkap AS nama_siswa, s.siswa_id, p.pendaftaran_id
      FROM dokumen_pendaftaran d
      JOIN siswa s ON d.siswa_id = s.siswa_id
      JOIN data_pendaftaran p ON s.siswa_id = p.siswa_id
      ORDER BY d.tanggal_upload DESC
    `);
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadDokumen,
  getDokumenByPendaftaran,
  verifikasiDokumen,
  updateDokumenFile,
  deleteDokumen,
  getAllDokumen,
  getAllDokumenAdmin,
};