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

const cart = grpc.loadPackageDefinition(packageDefinition).Cart;
const product = grpc.loadPackageDefinition(packageDefinition).Product;
const inventory = grpc.loadPackageDefinition(packageDefinition).Inventory;

export class ClientCartGRPC {
  static clientCart;

  constructor() {
    if (!ClientCartGRPC.clientCart) {
      ClientCartGRPC.clientCart = new cart(
        'localhost:50052',
        grpc.credentials.createInsecure()
      );
    }
  }

  async checkCartExist({ cartId }) {
    const data = { cartId };
    return new Promise((resolve, reject) => {
      ClientCartGRPC.clientCart.checkCartExist(data, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}

export class ClientProductGRPC {
  static clientProduct;

  constructor() {
    if (!ClientProductGRPC.clientProduct) {
      ClientProductGRPC.clientProduct = new product(
        'localhost:50051',
        grpc.credentials.createInsecure()
      );
    }
  }

  async getProduct({ productId, shopId }) {
    const data = { productId, shopId };
    return new Promise((resolve, reject) => {
      ClientProductGRPC.clientProduct.getProduct(data, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async getDiscountPrice({ totalPrice }) {
    const data = { totalPrice };
    return new Promise((resolve, reject) => {
      ClientProductGRPC.clientProduct.getDiscountPrice(
        data,
        (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        }
      );
    });
  }
}

export class ClientInventoryGRPC {
  static clientProduct;

  constructor() {
    if (!ClientProductGRPC.clientProduct) {
      ClientProductGRPC.clientProduct = new inventory(
        'localhost:50051',
        grpc.credentials.createInsecure()
      );
    }
  }

  async checkProductIsExist({ productId, shopId, quantity }) {
    const data = { productId, shopId, quantity };
    return new Promise((resolve, reject) => {
      ClientProductGRPC.clientProduct.checkProductIsStock(
        data,
        (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        }
      );
    });
  }
}