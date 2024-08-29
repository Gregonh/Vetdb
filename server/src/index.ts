/* eslint-disable @typescript-eslint/no-unused-vars */
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { DatabaseError } from 'pg';

import { db } from './data-sources/query_users';
import { customErrorHandler } from './middleware/errorMiddleware';
import { logErrors } from './middleware/logErrors';
import { notFoundRouteHandler } from './middleware/notFoundRouteHandler';
import { ValidationError } from './utils/errorClasses';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env['PORT'] || 4001;
app.disable('x-powered-by');
app.use(helmet());
const allowedOrigins = ['http://localhost:5173'];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  //credentials: true
};
//first middlewares
app.use(cors(options));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(express.static('public'));
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.log(`${req.method} Request Received with ${req.url}`);
  next();
});
//start route middlewares
app.get('/', (_req, response: Response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});
//avoid favicon error
app.get('/favicon.ico', (_req, res) => res.status(204));

//routes with callback queries
app.get('/users', db.getUsers);
app.get('/user/:id', db.getUserById);
app.get('/user/confirmEmail', db.getConfirmEmail);
app.post('/user', db.createUser);
app.put('/user', db.putUser);
app.delete('/user/:id', db.deleteUser);

// Route mock errors
app.get('/error', (_req: Request, _res: Response, _next: NextFunction) => {
  //be caught by the nearest error-handling middleware
  throw new Error('This is a test error!');
});
app.get('/customerror', (req: Request, _res: Response, next: NextFunction) => {
  next(new ValidationError(req.url));
});
app.get('/pgerror', (_req: Request, _res: Response, next: NextFunction) => {
  const pgError = new DatabaseError('Simulated database error', 123, 'error');
  pgError.code = '23505'; // Example PostgreSQL error code for unique violation
  next(pgError);
});
app.get('/unerror', (_req: Request, _res: Response, _next: NextFunction) => {
  const unk: unknown = {};
  throw unk;
});

//must be the last middleware before errors middlewares
app.use(notFoundRouteHandler);

//Error middlewares
if (process.env['NODE_ENV']?.trim() === 'dev') {
  //be aware of the trailing spaces in the env var
  app.use(logErrors);
}
app.use(customErrorHandler);

app.listen(PORT, () => {
  logger.log(`🚀  Server is running!
    📭 listening on port ${PORT}`);
});
