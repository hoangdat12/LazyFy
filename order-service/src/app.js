import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

import Database from './dbs/init.database.js';
import orderRoute from './routes/order.route.js';

const app = express();

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
app.use(
  cors({
    origin: 'http://localhost:8080', // Replace with your allowed origin
  })
);

// CONNECT
// 1. DATABASE
Database.getInstance('mongodb');

function parseJSON(req, res, next) {
  if (req.headers.user) {
    try {
      req.user = JSON.parse(req.headers.user);
    } catch (err) {
      return next(new Error('Invalid JSON in user header'));
    }
  }
  next();
}
app.use(parseJSON);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'Error',
    code: statusCode,
    message: err.message || 'Internal Server Error!',
  });
});

// ROUTE
app.use('/api/v1/order', orderRoute);

export default app;
