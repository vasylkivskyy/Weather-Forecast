import request from "supertest";
import app from "../src/server";

describe("Weather API Tests", () => {
  it("should return current weather for a valid city", async () => {
    const response = await request(app)
      .get("/api/weather")
      .query({ city: "London" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("temperature");
    expect(response.body).toHaveProperty("humidity");
    expect(response.body).toHaveProperty("description");
  });

  it("should return 400 for missing city parameter", async () => {
    const response = await request(app).get("/api/weather");

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "City parameter is required");
  });

  it("should return 404 for an invalid city", async () => {
    const response = await request(app)
      .get("/api/weather")
      .query({ city: "NonExistentCity123" });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "City not found");
  });
});
