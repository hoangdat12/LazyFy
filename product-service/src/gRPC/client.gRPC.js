import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import path from 'path';
import { BadRequestError } from '../core/error.response.js';

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

const { shop } = grpc.loadPackageDefinition(packageDefinition);

class ClientGRPC {
  clientShop;

  connectionGRPC() {
    this.clientShop = new shop.Shop(
      'localhost:50055',
      grpc.credentials.createInsecure()
    );
  }

  /**
   *
   * @param message
   * @param type
   */
  async fetchData({ message }) {
    if (!this.clientShop) {
      this.connectionGRPC();
    }
    const data = {
      shopId: message.data,
    };
    switch (message.type) {
      case 'getShop':
        return new Promise((resolve, reject) => {
          this.clientShop.getShopOfDiscount(data, (error, response) => {
            if (error) {
              console.error('Error:', error);
              reject(error);
            } else {
              resolve(response);
            }
          });
        });
      case 'get':
        break;
      default:
        throw new BadRequestError('Type not found!');
    }
  }
}

export default ClientGRPC;
