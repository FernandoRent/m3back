const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');

// Mock de la base de datos
jest.mock('../db', () => ({
  sql: {
    connect: jest.fn(),
    NVarChar: jest.fn(),
    Int: jest.fn()
  },
  config: {}
}));

// Mock de bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

// Mock de jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql } = require('../db');

// Setup de la app de prueba
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('debería registrar un nuevo usuario exitosamente', async () => {
      // Mock de la base de datos
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
      };

      sql.connect.mockResolvedValue(mockPool);
      
      // Mock: usuario no existe
      mockPool.query.mockResolvedValueOnce({ recordset: [] });
      
      // Mock: crear usuario
      mockPool.query.mockResolvedValueOnce({
        recordset: [{
          IdUsuario: 1,
          Nombre: 'Test User',
          Correo: 'test@email.com',
          FechaCreacion: new Date()
        }]
      });

      bcrypt.hash.mockResolvedValue('hashedPassword123');

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          Nombre: 'Test User',
          Correo: 'test@email.com',
          Contrasena: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Usuario registrado exitosamente');
      expect(response.body.usuario.Nombre).toBe('Test User');
      expect(response.body.usuario.ContrasenaHash).toBeUndefined();
    });

    it('debería fallar si faltan campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          Nombre: 'Test User'
          // Falta Correo y Contrasena
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Todos los campos son requeridos');
    });

    it('debería fallar si el usuario ya existe', async () => {
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
      };

      sql.connect.mockResolvedValue(mockPool);
      
      // Mock: usuario ya existe
      mockPool.query.mockResolvedValueOnce({
        recordset: [{ IdUsuario: 1, Correo: 'test@email.com' }]
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          Nombre: 'Test User',
          Correo: 'test@email.com',
          Contrasena: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El usuario ya existe con ese correo');
    });
  });

  describe('POST /api/auth/login', () => {
    it('debería hacer login exitosamente con credenciales válidas', async () => {
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
      };

      sql.connect.mockResolvedValue(mockPool);
      
      // Mock: encontrar usuario
      mockPool.query.mockResolvedValueOnce({
        recordset: [{
          IdUsuario: 1,
          Nombre: 'Test User',
          Correo: 'test@email.com',
          ContrasenaHash: 'hashedPassword123'
        }]
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken123');

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          Correo: 'test@email.com',
          Contrasena: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login exitoso');
      expect(response.body.token).toBe('mockToken123');
      expect(response.body.usuario.ContrasenaHash).toBeUndefined();
    });

    it('debería fallar con credenciales inválidas', async () => {
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
      };

      sql.connect.mockResolvedValue(mockPool);
      
      // Mock: usuario no encontrado
      mockPool.query.mockResolvedValueOnce({ recordset: [] });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          Correo: 'noexiste@email.com',
          Contrasena: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Credenciales inválidas');
    });

    it('debería fallar si faltan campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          Correo: 'test@email.com'
          // Falta Contrasena
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Correo y contraseña son requeridos');
    });
  });

  describe('GET /api/auth/verify', () => {
    it('debería verificar un token válido', async () => {
      jwt.verify.mockReturnValue({
        IdUsuario: 1,
        Correo: 'test@email.com',
        Nombre: 'Test User'
      });

      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer validToken123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Token válido');
      expect(response.body.usuario.IdUsuario).toBe(1);
    });

    it('debería fallar sin token', async () => {
      const response = await request(app)
        .get('/api/auth/verify');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token no proporcionado');
    });

    it('debería fallar con token inválido', async () => {
      jwt.verify.mockImplementation(() => {
        const error = new Error('Invalid token');
        error.name = 'JsonWebTokenError';
        throw error;
      });

      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalidToken');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token inválido');
    });
  });
}); 