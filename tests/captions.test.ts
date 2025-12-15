import request from "supertest";
import app from "../src/app";

describe("GET /captions/generate", () => {
  it("should return a generated caption when text is provided", async () => {
    const res = await request(app).get("/captions/generate?text=fitness");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("caption");
    expect(res.body.caption).toContain("fitness");
  });

  it("should return 400 if text is missing", async () => {
    const res = await request(app).get("/captions/generate");
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Missing 'text' query parameter" });
  });
});