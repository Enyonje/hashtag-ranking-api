"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = __importDefault(require("../../src/app"));
const globals_1 = require("@jest/globals");
let mongo;
(0, globals_1.beforeAll)(async () => {
    mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongo.getUri());
});
(0, globals_1.afterAll)(async () => {
    await mongoose_1.default.disconnect();
    await mongo.stop();
});
(0, globals_1.describe)("GET /ranking", () => {
    (0, globals_1.it)("should return ranking data", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/ranking");
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toBeDefined();
    });
});
