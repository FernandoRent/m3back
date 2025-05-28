const express = require('express');
const router = express.Router();
const { sql, config } = require('../db');
const authenticateToken = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - Nombre
 *         - Correo
 *         - ContrasenaHash
 *       properties:
 *         IdUsuario:
 *           type: integer
 *           description: ID único del usuario
 *         Nombre:
 *           type: string
 *           maxLength: 100
 *           description: Nombre del usuario
 *         Correo:
 *           type: string
 *           maxLength: 255
 *           description: Correo electrónico del usuario
 *         ContrasenaHash:
 *           type: string
 *           maxLength: 256
 *           description: Hash de la contraseña del usuario
 *         FechaCreacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del usuario
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM UsuariosVidal');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('IdUsuario', sql.Int, req.params.id)
      .query('SELECT * FROM UsuariosVidal WHERE IdUsuario = @IdUsuario');
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Correo
 *               - ContrasenaHash
 *             properties:
 *               Nombre:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nombre del usuario
 *               Correo:
 *                 type: string
 *                 maxLength: 255
 *                 description: Correo electrónico del usuario
 *               ContrasenaHash:
 *                 type: string
 *                 maxLength: 256
 *                 description: Hash de la contraseña del usuario
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Crear usuario
router.post('/', async (req, res) => {
  const { Nombre, Correo, ContrasenaHash } = req.body;
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('Nombre', sql.NVarChar(100), Nombre)
      .input('Correo', sql.NVarChar(255), Correo)
      .input('ContrasenaHash', sql.NVarChar(256), ContrasenaHash)
      .query('INSERT INTO UsuariosVidal (Nombre, Correo, ContrasenaHash) OUTPUT INSERTED.* VALUES (@Nombre, @Correo, @ContrasenaHash)');
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Correo
 *               - ContrasenaHash
 *             properties:
 *               Nombre:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nombre del usuario
 *               Correo:
 *                 type: string
 *                 maxLength: 255
 *                 description: Correo electrónico del usuario
 *               ContrasenaHash:
 *                 type: string
 *                 maxLength: 256
 *                 description: Hash de la contraseña del usuario
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Actualizar usuario
router.put('/:id', async (req, res) => {
  const { Nombre, Correo, ContrasenaHash } = req.body;
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('IdUsuario', sql.Int, req.params.id)
      .input('Nombre', sql.NVarChar(100), Nombre)
      .input('Correo', sql.NVarChar(255), Correo)
      .input('ContrasenaHash', sql.NVarChar(256), ContrasenaHash)
      .query('UPDATE UsuariosVidal SET Nombre = @Nombre, Correo = @Correo, ContrasenaHash = @ContrasenaHash WHERE IdUsuario = @IdUsuario');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('IdUsuario', sql.Int, req.params.id)
      .query('DELETE FROM UsuariosVidal WHERE IdUsuario = @IdUsuario');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/usuarios/profile:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token no válido o no proporcionado
 *       500:
 *         description: Error interno del servidor
 */
// Obtener perfil del usuario autenticado (ruta protegida)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('IdUsuario', sql.Int, req.user.IdUsuario)
      .query('SELECT IdUsuario, Nombre, Correo, FechaCreacion FROM UsuariosVidal WHERE IdUsuario = @IdUsuario');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
