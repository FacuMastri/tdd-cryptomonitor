/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/index.ts',
    'src/server.ts',
    '!**/node_modules/**',
    '!**/services/**',
    '!**/controllers/**'
  ],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
  testMatch: ['**/*.test.ts']
};
