const HeadmasterService = require('./headmaster.service');

// Dashboard summary untuk kepala sekolah
const getDashboardSummary = async (req, res, next) => {
  try {
    const [
      totalSiswa,
      totalPendaftaran,
      pendaftaranPerStatus,
      pendaftaranPerProgram,
      pendaftaranPerTahun
    ] = await Promise.all([
      HeadmasterService.getTotalSiswa(),
      HeadmasterService.getTotalPendaftaran(),
      HeadmasterService.getPendaftaranPerStatus(),
      HeadmasterService.getPendaftaranPerProgram(),
      HeadmasterService.getPendaftaranPerTahun()
    ]);

    res.json({
      status: 'success',
      data: {
        totalSiswa,
        totalPendaftaran,
        pendaftaranPerStatus,
        pendaftaranPerProgram,
        pendaftaranPerTahun
      }
    });
  } catch (err) {
    next(err);
  }
};

// Data siswa untuk kepala sekolah
const getAllSiswa = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', program = '', status = '' } = req.query;
    const data = await HeadmasterService.getAllSiswaWithFilters(page, limit, search, program, status);
    
    res.json({
      status: 'success',
      data: data.siswa,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(data.total / limit),
        totalItems: data.total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Data pendaftaran untuk kepala sekolah
const getAllPendaftaran = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', program = '', status = '', tahun = '' } = req.query;
    const data = await HeadmasterService.getAllPendaftaranWithFilters(page, limit, search, program, status, tahun);
    
    res.json({
      status: 'success',
      data: data.pendaftaran,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(data.total / limit),
        totalItems: data.total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Statistik untuk chart
const getChartStatistics = async (req, res, next) => {
  try {
    const { tahun = new Date().getFullYear() } = req.query;
    const [
      statusChart,
      programChart,
      yearlyChart,
      monthlyChart
    ] = await Promise.all([
      HeadmasterService.getStatusChartData(tahun),
      HeadmasterService.getProgramChartData(tahun),
      HeadmasterService.getYearlyChartData(),
      HeadmasterService.getMonthlyChartData(tahun)
    ]);

    res.json({
      status: 'success',
      data: {
        statusChart,
        programChart,
        yearlyChart,
        monthlyChart
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update status pendaftaran
const updateStatusPendaftaran = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status_pendaftaran, catatan } = req.body;
    
    const data = await HeadmasterService.updateStatusPendaftaran(id, status_pendaftaran, catatan);
    
    res.json({
      status: 'success',
      message: 'Status pendaftaran berhasil diperbarui',
      data
    });
  } catch (err) {
    next(err);
  }
};

// Export data siswa
const exportSiswa = async (req, res, next) => {
  try {
    const { format = 'excel' } = req.query;
    const data = await HeadmasterService.exportSiswaData(format);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=siswa-data.xlsx');
    res.send(data);
  } catch (err) {
    next(err);
  }
};

// Export data pendaftaran
const exportPendaftaran = async (req, res, next) => {
  try {
    const { format = 'excel' } = req.query;
    const data = await HeadmasterService.exportPendaftaranData(format);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=pendaftaran-data.xlsx');
    res.send(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardSummary,
  getAllSiswa,
  getAllPendaftaran,
  getChartStatistics,
  updateStatusPendaftaran,
  exportSiswa,
  exportPendaftaran
}; 