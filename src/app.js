import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

import instanceMongDB from "./dbs/init.mongodb.js";
import authRoute from "./routers/auth.router.js";
import shopRoute from "./routers/shop.router.js";
import productRoute from "./routers/product.router.js";

const app = express();

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

// CONNECT
instanceMongDB.connect("mongodb");

// ROUTES
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/shop", shopRoute);
app.use("/api/v1/product", productRoute);

// HANDLE ERROR
// app.use((req, res, next) => {
//   const error = new Error("Not found!");
//   error.status = 400;
//   next(error);
// });

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: "Error",
    code: statusCode,
    message: err.message || "Internal Server Error!",
  });
});

export default app;
