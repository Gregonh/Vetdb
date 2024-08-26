import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import useSWRMutation from 'swr/mutation';

import { type GetRequest } from './useRequest';

interface MutationRequestArgs<TBody = undefined, TParam = undefined> {
  //preventing conflicts or misuse when constructing the request.
  request: NonNullable<Omit<GetRequest<TBody>, 'params' | 'data' | 'method'>>;
  methodType: 'delete' | 'DELETE' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH';
  requestBody?: TBody;
  queryParams?: TParam extends Record<string, string | number | boolean | undefined>
    ? TParam
    : undefined;
}

type ResponseType<TData> = TData | { error: unknown; message: string };

const mutationFetcher = async <TData, TBody = undefined, TParam = undefined>(
  baseUrl: string,
  { arg }: { arg: MutationRequestArgs<TBody, TParam> },
): Promise<ResponseType<TData>> => {
  const url = new URL(baseUrl);

  // eslint-disable-next-line no-useless-catch
  try {
    if (arg.queryParams) {
      url.search = new URLSearchParams(
        arg.queryParams as Record<string, string>,
      ).toString();
    }
  } catch (error) {
    throw new Error('queryParams must be a valid object');
  }

  const config: AxiosRequestConfig<TBody> = {
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

  try {
    const response = await axios.request<TData>(config);
    return response.data;
  } catch (error) {
    return { error, message: 'Reject axios request' };
  }
};

/**
 * Hook for mutation operations: post, put, delete.
 * The key (req.url) must be the same as the used with a
 * useRequest instance to automatically revalidate that get local cache
 * after call trigger().
 * If we want manually revalidate use mutate() with the same key of a get request.
 * TData is the return data type, TBody the request body type, TParam is the query parameter type.
 * @param req
 * Axios request configuration
 * @returns
 * trigger to call the fetcher and automatically revalidate if the key is the same
 * as one used with useSWR hook.
 */
export function useMutationRequest<TData, TBody = undefined, TParam = undefined>(
  req: GetRequest<TBody>,
) {
  const { trigger, data, isMutating, error } = useSWRMutation<
    ResponseType<TData>,
    AxiosError | Error,
    string | null,
    MutationRequestArgs<TBody, TParam>
  >(req?.url ?? null, mutationFetcher);

  return {
    trigger,
    data,
    isMutating,
    error,
  };
}
