const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql, config } = require('../db');

// Clave secreta para JWT (en producción debe estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - Correo
 *         - Contrasena
 *       properties:
 *         Correo:
 *           type: string
 *           description: Correo electrónico del usuario
 *         Contrasena:
 *           type: string
 *           description: Contraseña del usuario
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - Nombre
 *         - Correo
 *         - Contrasena
 *       properties:
 *         Nombre:
 *           type: string
 *           description: Nombre del usuario
 *         Correo:
 *           type: string
 *           description: Correo electrónico del usuario
 *         Contrasena:
 *           type: string
 *           description: Contraseña del usuario
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         token:
 *           type: string
 *         usuario:
 *           type: object
 *           properties:
 *             IdUsuario:
 *               type: integer
 *             Nombre:
 *               type: string
 *             Correo:
 *               type: string
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: El usuario ya existe o datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/register', async (req, res) => {
  const { Nombre, Correo, Contrasena } = req.body;

  try {
    // Validar que todos los campos estén presentes
    if (!Nombre || !Correo || !Contrasena) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    let pool = await sql.connect(config);

    // Verificar si el usuario ya existe
    let existingUser = await pool.request()
      .input('Correo', sql.NVarChar(255), Correo)
      .query('SELECT * FROM UsuariosVidal WHERE Correo = @Correo');

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe con ese correo' });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Contrasena, saltRounds);

    // Crear el usuario
    let result = await pool.request()
      .input('Nombre', sql.NVarChar(100), Nombre)
      .input('Correo', sql.NVarChar(255), Correo)
      .input('ContrasenaHash', sql.NVarChar(256), hashedPassword)
      .query('INSERT INTO UsuariosVidal (Nombre, Correo, ContrasenaHash) OUTPUT INSERTED.* VALUES (@Nombre, @Correo, @ContrasenaHash)');

    const newUser = result.recordset[0];

    // Remover la contraseña de la respuesta
    delete newUser.ContrasenaHash;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: newUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
router.post('/login', async (req, res) => {
  const { Correo, Contrasena } = req.body;

  try {
    // Validar que todos los campos estén presentes
    if (!Correo || !Contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    let pool = await sql.connect(config);

    // Buscar el usuario por correo
    let result = await pool.request()
      .input('Correo', sql.NVarChar(255), Correo)
      .query('SELECT * FROM UsuariosVidal WHERE Correo = @Correo');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = result.recordset[0];

    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(Contrasena, usuario.ContrasenaHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar JWT token
    const token = jwt.sign(
      {
        IdUsuario: usuario.IdUsuario,
        Correo: usuario.Correo,
        Nombre: usuario.Nombre
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover la contraseña de la respuesta
    delete usuario.ContrasenaHash;

    res.json({
      message: 'Login exitoso',
      token: token,
      usuario: usuario
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verifica si el token JWT es válido
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   type: object
 *       401:
 *         description: Token inválido o expirado
 */
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      message: 'Token válido',
      usuario: {
        IdUsuario: decoded.IdUsuario,
        Correo: decoded.Correo,
        Nombre: decoded.Nombre
      }
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
