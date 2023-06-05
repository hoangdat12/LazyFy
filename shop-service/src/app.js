import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { Database } from './dbs/init.postgreSQL.js';

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

// CONNECT
// 1. DATABASE
Database.getInstance('psql');

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'Error',
    code: statusCode,
    message: err.message || 'Internal Server Error!',
  });
});

export default app;
