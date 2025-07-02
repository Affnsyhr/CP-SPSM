const NotifikasiModel = require('./notifikasi.model');

const kirimNotifikasi = async ({ penerima_id, judul, isi, jenis_notif }) => {
  return await NotifikasiModel.createNotifikasi({
    penerima_id,
    judul,
    isi,
    jenis_notif
  });
};

const updateStatusBaca = async (notifikasi_id) => {
  return await NotifikasiModel.updateStatusBaca(notifikasi_id);
};

// Controller untuk update status_baca notifikasi
const updateStatusBacaController = async (req, res, next) => {
  try {
    const { notifikasi_id } = req.params;
    const updated = await updateStatusBaca(notifikasi_id);
    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Notifikasi tidak ditemukan' });
    }
    res.json({ status: 'success', message: 'Status notifikasi diperbarui', data: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  kirimNotifikasi,
  updateStatusBaca,
  updateStatusBacaController,
};