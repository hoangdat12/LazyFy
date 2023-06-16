import * as amqp from 'amqplib';

class Producer {
  channel;
  constructor(queue) {
    this.queue = queue;
  }

  async connection() {
    const conn = await amqp.connect('amqp://localhost:5672');
    this.channel = await conn.createChannel();
  }

  async sendMessage(msg) {
    if (!this.channel) {
      await this.connection();
    }
    await this.channel.assertQueue(this.queue, {
      durable: false,
    });
    // Send the message to the stream queue
    const msgString = JSON.stringify(msg);
    await this.channel.sendToQueue(this.queue, Buffer.from(msgString), {
      expiration: '10000',
    });
  }
}

export default Producer;
