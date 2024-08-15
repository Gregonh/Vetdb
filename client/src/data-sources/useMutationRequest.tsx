import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import useSWRMutation from 'swr/mutation';

import { type GetRequest } from './useRequest';

interface MutationRequestArgs<TBody, TParam> {
  request: NonNullable<GetRequest>;
  methodType: 'delete' | 'DELETE' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH';
  requestBody: TBody | undefined;
  queryParams: TParam | undefined;
}
//as MutationFetcher<U, string | null, MutationRequestArgs<T, S>>
const mutationFetcher = async <TData, TBody, TParam>(
  baseUrl: string,
  { arg }: { arg: MutationRequestArgs<TBody, TParam> },
): Promise<TData> => {
  const url = !arg.queryParams
    ? baseUrl
    : // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${baseUrl}?${new URLSearchParams(arg.queryParams)}`;

  const config: AxiosRequestConfig<TBody> = {
    ...arg.request,
    url,
    method: arg.methodType,
    timeout: 40000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  if (arg.requestBody) {
    config.data = arg.requestBody;
  }

  const response = await axios.request<TData>(config);
  return response.data;
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
  req: GetRequest,
) {
  const { trigger, data, isMutating, error } = useSWRMutation<
    TData,
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
