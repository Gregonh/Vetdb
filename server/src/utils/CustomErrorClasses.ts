import { DefaultErrorBody } from '@shared/interfaces/IResponses';

/**
 * It mimics the structure of the error response and will be
 * the base of the other subclasses custom errors.
 * We have to pass arg instance (using req.url) when we use subclasses
 * to have this information in the log. But when we return the response,
 * we use req.url to avoid manual error.
 * All of these subclasses will be handle by our custom error middleware,
 * to return an appropriate error response.
 */
export abstract class BaseError extends Error implements DefaultErrorBody {
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
      'Invalid user input or malformed requests',
      instance,
    );
  }
}
/**
 * more specific than the last
 */
export class ValidationError extends BaseError {
  constructor(field = 'Field', instance: string) {
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
 * Indicates that the resource is missing without
 * indicating if this is temporary or permanent.
 * GET: You request a resource, but the resource doesn't exist.
 * DELETE, PUT: You try to delete/update a resource that doesn't exist.
 * result.rows.length === 0 or result.rows[0] === undefined),
 * it's also appropriate to return 404 Not Found.
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

export enum OperationCanConflict {
  INSERT,
  UPDATE,
  DELETE,
}
/**
 * POST: You try to create a new resource, but the resource already exists, causing a conflict
 * DELETE: You attempt to delete a resource,but there's a conflict (e.g.,
 * the resource is referenced by other data).
 * PUT/PATCH: You try to update a resource but the update violates a unique constraint
 * (e.g., changing a user's email to one that another user already has).
 * The result of the database operation was not the desired,
 * like an empty result: result.rows.length === 0
 * These operations can be: insert, update and delete.
 */
export class ConflictOperation extends BaseError {
  constructor(instance: string, operation: OperationCanConflict) {
    super(
      `Conflict ${operation}`,
      409,
      '/errors/conflict-operation',
      'Conflict operation in database',
      `The request ${operation} operation in the database give not the desired result`,
      instance,
    );
  }
}
