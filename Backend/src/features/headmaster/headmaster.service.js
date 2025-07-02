const HeadmasterModel = require('./headmaster.model');

// Dashboard summary
const getTotalSiswa = async () => {
  return await HeadmasterModel.getTotalSiswa();
};

const getTotalPendaftaran = async () => {
  return await HeadmasterModel.getTotalPendaftaran();
};

const getPendaftaranPerStatus = async () => {
  return await HeadmasterModel.getPendaftaranPerStatus();
};

const getPendaftaranPerProgram = async () => {
  return await HeadmasterModel.getPendaftaranPerProgram();
};

const getPendaftaranPerTahun = async () => {
  return await HeadmasterModel.getPendaftaranPerTahun();
};

// Data siswa dengan filter
const getAllSiswaWithFilters = async (page, limit, search, program, status) => {
  return await HeadmasterModel.getAllSiswaWithFilters(page, limit, search, program, status);
};

// Data pendaftaran dengan filter
const getAllPendaftaranWithFilters = async (page, limit, search, program, status, tahun) => {
  return await HeadmasterModel.getAllPendaftaranWithFilters(page, limit, search, program, status, tahun);
};

// Chart statistics
const getStatusChartData = async (tahun) => {
  return await HeadmasterModel.getStatusChartData(tahun);
};

const getProgramChartData = async (tahun) => {
  return await HeadmasterModel.getProgramChartData(tahun);
};

const getYearlyChartData = async () => {
  return await HeadmasterModel.getYearlyChartData();
};

const getMonthlyChartData = async (tahun) => {
  return await HeadmasterModel.getMonthlyChartData(tahun);
};

// Update status pendaftaran
const updateStatusPendaftaran = async (id, status_pendaftaran, catatan) => {
  return await HeadmasterModel.updateStatusPendaftaran(id, status_pendaftaran, catatan);
};

// Export data
const exportSiswaData = async (format) => {
  return await HeadmasterModel.exportSiswaData(format);
};

const exportPendaftaranData = async (format) => {
  return await HeadmasterModel.exportPendaftaranData(format);
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
