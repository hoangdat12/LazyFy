import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import * as dotenv from 'dotenv';

import { Database } from './dbs/init.postgreSQL.js';
import authRoute from './routes/auth.router.js';
import JwtService from './services/jwt.service.js';
import gatewayMiddleware from './middleware/gateway.middleware.js';
import swaggerDocs from './ultils/swagger/swagger.js';
import ServerGRPC from './gRPC/server.js';

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

// SWAGGER
swaggerDocs(app, process.env.PORT);

// MIDDLE WARE
// app.use(JwtService.verifyAccessToken);

// Gateway
// Proxy middleware configuration for the product service
app.use(
  '/api/v1/product',
  gatewayMiddleware({ target: 'http://localhost:8081' })
);
app.use(
  '/api/v1/discount',
  gatewayMiddleware({ target: 'http://localhost:8081' })
);

// Proxy middleware configuration for the cart service
app.use('/api/v1/cart', gatewayMiddleware({ target: 'http://localhost:8082' }));

// Proxy middleware configuration for the order service
app.use(
  '/api/v1//order',
  gatewayMiddleware({ target: 'http://localhost:8083' })
);

// Proxy middleware configuration for the inventory service
app.use(
  '/api/v1/inventory',
  gatewayMiddleware({ target: 'http://localhost:8084' })
);

// Proxy middleware configuration for the shop service
app.use('/api/v1/shop', gatewayMiddleware({ target: 'http://localhost:8085' }));

// Proxy middleware configuration for the order service
app.use(
  '/api/v1/order',
  gatewayMiddleware({ target: 'http://localhost:8086' })
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

// gRPC
const serverGRPC = new ServerGRPC();
serverGRPC.onServer();

export default app;
