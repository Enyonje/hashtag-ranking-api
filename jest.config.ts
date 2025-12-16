import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],

  moduleNameMapper: {
    "^mongoose$": "<rootDir>/tests/__mocks__/mongoose.ts",
  },

  testMatch: [
    "**/tests/unit/**/*.test.ts",
    "**/tests/integration/**/*.test.ts",
  ],
};

export default config;
