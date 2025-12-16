"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tests/captions.test.ts
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const globals_1 = require("@jest/globals");
// rest of your test...
(0, globals_1.describe)("GET /captions/generate", () => {
    (0, globals_1.it)("should return a mocked caption", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/captions/generate?text=fitness");
        (0, globals_1.expect)(res.statusCode).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty("caption");
        (0, globals_1.expect)(res.body.caption).toContain("caption");
    });
});
