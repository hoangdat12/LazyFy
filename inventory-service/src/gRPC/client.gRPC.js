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
