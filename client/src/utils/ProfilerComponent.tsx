import { Profiler } from 'react';

/**
 * Just a wrapper for the Profiler react.
 * Use only in development to test the component´s performance.
 */

interface ProfilerProps {
  id: string;
  children: React.JSX.Element;
}

type ProfilerOnRenderCallback = (
  /**
   * The string id prop of the {@link Profiler} tree that has just committed. This lets
   * you identify which part of the tree was committed if you are using multiple
   * profilers.
   *
   * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
   */
  id: string,
  /**
   * This lets you know whether the tree has just been mounted for the first time
   * or re-rendered due to a change in props, state, or hooks.
   *
   * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
   */
  phase: 'mount' | 'update' | 'nested-update',
  /**
   * The number of milliseconds spent rendering the {@link Profiler} and its descendants
   * for the current update. This indicates how well the subtree makes use of
   * memoization (e.g. {@link memo} and {@link useMemo}). Ideally this value should decrease
   * significantly after the initial mount as many of the descendants will only need to
   * re-render if their specific props change.
   *
   * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
   */
  actualDuration: number,
  /**
   * The number of milliseconds estimating how much time it would take to re-render the entire
   * {@link Profiler} subtree without any optimizations. It is calculated by summing up the most
   * recent render durations of each component in the tree. This value estimates a worst-case
   * cost of rendering (e.g. the initial mount or a tree with no memoization). Compare
   * {@link actualDuration} against it to see if memoization is working.
   *
   * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
   */
  baseDuration: number,
  /**
   * A numeric timestamp for when React began rendering the current update.
   *
   * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
   */
  startTime: number,
  /**
   * A numeric timestamp for when React committed the current update. This value is shared
   * between all profilers in a commit, enabling them to be grouped if desirable.
   *
   * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
   */
  commitTime: number,
) => void;

function ProfilerComponent(props: ProfilerProps) {
  const { id, children } = props;

  const onRenderCallback: ProfilerOnRenderCallback = (
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
  ) => {
    console.log({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
    });
  };

  return (
    <>
      <Profiler id={id} onRender={onRenderCallback}>
        {children}
      </Profiler>
    </>
  );
}

export { ProfilerComponent };
