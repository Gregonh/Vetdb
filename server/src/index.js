/* eslint-disable no-console */
/* eslint-disable no-undef */

import bodyParser from 'body-parser';
import errorhandler from 'errorhandler';
import express from 'express';

import { db } from './queries/query_users';

const app = express();
const PORT = process.env.PORT || 4001;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(`${req.method} Request Received`);
  next();
});

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

//routes with callback queries
app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.post("/users", db.createUser);
app.put("/users/:id", db.updateUser);
app.delete("/users/:id", db.deleteUser);

if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}

app.listen(PORT, () => {
  console.log(`🚀  Server is running!
    📭 listening on port ${PORT}`);
});
