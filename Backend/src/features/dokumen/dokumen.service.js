const { BadRequestError, NotFoundError } = require('../../utils/errors');
const DokumenModel = require('./dokumen.model');
const NotifikasiService = require('../notifikasi/notifikasi.service');
const PendaftaranModel = require('../pendaftaran/pendaftaran.model');
const SiswaModel = require('../siswa/siswa.model');

const uploadDokumen = async ({ pendaftaran_id, jenis_dokumen, nama_file }) => {
  if (!pendaftaran_id || !jenis_dokumen || !nama_file) {
    throw new BadRequestError('Semua field wajib diisi');
  }

  // 1. Ambil data pendaftaran untuk mendapatkan siswa_id
  const pendaftaran = await PendaftaranModel.getPendaftaranById(pendaftaran_id);
  if (!pendaftaran) {
    throw new NotFoundError('Data pendaftaran tidak ditemukan');
  }
  const siswa_id = pendaftaran.siswa_id;

  // 2. Simpan dokumen dengan siswa_id yang sudah ditemukan
  return await DokumenModel.createDokumen({ siswa_id, jenis_dokumen, nama_file });
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

const updateDokumenFile = async ({ dokumen_id, orang_tua_id, nama_file }) => {
  // Cek dokumen milik siapa
  const info = await DokumenModel.getSiswaOrangTuaByDokumenId(dokumen_id);
  if (!info || info.orang_tua_id !== orang_tua_id) {
    throw new NotFoundError('Dokumen tidak ditemukan atau bukan milik Anda');
  }
  // Update file jika status masih menunggu
  const updated = await DokumenModel.updateDokumenFile(dokumen_id, nama_file);
  if (!updated) throw new BadRequestError('Dokumen sudah diverifikasi atau tidak ditemukan');
  return updated;
};

const deleteDokumen = async ({ dokumen_id, orang_tua_id }) => {
  // Cek dokumen milik siapa
  const info = await DokumenModel.getSiswaOrangTuaByDokumenId(dokumen_id);
  if (!info || info.orang_tua_id !== orang_tua_id) {
    throw new NotFoundError('Dokumen tidak ditemukan atau bukan milik Anda');
  }
  // Hapus dokumen jika status masih menunggu
  const deleted = await DokumenModel.deleteDokumen(dokumen_id);
  if (!deleted) throw new BadRequestError('Dokumen sudah diverifikasi atau tidak ditemukan');
  return deleted;
};

module.exports = {
  uploadDokumen,
  getDokumenByPendaftaran,
  verifikasiDokumen,
  updateDokumenFile,
  deleteDokumen,
};