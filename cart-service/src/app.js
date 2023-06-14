import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import ServerGRPC from './gRPC/server.gRPC.js';
import Database from './dbs/init.mongodb.js';
import cartRoute from './routes/cart.route.js';

const app = express();

// CONNECT
Database.getInstance('mongodb');

const serverGRPC = new ServerGRPC();
serverGRPC.onServer();

// ROUTE
app.use('/api/v1/cart', cartRoute);

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
