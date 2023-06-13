import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import path from 'path';
import ShopRepository from '../pg/repository/shop.repository.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

const packageDefinition = protoLoader.loadSync(
  currentDirectory + '/shop.server.proto',
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const { shop } = grpc.loadPackageDefinition(packageDefinition);
class ServerGRPC {
  async onServer() {
    const server = new grpc.Server();
    server.addService(shop.Shop.service, {
      getShopOfDiscount: this.getShopOfDiscount,
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

  async getShopOfDiscount(call, callback) {
    const shopId = call.request.shopId;

    const data = await ShopRepository.findByShopId({
      shopId: parseInt(shopId),
    });
    callback(null, data);
  }
}

export default ServerGRPC;
