import { Request, Response, NextFunction } from 'express';
import { DatabaseError } from 'pg';
import { ZodError } from 'zod';

import { ValidationError } from '@/utils/CustomErrorClasses';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultErrorHandler = (_req: Request, _res: Response, _next: NextFunction) => {
  //be caught by the nearest error-handling middleware
  throw new Error('This is a test error!');
};

const customErrorHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new ValidationError(undefined, req.url));
};

const pgErrorHandler = (_req: Request, _res: Response, next: NextFunction) => {
  const pgError = new DatabaseError('Simulated database error', 123, 'error');
  pgError.code = '23505'; // Example PostgreSQL error code for unique violation
  next(pgError);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unknownErrorHandler = (_req: Request, _res: Response, _next: NextFunction) => {
  const unk: unknown = {};
  throw unk;
};

const zodErrorHandler = (_req: Request, _res: Response, next: NextFunction) => {
  const zError = new ZodError([
    {
      code: 'invalid_type',
      expected: 'string',
      received: 'number',
      path: ['names', 1],
      message: 'Invalid input: expected string, received number',
    },
  ]);
  next(zError);
};

export const mockError = {
  defaultErrorHandler,
  customErrorHandler,
  pgErrorHandler,
  unknownErrorHandler,
  zodErrorHandler,
};
