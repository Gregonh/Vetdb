import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import useSWRMutation from 'swr/mutation';

export type MutationRequest<TRequestBody = undefined> =
  AxiosRequestConfig<TRequestBody> | null;

interface MutationRequestArgs<TRequestBody = undefined, TParam = undefined> {
  //preventing conflicts or misuse when constructing the request.
  request: NonNullable<Omit<MutationRequest<TRequestBody>, 'params' | 'data' | 'method'>>; //these omit properties can be defined now
  methodType: 'delete' | 'DELETE' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH';
  requestBody?: TRequestBody;
  queryParams?: TParam extends Record<string, string | number | boolean | undefined>
    ? TParam
    : undefined;
}

//type ResponseType<TResponseBody> = TResponseBody ; //we prefer the full axios response, not just body response

const mutationFetcher = async <
  TResponseBody,
  TRequestBody = undefined,
  TParam = undefined,
>(
  baseUrl: string,
  { arg }: { arg: MutationRequestArgs<TRequestBody, TParam> },
): Promise<AxiosResponse<TResponseBody>> => {
  const url = new URL(baseUrl);

  try {
    if (arg.queryParams) {
      url.search = new URLSearchParams(
        arg.queryParams as Record<string, string>,
      ).toString();
    }
  } catch (_error) {
    throw new Error('queryParams must be a valid object');
  }

  const config: AxiosRequestConfig<TRequestBody> = {
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

  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.request<TResponseBody>(config);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Hook for mutation operations: post, put, delete.
 * The key (req.url) must be the same as the used with a
 * useRequest instance to automatically revalidate that get local cache
 * after call trigger().
 * If we want manually revalidate use mutate() with the same key of a get request.
 * TResponseBody is the return body data type, TRequestBody the request body type,
 * TParam is the query parameter type.
 * @param req
 * Axios request configuration
 * @returns
 * trigger to call the fetcher and automatically revalidate if the key is the same
 * as one used with useSWR hook.
 */
export function useMutationRequest<
  TResponseBody,
  TRequestBody = undefined,
  TParam = undefined,
>(req: MutationRequest<TRequestBody>) {
  const {
    trigger,
    data: response,
    isMutating,
    error,
  } = useSWRMutation<
    AxiosResponse<TResponseBody>,
    AxiosError | Error,
    string | null,
    MutationRequestArgs<TRequestBody, TParam>
  >(req?.url ?? null, mutationFetcher);

  return {
    trigger,
    response,
    data: response && response.data,
    isMutating,
    error,
  };
}
