const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const { method, path, ip, headers } = req;
  
  // Log incoming request
  logger.api(method, path, {
    type: 'request',
    ip,
    userAgent: headers['user-agent'],
    userId: req.user?.user_id || 'anonymous'
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    const { statusCode } = res;
    
    // Log response
    logger.api(method, path, {
      type: 'response',
      statusCode,
      duration,
      ip,
      userAgent: headers['user-agent'],
      userId: req.user?.user_id || 'anonymous'
    });

    // Call original end
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = requestLogger; 