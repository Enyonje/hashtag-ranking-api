"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const globals_1 = require("@jest/globals");
const fakeDoc = {
    _id: "fakeId123",
    email: "test@example.com",
    stripeCustomerId: "cus_test",
    premium: true,
};
// Minimal fake Schema constructor
class FakeSchema {
    constructor(definition) {
        return definition;
    }
}
exports.Schema = FakeSchema;
exports.default = {
    connect: globals_1.jest.fn(),
    disconnect: globals_1.jest.fn(),
    Schema: FakeSchema, // 👈 add Schema here
    model: globals_1.jest.fn(() => ({
        findOneAndUpdate: globals_1.jest.fn().mockResolvedValue({
            ...fakeDoc,
            premium: true,
        }),
        findOne: globals_1.jest.fn().mockResolvedValue(fakeDoc),
        create: globals_1.jest.fn().mockResolvedValue({
            ...fakeDoc,
            premium: false,
        }),
        deleteOne: globals_1.jest.fn().mockResolvedValue({
            deletedCount: 1,
        }),
    })),
};
