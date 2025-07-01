const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = this.getTimestamp();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };
    return JSON.stringify(logEntry) + '\n';
  }

  writeToFile(filename, content) {
    const filePath = path.join(this.logDir, filename);
    fs.appendFileSync(filePath, content);
  }

  log(level, message, meta = {}) {
    const formattedMessage = this.formatMessage(level, message, meta);
    
    // Console output
    console.log(formattedMessage);
    
    // File output
    const filename = `${level}.log`;
    this.writeToFile(filename, formattedMessage);
    
    // Error level also goes to error.log
    if (level === 'error') {
      this.writeToFile('error.log', formattedMessage);
    }
  }

  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, meta);
    }
  }

  // Security specific logging
  security(event, details = {}) {
    this.log('security', event, {
      ...details,
      ip: details.ip || 'unknown',
      userAgent: details.userAgent || 'unknown',
      userId: details.userId || 'anonymous'
    });
  }

  // Database specific logging
  database(operation, details = {}) {
    this.log('database', operation, {
      ...details,
      duration: details.duration || 0,
      query: details.query || 'unknown'
    });
  }

  // API specific logging
  api(method, path, details = {}) {
    this.log('api', `${method} ${path}`, {
      ...details,
      statusCode: details.statusCode || 0,
      duration: details.duration || 0,
      userId: details.userId || 'anonymous'
    });
  }
}

module.exports = new Logger(); 