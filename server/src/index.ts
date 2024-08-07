import bodyParser from 'body-parser';
import cors from 'cors';
import errorHandler from 'errorhandler';
import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
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
app.get('/users/:id', db.getUserById);
app.get('/users/email/:id', db.getEmailById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);
// Route that throws an error
app.get('/error', () => {
  throw new Error('This is a test error!');
});

if (process.env['NODE_ENV'] === 'development') {
  const typedErrorHandler: ErrorRequestHandler =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    errorHandler();
  app.use(typedErrorHandler);
}

// General error handler middleware for production
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).send('Something broke!');
  _next();
});

app.listen(PORT, () => {
  console.log(`🚀  Server is running!
    📭 listening on port ${PORT}`);
});
