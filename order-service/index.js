import { Kafka } from "kafkajs";

const kafkaServer = new Kafka({
  clientId: "order-service",
  brokers: ["localhost:9092"],
});

const orderConsumer = kafkaServer.consumer({ groupId: "order-service" });
// const orderProducer = kafkaServer.producer()

const connectKafka = async () => {
  try {
    // basics :
    await orderConsumer.connect();
    await orderConsumer.subscribe({
      topic: "payment-service",
      fromBeginning: true,
    });

    await orderConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(message, "message from order-service");

        const dataFromPayment = message.value;
        const cartData = JSON.parse(message.value);

        console.log(cartData, "cartData from order-service");
      },
    });
    console.log(`Order consumer: User `);
  } catch (error) {
    console.log(error);
  }
};

connectKafka();
