import { jest } from "@jest/globals";
/// <reference types="jest" />

const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn(async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                caption: "Mocked caption",
                tone: "playful",
                hashtags: ["#mocked"],
              }),
            },
          },
        ],
      })),
    },
  },
};

export default jest.fn(() => mockOpenAI);