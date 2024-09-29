import { useAuth0 } from '@auth0/auth0-react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

import { logger } from '../../utils/logger';
function isError(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'Unknown error';
  }
}

export function ErrorPage() {
  const error = useRouteError();
  const { isLoading, isAuthenticated } = useAuth0();
  logger.error(error);
  return (
    <>
      <div className="p-5 text-center text-xl">
        <h1 className="text-xl text-slate-900">Sorry, an error has occurred</h1>
        {isError(error) && <p className="text-base text-slate-700">{isError(error)}</p>}
        {isAuthenticated ? (
          isLoading ? (
            <p>Loading...</p>
          ) : (
            <Link
              className="font-secondary inline-block align-baseline text-sm text-[rgb(39,86,163)] hover:text-blue-800"
              to="/vet-menu"
            >
              Return to Menu!
            </Link>
          )
        ) : (
          <Link
            className="font-secondary inline-block align-baseline text-sm text-[rgb(39,86,163)] hover:text-blue-800"
            to="/"
          >
            Return to Home!
          </Link>
        )}
      </div>
    </>
  );
}
