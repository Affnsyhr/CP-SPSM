const logger = require('../utils/logger');

const corsLogger = (req, res, next) => {
  const { method, path, headers } = req;
  
  // Log CORS preflight requests
  if (method === 'OPTIONS') {
    logger.info('CORS Preflight Request', {
      path,
      origin: headers.origin,
      method: headers['access-control-request-method'],
      headers: headers['access-control-request-headers']
    });
  }
  
  // Log CORS violations (if any)
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    if (res.statusCode === 403 && chunk) {
      try {
        const response = JSON.parse(chunk.toString());
        if (response.message && response.message.includes('CORS')) {
          logger.warn('CORS Request Blocked', {
            path,
            origin: headers.origin,
            userAgent: headers['user-agent'],
            ip: req.ip
          });
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

module.exports = corsLogger; 