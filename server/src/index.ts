import bodyParser from 'body-parser';
import cors from 'cors';
import errorHandler from 'errorhandler';
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import helmet from 'helmet';

import { db } from './data-sources/query_users';

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
app.use(cors(options));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(express.static('public'));

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} Request Received with ${req.url}`);
  next();
});

app.get('/', (_req, response: Response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

//routes with callback queries
app.get('/users', db.getUsers);
app.get('/user/:id', db.getUserById);
app.get('/user/confirmEmail', db.getConfirmEmail);
app.post('/user', db.createUser);
app.put('/user', db.putUser);
app.delete('/user/:id', db.deleteUser);
// Route that throws an error
app.get('/error', () => {
  throw new Error('This is a test error!');
});

//catches any unhandled errors in development
if (process.env['NODE_ENV'] === 'development') {
  const typedErrorHandler: ErrorRequestHandler = errorHandler();
  app.use(typedErrorHandler);
}

// approach for production. It catches any errors not handled earlier
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  //delegate to the default Express error handler, when the headers have already been sent to the client
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀  Server is running!
    📭 listening on port ${PORT}`);
});
