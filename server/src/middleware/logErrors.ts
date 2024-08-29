import { ErrorRequestHandler } from 'express';

import { logger } from '../utils/logger';

export const logErrors: ErrorRequestHandler = (error, _req, _res, next) => {
  logger.trace(error);
  logger.error(error);
  next(error);
};