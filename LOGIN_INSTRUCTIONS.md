# 🔐 Sistema de Autenticación - API UsuariosVidal

## 📋 Endpoints de Autenticación

### 1. **Registro de Usuario**
```
POST /api/auth/register
```

**Body (JSON):**
```json
{
  "Nombre": "Juan Pérez",
  "Correo": "juan@email.com",
  "Contrasena": "miContraseñaSegura123"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "usuario": {
    "IdUsuario": 1,
    "Nombre": "Juan Pérez",
    "Correo": "juan@email.com",
    "FechaCreacion": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. **Login de Usuario**
```
POST /api/auth/login
```

**Body (JSON):**
```json
{
  "Correo": "juan@email.com",
  "Contrasena": "miContraseñaSegura123"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "IdUsuario": 1,
    "Nombre": "Juan Pérez",
    "Correo": "juan@email.com",
    "FechaCreacion": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. **Verificar Token**
```
GET /api/auth/verify
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta exitosa (200):**
```json
{
  "message": "Token válido",
  "usuario": {
    "IdUsuario": 1,
    "Correo": "juan@email.com",
    "Nombre": "Juan Pérez"
  }
}
```

### 4. **Perfil de Usuario (Ruta Protegida)**
```
GET /api/usuarios/profile
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔒 Características de Seguridad

- **Contraseñas hasheadas** con bcrypt (salt rounds: 10)
- **JWT tokens** con expiración de 24 horas
- **Validación de datos** en todos los endpoints
- **Verificación de usuarios únicos** por correo electrónico
- **Middleware de autenticación** para rutas protegidas

## 🚀 Cómo usar en tu Frontend

### 1. **Registro/Login**
```javascript
// Registro
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    Nombre: 'Juan Pérez',
    Correo: 'juan@email.com',
    Contrasena: 'miContraseña123'
  })
});

// Login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    Correo: 'juan@email.com',
    Contrasena: 'miContraseña123'
  })
});

const data = await loginResponse.json();
const token = data.token; // Guardar este token
```

### 2. **Usar el token en peticiones protegidas**
```javascript
const response = await fetch('http://localhost:3000/api/usuarios/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 📝 Códigos de Estado HTTP

- **200**: Operación exitosa
- **201**: Usuario creado exitosamente
- **400**: Datos inválidos o usuario ya existe
- **401**: Credenciales inválidas o token expirado
- **403**: Token inválido
- **404**: Usuario no encontrado
- **500**: Error interno del servidor

## 🔧 Variables de Entorno Requeridas

Asegúrate de tener estas variables en tu archivo `.env`:

```
JWT_SECRET=tu_clave_secreta_jwt_super_segura_y_larga
DB_USER=tu_usuario_sql_server
DB_PASSWORD=tu_contraseña_sql_server
DB_SERVER=tu_servidor_sql_server
DB_DATABASE=tu_base_de_datos
```

## 📖 Documentación Swagger

Toda la documentación está disponible en: `http://localhost:3000/api-docs`

¡Ahí puedes probar todos los endpoints directamente desde el navegador! 