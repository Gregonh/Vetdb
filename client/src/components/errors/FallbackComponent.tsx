import { useAuth0 } from '@auth0/auth0-react';
import { FallbackProps } from 'react-error-boundary';
import { Link } from 'react-router-dom';

export function FallbackComponent({ error, resetErrorBoundary }: FallbackProps) {
  const { isLoading, isAuthenticated } = useAuth0();

  return (
    <div role="alert">
      {error instanceof Error && (
        <pre>{error.message || 'An unknown error occurred'}</pre>
      )}
      {isAuthenticated ? (
        isLoading ? (
          <p>Loading...</p>
        ) : (
          resetErrorBoundary && (
            <button onClick={resetErrorBoundary}>🔄 Try Again!</button>
          )
        )
      ) : (
        <Link
          className="v-font-secondary hover:text-elements-hover text-elements-link inline-block align-baseline"
          to="/"
        >
          Return to Home!
        </Link>
      )}
    </div>
  );
}
