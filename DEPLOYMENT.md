# 🚀 Guía de Deployment - Backend API UsuariosVidal

## 📋 Configuración Previa

### 1. **Secrets de GitHub configurados** ✅
Según las imágenes, ya tienes configurados estos secrets:
- `AZUREAPPSERVICE_CLIENTID_A25C05_SPIDERSAP_ADMIN`
- `AZUREAPPSERVICE_TENANTID_A25C05_SPIDERSAP_ADMIN` 
- `AZUREAPPSERVICE_SUBSCRIPTIONID_A25C05_SPIDERSAP_ADMIN`

### 2. **Variables de entorno en Azure**
Debes configurar estas variables en tu Azure Web App:

```
DB_SERVER=sql18020.site4now.net
DB_DATABASE=db_a25c05_spidersap
DB_USER=db_a25c05_spidersap_admin
DB_PASSWORD=cuccus-nahti9-dodPam
DB_ENCRYPT=true
JWT_SECRET=spidersap
ALLOWED_ORIGINS=https://brave-ocean-018fd0810.6.azurestaticapps.net,https://spidersap.azurewebsites.net
NODE_ENV=production
```

## 🔧 Pasos para el Deployment

### 1. **Commit y Push**
```bash
git add .
git commit -m "Configure Azure deployment"
git push origin main
```

### 2. **El pipeline se ejecutará automáticamente**
- Se activará con el push a la rama `main`
- Construirá la aplicación
- Desplegará a Azure Web App

### 3. **Verificar el deployment**
- URL del backend: `https://spidersap.azurewebsites.net`
- Documentación Swagger: `https://spidersap.azurewebsites.net/api-docs`

## 📁 Archivos de Configuración Creados

- `.github/workflows/main_spidersap.yml` - Pipeline de GitHub Actions
- `web.config` - Configuración de IIS para Azure
- `package.json` - Actualizado con scripts y engines
- `DEPLOYMENT.md` - Esta guía

## 🔍 Endpoints Disponibles

Una vez desplegado, estos endpoints estarán disponibles:

### **Autenticación:**
- `POST https://spidersap.azurewebsites.net/api/auth/register`
- `POST https://spidersap.azurewebsites.net/api/auth/login`
- `GET https://spidersap.azurewebsites.net/api/auth/verify`

### **Usuarios:**
- `GET https://spidersap.azurewebsites.net/api/usuarios`
- `GET https://spidersap.azurewebsites.net/api/usuarios/:id`
- `POST https://spidersap.azurewebsites.net/api/usuarios`
- `PUT https://spidersap.azurewebsites.net/api/usuarios/:id`
- `DELETE https://spidersap.azurewebsites.net/api/usuarios/:id`
- `GET https://spidersap.azurewebsites.net/api/usuarios/profile` (protegida)

## 🛠️ Configuración de Variables de Entorno en Azure

1. Ve a tu Azure Web App `spidersap`
2. En el menú lateral, busca **"Configuration"**
3. En **"Application settings"**, agrega cada variable:

| Name | Value |
|------|-------|
| `DB_SERVER` | `sql18020.site4now.net` |
| `DB_DATABASE` | `db_a25c05_spidersap` |
| `DB_USER` | `db_a25c05_spidersap_admin` |
| `DB_PASSWORD` | `cuccus-nahti9-dodPam` |
| `DB_ENCRYPT` | `true` |
| `JWT_SECRET` | `spidersap` |
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGINS` | `https://brave-ocean-018fd0810.6.azurestaticapps.net,https://spidersap.azurewebsites.net` |

4. Haz clic en **"Save"**
5. La aplicación se reiniciará automáticamente

## 🔗 Integración con Frontend

Tu frontend en `https://brave-ocean-018fd0810.6.azurestaticapps.net` podrá conectarse al backend usando:

```javascript
const API_BASE_URL = 'https://spidersap.azurewebsites.net';

// Ejemplo de login
const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    Correo: 'usuario@email.com',
    Contrasena: 'contraseña123'
  })
});
```

## 🚨 Troubleshooting

### Si el deployment falla:
1. Revisa los logs en GitHub Actions
2. Verifica que todos los secrets estén configurados
3. Asegúrate de que las variables de entorno estén en Azure

### Si la API no responde:
1. Verifica las variables de entorno en Azure
2. Revisa los logs de la aplicación en Azure Portal
3. Confirma que la base de datos esté accesible

## ✅ Checklist Final

- [ ] Secrets de GitHub configurados
- [ ] Variables de entorno en Azure configuradas  
- [ ] Código pusheado a la rama `main`
- [ ] Pipeline ejecutado exitosamente
- [ ] API respondiendo en `https://spidersap.azurewebsites.net`
- [ ] Swagger disponible en `/api-docs`
- [ ] Frontend puede conectarse al backend 