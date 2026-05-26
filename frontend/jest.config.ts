import nextJest from 'next/jest'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured if you use `tsconfig.json` paths)
    // but we keep it here for clarity or custom overrides.
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Ensure we pick up .spec.tsx files
  testMatch: [
    "**/spec/**/*.spec.[jt]s?(x)",
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig)
