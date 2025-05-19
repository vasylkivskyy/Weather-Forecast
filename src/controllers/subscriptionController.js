import { sendEmail } from "../services/emailService.js";
import {
  createSubscription,
  findSubscriptionByConfirmationToken,
  confirmSubscription as confirmSubService,
  findSubscriptionByUnsubscribeToken,
  deleteSubscription,
  findSubscriptionByEmailAndCity,
} from "../services/subscriptionService.js";

export async function subscribe(req, res) {
  const { email, city, frequency } = req.body;

  if (
    !email ||
    !city ||
    !frequency ||
    !["hourly", "daily"].includes(frequency)
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const existingSubscription = await findSubscriptionByEmailAndCity(
    email,
    city
  );
  if (existingSubscription) {
    return res.status(409).json({ error: "Email already subscribed" });
  }

  try {
    const newSubscription = await createSubscription(email, city, frequency);
    const baseUrl =
      process.env.BASE_URL ||
      `http://localhost:${process.env.PORT || 3000}/api`;
    const confirmationLink = `${baseUrl}/confirm/${newSubscription.confirmationToken}`;
    const unsubscribeLink = `${baseUrl}/unsubscribe/${newSubscription.unsubscribeToken}`;

    const emailBody = `
      <p>Дякуємо за підписку на оновлення погоди для міста ${city} з частотою ${frequency}.</p>
      <p>Будь ласка, перейдіть за посиланням для підтвердження підписки: <a href="${confirmationLink}">${confirmationLink}</a></p>
      <p>Щоб відмовитися від підписки, перейдіть за посиланням: <a href="${unsubscribeLink}">${unsubscribeLink}</a></p>
    `;

    await sendEmail(
      email,
      "Підтвердження підписки на оновлення погоди",
      emailBody
    );
    res
      .status(200)
      .json({ message: "Subscription successful. Confirmation email sent." });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: "Failed to subscribe" });
  }
}

export async function confirmSubscription(req, res) {
  const { token } = req.params;
  try {
    const subscription = await findSubscriptionByConfirmationToken(token);
    if (subscription) {
      await confirmSubService(subscription);
      res.status(200).json({ message: "Subscription confirmed successfully" });
    } else {
      res.status(404).json({ error: "Token not found" });
    }
  } catch (error) {
    console.error("Error confirming subscription:", error);
    res.status(500).json({ error: "Failed to confirm subscription" });
  }
}

export async function unsubscribe(req, res) {
  const { token } = req.params;
  try {
    const subscription = await findSubscriptionByUnsubscribeToken(token);
    if (subscription) {
      await deleteSubscription(subscription);
      res.status(200).json({ message: "Unsubscribed successfully" });
    } else {
      res.status(404).json({ error: "Token not found" });
    }
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).json({ error: "Failed to unsubscribe" });
  }
}
