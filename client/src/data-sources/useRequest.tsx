import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

export type GetRequest = AxiosRequestConfig | null; //does not accept a request body

/*don't confuse data (complete body), with the innerElement of the body
So ResponseBody and ErrorResponseBody are our IResponses interfaces.*/
interface Return<ResponseBody, ErrorResponseBody>
  extends Pick<
    SWRResponse<AxiosResponse<ResponseBody>, AxiosError<ErrorResponseBody>>,
    'isValidating' | 'error' | 'mutate' | 'isLoading'
  > {
  data: ResponseBody | undefined;
  response: AxiosResponse<ResponseBody> | undefined;
}

//stablish a initial data
interface Config<ResponseBody = unknown, ErrorResponseBody = unknown>
  extends Omit<
    SWRConfiguration<AxiosResponse<ResponseBody>, AxiosError<ErrorResponseBody>>,
    'fallbackData'
  > {
  fallbackData?: ResponseBody;
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
export function useRequest<ResponseBody = unknown, ErrorResponseBody = unknown>(
  request: NonNullable<GetRequest>,
  { fallbackData, ...config }: Config<ResponseBody, ErrorResponseBody> = {},
): Return<ResponseBody, ErrorResponseBody> {
  const {
    data: response,
    error,
    isValidating,
    mutate,
    isLoading,
  } = useSWR<AxiosResponse<ResponseBody>, AxiosError<ErrorResponseBody>>(
    request.url ?? null,
    /**
     * NOTE: Typescript thinks `request` can be `null` here, but the fetcher
     * function is actually only called by `useSWR` when it isn't.
     * For that i used NonNullable with GetRequest
     */
    () => axios.request<ResponseBody>(request),
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
        } as AxiosResponse<ResponseBody>),
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
