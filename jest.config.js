export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js", "**/?(*.)+(spec|test).js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
};
