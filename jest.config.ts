import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  globalSetup: './global-setup.cjs',
  moduleFileExtensions: ['ts', 'js', 'cjs'],
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testRegex: '/*.test.ts$',
  verbose: true
};

export default jestConfig;
