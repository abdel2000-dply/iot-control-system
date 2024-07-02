import winston from 'winston';

const logger = winston.createLogger({
  level: 'info', // Log only if info or higher( warn, error)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message}) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
});