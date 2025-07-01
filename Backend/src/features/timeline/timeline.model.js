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
    `INSERT INTO timeline_pendaftaran (id_tahunajaran, nama_kegiatan, tanggal_mulai, tanggal_selesai, deskripsi)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [id_tahunajaran, nama_kegiatan, tanggal_mulai, tanggal_selesai, deskripsi]
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
    `UPDATE timeline_pendaftaran SET id_tahunajaran = $1, nama_kegiatan = $2, tanggal_mulai = $3, tanggal_selesai = $4, deskripsi = $5 WHERE timeline_id = $6 RETURNING *`,
    [id_tahunajaran, nama_kegiatan, tanggal_mulai, tanggal_selesai, deskripsi, timeline_id]
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