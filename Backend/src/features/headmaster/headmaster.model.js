const db = require('../../config/db');

// Dashboard summary
const getTotalSiswa = async () => {
  const result = await db.query('SELECT COUNT(*) as total FROM siswa');
  return result.rows[0];
};

const getTotalPendaftaran = async () => {
  const result = await db.query('SELECT COUNT(*) as total FROM data_pendaftaran');
  return result.rows[0];
};

const getPendaftaranPerStatus = async () => {
  const result = await db.query(`
    SELECT status_pendaftaran, COUNT(*) as total
    FROM data_pendaftaran
    GROUP BY status_pendaftaran
    ORDER BY total DESC
  `);
  return result.rows;
};

const getPendaftaranPerProgram = async () => {
  const result = await db.query(`
    SELECT ps.nama_program, COUNT(*) as total
    FROM data_pendaftaran dp
    JOIN program_sekolah ps ON dp.program_id = ps.program_id
    GROUP BY ps.nama_program
    ORDER BY total DESC
  `);
  return result.rows;
};

const getPendaftaranPerTahun = async () => {
  const result = await db.query(`
    SELECT ta.tahun_ajaran, COUNT(*) as total
    FROM data_pendaftaran dp
    JOIN tahun_ajaran ta ON dp.id_tahunajaran = ta.id_tahunajaran
    GROUP BY ta.tahun_ajaran
    ORDER BY ta.tahun_ajaran DESC
  `);
  return result.rows;
};

