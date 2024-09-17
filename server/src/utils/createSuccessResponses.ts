import { SuccessBody } from '@shared/interfaces/IResponses';
import { Response } from 'express';

export function createSuccessResponseBody<T>(
  innerBodyData: T,
  message?: string,
): SuccessBody<T> {
  return {
    innerBodyData,
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
 * @param innerBodyData Body´s data:TData
 * @param messageBody Body´s optional message
 * @returns Response<SuccessResponseBody< TData >> | void
 */
export function createSuccessResponse<TData>(
  response: Response<SuccessBody<TData>>,
  responseStatus: SuccessStatus,
  innerBodyData: TData,
  messageBody?: string,
): Response<SuccessBody<TData>> | void {
  if (responseStatus < SuccessStatus.OK || responseStatus > SuccessStatus.LIMIT) {
    throw new Error('Not valid success response status');
  }
  const resBody: SuccessBody<TData> = {
    innerBodyData,
    message: messageBody,
  };
  return response.status(responseStatus).json(resBody);
}
