import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  globalSetup: './global-setup.cjs',
  //globalTeardown: '<rootDir>/tests/integration/teardown.ts',
  moduleFileExtensions: ['ts', 'js', 'cjs'],
  preset: 'ts-jest/presets/js-with-ts',  //'ts-jest/presets/js-with-ts-esm',
  //setupFilesAfterEnv: ['./tests/integration/setup-files-after-env.ts'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testRegex: '/*.test.ts$',
  //extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
};

export default jestConfig;
