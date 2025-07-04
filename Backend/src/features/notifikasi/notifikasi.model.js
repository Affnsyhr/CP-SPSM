const db = require('../../config/db');

const createNotifikasi = async ({ penerima_id, judul, isi, jenis_notif }) => {
  const result = await db.query(
    `INSERT INTO notifikasi (penerima_id, judul, isi, tanggal_kirim, status_baca, jenis_notif)
     VALUES ($1, $2, $3, NOW(), 'belum_dibaca', $4)
     RETURNING *`,
    [penerima_id, judul, isi, jenis_notif]
  );
  return result.rows[0];
};

const updateStatusBaca = async (notif_id) => {
  const result = await db.query(
    `UPDATE notifikasi SET status_baca = 'terbaca' WHERE notif_id = $1 RETURNING *`,
    [notif_id]
  );
  return result.rows[0];
};

module.exports = {
  createNotifikasi,
  updateStatusBaca,
};