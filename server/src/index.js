/* eslint-disable no-console */
/* eslint-disable no-undef */

import bodyParser from 'body-parser';
import errorhandler from 'errorhandler';
import express from 'express';
import { Pool } from 'pg';

const app = express();
//where to listen for new requests by providing a port number
const PORT = process.env.PORT || 4001;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const pool = new Pool({
  user: 'postgres', // replace with your database username
  host: 'localhost', // replace with your database host
  database: 'dvdrental', // replace with your database name
  password: 'libretita5445.', // replace with your database password
  port: 5432, // replace with your database port
});

// Use static server to serve the Express Yourself Website
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(`${req.method} Request Received`);
  next();
});

//query function to call in the endpoint
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}

app.listen(PORT, () => {
  console.log(`🚀  Server is running!
    📭 listening on port ${PORT}`);
});
