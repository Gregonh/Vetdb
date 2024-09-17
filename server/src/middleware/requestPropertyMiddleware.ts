import { NextFunction, Request, Response } from 'express';

/*
All the middleware to return a request property.
Typescript don´t let you do just request.property = value,
so we have to extend the express request.
Add the desired property in the @types/express/index.d.ts 
first, and then create the corresponding middleware.
*/
//
export function idPropertyMiddleware(req: Request, _res: Response, next: NextFunction) {
  //TODO: determinate where deal with undefined
  // eslint-disable-next-line no-param-reassign
  req.userId = req.params['id'];
  next();
}
