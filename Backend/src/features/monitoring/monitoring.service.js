const MonitoringModel = require('./monitoring.model');

const getPendaftarPerTahunAjaran = async () => {
  return await MonitoringModel.getPendaftarPerTahunAjaran();
};

const getPendaftarPerProgramStatus = async () => {
  return await MonitoringModel.getPendaftarPerProgramStatus();
};

const getTotalSiswa = async () => {
  return await MonitoringModel.getTotalSiswa();
};

module.exports = {
  getPendaftarPerTahunAjaran,
  getPendaftarPerProgramStatus,
  getTotalSiswa,
};