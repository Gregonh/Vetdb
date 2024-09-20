import { NextFunction, Request } from 'express';
import { QueryResult, QueryResultRow } from 'pg';
import z from 'zod';

import { NotFoundError } from '@/utils/CustomErrorClasses';

/**
 * The default check with the results after the success of a database operation.
 * The generic type needs to extend QueryResultRow to be used with QueryResult.
 * @param results Database query result, T is the data of one row index element
 * @param request
 * @param next return errors
 * @returns
 */
export const checkQueryResultError = <T extends QueryResultRow>(
  results: QueryResult<T> | null | undefined,
  request: Request,
  next: NextFunction,
  entityName: string,
) => {
  if (!results || results.rows.length === 0 || !results.rows[0]) {
    return next(new NotFoundError(request.url, entityName));
  }

  if (results.rows.length > 1) {
    return next(new Error('Critical error, Duplicate conflict'));
  }
};

//We checked if result is empty or undefined and his length before this method
export const zodValidationResult = <T extends QueryResultRow>(
  next: NextFunction,
  results: QueryResult<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodObject<any, any>,
) => {
  try {
    schema.parse(results.rows[0]);
    //multiple row results
    if (results.rows.length > 1) {
      results.rows.forEach((item: T) => {
        schema.parse(item);
      });
    }
  } catch (error) {
    return next(error);
  }
};
