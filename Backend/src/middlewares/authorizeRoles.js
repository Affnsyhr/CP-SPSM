// middlewares/authorizeRoles.js
const { ForbiddenError } = require('../utils/errors');

/**
 * Middleware untuk membatasi akses berdasarkan role
 * @param  {...number} allowedRoles - Daftar role_id yang diizinkan
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role_id;
    if (!allowedRoles.includes(userRole)) {
      return next(new ForbiddenError('Akses ditolak untuk role ini'));
    }

    next();
  };
};

module.exports = authorizeRoles;
