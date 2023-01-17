import type { Config } from 'jest';

const config: Config = {
  collectCoverage:   true,
  coverageDirectory: "coverage",
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  globalSetup:            "./global-setup.js",
  preset:                 "ts-jest/presets/js-with-babel",
  testEnvironment:        "node",
  testPathIgnorePatterns: ["/node_modules/"],
  testRegex:              "/*.test.ts$",
  transform: {
    "^.+\\.[t]sx?$": "ts-jest",
    "^.+\\.[j]sx?$": "babel-jest"
  },
  verbose: true,
};

export default config;