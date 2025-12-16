import request from "supertest";
import app from "../../src/app";
import { describe, it, expect } from "@jest/globals";


describe("GET /health", () => {
  it("should return status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});