import { LogLevel } from './Logger';

/** The App environment */
export type Environment = 'development' | 'production';

export const APP_ENV: Environment =
  process.env['NODE_ENV'] === 'production' ? 'production' : 'development';

export const LOG_LEVEL: LogLevel = APP_ENV === 'production' ? 'warn' : 'log';

/**
 * Used in logger.ts:
 * to use logger.log() everywhere and know it will be removed in the production builds.
 * you can see the difference when running the app:
 * When you run npm start, yarn start, or pnpm start,
 * NODE_ENV is automatically set to "development".
 * When you run npm run build, NODE_ENV is set to "production".
 */
