import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../src/app";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from "@jest/globals";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("GET /ranking", () => {
  it("should return ranking data", async () => {
    const res = await request(app).get("/ranking");

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
});
