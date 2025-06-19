const MonitoringService = require('./monitoring.service');

const statistikPendaftaran = async (req, res, next) => {
  try {
    const data = await MonitoringService.statistikPendaftaran();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

const statistikSiswa = async (req, res, next) => {
  try {
    const data = await MonitoringService.statistikSiswa();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

const statistikDokumen = async (req, res, next) => {
  try {
    const data = await MonitoringService.statistikDokumen();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

const statistikProgram = async (req, res, next) => {
  try {
    const data = await MonitoringService.statistikProgram();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

const statistikTahunAjaran = async (req, res, next) => {
  try {
    const data = await MonitoringService.statistikTahunAjaran();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  statistikPendaftaran,
  statistikSiswa,
  statistikDokumen,
  statistikProgram,
  statistikTahunAjaran,
};