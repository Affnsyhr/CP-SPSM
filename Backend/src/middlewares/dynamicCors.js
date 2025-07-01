const cors = require('cors');

// Different CORS configurations for different routes
const corsConfigs = {
  // Public routes - more permissive
  public: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        process.env.FRONTEND_URL
      ].filter(Boolean);
      
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
  },
  
  // Admin routes - more restrictive
  admin: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:3000',
        process.env.FRONTEND_URL
      ].filter(Boolean);
      
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Admin routes not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  },
  
  // File upload routes - specific headers
  upload: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        process.env.FRONTEND_URL
      ].filter(Boolean);
      
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Upload routes not allowed by CORS'));
      }
    },
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  }
};

// Middleware factory for dynamic CORS
const dynamicCors = (configType = 'public') => {
  const config = corsConfigs[configType];
  if (!config) {
    throw new Error(`Unknown CORS config type: ${configType}`);
  }
  
  return cors(config);
};

module.exports = {
  dynamicCors,
  corsConfigs
}; 