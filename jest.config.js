module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  setupFiles: ['./src/__tests__/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|zustand|immer)',
  ],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
  moduleNameMapper: {
    // Stub out Expo's native-only winter runtime that cannot run in Node
    'expo/src/winter/runtime.native': '<rootDir>/src/__tests__/__mocks__/empty.js',
    'expo/src/winter/installGlobal': '<rootDir>/src/__tests__/__mocks__/empty.js',
    // Path aliases
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/services/**/*.ts',
    'src/stores/**/*.ts',
    'src/hooks/**/*.ts',
    'src/components/**/*.tsx',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
};
