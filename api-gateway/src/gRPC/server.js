import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import path from 'path';
import JwtService from '../services/jwt.service.js';

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

const auth = grpc.loadPackageDefinition(packageDefinition).Auth;

class ServerGRPC {
  async onServer() {
    const server = new grpc.Server();
    server.addService(auth.service, {
      verifyAccessToken: this.verifyAccessToken,
    });

    server.bindAsync(
      '0.0.0.0:50050',
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

  async verifyAccessToken(call, callback) {
    const { accessToken, userId } = call.request;
    const response = await JwtService.verifyAccessTokenV2({
      accessToken,
      userId,
    });
    callback(null, response);
  }
}

export default ServerGRPC;
