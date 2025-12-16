"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const globals_1 = require("@jest/globals");
globals_1.jest.mock("stripe", () => {
    return globals_1.jest.fn().mockImplementation(() => ({
        paymentIntents: {
            retrieve: globals_1.jest.fn(async (id) => {
                if (id === "pi_fake") {
                    return { status: "requires_payment_method" }; // not succeeded
                }
                return { status: "succeeded" };
            }),
        },
    }));
});
(0, globals_1.describe)("POST /captions/premium", () => {
    (0, globals_1.it)("should reject if payment not completed", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/captions/premium")
            .send({ text: "fitness", paymentIntentId: "pi_fake" });
        (0, globals_1.expect)(res.statusCode).toBe(402);
    });
});
