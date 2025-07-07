import 'reflect-metadata';
import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\.spec\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '.*\\.module\\.ts$'],
  coverageReporters: ['html', 'text-summary'],
  testEnvironment: 'node',
  setupFiles: ['reflect-metadata'],
};

export default config;
