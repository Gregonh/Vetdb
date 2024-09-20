import { SuccessBody } from '@shared/interfaces/IResponses';
import { AxiosResponse } from 'axios';
import { z } from 'zod';

function isArray<T>(arr: T | T[]): arr is Array<T> {
  return Array.isArray(arr);
}

/**
 * This method must be always call inside a try/catch block.
 * Axios automatically throw errors (server/Error response) when we use await trigger(),
 * so we don´t need to check if response is empty. After receive the response
 * we do the validation.
 * @description Validate the response body of an Axios response based on a Zod schema.
 * @param response - The Axios response containing the data to validate.
 * @param schema - The Zod schema to validate the data against.
 * @throws Will throw an error if the data does not match the schema.
 */
export const validationAxiosResponseBody = <T>(
  response: AxiosResponse<SuccessBody<T>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodObject<any, any>,
) => {
  const dataBody = response.data.innerBodyData;
  const isArrayData = isArray(dataBody);
  if (isArrayData) {
    dataBody.forEach((item: T) => {
      schema.parse(item);
    });
  } else {
    schema.parse(dataBody);
  }
};
