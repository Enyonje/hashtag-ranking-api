import request from "supertest";
import app from "../src/app";

describe("POST /webhook", () => {
  it("should reject invalid signature", async () => {
    const res = await request(app)
      .post("/webhook")
      .set("stripe-signature", "invalid")
      .send({ test: "data" });
    expect(res.statusCode).toBe(400);
  });
});