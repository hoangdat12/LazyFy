import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import path from 'path';
import InventoryRepository from '../pg/repository/inventory.repository.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

const packageDefinition = protoLoader.loadSync(
  currentDirectory + '/server.proto',
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const product = grpc.loadPackageDefinition(packageDefinition).Product;

class ServerGRPC {
  async onServer() {
    const server = new grpc.Server();
    server.addService(product.service, {
      checkProductIsStock: this.checkProductIsStock,
    });

    server.bindAsync(
      '0.0.0.0:50053',
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          console.error('Failed to bind server:', err.message);
          return;
        }
        server.start();
        console.log('gRPC server started on port', port);
      }
    );
  }

  async checkProductIsStock(call, callback) {
    const { productId, shopId, quantity } = call.request;
    const response = {
      isStock: false,
      message: '',
    };
    const invenProduct = await InventoryRepository.findByProductId({
      productId,
      shopId,
    });
    if (!invenProduct) {
      response.message = 'Inventory of Product not found, please try again!';
      return response;
    }

    if (invenProduct.inven_stock < quantity) {
      // Notify for shop

      response.message = 'Product sell out!';
      return response;
    }

    response.isStock = true;
    return response;
  }
}

export default ServerGRPC;
