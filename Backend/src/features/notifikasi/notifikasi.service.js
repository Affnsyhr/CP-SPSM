const NotifikasiModel = require('./notifikasi.model');

const kirimNotifikasi = async ({ penerima_id, judul, isi, jenis_notif }) => {
  return await NotifikasiModel.createNotifikasi({
    penerima_id,
    judul,
    isi,
    jenis_notif
  });
};

module.exports = {
  kirimNotifikasi,
};