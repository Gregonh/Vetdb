/* eslint-disable no-console */
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

function isError(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    console.error(error);
    return 'Unknown error';
  }
}

export function ErrorPage() {
  const error = useRouteError();
  return (
    <>
      <div className="p-5 text-center text-xl">
        <h1 className="text-xl text-slate-900">Sorry, an error has occurred</h1>
        {isError(error) && (
          <p className="text-base text-slate-700">{isError(error)}</p>
        )}
      </div>
    </>
  );
}
