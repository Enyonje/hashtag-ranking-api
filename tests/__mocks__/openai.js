"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
/// <reference types="jest" />
const mockOpenAI = {
    chat: {
        completions: {
            create: globals_1.jest.fn(async () => ({
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
exports.default = globals_1.jest.fn(() => mockOpenAI);
