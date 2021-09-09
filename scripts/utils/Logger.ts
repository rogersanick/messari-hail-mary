import winston, { format } from 'winston';
import path from 'path';

const logPath = path.resolve('logs/combined.log');
const errorLogPath = path.resolve('logs/error.log');
export const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.label({ label: '[MESSARI-HAIL-MARY]' }),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    //
    // The simple format outputs
    // `${level}: ${message} ${[Object with everything else]}`
    //
    format.simple(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: logPath }),
    new winston.transports.File({ filename: errorLogPath, level: 'error' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}
