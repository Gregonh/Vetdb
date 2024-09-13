import { Response } from 'express';

import { SuccessResponseBody } from './IResponses';

function createSuccessResponseBody<T>(data: T, message?: string): SuccessResponseBody<T> {
  return {
    innerBodyData: data,
    message,
  };
}

//accepted status for a success response
export enum SuccessStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  LIMIT = 299,
}

/**
 * The standard-always way of creating a success response.
 * Always include it inside try catch block.
 * We need to include the type of the ResBody in
 * every response middleware to be used
 * as argument of this function. That is the way to avoid the any in
 * Response<any, Record<string, any>> returned in our middlewares.
 * @param response Response with the type of the body
 * @param responseStatus Only admit some enum status
 * @param dataBody Body´s data:TData
 * @param messageBody Body´s optional message
 * @returns Response<SuccessResponseBody< TData >> | void
 */
export function createSuccessResponse<TData>(
  response: Response<SuccessResponseBody<TData>>,
  responseStatus: SuccessStatus,
  dataBody: TData,
  messageBody?: string,
): Response<SuccessResponseBody<TData>> | void {
  if (responseStatus < SuccessStatus.OK || responseStatus > SuccessStatus.LIMIT) {
    throw new Error('Not valid success response status');
  }
  const resBody = createSuccessResponseBody<TData>(dataBody, messageBody);
  return response.status(responseStatus).json(resBody);
}
