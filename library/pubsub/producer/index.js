const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092']
});

const producer = kafka.producer();

const produce = async (key, topic, data) => {
  try {
    await producer.connect();

    const message = {
      key,
      value: data
    };

    await producer.send({
      topic,
      messages: [message]
    });

    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error producing message:', error);
  } finally {
    await producer.disconnect();
  }
};

module.exports = produce;
