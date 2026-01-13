import express from "express";
import cors from "cors";
import { Kafka } from "kafkajs";
const port = 8000;

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

const kafkaServer = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9092"],
});

const producer = kafkaServer.producer();

// All APIs
app.get("/", () => {
  console.log("App choltese . .");
});

app.post("/payment-service", async (req, res) => {
  const { cart } = req.body;
  const userId = "123";

  // KAFKA
  await producer.send({
    topic: "payment-service",
    messages: [{ value: JSON.stringify({ userId, cart }) }],
  });

  setTimeout(() => {
    return res.status(200).send("Payment successful");
  }, 3000);

  // return res.status(200).send("Payment successful");
});

const connectkafka = async () => {
  try {
    await producer.connect();
    console.log("Producer connected successfully");
  } catch (error) {
    console.log(error.message);
  }
};

app.get("/payment-service", () => {
  console.log("App payment-service choltese . . .");
});

app.listen(port, () => {
  console.log(`App listening from port: ${port}`);
  connectkafka();
});
