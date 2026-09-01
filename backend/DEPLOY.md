# 🚀 Guía de Despliegue — Backend Sysmicon

## Requisitos en el servidor Hostinger
- PHP >= 8.1 (verificar en cPanel → PHP Version)
- MySQL 5.7 / 8.0 (ya disponible)
- `mod_rewrite` activo (ya activo en Hostinger)
- Composer instalado (o subir el `vendor/` generado localmente)

---

## Paso 1 — Instalar Composer localmente (si no lo tienes)

1. Descarga el instalador de [getcomposer.org/download](https://getcomposer.org/download/)
2. Ejecuta el instalador `.exe` para Windows
3. Reinicia la terminal

Luego, dentro de `Sysmicon/backend/`:
```bash
composer install --no-dev --optimize-autoloader
```

Esto genera la carpeta `vendor/`.

---

## Paso 2 — Crear las tablas en MySQL

1. Accede a phpMyAdmin en Hostinger:  
   **https://auth-db1885.hstgr.io/index.php?db=u870397049_sysmiconbeta**
2. Selecciona la base de datos `u870397049_sysmiconbeta`
3. Ve a la pestaña **SQL**
4. Pega el contenido de `database/schema.sql` y ejecuta

---

## Paso 3 — Subir archivos al servidor

Sube vía **FTP (FileZilla)** o el **Administrador de Archivos de cPanel** toda la carpeta `backend/` al servidor.

**Ubicación recomendada:**
- Si el frontend va en `public_html/` → sube el backend a `public_html/api/`
- Si tienes subdominio `api.sysmicon.com` → sube a su `document_root`

> ⚠️ **NO subas el archivo `.env`** — es solo local. Crea uno nuevo en el servidor.

---

## Paso 4 — Crear el `.env` en el servidor

En el servidor, crea el archivo `.env` en la raíz del backend con los valores reales (copia `.env.example` y rellena).

**En cPanel → Administrador de Archivos** puedes crear el archivo directamente.

---

## Paso 5 — Ejecutar el seed (crear usuario admin)

Con SSH de Hostinger (o desde cPanel → Terminal):
```bash
cd /home/u870397049/public_html/api
php database/seed.php
```

Salida esperada:
```
✅ Usuario admin creado exitosamente.
   Email    : adminsysmi@sysmicon.com
   Contraseña: Sysmicon-123
   Rol      : admin
```

---

## Paso 6 — Actualizar la URL del API en el frontend

En `frontend/src/environments/environment.prod.ts`, actualiza `apiUrl` con la URL real:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://sysmicon.com/api',  // ← ajustar según tu configuración
};
```

---

## Paso 7 — Verificar que el backend funciona

Abre en el navegador:
```
https://sysmicon.com/api/health
```

Respuesta esperada:
```json
{
  "success": true,
  "data": { "status": "ok", "service": "Sysmicon API", "timestamp": "..." }
}
```

---

## Estructura final en el servidor

```
public_html/
├── (archivos del frontend Angular compilado)
└── api/
    ├── .env              ← SOLO en el servidor, nunca en Git
    ├── .htaccess
    ├── index.php
    ├── composer.json
    ├── vendor/           ← generado por composer install
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── helpers/
    └── database/
```

---

## Credenciales del Panel Admin

| Campo | Valor |
|-------|-------|
| URL Admin | `/admin` |
| Email | `adminsysmi@sysmicon.com` |
| Contraseña | `Sysmicon-123` |

