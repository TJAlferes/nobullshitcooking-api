import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  globalSetup: './global-setup.cjs',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testRegex: '/*.test.ts$',
  transform: {
    '^.+\\.[t]sx?$': 'ts-jest',
  },
  verbose: true,
};

export default config;
