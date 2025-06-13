const ROLE_SUPERADMIN = 1;
const ROLE_ORANG_TUA = 2;
const ROLE_ADMIN_TU = 3;
const ROLE_KEPALA_SEKOLAH = 4;

// Untuk validasi di middleware (jika perlu)
const ROLE_NAMES = {
  [ROLE_SUPERADMIN]: 'superadmin',
  [ROLE_ORANG_TUA]: 'orang_tua',
  [ROLE_ADMIN_TU]: 'admin_tu',
  [ROLE_KEPALA_SEKOLAH]: 'kepala_sekolah',
};

const ROLES = {
  SUPERADMIN: ROLE_SUPERADMIN,
  ORANG_TUA: ROLE_ORANG_TUA,
  ADMIN_TU: ROLE_ADMIN_TU,
  KEPALA_SEKOLAH: ROLE_KEPALA_SEKOLAH
};

module.exports = {
  ROLE_SUPERADMIN,
  ROLE_ORANG_TUA,
  ROLE_ADMIN_TU,
  ROLE_KEPALA_SEKOLAH,
  ROLE_NAMES,
  ROLES
};
