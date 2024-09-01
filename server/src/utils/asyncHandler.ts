import { Request, Response, NextFunction } from 'express';
/**
 * To avoid the error: Promise returned in function argument where
 * a void return was expected.
 * To use with async functions that are used as handlers.
 * The problem with these functions is that return Promise<void> and
 * not void, for that we have this wrapper, to return a void function.
 * @param callback async function
 * @returns void
 */
export const asyncWrapper = (
  //describing the type of the function, rather than the type of the value returned from the function
  callback: (
    req: Request,
    res: Response,
    next: NextFunction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<void | Response<any, Record<string, any>>>,
) => {
  return function (request: Request, response: Response, next: NextFunction) {
    callback(request, response, next).catch(next);
  };
};
