const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  const { method, path, ip, headers } = req;
  
  // Log error
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method,
    path,
    ip,
    userAgent: headers['user-agent'],
    userId: req.user?.user_id || 'anonymous'
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors
    });
  }

  if (err.name === 'JsonWebTokenError') {
    logger.security('Invalid JWT token', {
      ip,
      userAgent: headers['user-agent'],
      path
    });
    
    return res.status(401).json({
      status: 'error',
      message: 'Token tidak valid'
    });
  }

  if (err.name === 'TokenExpiredError') {
    logger.security('Expired JWT token', {
      ip,
      userAgent: headers['user-agent'],
      path,
      userId: req.user?.user_id
    });
    
    return res.status(401).json({
      status: 'error',
      message: 'Token telah kadaluarsa'
    });
  }

  if (err.code === 'EBADCSRFTOKEN') {
    logger.security('CSRF token validation failed', {
      ip,
      userAgent: headers['user-agent'],
      path
    });
    
    return res.status(403).json({
      status: 'error',
      message: 'CSRF token validation failed'
    });
  }

  if (err.message === 'Not allowed by CORS') {
    logger.security('CORS violation', {
      ip,
      userAgent: headers['user-agent'],
      path,
      origin: headers.origin
    });
    
    return res.status(403).json({
      status: 'error',
      message: 'CORS: Origin not allowed',
      allowedOrigins: ['http://localhost:3000', 'http://localhost:3001']
    });
  }

  // Handle database errors
  if (err.code === '23505') { // Unique constraint violation
    logger.database('Unique constraint violation', {
      error: err.message,
      detail: err.detail,
      table: err.table
    });
    
    return res.status(409).json({
      status: 'error',
      message: 'Data sudah ada dalam sistem'
    });
  }

  if (err.code === '23503') { // Foreign key constraint violation
    logger.database('Foreign key constraint violation', {
      error: err.message,
      detail: err.detail
    });
    
    return res.status(400).json({
      status: 'error',
      message: 'Data referensi tidak ditemukan'
    });
  }

  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Don't leak error details in production
  const errorResponse = {
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler; 