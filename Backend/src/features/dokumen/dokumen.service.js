const { BadRequestError } = require('../../utils/errors');
const DokumenModel = require('./dokumen.model');
const NotifikasiService = require('../notifikasi/notifikasi.service');

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
const verifikasiDokumen = async ({ dokumen_id, status_verifikasi, catatan, verified_by }) => {
  // Update status dokumen
  const dokumen = await DokumenModel.updateStatusVerifikasi({ dokumen_id, status_verifikasi, catatan, verified_by });

  // Ambil data siswa dan orang tua terkait dokumen
  const info = await DokumenModel.getSiswaOrangTuaByDokumenId(dokumen_id);

  // Kirim notifikasi ke orang tua
  if (info && info.orang_tua_id) {
    await NotifikasiService.kirimNotifikasi({
      penerima_id: info.orang_tua_id,
      judul: 'Status Dokumen',
      isi: `Dokumen ${dokumen.jenis_dokumen} telah ${status_verifikasi}.`,
      jenis_notif: 'dokumen'
    });
  }

  return dokumen;
};
module.exports = {
  uploadDokumen,
  getDokumenByPendaftaran,
  verifikasiDokumen,
};