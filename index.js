const express = require('express');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || process.env.WEBSITES_PORT || 3000;

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de UsuariosVidal',
      version: '1.0.0',
      description: 'API REST para gestión de usuarios con operaciones CRUD completas y sistema de autenticación'
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://spidersap.azurewebsites.net' 
          : `http://localhost:${PORT}`,
        description: process.env.NODE_ENV === 'production' 
          ? 'Servidor de producción en Azure' 
          : 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Ruta donde están las anotaciones
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Configuración de CORS para permitir acceso desde el frontend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'https://brave-ocean-018fd0810.6.azurestaticapps.net',
    'https://spidersap.azurewebsites.net'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Ruta para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API de UsuariosVidal funcionando - Documentación disponible en /api-docs - Deploy con Publish Profile ✅');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 