import { ErrorResponse } from './responses';

/**
 * It mimics the structure of the error response and will be
 * the base of the other custom errors.
 * We have to pass arg instance (using req.url) when we use subclasses
 * to have this information in the log. But when we return the response
 * we use req.url to avoid manual error.
 */
export abstract class BaseError extends Error implements ErrorResponse {
  constructor(
    message: string,
    public status: number,
    public type: string,
    public title: string,
    public detail: string,
    public instance?: string,
  ) {
    super(message);
    // Enforce the status code range between 400 and 599
    if (status < 400 || status >= 600) {
      throw new Error(`Invalid status code: ${status}. It must be between 400 and 599.`);
    }
  }
}

//a generic custom error class, avoid to use it unless there is no other options
export class CustomError extends BaseError {
  constructor(
    message: string,
    status?: number,
    instance?: string,
    type?: string,
    title?: string,
    detail?: string,
  ) {
    super(
      message,
      status || 500,
      type || '/errors/internal-server-error',
      title || 'Internal Server Error',
      detail ||
        'A custom default error occurred. The server could not be more specific on what the exact problem is',
      instance || '/api/customErrorHandler',
    );
  }
}

//CLIENT ERRORS

/**
 * For invalid user input or malformed requests.
 * Missing parameter.
 * Upload a file too large.
 *  malformed request syntax, invalid request message framing, or deceptive request routing.
 * Request body could not be read properly (like an invalid json body).
 */
export class BadRequestError extends BaseError {
  constructor(instance: string) {
    super(
      `Invalid user input or malformed requests`,
      400,
      '/errors/bad-request-error',
      'BadRequestError',
      'For invalid user input or malformed requests',
      instance,
    );
  }
}
/**
 * more specific than the last
 */
export class ValidationError extends BaseError {
  constructor(instance: string, field = 'Field') {
    super(
      `${field} validation failed`,
      400,
      '/errors/validation-error',
      'Field is invalid',
      `The provided ${field} is invalid.`,
      instance,
    );
  }
}

/**
 * common causes why that might happen: Error or typo in
 * the website's URL. Outdated cookies or browser cache
 */
export class UnauthorizedError extends BaseError {
  constructor(instance: string) {
    super(
      `Authentication failure`,
      401,
      '/errors/unauthorized-error',
      'UnauthorizedError',
      'A trouble authenticating the visitor login credentials with the server',
      instance,
    );
  }
}

export class ForbiddenError extends BaseError {
  constructor(instance: string) {
    super(
      `Authorization failure`,
      403,
      '/errors/forbidden-error',
      'ForbiddenError',
      'The server understood the request but refuses to authorize it, lack the necessary permissions',
      instance,
    );
  }
}

/**
 * only indicates that the resource is missing without
 * indicating if this is temporary or permanent.
 * like dead links.
 *
 */
export class NotFoundError extends BaseError {
  constructor(instance: string, resource = 'Resource') {
    super(
      `${resource} not found`,
      404,
      '/errors/not-found',
      'NotFoundError',
      `The requested ${resource} could not be found on the server`,
      instance,
    );
  }
}
/**
 * more specific than the last
 */
export class RouteNotFound extends BaseError {
  constructor(instance: string, routePath = 'Route path') {
    super(
      `${routePath} not found`,
      404,
      '/errors/route-not-found',
      'Route path not found',
      `The requested ${routePath} could not be found.`,
      instance,
    );
  }
}

/**
 * Conflict with the current state of the target resource.
 * Errors with third party like postgres.
 * In a version control conflict.
 */
export class ConflictError extends BaseError {
  constructor(instance: string) {
    super(
      `Conflict`,
      409,
      '/errors/conflict',
      'Conflict',
      `The request conflict with the current state of the target resource`,
      instance,
    );
  }
}
