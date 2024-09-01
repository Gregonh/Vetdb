import { ErrorRequestHandler } from 'express';

import { logger } from '../utils/Logger';

export const logErrors: ErrorRequestHandler = (error, _req, _res, next) => {
  logger.trace(error);
  logger.error(error);
  next(error);
};
