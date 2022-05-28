import { format, transports } from 'winston';
import { logger, errorLogger as winstonErrorLogger } from 'express-winston';

export const requestLogger = logger({
  transports: [new transports.File({ filename: 'request.log' })],
  format: format.json(),
});

export const errorLogger = winstonErrorLogger({
  transports: [new transports.File({ filename: 'error.log' })],
  format: format.json(),
});
