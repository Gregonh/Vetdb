import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import useSWRMutation from 'swr/mutation';

import { logger } from '@/utils/logger';

export type MutationRequestConfig<RequestBody = undefined> =
  AxiosRequestConfig<RequestBody> | null;

interface FetcherRequestArgs<RequestBody = undefined, QueryParam = undefined> {
  //preventing conflicts or misuse when constructing the request.
  request: NonNullable<
    Omit<MutationRequestConfig<RequestBody>, 'params' | 'data' | 'method'>
  >;
  //these omit properties can be defined now
  methodType: 'delete' | 'DELETE' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH';
  requestBody?: RequestBody;
  queryParams?: QueryParam extends Record<string, string | number | boolean | undefined>
    ? QueryParam
    : undefined;
}
//fist arg is passed automatically as hook´s key, the second is our FetcherRequestArgs obj
//when we call the trigger() we pass manually only the second argument
const mutationFetcher = async <
  SuccessBody,
  RequestBody = undefined,
  QueryParam = undefined,
>(
  baseUrl: string,
  { arg }: { arg: FetcherRequestArgs<RequestBody, QueryParam> },
): Promise<AxiosResponse<SuccessBody>> => {
  const url = new URL(baseUrl);

  try {
    if (arg.queryParams) {
      url.search = new URLSearchParams(
        arg.queryParams as Record<string, string>,
      ).toString();
    }
  } catch (error) {
    logger.error(error);
    throw new Error('queryParams must be a valid object');
  }

  const config: AxiosRequestConfig<RequestBody> = {
    //Default config
    timeout: 40000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    //update config
    ...arg.request,
    url: url.toString(),
    method: arg.methodType,
  };

  if (arg.requestBody) {
    config.data = arg.requestBody;
  }

  // Axios will automatically throw errors, and SWR will catch them
  const response = await axios.request<SuccessBody>(config);
  return response;
};

/**
 * Hook for mutation operations: post, put, delete.
 * The key (req.url) must be the same as the used with a
 * useRequest instance to automatically revalidate that get local cache
 * after call trigger().
 * If we want manually revalidate use mutate() with the same key of a get request.
 * SuccessBody is the return body data type, we generally use SuccessBody<zodSchemaTypeForInnerBody>.
 * RequestBody the request body type, we generally use a zodSchemaTypeForRequest.
 * QueryParam is the query parameter type.
 * @param requestConfig
 * Axios request configuration
 * @returns
 * trigger to call the fetcher and automatically revalidate if the key is the same
 * as one used with useSWR hook.
 */
export function useMutationRequest<
  SuccessBody,
  RequestBody = undefined,
  QueryParam = undefined,
>(requestConfig: MutationRequestConfig<RequestBody>) {
  const {
    //useSWRMutation doesn't trigger the request automatically like useSWR. manually call the trigger()
    trigger,
    data: response,
    isMutating,
    error,
  } = useSWRMutation<
    AxiosResponse<SuccessBody>,
    AxiosError | Error,
    string | null,
    FetcherRequestArgs<RequestBody, QueryParam>
  >(requestConfig?.url ?? null, mutationFetcher);

  return {
    trigger,
    response, //Entire axios response
    data: response && response.data, //body response
    isMutating,
    error,
  };
}

/**
 *If the request succeeds, Axios returns an AxiosResponse.
  If the request fails (e.g., network issue, timeout, or a 
  response with a 4xx or 5xx status), Axios throws an AxiosError, 
  which may or may not contain a response.

  Handle these errors in multiple ways, either inside your fetcher 
  or in the place where you call trigger(). I will handle it in the 
  place where i call trigger:
  Pros: By handling the error in trigger, you can do more specific error handling.
  Cons: If you always catch the error there, you might prevent the error variable 
  in the hook from being populated automatically.
  If you don’t wrap the trigger() with try/catch, the error will be captured 
  by SWR itself, and you’ll have access to the error variable from the mutation hook.
  ensure that your central error handler distinguishes between errors you want to 
  handle globally and errors you want to show in the UI.
  If your goal is to manage errors in the UI using the error variable from the hook, 
  you can avoid try/catch and let SWR handle the error.
  Only use try/catch when you want to do something specific with the error (e.g., logging)
 */
