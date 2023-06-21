'use strict';
import * as amqp from 'amqplib';
import InventoryRepository from '../pg/repository/inventory.repository.js';
import InventoryService from '../service/inventory.service.js';
import { BadRequestError } from '../core/error.response.js';

class Consumer {
  static channel;

  constructor(queue = 'inventory_queue') {
    this.queue = queue;
  }

  async connect() {
    const conn = await amqp.connect('amqp://localhost:5672');
    Consumer.channel = await conn.createChannel();
  }

  async receivedMessage() {
    if (!Consumer.channel) {
      await this.connect();
    }
    await Consumer.channel.assertQueue(this.queue, {
      durable: false,
    });
    Consumer.channel.prefetch(1);
    Consumer.channel.qos(100);
    Consumer.channel.consume(
      this.queue,
      async (msg) => {
        if (msg) {
          const { type, data } = JSON.parse(msg.content.toString());
          switch (type) {
            case 'decreQuantity':
              await changeQuantity({ data, type: 'decre' });
              break;

            case 'increQuantity':
              await changeQuantity({ data });
              break;

            default:
              console.log('Not valid!');
              throw new BadRequestError('Type of Message not valid!');
          }
          Consumer.channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  }
}

const changeQuantity = async ({ data, type = 'incre' }) => {
  for (let order of data.shop_orders) {
    // Create an array to store the updates
    const updates = [];
    const { shopId, products } = order;
    console.log(order);
    // Collect the updates in the loop
    for (let product of products) {
      const { productId, quantity } = product;
      const isStock = await InventoryService.isStock({
        productId,
        shopId,
        quantity,
      });
      if (!isStock) throw new BadRequestError('Product sell out!');
      updates.push({
        productId,
        shopId,
        quantity: type === 'incre' ? quantity : -quantity,
      });
    }

    // Batch update the inventory
    const updatePromises = updates.map((update) =>
      InventoryRepository.increQuantityProduct(update)
    );

    // Await all update promises
    await Promise.all(updatePromises);
  }
};

export default Consumer;
