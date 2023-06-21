import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import path from 'path';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

const packageDefinition = protoLoader.loadSync(
  currentDirectory + '/client.proto',
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const product = grpc.loadPackageDefinition(packageDefinition).Product;
const auth = grpc.loadPackageDefinition(packageDefinition).Auth;

export class ClientGRPC {
  static client;

  constructor() {
    if (!ClientGRPC.client) {
      ClientGRPC.client = new product(
        'localhost:50051',
        grpc.credentials.createInsecure()
      );
    }
  }

  async getProduct({ productId, shopId }) {
    const data = { productId, shopId };
    return new Promise((resolve, reject) => {
      ClientGRPC.client.getProduct(data, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}

export class ClientGRPCForUser {
  static clientAuth;

  constructor() {
    if (!ClientGRPCForUser.clientAuth) {
      ClientGRPCForUser.clientAuth = new auth(
        'localhost:50050',
        grpc.credentials.createInsecure()
      );
    }
  }

  async verifyAccessToken({ accessToken, userId }) {
    const data = { accessToken, userId };
    return new Promise((resolve, reject) => {
      ClientGRPCForUser.clientAuth.verifyAccessToken(
        data,
        (error, response) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(response);
          }
        }
      );
    });
  }
}
