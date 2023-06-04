import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import path from 'path';
import { findProductByProductIds } from '../repositories/product.repo.js';
import { InternalServerError } from '../core/error.response.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

const packageDefinition = protoLoader.loadSync(
  currentDirectory + '/product.proto',
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const { cart } = grpc.loadPackageDefinition(packageDefinition);

class ServerGRPC {
  async onServer() {
    const server = new grpc.Server();
    server.addService(cart.Cart.service, {
      checkProduct: this.checkProductIsExistService,
    });

    server.bindAsync(
      '0.0.0.0:50051',
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

  async checkProductIsExistService(call, callback) {
    const productIds = call.request.data;
    console.log('ProductIds received from client:::: ', productIds);
    const data = await findProductByProductIds({ productIds });
    callback(null, data);
  }
}

export default ServerGRPC;
