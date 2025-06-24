const db = require('../../config/db');

const createTimeline = async ({
  periode_id,
  id_tahunajaran,
  nama_kegiatan,
  tanggal_mulai,
  tanggal_selesai,
  deskripsi
}) => {
  const result = await db.query(
    `INSERT INTO timeline_pendaftaran (periode_id, id_tahunajaran, nama_kegiatan, tanggal_mulai, tanggal_selesai, deskripsi)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [periode_id, id_tahunajaran, nama_kegiatan, tanggal_mulai, tanggal_selesai, deskripsi]
  );
  return result.rows[0];
};

const getAllTimeline = async () => {
  const result = await db.query('SELECT * FROM timeline_pendaftaran ORDER BY tanggal_mulai ASC');
  return result.rows;
};

const updateTimeline = async (timeline_id, {
  periode_id,
  id_tahunajaran,
  nama_kegiatan,
  tanggal_mulai,
  tanggal_selesai,
  deskripsi
}) => {
  const result = await db.query(
    `UPDATE timeline_pendaftaran SET periode_id = $1, id_tahunajaran = $2, nama_kegiatan = $3, tanggal_mulai = $4, tanggal_selesai = $5, deskripsi = $6 WHERE timeline_id = $7 RETURNING *`,
    [periode_id, id_tahunajaran, nama_kegiatan, tanggal_mulai, tanggal_selesai, deskripsi, timeline_id]
  );
  return result.rows[0];
};

const deleteTimeline = async (timeline_id) => {
  const result = await db.query('DELETE FROM timeline_pendaftaran WHERE timeline_id = $1 RETURNING *', [timeline_id]);
  return result.rows[0];
};

module.exports = {
  createTimeline,
  getAllTimeline,
  updateTimeline,
  deleteTimeline,
}; 