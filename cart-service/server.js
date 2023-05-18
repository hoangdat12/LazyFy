import app from "./src/app.js";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8082;
const server = app.listen(PORT, () => {
  console.log("Server start with http://localhost:8082");
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit Server Express");
  });
});
