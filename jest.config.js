const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', '<rootDir>/jest.mocks.tsx'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.module\\.css$': '<rootDir>/jest.cssMock.js',
    '\\.css$': '<rootDir>/jest.cssMock.js',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/layout.tsx',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown|remark-gfm|react-syntax-highlighter)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)