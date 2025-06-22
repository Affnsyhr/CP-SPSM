const AktivitasLogModel = require('./aktivitasLog.model');

const logAktivitas = async ({ user_id, aktivitas, ip_address }) => {
  return await AktivitasLogModel.createLog({ user_id, aktivitas, ip_address });
};

module.exports = { logAktivitas };