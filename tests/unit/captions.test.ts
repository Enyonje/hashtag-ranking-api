// tests/captions.test.ts
import request from "supertest";
import app from "../../src/app";
import { describe, it, expect } from "@jest/globals";

// rest of your test...

describe("GET /captions/generate", () => {
  it("should return a mocked caption", async () => {
    const res = await request(app).get("/captions/generate?text=fitness");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("caption");
   expect(res.body.caption).toContain("caption");
  });
});