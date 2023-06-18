import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { Database } from './dbs/init.postgreSQL.js';
import inventoryRoute from './route/inventory.route.js';
import ServerGRPC from './gRPC/server.gRPC.js';
import Consumer from './rabbitMQ/consumer.js';

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

// CONNECT MONGODB
Database.getInstance('psql');

// RabbitMQ
const consumer = new Consumer();
await consumer.receivedMessage();

// gRPC
const serverGRPC = new ServerGRPC();
serverGRPC.onServer();

//ROUTE
app.use('/api/v1/inventory', inventoryRoute);

// HANDLE ERROR
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'Error',
    code: statusCode,
    message: err.message || 'Internal Server Error!',
  });
});

export default app;
