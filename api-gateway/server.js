import app from "./src/app.js";

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log("Server start with http://localhost:8080");
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit Server Express");
  });
});
