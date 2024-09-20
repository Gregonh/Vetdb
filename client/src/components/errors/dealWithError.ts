/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { logger } from '../../utils/logger';

const zodApproachError = (error: z.ZodError) => {
  const formatter = new Intl.ListFormat('en', { style: 'narrow', type: 'unit' });
  const issueMessages = error.issues.map(
    (issue, index) => `Index${index}: ${issue.message}`,
  );
  logger.error(`${error.name}: ${formatter.format(issueMessages)}`);
  toast.error(`${error.name}`);
};

const axiosApproachError = (error: AxiosError, showBoundary: (error: any) => void) => {
  showBoundary(error);
};

const defaultApproachError = (error: Error, showBoundary: (error: any) => void) => {
  showBoundary(error);
};

const unknownApproachError = (error: unknown, showBoundary: (error: any) => void) => {
  showBoundary(error);
};
//todo: look if dealwitherrors must be used with showBoundary as optional in some cases
/**
 * Deal with errors that are caught manually (not by Errorboundary).
 * Narrow and then we have two options:
 * - log the error and show a visual indication to the user
 * - send the error to ErrorBoundary (that automatically logs also).
 * If one error use showBoundary, it can´t use a toast.
 * The toast must be used with a Toaster component at the same time.
 * @param error from a catch block
 * @param showBoundary hook to re-throw an error to ErrorBoundary
 */
export const dealWithErrors = (error: unknown, showBoundary: (error: any) => void) => {
  logger.trace(error);

  if (error instanceof z.ZodError) {
    zodApproachError(error);
  } else if (axios.isAxiosError(error)) {
    axiosApproachError(error, showBoundary);
  } else if (error instanceof Error) {
    defaultApproachError(error, showBoundary);
  } else {
    unknownApproachError(error, showBoundary);
  }
};
