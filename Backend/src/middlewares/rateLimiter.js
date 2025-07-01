const rateLimit = require('express-rate-limit');

// Global rate limiter - lebih longgar untuk development
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Lebih longgar di development
  message: {
    status: 'error',
    message: 'Too many requests from this IP'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting untuk development atau health check
    return process.env.NODE_ENV === 'development' || req.path === '/api/health';
  }
});

// Auth-specific rate limiter - lebih longgar untuk development
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: process.env.NODE_ENV === 'production' ? 5 : 20, // Lebih longgar di development
  message: {
    status: 'error',
    message: 'Too many login attempts, try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: process.env.NODE_ENV === 'production' ? 10 : 50, // Lebih longgar di development
  message: {
    status: 'error',
    message: 'Too many file uploads, try again later'
  }
});

module.exports = {
  globalLimiter,
  authLimiter,
  uploadLimiter
};