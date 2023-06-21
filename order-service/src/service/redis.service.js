import * as redis from 'redis';
import { promisify } from 'util';
import { ClientInventoryGRPC } from '../gRPC/client.grpc.js';

class RedisService {
  static instance;
  redisClient;

  constructor() {
    this.connect();
  }

  connect() {
    return new Promise(async (resolve, reject) => {
      this.redisClient = redis.createClient();

      await this.redisClient.connect();
    });
  }

  static getInstance() {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance.redisClient;
  }
}

const redisClient = RedisService.getInstance();
const clientInventoryGRPC = new ClientInventoryGRPC();

export const acquireLock = async ({ productId, quantity, shopId }) => {
  const key = `lock_v2023_${productId}`;
  const retryTime = 10;
  const expireTime = 3000;
  for (let i = 0; i < retryTime; i++) {
    const result = await redisClient.setNX(key, expireTime.toString());
    console.log('Result::: ', result);
    if (result === 1 || result === true) {
      const response = await clientInventoryGRPC.checkProductIsStock({
        productId,
        shopId,
        quantity,
      });
      if (response.isStock) {
        await redisClient.pExpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  return null;
};

export const releaseLock = async ({ key }) => {
  return await redisClient.del(key);
};
