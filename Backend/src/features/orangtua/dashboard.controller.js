const DashboardService = require('./dashboard.service');

const dashboardSummary = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const [
      siswa,
      pendaftaran,
      dokumen,
      notifikasi
    ] = await Promise.all([
      DashboardService.getSiswa(user_id),
      DashboardService.getPendaftaran(user_id),
      DashboardService.getDokumen(user_id),
      DashboardService.getNotifikasi(user_id)
    ]);
    res.json({
      status: 'success',
      data: {
        siswa,
        pendaftaran,
        dokumen,
        notifikasi
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  dashboardSummary
};