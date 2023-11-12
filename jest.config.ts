import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  globalSetup: './global-setup.cjs',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  transform: {
    '^.+\\.[t]sx?$': ['ts-jest', {babelConfig: true}],
  },
  verbose: true,
};

export default config;
