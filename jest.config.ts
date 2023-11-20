import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  globalSetup: './global-setup.cjs',
  preset: 'ts-jest/presets/js-with-ts-esm', //'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testRegex: '/*.test.ts$',
  /*transform: {
    '^.+\\.ts?$': ['ts-jest', {isolatedModules: true}],
  },*/
  extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
};

export default config;
