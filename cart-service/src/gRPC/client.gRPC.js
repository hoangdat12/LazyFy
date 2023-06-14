import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  BadRequestError,
  InternalServerError,
} from '../core/error.response.js';

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

class ClientGRPC {
  clientProduct;

  connectionGRPC() {
    this.clientProduct = new product(
      'localhost:50051',
      grpc.credentials.createInsecure()
    );
  }

  /**
   *
   * @param message
   * @param type
   */
  async fetchData({ message }) {
    if (!this.clientProduct) {
      this.connectionGRPC();
    }
    const data = {
      data: message.data,
    };
    switch (message.type) {
      case 'check':
        this.clientProduct.checkProduct(data, (error, response) => {
          if (error) {
            console.error('Error:', error);
            return;
          }
          console.log('Server Response:', response);
          return response;
        });
        break;
      case 'get':
        break;
      default:
        throw new BadRequestError('Type not found!');
    }
  }
}

export default ClientGRPC;
