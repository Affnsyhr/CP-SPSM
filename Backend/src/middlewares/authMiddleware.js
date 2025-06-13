// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');

/**
 * Middleware untuk memverifikasi JWT dan menyisipkan user ke req.user
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token tidak ditemukan');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // => { user_id, role_id }
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Token tidak valid');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
