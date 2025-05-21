const express = require('express');
const router = express.Router();
const { sql, config } = require('../db');

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

module.exports = router; 