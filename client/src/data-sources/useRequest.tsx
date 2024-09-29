import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

export type GetRequest<RequestBody = undefined> =
  AxiosRequestConfig<RequestBody> | null;

/*Don't confuse data (complete body), with the innerElement of the body.
So SuccessBody and ErrorResponseBody are our IResponses interfaces.
We generally use something like SuccessBody<zodSchemaTypeForResponse>*/
interface Return<SuccessBody, ErrorResponseBody>
  extends Pick<
    SWRResponse<AxiosResponse<SuccessBody>, AxiosError<ErrorResponseBody>>,
    'isValidating' | 'error' | 'mutate' | 'isLoading'
  > {
  data: SuccessBody | undefined;
  response: AxiosResponse<SuccessBody> | undefined;
}

//stablish a initial data
interface Config<SuccessBody = unknown, ErrorResponseBody = unknown>
  extends Omit<
    SWRConfiguration<AxiosResponse<SuccessBody>, AxiosError<ErrorResponseBody>>,
    'fallbackData'
  > {
  fallbackData?: SuccessBody;
}

/**
 * GET request using axios
 * Two ways of revalidate:
 * - manually revalidation using mutate(request.url)
 * - automatically after trigger() using the same request.url as key in the useMutationRequest hook.
 * @param request
 * An Axios request object with props url at least. It can also include a body
 * request, param or query, depending on the endpoint's needs.
 * @param optionalParam1 fallback data to stablish a initial data if needed
 * @returns
 * all the swr destructuring properties return.
 * mutate(key) as manually revalidation. The key must be the same
 * request.url used in the instance of this hook.
 */
export function useRequest<
  SuccessBody = unknown,
  ErrorResponseBody = unknown,
  RequestBody = undefined,
>(
  request: NonNullable<GetRequest<RequestBody>>,
  { fallbackData, ...config }: Config<SuccessBody, ErrorResponseBody> = {},
): Return<SuccessBody, ErrorResponseBody> {
  const {
    data: response,
    error,
    isValidating,
    mutate,
    isLoading,
  } = useSWR<AxiosResponse<SuccessBody>, AxiosError<ErrorResponseBody>>(
    request.url ?? null,
    /**
     * NOTE: Typescript thinks `request` can be `null` here, but the fetcher
     * function is actually only called by `useSWR` when it isn't.
     * For that i used NonNullable with GetRequest
     */
    () => axios.request<SuccessBody>(request), //TODO: is async?
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
        } as AxiosResponse<SuccessBody>),
    },
  );

  return {
    data: response && response.data, //generally the SuccessBody<zodSchemaTypeForResponse>
    response, //the complete axios response
    error, //after fetch error (server error or response error) this var is populated
    isValidating,
    mutate,
    isLoading,
  };
}
