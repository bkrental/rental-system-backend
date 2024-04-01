const amqp = require('amqplib');

const queueNames = ['email', 'sms', 'notification'];


class QueueService {
  static instance = null;

  constructor(channel) {
    this.channel = channel;
  }

  static async init() {
    const connection = await amqp.connect(process.env.RABBITMQ_UR);
    const channel = await connection.createChannel();

    try {
      queueNames.forEach((queueName) => {
        channel.assertQueue(queueName, {
          durable: true,
        });
      });
    } catch (error) {
      console.log('Error initializing queue service', error);
    }
    return new QueueService(channel);
  }

  static async getInstance() {
    if (!QueueService.instance) {
      console.log('Initializing Queue Service');
      QueueService.instance = await QueueService.init();

    }
    return QueueService.instance;
  }


  async publishMsg(queueName, data) {
    if (!this.channel) {
      throw new Error('Channel is not initialized');
    }

    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { expiration: 5000 });

    console.log(`Sent to queue: ${queueName}`);
  }
}

module.exports = QueueService;
