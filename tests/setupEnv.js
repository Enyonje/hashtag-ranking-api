"use strict";
// tests/setupEnv.ts
// Make sure we are in test mode
process.env.NODE_ENV = 'test';
// Dummy envs so schema validation passes
process.env.MONGO_URI = 'mongodb://localhost:27017/testdb';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.API_KEY = 'your-dev-key-1';
// Optional: if you use rate limiting, disable it in tests via an env flag
process.env.DISABLE_RATE_LIMIT = 'true';
// Mock redis so it never opens a real connection
jest.mock('redis', () => {
    const client = {
        isOpen: false,
        connect: jest.fn(async () => { client.isOpen = true; }),
        quit: jest.fn(async () => { client.isOpen = false; }),
        on: jest.fn(),
    };
    return { createClient: () => client };
});
// Mock mongoose so it never opens a real connection
jest.mock('mongoose', () => {
    const close = jest.fn(async () => undefined);
    const connect = jest.fn(async () => undefined);
    const connection = { close };
    return { __esModule: true, default: { connect, connection } };
});
