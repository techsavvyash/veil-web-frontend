/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 60000,
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ]
}

module.exports = config