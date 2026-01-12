import express from "express";
import cors from "cors";
const port = 5000;

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));

// All APIs
app.get("/", () => {
  console.log("App choltese . . .");
});

app.get("/payment-service", () => {
  console.log("App payment-service choltese . . .");
});

app.listen(port, () => {
  console.log(`App listening from port: ${port}`);
});
