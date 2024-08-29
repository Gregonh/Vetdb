import { Request, Response, NextFunction } from 'express';

import { RouteNotFound } from '../utils/errorClasses';

/**
 * a middleware to send an error when no other routes
 * middleware matches the request path. Must be the last
 * app.use middleware and before the errors middlewares.
 * @param req
 * @param _res
 * @param next
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notFoundRouteHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // example: GET 'http://www.example.com/admin/new?a=b'
  const fullPath = req.originalUrl; // '/admin/new?a=b' (full path with query string)
  const error = new RouteNotFound(fullPath, '/api/notFoundHandler');
  next(error);
};
