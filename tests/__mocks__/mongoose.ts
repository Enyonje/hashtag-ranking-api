
import { jest } from "@jest/globals";
/// <reference types="jest" />

// Fake document type
interface FakeDoc {
  _id: string;
  email: string;
  stripeCustomerId?: string;
  premium?: boolean;
}

const fakeDoc: FakeDoc = {
  _id: "fakeId123",
  email: "test@example.com",
  stripeCustomerId: "cus_test",
  premium: true,
};

// Minimal fake Schema constructor
class FakeSchema<T> {
  constructor(definition: any) {
    return definition;
  }
}

export const Schema = FakeSchema;

export default {
  connect: jest.fn(),
  disconnect: jest.fn(),
  Schema: FakeSchema, // 👈 add Schema here
  model: jest.fn(() => ({
    findOneAndUpdate: jest.fn<() => Promise<FakeDoc>>().mockResolvedValue({
      ...fakeDoc,
      premium: true,
    }),
    findOne: jest.fn<() => Promise<FakeDoc>>().mockResolvedValue(fakeDoc),
    create: jest.fn<() => Promise<FakeDoc>>().mockResolvedValue({
      ...fakeDoc,
      premium: false,
    }),
    deleteOne: jest.fn<() => Promise<{ deletedCount: number }>>().mockResolvedValue({
      deletedCount: 1,
    }),
  })),
};