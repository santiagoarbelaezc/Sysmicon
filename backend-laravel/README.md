<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=120&section=header&animation=fadeIn" />
</div>

<h1 align="center">⚙️ Sysmicon Backend (Laravel 12 + CRM + API REST)</h1>

<h3 align="center">🚀 API REST Empresarial con Pipeline Comercial y Aislamiento de Seguridad</h3>

<p align="center">
  Backend moderno desarrollado en Laravel 12 con PHP 8.2+. Integra autenticación JWT con sesión absoluta de 12 horas, cookies HttpOnly SameSite=Strict, doble guard de aislamiento (Staff interno vs Portal de Clientes), CRM completo para obras arquitectónicas, radicación pública de PQRs y optimización multimedia en Cloudinary.
</p>

---

## 🔧 Stack Tecnológico

<div align="center">
  <img src="https://img.shields.io/badge/Laravel-12.0-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/PHP-8.2%20%7C%208.5-777BB4?style=for-the-badge&logo=php&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/MySQL-Hostinger-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/JWT-HS256-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Cloudinary-SDK%20v3-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
</div>

---

## 🛡️ Características Clave de Seguridad

- **Sesión de 12 Horas**: Access token de 15 minutos en memoria y refresh token rotativo en cookie `HttpOnly; SameSite=Strict`. Expiración absoluta a las 12 horas desde el login.
- **Doble Guard**:
  - `staff` (`Usuario`): Administradores, arquitectos y comerciales con acceso al panel y CRM.
  - `cliente` (`CuentaCliente`): Registro público para novedades de obras; **bloqueado con 403 en todas las rutas administrativas**.
- **Bloqueo Progresivo**: Protección contra ataques de fuerza bruta (15 min → 1 h → 24 h).
- **2FA TOTP**: Autenticación en dos pasos obligatoria para administradores con códigos de recuperación de un solo uso.
- **Regla de Autoprotección**: Un administrador autenticado no puede desactivar ni eliminar su propia cuenta activa.

---

## 💼 Módulos CRM Integrados

- **Clientes & Contactos**: Directorio de clientes personas o empresas con contactos vinculados.
- **Pipeline Kanban**: Oportunidades comerciales clasificadas por etapas (`contacto`, `visita`, `propuesta`, `negociacion`, `ganado`, `perdido`).
- **Conversión Automática**: Al pasar una oportunidad a `ganado`, se genera automáticamente un `Proyecto` de obra vinculado.
- **Propuestas**: Consecutivos anuales autoincrementales (`PRO-2026-XXXX`).
- **Hitos & Avance**: Cálculo de porcentaje de cumplimiento en obras.
- **Bitácora & Tareas**: Historial cronológico y calendario de seguimientos.

---

## 🚀 Cómo ejecutar en desarrollo

### 1. Requisitos
- **PHP** >= 8.2 (extensiones: pdo, pdo_mysql, mbstring, openssl, curl).
- **Composer** >= 2.0.

### 2. Instalación y configuración
```bash
cd backend-laravel
composer install
cp .env.example .env
php artisan key:generate
# Configurar JWT_SECRET, DB_* y Cloudinary en .env
php artisan migrate --seed
```

### 3. Ejecutar pruebas automatizadas (27 tests, 132 aserciones)
```bash
php artisan test
```

### 4. Servidor local
```bash
php artisan serve
# API disponible en: http://localhost:8000/api/v1
```

### 5. Migrar datos existentes desde backend PHP puro
```bash
php artisan sysmicon:migrar-php-puro --database=nombre_bd_antigua
```

---

## 👨‍💻 Desarrollador

<div align="center">
  <strong>Santiago Arbelaez Contreras</strong><br>
  Junior Full Stack Developer<br>
  Estudiante de Ingeniería de Sistemas – Universidad del Quindío
  <br><br>
  <a href="https://github.com/santiagoarbelaezc">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <img width="10" />
  <a href="https://www.linkedin.com/in/santiago-arbelaez-contreras-9830b5290/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <img width="10" />
  <a href="https://portfolio-santiagoa.web.app/portfolio">
    <img src="https://img.shields.io/badge/Portfolio-6C63FF?style=for-the-badge&logo=sparkles&logoColor=white" />
  </a>
</div>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=90&section=footer&animation=fadeIn" />
</div>
