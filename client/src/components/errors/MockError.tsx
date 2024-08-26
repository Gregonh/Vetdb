/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from 'axios';
import { useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { toast, Toaster } from 'react-hot-toast';
import { ZodError } from 'zod';

import { dealWithErrors } from './dealWithError';
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
          💥 Automatic Error Boundary
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
                dealWithErrors(error, showBoundary);
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
                dealWithErrors(error, showBoundary);
              });
          }}
        >
          🎈 Simulate AxiosError
        </button>
      </div>
      <div>
        <button
          className="mb-5 w-full rounded-[10px] p-2.5"
          onClick={() => {
            try {
              throw new Error('Papas fritas');
            } catch (error: unknown) {
              if (error instanceof Error) {
                logger.error(error.stack);
                toast.error(`Error:${error.message}`);
              }
            }
          }}
        >
          🥪 Simulate Toast error
        </button>
        <Toaster />
      </div>
      <div>
        <button
          className="mb-5 w-full rounded-[10px] p-2.5"
          onClick={() => {
            try {
              throw new ZodError([
                {
                  code: 'invalid_type',
                  expected: 'string',
                  received: 'number',
                  path: ['names', 1],
                  message: 'Invalid input: expected string, received number',
                },
                {
                  code: 'invalid_type',
                  expected: 'string',
                  received: 'number',
                  path: ['names', 1],
                  message: 'Invalid input 2: expected string, received number',
                },
              ]);
            } catch (error: unknown) {
              // logger.error(error.issues);
              // toast.error(`${error.name} : ${error.issues[0]?.message}`);
              dealWithErrors(error, showBoundary);
            }
          }}
        >
          🟥 Simulate Zod error
        </button>
        <Toaster />
      </div>
    </div>
  );
}
