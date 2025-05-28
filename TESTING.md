# 🧪 Guía de Testing - Backend API UsuariosVidal

## 📋 Configuración de Testing

### **Tecnologías utilizadas:**
- **Jest** - Framework de testing
- **Supertest** - Testing de APIs HTTP
- **Mocks** - Simulación de base de datos y dependencias

## 🚀 Comandos de Testing

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch (se re-ejecutan al cambiar código)
npm run test:watch

# Ejecutar pruebas con reporte de coverage
npm run test:coverage
```

## 📁 Estructura de Tests

```
tests/
├── setup.js          # Configuración global de Jest
├── auth.test.js       # Pruebas de autenticación
└── usuarios.test.js   # Pruebas de CRUD de usuarios
```

## 🔍 Pruebas Implementadas

### **Autenticación (auth.test.js):**
- ✅ Registro de usuario exitoso
- ✅ Registro con campos faltantes
- ✅ Registro con usuario existente
- ✅ Login exitoso
- ✅ Login con credenciales inválidas
- ✅ Login con campos faltantes
- ✅ Verificación de token válido
- ✅ Verificación sin token
- ✅ Verificación con token inválido

### **Usuarios (usuarios.test.js):**
- ✅ Obtener todos los usuarios
- ✅ Manejo de errores de base de datos
- ✅ Obtener usuario por ID
- ✅ Usuario no encontrado (404)
- ✅ Crear nuevo usuario
- ✅ Actualizar usuario existente
- ✅ Actualizar usuario inexistente
- ✅ Eliminar usuario existente
- ✅ Eliminar usuario inexistente
- ✅ Obtener perfil de usuario autenticado

## 📊 Coverage Actual

```
File               | % Stmts | % Branch | % Funcs | % Lines
-------------------|---------|----------|---------|--------
routes/auth.js     |   88.46 |    78.26 |     100 |   88.46
routes/usuarios.js |   78.43 |       75 |   83.33 |   78.43
```

**Total: 19 pruebas pasando ✅**

## 🔧 Configuración de Mocks

### **Base de Datos:**
- Mock completo de `mssql`
- Simulación de conexiones y queries
- Respuestas controladas para cada test

### **Autenticación:**
- Mock de `bcrypt` para hashing
- Mock de `jsonwebtoken` para tokens
- Mock del middleware de autenticación

## 🎯 Integración con CI/CD

Las pruebas se ejecutan automáticamente en:

### **GitHub Actions:**
1. **Workflow principal** (`main_spidersap.yml`):
   - Se ejecuta en push a `main`
   - Incluye: ESLint → Tests → Deploy

2. **Workflow de calidad** (`lint.yml`):
   - Se ejecuta en push y pull requests
   - Incluye: ESLint → Tests

### **Flujo de CI/CD:**
```
Push/PR → Install → ESLint → Tests → Deploy (solo main)
```

## 🚨 Troubleshooting

### **Si las pruebas fallan:**
1. Verifica que todas las dependencias estén instaladas
2. Revisa que los mocks estén configurados correctamente
3. Asegúrate de que no hay conflictos de puertos

### **Si el coverage es bajo:**
1. Agrega más casos de prueba
2. Prueba casos edge (errores, validaciones)
3. Incluye pruebas de integración

## ✅ Buenas Prácticas Implementadas

- **Aislamiento:** Cada test es independiente
- **Mocks:** No dependemos de servicios externos
- **Coverage:** Medimos la cobertura de código
- **CI/CD:** Tests automáticos en cada commit
- **Descriptivos:** Nombres claros de tests
- **Setup/Teardown:** Limpieza entre tests

## 🔄 Agregar Nuevas Pruebas

Para agregar nuevas pruebas:

1. **Crea el archivo:** `tests/nombreModulo.test.js`
2. **Estructura básica:**
```javascript
const request = require('supertest');
const express = require('express');

describe('Nombre del Módulo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería hacer algo específico', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

3. **Ejecuta:** `npm test` para verificar

¡Las pruebas son fundamentales para mantener la calidad del código! 🎯 