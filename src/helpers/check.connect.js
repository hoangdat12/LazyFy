import mongoose from "mongoose";
import os from "os";
import process from "process";

const SECOND_CHECK_OVERLOADING = 5000;

// COUNT CONNECT TO MONGODB
const countConnect = () => {
  const numberConnect = mongoose.connections.length;
  console.log("Number of connections:::", numberConnect);
};

// CHECK OVER LOAD
const checkOverLoad = () => {
  setInterval(() => {
    const numberConnect = mongoose.connections.length;
    // Get core of CPU
    const numberCores = os.cpus().length;
    // Get memory is usaged
    const memoryUsaged = process.memoryUsage().rss;

    // EXAMPLE
    const MAX_CONNECT = numberCores * 5;

    console.log(`Active connections:::${numberConnect}`);
    console.log(`Memory use::::${memoryUsaged / (1024 * 1024)} MB`);

    if (numberConnect > MAX_CONNECT) {
      console.log(`Connection is overloading!`);
    }
  }, SECOND_CHECK_OVERLOADING);
};

export { countConnect };
