const express = require('express');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de UsuariosVidal',
      version: '1.0.0',
      description: 'API REST para gestión de usuarios con operaciones CRUD completas'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desarrollo'
      }
    ],
  },
  apis: ['./routes/*.js'], // Ruta donde están las anotaciones
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(cors());
app.use(express.json());

// Ruta para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/usuarios', usuariosRoutes);

app.get('/', (req, res) => {
  res.send('API de UsuariosVidal funcionando - Documentación disponible en /api-docs');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 