import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 4242;

import { BallotRouter, UsersRouter } from './router';

app.use(cors());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(bodyParser.json());
app.use('/ballots', BallotRouter);
app.use('/users', UsersRouter);

try {
  app.listen(PORT, async () => {
    console.log(`🚀  RestAPI listening on ${PORT}...`);
  });
} catch (error) {
  throw new Error(error);
}

export default app;
