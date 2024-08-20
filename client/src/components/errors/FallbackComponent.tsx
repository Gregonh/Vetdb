/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ErrorInfo } from 'react';
import { FallbackProps } from 'react-error-boundary';


export function FallbackComponent({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <pre>{error.message}</pre>
      {resetErrorBoundary && <button onClick={resetErrorBoundary}>🔄 Try Again!</button>}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logErrorToService(_error: Error, _info: ErrorInfo): void {
  // if (isAxiosError(error)) {
  //   logger.error(
  //     'Axios error occurred:',
  //     error.message,
  //     error.config?.url,
  //     info.componentStack,
  //   );
  // } else {
  //   logger.error('Caught an error:', error.message, info.componentStack);
  // }
  // if (error.stack) {
  //   logger.error('Original stack trace:', error.stack);
  // }
}
