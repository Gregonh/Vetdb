/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from 'axios';
import { useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import { logger } from '../../utils/logger';


function asyncError() {
  return new Promise((_resolve, reject) => {
    // raise an error after 200ms
    setTimeout(() => {
      reject(new Error(`Async error raised`));
    }, 200);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MockError(props: any) {
  const { showBoundary } = useErrorBoundary();

  const [raiseError, setRaiseError] = useState(false);

  return (
    <div className="px-cspace-m-l text-center">
      <div>
        <button
          className="mb-5 w-full rounded-[10px] p-2.5"
          onClick={() => setRaiseError((error) => !error)}
        >
          💥 Simulate Error
        </button>
        {/* "a" is undefined so "props.a.b" will result in an error */}
        {raiseError ? props.a.b : undefined}
      </div>
      <div>
        <button
          className="mb-5 w-full rounded-[10px] p-2.5"
          onClick={() => {
            asyncError()
              .then(() => {
                logger.log('waited successfully');
              })
              .catch((error) => {
                // propagate the error to the error boundary
                showBoundary(error);
              });
          }}
        >
          ⌛ Simulate Async Error
        </button>
      </div>
      <div>
        <button
          className="mb-5 w-full rounded-[10px] p-2.5"
          onClick={() => {
            axios
              .get('https://nonexistent.url')
              .then((response) => logger.log(response))
              .catch((error) => {
                showBoundary(error);
              });
          }}
        >
          🎈 Simulate AxiosError
        </button>
      </div>
    </div>
  );
}
