import * as amqp from 'amqplib';
import { BadRequestError } from '../core/error.response.js';
import CartService from '../services/cart.service.js';

/**
 * Interface IMsg {
 * type: ''
 * data:
 * }
 */

class Consumer {
  static channel;
  constructor(queue = 'cart_queue') {
    this.queue = queue;
  }

  async connection() {
    const conn = await amqp.connect('amqp://localhost:5672');
    Consumer.channel = await conn.createChannel();
  }

  async receivedMessage() {
    if (!Consumer.channel) {
      await this.connection();
    }
    await Consumer.channel.assertQueue(this.queue, {
      durable: false,
    });
    Consumer.channel.prefetch(1);
    Consumer.channel.qos(100);
    let msgReceived = null;
    Consumer.channel.consume(
      this.queue,
      async (msg) => {
        if (msg) {
          const { type, data } = JSON.parse(msg.content.toString());
          switch (type) {
            case 'create':
              await CartService.createCartForNewUser({ userId: data.userId });
              break;

            // Delete product after order
            case 'delete':
              await CartService.deleteProductFromCart({
                userId: data.userId,
                cartId: data.cartId,
              });
              break;
            default:
              console.log('Not valid!');
              throw new BadRequestError('Type of Message not valid!');
          }
        }
        Consumer.channel.ack(msg);
      },
      {
        noAck: false,
      }
    );
  }
}

export default Consumer;
