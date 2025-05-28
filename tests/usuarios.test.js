const request = require('supertest');
const express = require('express');
const usuariosRoutes = require('../routes/usuarios');

// Mock de la base de datos
jest.mock('../db', () => ({
  sql: {
    connect: jest.fn(),
    NVarChar: jest.fn(),
    Int: jest.fn()
  },
  config: {}
}));

// Mock del middleware de autenticación
jest.mock('../middleware/auth', () => {
  return jest.fn((req, res, next) => {
    req.user = {
      IdUsuario: 1,
      Correo: 'test@email.com',
      Nombre: 'Test User'
    };
    next();
  });
});

const { sql } = require('../db');

// Setup de la app de prueba
const app = express();
app.use(express.json());
app.use('/api/usuarios', usuariosRoutes);

describe('Usuarios Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/usuarios', () => {
    it('debería obtener todos los usuarios', async () => {
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        query: jest.fn()
      };

      sql.connect.mockResolvedValue(mockPool);
      mockPool.query.mockResolvedValue({
        recordset: [
          {
            IdUsuario: 1,
            Nombre: 'Usuario 1',
            Correo: 'usuario1@email.com',
            FechaCreacion: new Date()
          },
          {
            IdUsuario: 2,
            Nombre: 'Usuario 2',
            Correo: 'usuario2@email.com',
            FechaCreacion: new Date()
          }
        ]
      });

      const response = await request(app)
        .get('/api/usuarios');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].Nombre).toBe('Usuario 1');
    });

    it('debería manejar errores de base de datos', async () => {
      sql.connect.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/usuarios');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database connection failed');
    });
  });

  describe('GET /api/usuarios/:id', () => {
    it('debería obtener un usuario por ID', async () => {
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
      };

      sql.connect.mockResolvedValue(mockPool);
      mockPool.query.mockResolvedValue({
        recordset: [{
          IdUsuario: 1,
          Nombre: 'Test User',
          Correo: 'test@email.com',
          FechaCreacion: new Date()
        }]
      });

      const response = await request(app)
        .get('/api/usuarios/1');

      expect(response.status).toBe(200);
      expect(response.body.IdUsuario).toBe(1);
      expect(response.body.Nombre).toBe('Test User');
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
      };

      sql.connect.mockResolvedValue(mockPool);
      mockPool.query.mockResolvedValue({ recordset: [] });

      const response = await request(app)
        .get('/api/usuarios/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Usuario no encontrado');
    });
  });

  describe('POST /api/usuarios', () => {
    it('debería crear un nuevo usuario', async () => {
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
      };

      sql.connect.mockResolvedValue(mockPool);
      mockPool.query.mockResolvedValue({
        recordset: [{
          IdUsuario: 3,
          Nombre: 'Nuevo Usuario',
          Correo: 'nuevo@email.com',
          ContrasenaHash: 'hashedPassword',
          FechaCreacion: new Date()
        }]
      });

      const response = await request(app)
        .post('/api/usuarios')
        .send({
          Nombre: 'Nuevo Usuario',
          Correo: 'nuevo@email.com',
          ContrasenaHash: 'hashedPassword'
        });

      expect(response.status).toBe(201);
      expect(response.body.Nombre).toBe('Nuevo Usuario');
      expect(response.body.IdUsuario).toBe(3);
    });
  });

  describe('PUT /api/usuarios/:id', () => {
    it('debería actualizar un usuario existente', async () => {
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
      };

      sql.connect.mockResolvedValue(mockPool);
      mockPool.query.mockResolvedValue({ rowsAffected: [1] });

      const response = await request(app)
        .put('/api/usuarios/1')
        .send({
          Nombre: 'Usuario Actualizado',
          Correo: 'actualizado@email.com',
          ContrasenaHash: 'newHashedPassword'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Usuario actualizado correctamente');
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
      };

      sql.connect.mockResolvedValue(mockPool);
      mockPool.query.mockResolvedValue({ rowsAffected: [0] });

      const response = await request(app)
        .put('/api/usuarios/999')
        .send({
          Nombre: 'Usuario Actualizado',
          Correo: 'actualizado@email.com',
          ContrasenaHash: 'newHashedPassword'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Usuario no encontrado');
    });
  });

  describe('DELETE /api/usuarios/:id', () => {
    it('debería eliminar un usuario existente', async () => {
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
      };

      sql.connect.mockResolvedValue(mockPool);
      mockPool.query.mockResolvedValue({ rowsAffected: [1] });

      const response = await request(app)
        .delete('/api/usuarios/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Usuario eliminado correctamente');
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
      };

      sql.connect.mockResolvedValue(mockPool);
      mockPool.query.mockResolvedValue({ rowsAffected: [0] });

      const response = await request(app)
        .delete('/api/usuarios/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Usuario no encontrado');
    });
  });

  describe('GET /api/usuarios/profile', () => {
    it('debería obtener el perfil del usuario autenticado', async () => {
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
      };

      sql.connect.mockResolvedValue(mockPool);
      mockPool.query.mockResolvedValue({
        recordset: [{
          IdUsuario: 1,
          Nombre: 'Test User',
          Correo: 'test@email.com',
          FechaCreacion: new Date()
        }]
      });

      const response = await request(app)
        .get('/api/usuarios/profile');

      expect(response.status).toBe(200);
      expect(response.body.IdUsuario).toBe(1);
      expect(response.body.Nombre).toBe('Test User');
    });
  });
}); 