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

const auth = grpc.loadPackageDefinition(packageDefinition).Auth;

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
