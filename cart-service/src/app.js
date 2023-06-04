import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';

import Database from './dbs/init.mongodb.js';

const app = express();

// CONNECT
Database.getInstance('mongodb');

// ROUTE
// app.use('/api/v1/cart');

// MIDDLEWARE
app.use(morgan('dev'));
app.use(helmet());
// Giam bang thong
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

export default app;
