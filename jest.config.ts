import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  globalSetup: './global-setup.cjs',
  moduleFileExtensions: ['ts', 'js'],
  preset: 'ts-jest/presets/js-with-ts-esm', //'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testRegex: '/*.test.ts$',
  /*transform: {
    '^.+\\.ts?$': 'ts-jest',
  },*/
  extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
};

export default config;
