import fetch from "node-fetch";
import { sendEmail } from "./emailService.js";
import { getConfirmedSubscriptionsByFrequency } from "./subscriptionService.js";

async function sendWeatherUpdate(email, city) {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const weatherApiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(weatherApiUrl);
    const data = await response.json();

    if (response.ok) {
      const weatherInfo = `Температура: ${data.current.temp_c}°C, Вологість: ${data.current.humidity}%, Опис: ${data.current.condition.text}`;
      const emailBody = `<p>Поточний прогноз погоди для міста ${city}:</p><p>${weatherInfo}</p>`;
      await sendEmail(email, `Оновлення погоди для ${city}`, emailBody);
    } else {
      console.error(`Failed to fetch weather for ${city}:`, data);
    }
  } catch (error) {
    console.error(
      `Error sending weather update for ${city} to ${email}:`,
      error
    );
  }
}

async function processWeatherUpdates(frequency) {
  const subscriptions = await getConfirmedSubscriptionsByFrequency(frequency);
  console.log(
    `Processing ${frequency} weather updates for ${subscriptions.length} subscribers`
  );
  for (const subscription of subscriptions) {
    await sendWeatherUpdate(subscription.email, subscription.city);
  }
}

export async function startWeatherUpdates() {
  console.log("Starting periodic weather updates...");
  setInterval(() => {
    processWeatherUpdates("hourly");
  }, 60 * 60 * 1000);

  const dailyUpdateRule = new Date();
  dailyUpdateRule.setHours(8);
  dailyUpdateRule.setMinutes(0);
  dailyUpdateRule.setSeconds(0);

  function runDailyUpdate() {
    const now = new Date();
    if (
      now.getHours() === dailyUpdateRule.getHours() &&
      now.getMinutes() === dailyUpdateRule.getMinutes()
    ) {
      processWeatherUpdates("daily");
    }
  }

  setInterval(runDailyUpdate, 60 * 1000);
}
