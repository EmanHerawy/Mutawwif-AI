/**
 * Unit test config — no expo/RN preset.
 * Used for pure TypeScript services, stores, and utility functions.
 * No native modules loaded; all RN dependencies mocked in setup.ts.
 */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { strict: true } }],
  },
  setupFiles: ['./src/__tests__/setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Stub ALL expo/RN native modules — unit tests don't need them
    '^expo(-.*)?$': '<rootDir>/src/__tests__/__mocks__/expo.js',
    '^react-native$': '<rootDir>/src/__tests__/__mocks__/react-native.js',
    '^react-native/(.*)$': '<rootDir>/src/__tests__/__mocks__/empty.js',
    '^@react-native/(.*)$': '<rootDir>/src/__tests__/__mocks__/empty.js',
    '^@react-native-async-storage/async-storage$': '<rootDir>/src/__tests__/__mocks__/async-storage.js',
    '^@react-native-community/netinfo$': '<rootDir>/src/__tests__/__mocks__/netinfo.js',
    '^react-native-mmkv$': '<rootDir>/src/__tests__/__mocks__/mmkv.js',
    '^firebase(.*)$': '<rootDir>/src/__tests__/__mocks__/empty.js',
    '^i18next$': '<rootDir>/src/__tests__/__mocks__/empty.js',
    '^react-i18next$': '<rootDir>/src/__tests__/__mocks__/empty.js',
  },
  collectCoverageFrom: [
    'src/services/**/*.ts',
    'src/stores/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: { branches: 70, functions: 70, lines: 70 },
  },
};
