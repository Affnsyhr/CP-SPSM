const db = require('../../config/db');

// Rekap jumlah pendaftar per tahun ajaran
const getPendaftarPerTahunAjaran = async () => {
  const result = await db.query(`
    SELECT ta.tahun_ajaran, COUNT(*) as total
    FROM data_pendaftaran dp
    JOIN tahun_ajaran ta ON dp.id_tahunajaran = ta.id_tahunajaran
    GROUP BY ta.tahun_ajaran
    ORDER BY ta.tahun_ajaran DESC
  `);
  return result.rows;
};

// Rekap jumlah pendaftar per program dan status
const getPendaftarPerProgramStatus = async () => {
  const result = await db.query(`
    SELECT ps.nama_program, dp.status_pendaftaran, COUNT(*) as total
    FROM data_pendaftaran dp
    JOIN program_sekolah ps ON dp.program_id = ps.program_id
    GROUP BY ps.nama_program, dp.status_pendaftaran
    ORDER BY ps.nama_program, dp.status_pendaftaran
  `);
  return result.rows;
};

// Rekap total siswa
const getTotalSiswa = async () => {
  const result = await db.query('SELECT COUNT(*) as total FROM siswa');
  return result.rows[0];
};

module.exports = {
  getPendaftarPerTahunAjaran,
  getPendaftarPerProgramStatus,
  getTotalSiswa,
}; 