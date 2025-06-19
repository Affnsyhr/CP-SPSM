const { BadRequestError } = require('../../utils/errors');
const DokumenModel = require('./dokumen.model');

const uploadDokumen = async ({ pendaftaran_id, jenis_dokumen, nama_file, path_file }) => {
  if (!pendaftaran_id || !jenis_dokumen || !nama_file || !path_file) {
    throw new BadRequestError('Semua field wajib diisi');
  }
  return await DokumenModel.createDokumen({ pendaftaran_id, jenis_dokumen, nama_file, path_file });
};

const getDokumenByPendaftaran = async (pendaftaran_id) => {
  if (!pendaftaran_id) throw new BadRequestError('pendaftaran_id wajib diisi');
  return await DokumenModel.getDokumenByPendaftaran(pendaftaran_id);
};

module.exports = {
  uploadDokumen,
  getDokumenByPendaftaran,
};