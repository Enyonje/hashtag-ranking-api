import { jest } from "@jest/globals";

jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn(() => ({
        type: "payment_intent.succeeded",
        data: { object: { customer: "cus_test" } }
      }))
    },
    paymentIntents: {
      retrieve: jest.fn(async () => ({
        status: "succeeded"
      }))
    }
  }));
});

jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(async () => ({
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
