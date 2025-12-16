"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
globals_1.jest.mock("stripe", () => {
    return globals_1.jest.fn().mockImplementation(() => ({
        webhooks: {
            constructEvent: globals_1.jest.fn(() => ({
                type: "payment_intent.succeeded",
                data: { object: { customer: "cus_test" } }
            }))
        },
        paymentIntents: {
            retrieve: globals_1.jest.fn(async () => ({
                status: "succeeded"
            }))
        }
    }));
});
globals_1.jest.mock("openai", () => {
    return globals_1.jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: globals_1.jest.fn(async () => ({
                    choices: [
                        {
                            message: {
                                content: JSON.stringify({
                                    caption: "Test caption",
                                    tone: "casual",
                                    hashtags: ["#test"]
                                })
                            }
                        }
                    ]
                }))
            }
        }
    }));
});
