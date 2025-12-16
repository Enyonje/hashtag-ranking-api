import request from "supertest";
import app from "../../src/app";
import { describe, it, expect, jest } from "@jest/globals";


jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      retrieve: jest.fn(async (id: string) => {
        if (id === "pi_fake") {
          return { status: "requires_payment_method" }; // not succeeded
        }
        return { status: "succeeded" };
      }),
    },
  }));
});

describe("POST /captions/premium", () => {
  it("should reject if payment not completed", async () => {
    const res = await request(app)
      .post("/captions/premium")
      .send({ text: "fitness", paymentIntentId: "pi_fake" });

    expect(res.statusCode).toBe(402);
  });
});