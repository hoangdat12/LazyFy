import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import path from 'path';
import CartRepository from '../repository/cart.repository.js';
import { Types } from 'mongoose';

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

const cart = grpc.loadPackageDefinition(packageDefinition).Cart;

class ServerGRPC {
  async onServer() {
    const server = new grpc.Server();
    server.addService(cart.service, {
      checkCartExist: this.checkCartExist,
    });

    server.bindAsync(
      '0.0.0.0:50052',
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

  async checkCartExist(call, callback) {
    const cartId = call.request.cartId;
    const response = {
      cartId,
      userId: null,
    };
    if (!Types.ObjectId.isValid(cartId)) {
      callback(null, response);
      return;
    }
    const data = await CartRepository.findById({ cartId });
    if (data) {
      response.userId = data.cart_user_id;
    }
    callback(null, response);
  }
}

export default ServerGRPC;
