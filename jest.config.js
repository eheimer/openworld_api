module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@openworld/(.*)": "<rootDir>/src/$1"
  },
  modulePathIgnorePatterns: [
    "<rootDir>/bin/"
  ]
};