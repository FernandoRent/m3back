module.exports = {
  // Entorno de testing
  testEnvironment: 'node',

  // Patrones de archivos de test
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Directorios a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/'
  ],

  // Configuración de coverage
  collectCoverage: false,
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!.eslintrc.js',
    '!**/__tests__/**'
  ],

  // Umbral de coverage
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Timeout para tests
  testTimeout: 10000,

  // Variables de entorno para testing
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },

  // Verbose output
  verbose: true
}; 