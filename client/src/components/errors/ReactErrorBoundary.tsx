import { ComponentType, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

interface BoundaryProps {
  FallbackComponent: ComponentType<FallbackProps>;
  children: ReactNode | undefined;
  onError: (error: Error, info: ErrorInfo) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReset?: (...args: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateKey?: any;
}

export function ReactErrorBoundary(props: BoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={props.FallbackComponent}
      // logs
      onError={props.onError}
      // clean up or reset the state key of resetKeys, or call window.location.reload()
      onReset={props.onReset}
      // reset this ErrorBoundary when the array dependency change (by onReset function)
      resetKeys={[props.stateKey]}
    >
      {/* can use as prop the same props.stateKey if needed */}
      {props.children}
    </ErrorBoundary>
  );
}
