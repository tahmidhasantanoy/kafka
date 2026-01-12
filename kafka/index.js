import { Kafka } from "kafkajs";


const kafkaServer = new Kafka({
  clientId: "kafka-service",
  brokers: ["localhost:9092"],
});

const admin = Kafka.admin();

const run = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [{ topic: "payment-service" }, { topic: "order-service" }],
  });
};

run();
