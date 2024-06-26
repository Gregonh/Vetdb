/* eslint-disable no-console */
/* eslint-disable no-undef */

import bodyParser from 'body-parser';
import errorhandler from 'errorhandler';
import express from 'express';

const app = express();
//where to listen for new requests by providing a port number
const PORT = process.env.PORT || 4001;

// Use static server to serve the Express Yourself Website
app.use(express.static('public'));

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${req.method} Request Received`);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}

app.listen(PORT, () => {
  console.log(`🚀  Server is running!
    📭 listening on port ${PORT}`);
});
