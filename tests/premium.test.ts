import request from "supertest";
import app from "../src/app";

describe("POST /captions/premium", () => {
  it("should reject if paymentIntentId is missing", async () => {
    const res = await request(app)
      .post("/captions/premium")
      .send({ text: "fitness" });
    expect(res.statusCode).toBe(400);
  });

  it("should reject if payment not completed", async () => {
    const res = await request(app)
      .post("/captions/premium")
      .send({ text: "fitness", paymentIntentId: "pi_fake" });
    expect(res.statusCode).toBe(402);
  });
});