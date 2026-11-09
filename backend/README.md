<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=120&section=header&animation=fadeIn" />
</div>

<h1 align="center">🏗️ Sysmicon - Backend API REST</h1>

<h3 align="center">🚀 API REST en PHP 8.3 con Arquitectura Segura de API Bridge y Aislamiento de Núcleo</h3>

<p align="center">
  Núcleo de servicios web para la plataforma de arquitectura, diseño y construcción <b>Sysmicon</b>.<br>
  Provee autenticación robusta mediante JWT, gestión de proyectos, cotizaciones dinámicas, subida multimedia a Cloudinary y telemetría de visitas.
</p>

---

## 📋 **Descripción del Proyecto**

El **Backend de Sysmicon** es una API REST modular desarrollada en **PHP 8.3** estructurada sin sobrecarga de frameworks pesados, optimizada para alto rendimiento y baja latencia en entornos de hosting compartido y servidores dedicados.

Implementa el patrón de diseño **API Bridge**, asegurando que el código fuente, dependencias (`vendor/`) y credenciales sensibles (`.env`) residan **100% aislados fuera de la raíz pública (`public_html`)**, mitigando riesgos de acceso no autorizado y escaneo de vulnerabilidades web.

> 🛡️ **Seguridad del Núcleo:** Los archivos ejecutables críticos y variables de entorno residen en un directorio privado con permisos restringidos (`600`/`755`).

---

## 🔧 **Stack Tecnológico**

### **Motor & Lenguaje**
<div align="center">
  <img src="https://img.shields.io/badge/PHP-8.3-777BB4?style=for-the-badge&logo=php&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Composer-2.x-885630?style=for-the-badge&logo=composer&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/JWT-Firebase_6.10-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" />
</div>

### **Persistencia & Almacenamiento Multimedia**
<div align="center">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/PDO-Prepared_Statements-005C84?style=for-the-badge&logo=database&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Cloudinary-SDK_2.13-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
</div>

### **Infraestructura & Servidor Web**
<div align="center">
  <img src="https://img.shields.io/badge/Apache-2.4-D22128?style=for-the-badge&logo=apache&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Hostinger-Cloud_Shared-673DE6?style=for-the-badge&logo=hostinger&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/API_Bridge-Architecture-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
</div>

---

## 🏛️ **Arquitectura de Seguridad: API Bridge**

El backend opera mediante delegación de flujo desacoplada:

```
Petición Web (HTTPS)
       │
       ▼
[public_html/backend_php/index.php]   ───► [API Bridge Público]
       │
       ├── Valida existencia del núcleo
       └── Require dinámico seguro
             │
             ▼
[../sysmicon-backend/index.php]        ───► [Núcleo Privado Aislado]
       ├── Carga .env (Permisos 600)
       ├── Rutas & Middleware (Auth, Admin, CORS)
       ├── Controladores & Modelos
       └── Conexión a Base de Datos MySQL
```

---

## 📦 **Módulos y Endpoints Principales**

| Módulo | Prefijo de Ruta | Descripción |
| :--- | :--- | :--- |
| **Autenticación** | `/backend_php/auth/*` | Inicio de sesión, validación de sesión con JWT y cierre seguro. |
| **Proyectos** | `/backend_php/proyectos/*` | CRUD completo de obras, planos, renders y etiquetas de diseño. |
| **Usuarios** | `/backend_php/usuarios/*` | Gestión de administradores con regla estricta de autoprotección. |
| **Contacto & PQRS** | `/backend_php/contacto/*` | Recepción de consultas, solicitudes de asesoría y formularios. |
| **Mensajes** | `/backend_php/mensajes/*` | Bandeja de entrada administrativa y cambio de estado de mensajes. |
| **Analítica** | `/backend_php/analytics/*` | Registro de impresiones, tráfico de usuarios y telemetría anónima. |
| **Configuración** | `/backend_php/config/*` | Parámetros globales del sistema, logos y textos institucionales. |
| **Salud del Sistema** | `/backend_php/health` | Diagnóstico de latencia, conectividad con MySQL y estado del API. |

---

## 🔒 **Seguridad y Reglas de Negocio**

- **Protección de Cuenta de Administrador**: Un usuario autenticado no puede eliminarse ni desactivarse a sí mismo, garantizando continuidad administrativa.
- **Consultas Preparadas con PDO**: Mitigación al 100% de inyecciones SQL (`SQLi`).
- **Cabeceras CORS Robustas**: Configuración centralizada de orígenes permitidos con soporte para solicitudes preflight `OPTIONS`.
- **Exclusión Estricta en Git**: Ningún archivo `.env`, certificado o directorio `vendor/` es versionado en el repositorio.

---

## 🚀 **Cómo ejecutar el Backend en Local**

### 1. Prerrequisitos
- PHP 8.1 o superior con extensiones habilitadas: `pdo`, `pdo_mysql`, `mbstring`, `curl`, `json`.
- Composer instalado globalmente.
- Servidor MySQL activo (XAMPP, Laragon o MySQL Server local).

### 2. Instalación de Dependencias
```bash
cd backend
composer install
```

### 3. Configuración del Entorno
Copia el archivo de ejemplo y ajusta las credenciales de tu base de datos local:
```bash
cp .env.example .env
```

Edita `.env`:
```env
DB_HOST=localhost
DB_NAME=sysmicon_db
DB_USER=root
DB_PASS=
JWT_SECRET=tu_clave_secreta_para_desarrollo_local
```

### 4. Ejecución del Servidor de Pruebas
Puedes iniciar el servidor embebido de PHP o usar el script incluido:
```bash
# Opción 1: Servidor embebido de PHP
php -S localhost:8000

# Opción 2: Script batch (Windows)
start-backend.bat
```

Endpoint de verificación:
```bash
curl http://localhost:8000/health
```

---

## 👨💻 **Desarrollador**

<div align="center">
<b>Santiago Arbelaez Contreras</b><br>
Junior Full Stack Developer<br>
Estudiante de Ingeniería de Sistemas – Universidad del Quindío

<br>
<a href="https://github.com/santiagoarbelaezc" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>
<img width="10" />
<a href="https://www.linkedin.com/in/santiago-arbelaez-contreras-9830b5290/" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>
<img width="10" />
<a href="https://portfolio-santiagoa.web.app/portfolio" target="_blank">
  <img src="https://img.shields.io/badge/Portfolio-6C63FF?style=for-the-badge&logo=sparkles&logoColor=white" />
</a>
</div>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=90&section=footer&animation=fadeIn" />
</div>
