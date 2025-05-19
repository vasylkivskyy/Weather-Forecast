import mongoose from "mongoose";
import dotenv from "dotenv";
import Subscription from "../models/subscription.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    await runMigrations();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

async function runMigrations() {
  try {
    const indexes = await Subscription.collection.indexes();
    const emailIndexExists = indexes.some(
      (index) => index.key && index.key.email === 1
    );

    if (!emailIndexExists) {
      console.log("Creating index for email...");
      await Subscription.collection.createIndex({ email: 1 });
      console.log("Index for email created");
    }

    console.log("Database migrations completed");
  } catch (error) {
    console.error("Error running database migrations:", error);
  }
}

export default connectDatabase;
