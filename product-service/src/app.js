import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

import Database from './dbs/init.mongodb.js';
import productRoute from './routers/product.router.js';
import discountRoute from './routers/discount.router.js';
import Consumer from './rabbitMQ/consummer.js';
import ServerGRPC from './gRPC/server.gRPC.js';

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
    origin: 'http://localhost:8081', // Replace with your allowed origin
  })
);

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

// CONNECT
Database.getInstance('mongodb');

// RabbitMQ
// const consumer = new Consumer();
// await consumer.receivedMessage();

// gRPC
const serverGRPC = new ServerGRPC();
serverGRPC.onServer();

// ROUTES
app.use('/api/v1/product', productRoute);
app.use('/api/v1/discount', discountRoute);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'Error',
    code: statusCode,
    message: err.message || 'Internal Server Error!',
  });
});

export default app;
