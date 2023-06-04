import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import * as dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { Database } from './dbs/init.postgreSQL.js';
import { InternalServerError } from '../src/core/error.response.js';
// import KeyTokenRepository from "./pg/repository/keyToken.repository.js";
import authRoute from './routes/auth.router.js';
import JwtService from './services/jwt.service.js';

dotenv.config();

const app = express();

// CONNECT DB
Database.getInstance('psql');

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

// ROUTE
app.use('/api/v1/auth', authRoute);

app.use(JwtService.verifyAccessToken);
// Gateway
// Proxy middleware configuration for the product service
app.use(
  '/api/v1/product',
  createProxyMiddleware({
    target: 'http://localhost:8081',
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
      if (req.user) {
        // delete accessToken
        proxyReq.removeHeader('authorization');
        // set user and keyToken
        proxyReq.setHeader('user', JSON.stringify(req.user));
        proxyReq.setHeader('keyToken', JSON.stringify(req.keyToken));
      }
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
      proxyReq.end();
    },
  })
);

// Proxy middleware configuration for the cart service
app.use(
  '/api/v1/cart',
  createProxyMiddleware({
    target: 'http://localhost:8002',
    changeOrigin: true,
    secure: false,
  })
);

// Proxy middleware configuration for the order service
app.use(
  '/api/v1//order',
  createProxyMiddleware({
    target: 'http://localhost:8003',
    changeOrigin: true,
    secure: false,
  })
);

// Proxy middleware configuration for the inventory service
app.use(
  '/api/v1/inventory',
  createProxyMiddleware({
    target: 'http://localhost:8004',
    changeOrigin: true,
    secure: false,
  })
);

app.use((err, req, res, next) => {
  console.log('err::: ', err);
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'Error',
    code: statusCode,
    message: err.message || 'Internal Server Error!',
  });
});

export default app;
