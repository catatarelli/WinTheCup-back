/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/**/*.test.ts"],
  resolver: "jest-ts-webcompat-resolver",
  testPathIgnorePatterns: [
    "src/index.tsx",
    "src/setupTests.ts",
    "src/__snapshots__/*.snap",
    "src/loadEnvironments.ts",
  ],
};
