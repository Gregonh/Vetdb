import { Request, Response, NextFunction } from 'express';

import { RouteNotFound } from '../utils/CustomErrorClasses';

/**
 * a middleware to send an error when no other routes
 * middleware matches the request path. Must be the last
 * app.use middleware and before the errors middlewares.
 * @param req
 * @param _res
 * @param next
 */

export const notFoundRouteHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // example: GET 'http://www.example.com/admin/new?a=b'
  const fullPath = req.originalUrl; // '/admin/new?a=b' (full path with query string)
  const error = new RouteNotFound('/api/notFoundHandler', fullPath);
  next(error);
};
