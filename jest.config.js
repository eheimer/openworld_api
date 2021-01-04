module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["<rootDir>/src/tests/**/*.[jt]s?(x)"],
  testPathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/node_modules/",
    "<rootDir>/src/tests/helpers/",
    "<rootDir>/src/tests/models/",
    "<rootDir>/src/tests/services/"
  ],
  moduleNameMapper: {},
};