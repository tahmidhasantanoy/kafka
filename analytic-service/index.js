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

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();

        const { userId, cart } = JSON.parse(value);
        console.log(cart, "cart item");

        const total = cart.reduce((acc, item) => {
          return acc + item.price;
        }, 0);

        console.log(`Analytic consumer: User ${userId} price: ${total}`);
      },
    });
  } catch (error) {}
};

run();
