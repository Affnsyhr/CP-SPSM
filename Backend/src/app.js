const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./routes/index');

// Import middlewares
const securityMiddleware = require('./middlewares/security');
const { globalLimiter } = require('./middlewares/rateLimiter');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();

// CORS configuration - lebih fleksibel untuk development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove undefined values
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply security middlewares
app.use(securityMiddleware);

// Apply rate limiting
app.use('/api', globalLimiter);

// Apply request logging
app.use(requestLogger);

// Apply basic middlewares
app.use(cors(corsOptions));

// Preflight handling for specific complex routes
app.options('/api/auth/login', cors(corsOptions));
app.options('/api/auth/register', cors(corsOptions));
app.options('/api/dokumen', cors(corsOptions));

app.use(morgan('combined', {
  stream: {
    write: (message) => {
      logger.info('HTTP Request', { message: message.trim() });
    }
  }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api', router);

// Enhanced error handling middleware
app.use(errorHandler);

module.exports = app;
