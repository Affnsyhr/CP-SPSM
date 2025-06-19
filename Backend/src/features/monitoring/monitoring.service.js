const db = require('../../config/db');

// Statistik jumlah pendaftaran per status
const statistikPendaftaran = async () => {
  const result = await db.query(`
    SELECT status_pendaftaran, COUNT(*) AS jumlah
    FROM pendaftaran
    GROUP BY status_pendaftaran
    ORDER BY status_pendaftaran
  `);
  return result.rows;
};

// Statistik jumlah siswa baru per tahun ajaran
const statistikSiswa = async () => {
  const result = await db.query(`
    SELECT t.tahun_mulai, t.tahun_selesai, COUNT(s.siswa_id) AS jumlah_siswa
    FROM siswa s
    JOIN pendaftaran p ON s.siswa_id = p.siswa_id
    JOIN tahun_ajaran t ON p.tahun_ajaran_id = t.tahun_ajaran_id
    GROUP BY t.tahun_mulai, t.tahun_selesai
    ORDER BY t.tahun_mulai DESC
  `);
  return result.rows;
};

// Statistik dokumen masuk
const statistikDokumen = async () => {
  const result = await db.query(`
    SELECT jenis_dokumen, COUNT(*) AS jumlah
    FROM dokumen
    GROUP BY jenis_dokumen
    ORDER BY jenis_dokumen
  `);
  return result.rows;
};

// Statistik program aktif
const statistikProgram = async () => {
  const result = await db.query(`
    SELECT nama_program, kuota, biaya, status, created_at
    FROM program
    WHERE status = true
    ORDER BY created_at DESC
  `);
  return result.rows;
};

// Statistik tahun ajaran aktif
const statistikTahunAjaran = async () => {
  const result = await db.query(`
    SELECT tahun_mulai, tahun_selesai, status, created_at
    FROM tahun_ajaran
    WHERE status = true
    ORDER BY tahun_mulai DESC
  `);
  return result.rows;
};

module.exports = {
  statistikPendaftaran,
  statistikSiswa,
  statistikDokumen,
  statistikProgram,
  statistikTahunAjaran,
};