/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LOG_LEVEL } from './environment';

/** Signature of a logging function.
 * Compatible enough to accept methods with param only
 * optionalParams: any[], like console.log
 */
export interface LogFn {
  (message?: any, ...optionalParams: any[]): void;
}

/** Basic logger interface, to stablish properties */
export interface Logger {
  log: LogFn;
  warn: LogFn;
  error: LogFn;
  info: LogFn;
  table: LogFn;
  group: LogFn;
  trace: LogFn;
  groupEnd: LogFn;
  assert: LogFn;
  count: LogFn;
  countReset: LogFn;
  debug: LogFn;
  dir: LogFn;
  time: LogFn;
  timeEnd: LogFn;
}

/** Log levels*/
export type LogLevel = 'log' | 'warn' | 'error';

//empty property
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NO_OP: LogFn = (_message?: any, ..._optionalParams: any[]) => {};

/**
 *Logger which outputs to the browser console.
 *
 *- Configurable: we can tell it to output all logs,
 *only errors, or warn, debug and error logs.
 *- We use the environments to stablish that configuration
 *and avoid to have to track them down before building
 *a production app.
  - All the message passed to a logger must be formatted 
  with formatMessage and we can add css style to them.
 *- You can disable the log level in development too and 
 *use it only in the components you’re working on (by
 *creating a new logger instance).
 *- You can add logging to Sentry or other monitoring platforms in
 *production.
 * 
 *- Usage in components:
 *import {logger,formatMessage,logStyle} from "../logger";
 *logger.group(formatMessage("hi", false));
  logger.log(formatMessage("hi"), logStyle);
 *
  The message must be formatted with formatMessage method 
  first, his second argument is optional and must be false 
  if that logger does not use a style.
 */
export class ConsoleLogger implements Logger {
  readonly error: LogFn;
  readonly trace: LogFn;
  readonly warn: LogFn;
  readonly debug: LogFn;
  readonly log: LogFn;
  readonly info: LogFn;
  readonly table: LogFn;
  readonly group: LogFn;
  readonly groupEnd: LogFn;
  readonly assert: LogFn;
  readonly count: LogFn;
  readonly countReset: LogFn;
  readonly dir: LogFn;
  readonly time: LogFn;
  readonly timeEnd: LogFn;

  constructor(options?: { level?: LogLevel }) {
    const { level } = options || {};

    this.trace = console.trace.bind(console);
    this.error = console.error.bind(console);

    if (level === 'error') {
      this.warn = NO_OP;
      this.debug = NO_OP;
      this.log = NO_OP;
      this.info = NO_OP;
      this.table = NO_OP;
      this.group = NO_OP;
      this.groupEnd = NO_OP;
      this.assert = NO_OP;
      this.count = NO_OP;
      this.countReset = NO_OP;
      this.dir = NO_OP;
      this.time = NO_OP;
      this.timeEnd = NO_OP;
      return;
    }

    this.warn = console.warn.bind(console);
    this.debug = console.debug.bind(console);

    if (level === 'warn') {
      this.log = NO_OP;
      this.info = NO_OP;
      this.table = NO_OP;
      this.group = NO_OP;
      this.groupEnd = NO_OP;
      this.assert = NO_OP;
      this.count = NO_OP;
      this.countReset = NO_OP;
      this.dir = NO_OP;
      this.time = NO_OP;
      this.timeEnd = NO_OP;
      return;
    }

    this.log = console.log.bind(console);
    this.info = console.info.bind(console);
    this.table = console.table.bind(console);
    this.group = console.group.bind(console);
    this.groupEnd = console.groupEnd.bind(console);
    this.assert = console.assert.bind(console);
    this.count = console.count.bind(console);
    this.countReset = console.countReset.bind(console);
    this.dir = console.dir.bind(console);
    this.time = console.time.bind(console);
    this.timeEnd = console.timeEnd.bind(console);
  }
}

export const logger = new ConsoleLogger({ level: LOG_LEVEL });
//css styles for the log methods
export const traceStyle =
  'color: #B85042; background-color: #E7E8D1; border: 2px solid #A7BEAE; padding: 2px; font-weight: bold;';
export const logStyle = 'color: #FBEAEB; font-weight: bold; background-color:#2F3C7E ;';
export const debugStyle = 'color: #735DA5; background-color: #D3C5E5;';
export const errorStyle = 'color: #990011; font-weight: bold; background-color:#101820;';
export const warnStyle = 'color: #FEE715; background-color: #101820;';
export const defaultStyle =
  'color: #00246B; background-color: #CADCFC; border: 2px solid #A7BEAE; padding: 2px; font-weight: bold;';

/**
 * Get a formatted message for a logger.
 * @param message will be formatted to avoid logging issues with
 * circular references and ObjectObject error.
 * @param isStyled false if the logger does not have css style arg.
 * @returns a string message.
 */
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export function formatMessage(message: any, isStyled: boolean = true): string | any {
  if (typeof message === 'object') {
    try {
      // Avoid circular references and ObjectObject error.
      const formattedMessage = JSON.stringify(
        JSON.parse(JSON.stringify(message)),
        null,
        2,
      );
      if (!isStyled) return formattedMessage;
      return `%c${formattedMessage}`;
    } catch (error) {
      return 'Error formatting message';
    }
  }
  if (!isStyled) return message;
  const msn = `%c${message}`;
  return msn;
}
