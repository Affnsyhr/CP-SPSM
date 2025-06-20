const DokumenService = require('./dokumen.service');

// Tambahkan array jenis dokumen yang diizinkan
const allowedJenisDokumen = ['nilai_rapor', 'akte', 'foto_3x4', 'kk'];

const uploadDokumen = async (req, res, next) => {
  try {
    const { pendaftaran_id, jenis_dokumen } = req.body;
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'File dokumen wajib diupload' });
    }
    const dokumen = await DokumenService.uploadDokumen({
      pendaftaran_id,
      jenis_dokumen,
      nama_file: req.file.originalname,
      path_file: req.file.path,
    });
    res.status(201).json({
      status: 'success',
      message: 'Dokumen berhasil diupload',
      data: dokumen,
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

    if (catatan) {
      catatan = `[Verifikator: ${admin_name}] ${catatan}`;
    } else {
      catatan = `[Verifikator: ${admin_name}]`;
    }

    const dokumen = await DokumenService.verifikasiDokumen({ dokumen_id, status_verifikasi, catatan, verified_by });
    res.json({ status: 'success', message: 'Status dokumen diperbarui', data: dokumen });
  } catch (err) { next(err); }
};

module.exports = {
  uploadDokumen,
  getDokumenByPendaftaran,
  verifikasiDokumen,
};