import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { customErrorHandler } from './middleware/errorMiddleware';
import { logErrors } from './middleware/logErrors';
import { notFoundRouteHandler } from './middleware/notFoundRouteHandler';
import { idPropertyMiddleware } from './middleware/requestPropertyMiddleware';
import { mockErrorRouter } from './routes/mockErrorRoutes';
import { userRouter } from './routes/userRoutes';
import { logger } from './utils/Logger';

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
app.use(express.json()); //replace body-parser
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.static('public'));

//morgan logging configuration
morgan.token('id', (req: Request) => {
  return req.userId;
});
app.use(idPropertyMiddleware);
app.use(morgan('dev'));
app.use(morgan(':req[header] :res[header] user_id- :id'));

//home route
app.get('/', (_req: Request, response: Response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});
//avoid favicon error
app.get('/favicon.ico', (_req, res) => res.status(204));

//routes
app.use('/users', userRouter);
app.use('/api/mock', mockErrorRouter);

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