// Data siswa dengan filter
const getAllSiswaWithFilters = async (page, limit, search, program, status) => {
  let whereConditions = [];
  let params = [];
  let paramIndex = 1;

  if (search) {
    whereConditions.push(`(s.nama_lengkap ILIKE $${paramIndex} OR ot.nama_lengkap ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  const countQuery = `
    SELECT COUNT(DISTINCT s.siswa_id) as total
    FROM siswa s
    LEFT JOIN orang_tua ot ON s.orang_tua_id = ot.user_id
    ${whereClause}
  `;
  
  const countResult = await db.query(countQuery, params);
  const total = parseInt(countResult.rows[0].total);

  const offset = (page - 1) * limit;
  const dataQuery = `
    SELECT DISTINCT
      s.siswa_id,
      s.nama_lengkap as nama_siswa,
      s.tempat_lahir,
      s.tanggal_lahir,
      s.jenis_kelamin,
      s.created_at,
      ot.nama_lengkap as nama_orangtua,
      ot.no_hp as no_hp_orangtua,
      u.email as email_orangtua
    FROM siswa s
    LEFT JOIN orang_tua ot ON s.orang_tua_id = ot.user_id
    LEFT JOIN users u ON ot.user_id = u.user_id
    ${whereClause}
    ORDER BY s.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  
  params.push(limit, offset);
  const dataResult = await db.query(dataQuery, params);

  return {
    siswa: dataResult.rows,
    total
  };
};

// Data pendaftaran dengan filter
const getAllPendaftaranWithFilters = async (page, limit, search, program, status, tahun) => {
  let whereConditions = [];
  let params = [];
  let paramIndex = 1;

  if (search) {
    whereConditions.push(`(s.nama_lengkap ILIKE $${paramIndex} OR ot.nama_lengkap ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  const countQuery = `
    SELECT COUNT(*) as total
    FROM data_pendaftaran dp
    JOIN siswa s ON dp.siswa_id = s.siswa_id
    JOIN orang_tua ot ON dp.orang_tua_id = ot.user_id
    ${whereClause}
  `;
  
  const countResult = await db.query(countQuery, params);
  const total = parseInt(countResult.rows[0].total);

  const offset = (page - 1) * limit;
  const dataQuery = `
    SELECT
      dp.pendaftaran_id,
      dp.tanggal_daftar,
      dp.status_pendaftaran,
      dp.catatan,
      s.nama_lengkap as nama_siswa,
      ot.nama_lengkap as nama_orangtua,
      ot.no_hp as no_hp_orangtua,
      u.email as email_orangtua,
      ps.nama_program,
      ta.tahun_ajaran
    FROM data_pendaftaran dp
    JOIN siswa s ON dp.siswa_id = s.siswa_id
    JOIN orang_tua ot ON dp.orang_tua_id = ot.user_id
    JOIN users u ON ot.user_id = u.user_id
    JOIN program_sekolah ps ON dp.program_id = ps.program_id
    JOIN tahun_ajaran ta ON dp.id_tahunajaran = ta.id_tahunajaran
    ${whereClause}
    ORDER BY dp.tanggal_daftar DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  
  params.push(limit, offset);
  const dataResult = await db.query(dataQuery, params);

  return {
    pendaftaran: dataResult.rows,
    total
  };
};

// Chart statistics
const getStatusChartData = async (tahun) => {
  const result = await db.query(`
    SELECT 
      dp.status_pendaftaran,
      COUNT(*) as total
    FROM data_pendaftaran dp
    WHERE EXTRACT(YEAR FROM dp.tanggal_daftar) = $1
    GROUP BY dp.status_pendaftaran
    ORDER BY total DESC
  `, [tahun]);
  return result.rows;
};

const getProgramChartData = async (tahun) => {
  const result = await db.query(`
    SELECT 
      ps.nama_program,
      COUNT(*) as total
    FROM data_pendaftaran dp
    JOIN program_sekolah ps ON dp.program_id = ps.program_id
    WHERE EXTRACT(YEAR FROM dp.tanggal_daftar) = $1
    GROUP BY ps.nama_program
    ORDER BY total DESC
  `, [tahun]);
  return result.rows;
};

const getYearlyChartData = async () => {
  const result = await db.query(`
    SELECT 
      EXTRACT(YEAR FROM dp.tanggal_daftar) as tahun,
      COUNT(*) as total
    FROM data_pendaftaran dp
    GROUP BY EXTRACT(YEAR FROM dp.tanggal_daftar)
    ORDER BY tahun DESC
  `);
  return result.rows;
};

const getMonthlyChartData = async (tahun) => {
  const result = await db.query(`
    SELECT 
      EXTRACT(MONTH FROM dp.tanggal_daftar) as bulan,
      COUNT(*) as total
    FROM data_pendaftaran dp
    WHERE EXTRACT(YEAR FROM dp.tanggal_daftar) = $1
    GROUP BY EXTRACT(MONTH FROM dp.tanggal_daftar)
    ORDER BY bulan
  `, [tahun]);
  return result.rows;
};

// Update status pendaftaran
const updateStatusPendaftaran = async (id, status_pendaftaran, catatan) => {
  const result = await db.query(`
    UPDATE data_pendaftaran 
    SET status_pendaftaran = $1, catatan = $2 
    WHERE pendaftaran_id = $3 
    RETURNING *
  `, [status_pendaftaran, catatan, id]);
  return result.rows[0];
};

// Export data (placeholder)
const exportSiswaData = async (format) => {
  const result = await db.query(`
    SELECT 
      s.nama_lengkap as nama_siswa,
      s.tempat_lahir,
      s.tanggal_lahir,
      s.jenis_kelamin,
      ot.nama_lengkap as nama_orangtua,
      ot.no_hp as no_hp_orangtua,
      u.email as email_orangtua
    FROM siswa s
    LEFT JOIN orang_tua ot ON s.orang_tua_id = ot.user_id
    LEFT JOIN users u ON ot.user_id = u.user_id
    ORDER BY s.created_at DESC
  `);
  return JSON.stringify(result.rows);
};

const exportPendaftaranData = async (format) => {
  const result = await db.query(`
    SELECT 
      s.nama_lengkap as nama_siswa,
      dp.tanggal_daftar,
      dp.status_pendaftaran,
      ot.nama_lengkap as nama_orangtua,
      ps.nama_program,
      ta.tahun_ajaran
    FROM data_pendaftaran dp
    JOIN siswa s ON dp.siswa_id = s.siswa_id
    JOIN orang_tua ot ON dp.orang_tua_id = ot.user_id
    JOIN program_sekolah ps ON dp.program_id = ps.program_id
    JOIN tahun_ajaran ta ON dp.id_tahunajaran = ta.id_tahunajaran
    ORDER BY dp.tanggal_daftar DESC
  `);
  return JSON.stringify(result.rows);
};

module.exports = {
  getTotalSiswa,
  getTotalPendaftaran,
  getPendaftaranPerStatus,
  getPendaftaranPerProgram,
  getPendaftaranPerTahun,
  getAllSiswaWithFilters,
  getAllPendaftaranWithFilters,
  getStatusChartData,
  getProgramChartData,
  getYearlyChartData,
  getMonthlyChartData,
  updateStatusPendaftaran,
  exportSiswaData,
  exportPendaftaranData
}; 