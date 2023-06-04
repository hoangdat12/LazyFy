'use strict';

import mongoose from 'mongoose';

const connectUri = 'mongodb://127.0.0.1:27017/cart-service';

const connectMongoDb = () => {
  // Poolsize: max connection
  mongoose
    .connect(connectUri)
    .then((_) => {
      console.log('Connect Mongodb Successfully!');
    })
    .catch((err) => {
      console.log(err);
      console.log('Error Connect Mongodb!');
    });
};

class Database {
  constructor(type) {
    this.connect(type);
  }
  connect(type) {
    switch (type) {
      case 'mongodb':
        connectMongoDb();
        break;
      default:
        break;
    }
  }

  static getInstance(type) {
    if (!Database.instance) {
      Database.instance = new Database(type);
    }
    return Database.instance;
  }
}

export default Database;
