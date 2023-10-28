const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

class Logger {
  constructor (logPath, serviceName) {
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    );

    this.logger = winston.createLogger({
      level: 'info',
      format: logFormat,
      defaultMeta: { service: serviceName },
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          dirname: logPath,
          filename: `${serviceName}-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d'
        })
      ]
    });
  }

  info (message, ...meta) {
    this.logger.info(message, meta);
  }

  error (message, ...meta) {
    this.logger.error(message, meta);
  }

  warn (message, ...meta) {
    this.logger.warn(message, meta);
  }

  debug (message, ...meta) {
    this.logger.debug(message, meta);
  }
}

module.exports = Logger;
