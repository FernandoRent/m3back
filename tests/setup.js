// Setup global para Jest
require('dotenv').config({ path: '.env.test' });

// Mock de console para tests más limpios
global.console = {
  ...console,
  // Silenciar logs en tests
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Configuración global para tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';

// Timeout global para operaciones de base de datos
jest.setTimeout(10000); 