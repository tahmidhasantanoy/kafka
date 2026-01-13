import { Kafka } from "kafkajs";

const kafkaServer = new Kafka({
  clientId: "analytic-service",
  brokers: ["localhost:9092"],
});

const consumer = kafkaServer.consumer({ groupId: "analytic-service" });

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: "payment-service",
      fromBeginning: true,
    });

    // Whenever a new message arrives in the subscribed topic, run this function.
    // Kafka is event-driven.
    // You’re not polling manually. Kafka pushes messages to your consumer.
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        // your message handler
        // eachMessage: your message handler

        /* 
            topic → which topic the message came from
            partition → which partition inside that topic
            message → the actual message data
        */

        console.log(topic, "Topic from analytic-service"); // topic: payment-service
        console.log(partition, "partition from analytic-service"); // partition: 0
        const value = message.value.toString(); // Kafka always sends data as a Buffer, convert raw binary data → string

        const { userId, cart } = JSON.parse(value);
        console.log(cart, "cart item");

        const total = cart
          .reduce((acc, item) => {
            return acc + item.price;
          }, 0)
          .toFixed(2);

        console.log(`Analytic consumer: User ${userId} price: ${total}`);
      },
    });
  } catch (error) {}
};

run();
