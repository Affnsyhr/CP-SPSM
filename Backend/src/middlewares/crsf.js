const csrf = require('csurf');

// CSRF protection configuration
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// CSRF error handler
const csrfErrorHandler = (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      status: 'error',
      message: 'CSRF token validation failed'
    });
  }
  next(err);
};

// CSRF token provider
const csrfTokenProvider = (req, res, next) => {
  if (req.csrfToken) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
  }
  next();
};

module.exports = {
  csrfProtection,
  csrfErrorHandler,
  csrfTokenProvider
};