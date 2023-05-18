import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

import instanceMongDB from './dbs/init.mongodb.js';
import shopRoute from './routers/shop.router.js';
import productRoute from './routers/product.router.js';

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
instanceMongDB.connect('mongodb');

app.get('/api/v1/product/test', (req, res) => {
  console.log(req.headers);
  return res.json({ msg: 'test' }).status(200);
});

// ROUTES
app.use('/api/v1/shop', shopRoute);
app.use('/api/v1/product', productRoute);

// HANDLE ERROR
// app.use((req, res, next) => {
//   const error = new Error("Not found!");
//   error.status = 400;
//   next(error);
// });

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'Error',
    code: statusCode,
    message: err.message || 'Internal Server Error!',
  });
});

export default app;
