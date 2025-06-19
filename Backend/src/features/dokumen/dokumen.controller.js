const DokumenService = require('./dokumen.service');

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

module.exports = {
  uploadDokumen,
  getDokumenByPendaftaran,
};