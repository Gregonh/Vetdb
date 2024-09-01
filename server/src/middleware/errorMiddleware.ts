import { ErrorRequestHandler } from 'express';
import { DatabaseError } from 'pg';

import { BaseError, ConflictError } from '../utils/CustomErrorClasses';
import { ErrorResponseBody, SecondaryErrorResponseBody } from '../utils/IResponses';

/**
 * Last error defense before default express handler.
 * Controls the response error sent to the client
 * by identifying the error type and structuring the response accordingly.
 * The errors type can be: Third-Party Errors (like postgres), custom error classes,
 * Error and unknown. The response will be of type json, and use a body of type
 * ErrorResponseBody or SecondaryErrorResponseBody.
 * @param error Third-party errors (ex. Postgres), custom classes, Error and unknown
 * @param req
 * @param res Will use a json body of type: ErrorResponseBody or SecondaryErrorResponseBody
 * @param next To delegate to default express error handler
 * @returns
 */
export const customErrorHandler: ErrorRequestHandler = (
  error: unknown,
  req,
  res,
  next,
) => {
  //delegate to the default Express error handler, when the headers have already been sent to the client
  if (res.headersSent) {
    return next(error);
  }
  //postgres pg error: use pg error class to create a ConflictError instance
  if (error instanceof DatabaseError) {
    // Unique constraint violation in Postgres
    if (error.code === '23505' || error.code === '23503') {
      const conflictError = new ConflictError(req.url);
      const errorResponse: ErrorResponseBody = conflictError;
      const statusCode = errorResponse.status ?? 409;
      return res.status(statusCode).json(errorResponse);
    } else {
      //express default middleware
      return next(error);
    }
  } else if (error instanceof BaseError) {
    //custom errors
    const statusCode = error.status ?? 500;
    const errorResponse: ErrorResponseBody = {
      status: statusCode,
      title: error.title,
      type: error.type,
      detail: error.detail,
      instance: req.url || error.instance,
      //traceId?
    };
    return res.status(statusCode).json(errorResponse);
  } else if (error instanceof Error) {
    //Default error
    const responseError: SecondaryErrorResponseBody = {
      status: 500,
      title: 'Internal Server Error',
      detail: error.message || 'An Error occurred',
      instance: req.url,
    };
    return res.status(500).json(responseError);
  } else {
    //unknown error
    const responseError: SecondaryErrorResponseBody = {
      status: 500,
      title: 'Internal Server Error',
      detail: 'An unknown error occurred',
      instance: req.url,
    };
    return res.status(500).json(responseError);
  }
};
