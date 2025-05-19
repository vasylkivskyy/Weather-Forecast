import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDatabase from "./config/database.js";
import weatherRoutes from "./routes/weather.js";
import subscriptionRoutes from "./routes/subscription.js";
import { startWeatherUpdates } from "./services/weatherUpdateService.js";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const startServer = async () => {
  try {
    await connectDatabase();
    app.use("/api", weatherRoutes);
    app.use("/api", subscriptionRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      startWeatherUpdates();
    });
  } catch (error) {
    console.error(
      "Failed to start server due to database connection error:",
      error
    );
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test2") {
  startServer();
}

export default app;
