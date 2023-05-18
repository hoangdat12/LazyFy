import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

const app = express();

// CONNECT
instanceMongDB.connect("mongodb");

// MIDDLEWARE
app.use(morgan("dev"));
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
