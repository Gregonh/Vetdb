// Default Error response interface following RFC 9457
export interface ErrorResponse {
  status: number; //The HTTP status code
  type: string; //reference these URIs for documentation about the error, e.g., "https://example.com/probs/out-of-credit"
  title: string; // A short, human-readable summary of the problem. same across all instances, (e.g., "Validation Error")
  detail?: string; // more specific explanation of the error, such as which field
  instance?: string; // URI reference, could be a path to the API request that caused the error (e.g., /users/12345).
  traceId?: string; //unique identifier for the request that caused the problem
}

//for not handling errors that have not status code
export interface SecondaryErrorResponse {
  status: 500;
  title: 'Internal Server Error';
  detail: string;
  instance: string;
}

export interface SuccessResponse<T> {
  data: T;
  message: string;
}

export function createSuccessResponse<T>(data: T, message: string): SuccessResponse<T> {
  return {
    data,
    message,
  };
}
