const amqp = require('amqplib');

const queueNames = ['email_queue'];


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
        let option = {
          durable: true
        }
        if (queueName === 'email_queue') {
          option = {
            ...option,
            arguments: {
              'x-dead-letter-exchange': 'my_exchange',
              'x-dead-letter-routing-key': 'delay_queue'
            }
          };
        }

        channel.assertQueue(queueName, option);
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

    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));

    console.log(`Sent to queue: ${queueName}`);
  }
}

module.exports = QueueService;
