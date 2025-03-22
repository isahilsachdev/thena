const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logDir = process.env.VERCEL ? '/tmp' : 'logs'; // Use /tmp in Vercel

// Ensure log directory exists (only for local environment)
if (!process.env.VERCEL && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'flight-tracker-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // Only log to files if not running in Vercel
    ...(process.env.VERCEL
      ? []
      : [
          new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
          new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
        ])
  ]
});

module.exports = logger;
