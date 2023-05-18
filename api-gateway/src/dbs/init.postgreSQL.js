"use strict";
import pkg from "pg";
const { Pool } = pkg;
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE_NAME,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT,
});

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "user-service",
//   password: "01658384066a",
//   port: "5432",
// });

export default pool;
