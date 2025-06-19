const MonitoringService = require('./monitoring.service');

const monitoringSummary = async (req, res, next) => {
  try {
    const [
      pendaftaran,
      siswa,
      dokumen,
      program,
      tahunAjaran
    ] = await Promise.all([
      MonitoringService.statistikPendaftaran(),
      MonitoringService.statistikSiswa(),
      MonitoringService.statistikDokumen(),
      MonitoringService.statistikProgram(),
      MonitoringService.statistikTahunAjaran()
    ]);
    res.json({
      status: 'success',
      data: {
        pendaftaran,
        siswa,
        dokumen,
        program,
        tahunAjaran
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  ...module.exports,
  monitoringSummary
};