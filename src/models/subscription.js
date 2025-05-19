import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  frequency: {
    type: String,
    enum: ["hourly", "daily"],
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  confirmationToken: {
    type: String,
    unique: true,
  },
  unsubscribeToken: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
