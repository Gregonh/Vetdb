import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

export type GetRequest<TBody = undefined> = AxiosRequestConfig<TBody> | null;

interface Return<Data, Error>
  extends Pick<
    SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
    'isValidating' | 'error' | 'mutate' | 'isLoading'
  > {
  data: Data | undefined;
  response: AxiosResponse<Data> | undefined;
}

export interface Config<Data = unknown, Error = unknown>
  extends Omit<SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>, 'fallbackData'> {
  fallbackData?: Data;
}
/**
 * GET request using axios
 * Two ways of revalidate:
 * - manually revalidation using mutate(request.url)
 * - automatically after trigger() using the same request.url as key in a useSWRMutation hook.
 * @param request
 * an axios request object with props url
 * @param optionalParam1 fallback data to stablish a initial data if needed
 * @returns
 * all the swr destructuring properties return.
 * mutate(key) as manually revalidation. The key must be the same
 * request.url used in the instance of this hook.
 */
export function useRequest< Data = unknown, Error = unknown, TBody = undefined>(
  request: NonNullable<GetRequest<TBody>>,
  { fallbackData, ...config }: Config<Data, Error> = {},
): Return<Data, Error> {
  const {
    data: response,
    error,
    isValidating,
    mutate,
    isLoading,
  } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
    request.url ?? null,
    /**
     * NOTE: Typescript thinks `request` can be `null` here, but the fetcher
     * function is actually only called by `useSWR` when it isn't.
     * For that i used NonNullable with GetRequest
     */
    () => axios.request<Data>(request),
    {
      ...config,
      fallbackData:
        fallbackData &&
        ({
          status: 200,
          statusText: 'InitialData',
          config: request,
          headers: {},
          data: fallbackData,
        } as AxiosResponse<Data>),
    },
  );

  return {
    data: response && response.data,
    response,
    error,
    isValidating,
    mutate,
    isLoading,
  };
}
