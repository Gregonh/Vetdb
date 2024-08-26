/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { FallbackProps } from 'react-error-boundary';

export function FallbackComponent({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <pre>{error.message}</pre>
      {resetErrorBoundary && <button onClick={resetErrorBoundary}>🔄 Try Again!</button>}
    </div>
  );
}
