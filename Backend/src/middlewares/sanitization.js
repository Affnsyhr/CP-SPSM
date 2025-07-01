const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>'"]/g, '');
  };
  
  const sanitizeMiddleware = (req, res, next) => {
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeInput(req.body[key]);
        }
      });
    }
    next();
  };
  
  module.exports = { sanitizeMiddleware };