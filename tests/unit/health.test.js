"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const globals_1 = require("@jest/globals");
(0, globals_1.describe)("GET /health", () => {
    (0, globals_1.it)("should return status ok", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/health");
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toEqual({ status: "ok" });
    });
});
