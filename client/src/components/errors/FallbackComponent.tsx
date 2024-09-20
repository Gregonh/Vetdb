import { FallbackProps } from 'react-error-boundary';

export function FallbackComponent({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      {error instanceof Error && (
        <pre>{error.message || 'An unknown error occurred'}</pre>
      )}
      {resetErrorBoundary && <button onClick={resetErrorBoundary}>🔄 Try Again!</button>}
    </div>
  );
}
