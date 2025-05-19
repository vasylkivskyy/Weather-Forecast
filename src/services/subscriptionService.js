import Subscription from "../models/subscription.js";
import { v4 as uuidv4 } from "uuid";

export async function createSubscription(email, city, frequency) {
  const confirmationToken = uuidv4();
  const unsubscribeToken = uuidv4();

  const newSubscription = new Subscription({
    email,
    city,
    frequency,
    confirmationToken,
    unsubscribeToken,
  });

  return await newSubscription.save();
}

export async function findSubscriptionByConfirmationToken(token) {
  return await Subscription.findOne({ confirmationToken });
}

export async function findSubscriptionByUnsubscribeToken(token) {
  return await Subscription.findOne({ unsubscribeToken });
}

export async function confirmSubscription(subscription) {
  subscription.confirmed = true;
  subscription.confirmationToken = undefined;
  return await subscription.save();
}

export async function deleteSubscription(subscription) {
  return await subscription.deleteOne();
}

export async function getConfirmedSubscriptionsByFrequency(frequency) {
  return await Subscription.find({ confirmed: true, frequency });
}

export async function findSubscriptionByEmailAndCity(email, city) {
  return await Subscription.findOne({ email, city });
}
