/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// For request body
export function validateBody(schema: z.ZodObject<any, any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); // Always expect body data
      next();
    } catch (error) {
      return next(error);
    }
  };
}

// For query parameters
export function validateQuery(schema: z.ZodObject<any, any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query); 
      next();
    } catch (error) {
      return next(error);
    }
  };
}

// For URL params
export function validateParams(schema: z.ZodObject<any, any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params); 
      next();
    } catch (error) {
      return next(error);
    }
  };
}
