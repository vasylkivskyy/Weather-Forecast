import fetch from "node-fetch";

export async function getWeather(req, res) {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  const weatherApiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  try {
    const response = await fetch(weatherApiUrl);
    const data = await response.json();

    if (response.ok) {
      res.json({
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        description: data.current.condition.text,
      });
    } else if (data.error && data.error.code === 1006) {
      res.status(404).json({ error: "City not found" });
    } else {
      res
        .status(response.status)
        .json({ error: "Failed to fetch weather data" });
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
