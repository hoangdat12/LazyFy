import * as amqp from 'amqplib';
import { BadRequestError } from '../core/error.response.js';

/**
 * Interface IMsg {
 * type: ''
 * data:
 * }
 */

class Consumer {
  static channel;
  constructor(queue = 'product_queue') {
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
      (msg) => {
        if (msg) {
          msgReceived = JSON.parse(msg.content.toString());
          console.log(msgReceived);
          switch (msgReceived.type) {
            case 'check':
              console.log('Check product is Exist or not!');
              break;
            case 'get':
              console.log('List product:::: ');
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
