/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ErrorRequestHandler } from 'express';
import { DatabaseError } from 'pg';

import { BaseError, ConflictError } from '../utils/errorClasses';
import { ErrorResponse, SecondaryErrorResponse } from '../utils/responses';

/**
 * Last error defense before default express handler.
 * Controls the response error sent to the client
 * by identifying the error type and structuring the response accordingly.
 * The errors type can be: Third-Party Errors (like postgres), custom error classes,
 * Error and unknown.
 * @param error
 * @param req
 * @param res
 * @param next
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
      const errorResponse: ErrorResponse = conflictError;
      const statusCode = errorResponse.status ?? 409;
      res.status(statusCode).json(errorResponse);
    } else {
      //express default middleware
      next(error);
    }
  } else if (error instanceof BaseError) {
    //custom errors
    const statusCode = error.status ?? 500;
    const errorResponse: ErrorResponse = {
      status: statusCode,
      title: error.title,
      type: error.type,
      detail: error.detail,
      instance: req.url || error.instance ,
      //traceId?
    };
    res.status(statusCode).json(errorResponse);
  } else if (error instanceof Error) {
    //Default error
    const responseError: SecondaryErrorResponse = {
      status: 500,
      title: 'Internal Server Error',
      detail: error.message || 'An Error occurred',
      instance: req.url,
    };
    res.status(500).json(responseError);
  } else {
    //unknown error
    const responseError: SecondaryErrorResponse = {
      status: 500,
      title: 'Internal Server Error',
      detail: 'An unknown error occurred',
      instance: req.url,
    };
    res.status(500).json(responseError);
  }
};
