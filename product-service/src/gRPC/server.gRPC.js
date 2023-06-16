import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  findProductByProductIds,
  findProductByProductId,
} from '../repositories/product.repo.js';
import { Types } from 'mongoose';
import DiscountService from '../services/discount.service.js';

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
      getProduct: this.getProduct,
      checkMultipleProduct: this.checkMultipleProduct,
      getDiscountPrice: this.getDiscountPrice,
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

  async getProduct(call, callback) {
    const { productId, shopId } = call.request;
    const response = {
      product: null,
    };
    if (!Types.ObjectId.isValid(productId)) {
      callback(null, response);
      return;
    }
    const data = await findProductByProductId({ productId, shopId });
    if (data) {
      response.product = data;
    }
    callback(null, response);
  }

  async checkMultipleProduct(call, callback) {
    const productIds = call.request.productIds;
    const data = await findProductByProductIds({ productIds });
    callback(null, data);
  }

  async getDiscountPrice(call, callback) {
    const { discountCode, totalPrice, productId, userId } = call.request;
    const response = {
      totalDiscount: 0,
      message: '',
    };
    const data = await DiscountService.getPriceOfDiscount({
      totalPrice,
      code: discountCode,
      productId,
      userId,
    });
    if (data) {
      response.totalDiscount = data.totalDiscount;
      response.message = data.message;
      response.isValid = data.isValid;
    }
    callback(null, response);
  }
}

export default ServerGRPC;
