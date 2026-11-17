<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=120&section=header&animation=fadeIn" />
</div>

<h1 align="center">🏛️ Arquitectura Frontend - Sysmicon (React 18 + Vite 6 + TypeScript)</h1>

<h3 align="center">⚡ Migración Técnica de Alto Rendimiento: De Angular 18 a React 18 Modular</h3>

<p align="center">
  Documentación integral de arquitectura de software, gestión de estado reactivo, flujo de autenticación JWT con auto-refresh, capas de servicio, componentes UI y directrices de seguridad para la nueva versión de <strong>Sysmicon Web</strong>.
</p>

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Vite-6.0.11-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Lucide--React-Icons-F43F5E?style=for-the-badge&logo=lucide&logoColor=white" />
</div>

---

## 📑 Tabla de Contenidos

1. [Visión General & Objetivos](#-visión-general--objetivos)
2. [Estructura del Proyecto](#-estructura-del-proyecto)
3. [Gestión de Estado Reactivo (Signals System)](#-gestión-de-estado-reactivo-signals-system)
4. [Capa de Red & Autenticación JWT](#-capa-de-red--autenticación-jwt)
5. [Enrutamiento y Guardas de Seguridad](#-enrutamiento-y-guardas-de-seguridad)
6. [Regla de Autoprotección del Administrador](#-regla-de-autoprotección-del-administrador)
7. [Arquitectura de Componentes & Vistas](#-arquitectura-de-componentes--vistas)
8. [Diseño, Tipografía & Animaciones](#-diseño-tipografía--animaciones)
9. [Optimización de Multimedia & PWA](#-optimización-de-multimedia--pwa)
10. [Seguridad y Gestión de Secretos](#-seguridad-y-gestión-de-secretos)
11. [Guía de Desarrollo y Construcción](#-guía-de-desarrollo-y-construcción)

---

## 🎯 Visión General & Objetivos

La migración a `frontend-react` fue concebida para:
- **Reducir drásticamente los tiempos de compilación y HMR** mediante el motor de **Vite 6** con Rollup/esbuild.
- **Mantener paridad funcional total** con la aplicación existente desarrollada en Angular 18 (rutas, diseño visual, estilos, animaciones y lógica de negocio).
- **Adoptar un modelo reactivo limpio** mediante *Signals* nativos (`useSyncExternalStore`), evitando la complejidad innecesaria de dependencias pesadas como Redux o MobX.
- **Garantizar resiliencia y desacoplamiento** con el backend PHP (Laravel/Slim o Custom Router) en Apache/Hostinger.

---

## 📂 Estructura del Proyecto

El código fuente reside en `frontend-react/` con una estructura modular inspirada en Domain-Driven Design (DDD):

```
frontend-react/
├── public/                     # Archivos estáticos directos (manifest, iconos, fuentes, videos)
│   ├── assets/                 # Fuentes Exo 2, logos corporativos, videos locales
│   ├── images/                 # Mockups de proyectos de arquitectura y renders
│   ├── manifest.webmanifest    # Manifiesto de PWA
│   └── .htaccess               # Enrutamiento SPA en servidores Apache
├── src/
│   ├── components/             # Componentes UI de catálogo y landing pública
│   │   ├── architectural-scroll-block/
│   │   ├── banner-crearplano/
│   │   ├── banner-video/
│   │   ├── button/
│   │   ├── contact-steps/
│   │   ├── cookie-consent/
│   │   ├── director-showcase/
│   │   ├── mission-section/
│   │   ├── photo-collage/
│   │   ├── photo-duo-gallery/
│   │   ├── project-card/
│   │   ├── projects/
│   │   ├── service-card/
│   │   ├── services-section/
│   │   ├── testimonial-card/
│   │   └── testimonios/
│   ├── core/                   # Núcleo de la aplicación
│   │   ├── apiClient.ts        # Cliente HTTP Axios-like con auto-refresh de JWT
│   │   ├── app.constants.ts    # Claves de almacenamiento y constantes globales
│   │   ├── env.ts              # Adaptador de variables de entorno (VITE_API_URL)
│   │   └── signal.ts           # Implementación ligera de Signals con useSyncExternalStore
│   ├── guards/
│   │   └── RouteGuards.tsx     # ProtectedRoute, GuestRoute, RequireAdmin
│   ├── models/                 # Tipos e interfaces TypeScript
│   │   ├── contacto.model.ts
│   │   ├── cotizacion.model.ts
│   │   ├── proyecto.model.ts
│   │   ├── servicio.model.ts
│   │   └── testimonio.model.ts
│   ├── pages/                  # Vistas y páginas de la aplicación
│   │   ├── admin/              # Módulo administrativo protegido
│   │   │   ├── admin-layout/   # Shell administrativo (Sidebar + Header + Outlet)
│   │   │   └── views/          # Subvistas (DashInicio, DashAnaliticas, DashMensajes, etc.)
│   │   ├── agendar-cita/
│   │   ├── cotiza-con-nosotros/
│   │   ├── crea-tu-diseno/
│   │   ├── home/
│   │   ├── legal-page/
│   │   ├── login/
│   │   ├── nosotros/
│   │   ├── olvide-contrasena/
│   │   ├── proyecto-detalle/
│   │   └── proyectos-page/
│   ├── services/               # Capa de consumo de API y orquestación
│   │   ├── admin.service.ts
│   │   ├── analytics.service.ts
│   │   ├── auth.service.ts
│   │   ├── cms.service.ts
│   │   ├── cookie-consent.service.ts
│   │   ├── cotizador.service.ts
│   │   ├── loading.service.ts
│   │   ├── proyectos.service.ts
│   │   ├── pwa.service.ts
│   │   ├── servicios.service.ts
│   │   └── testimonios.service.ts
│   ├── shared/                 # Componentes compartidos de layout global
│   │   ├── about/
│   │   ├── footer/
│   │   ├── hero/
│   │   ├── hero-video/
│   │   ├── navbar/
│   │   └── pwa-install-modal/
│   ├── utils/
│   │   └── optimizedImage.ts   # Helper para CDN Cloudinary f_auto,q_auto
│   ├── App.tsx                 # Enrutador principal y ciclo de vida global (AOS)
│   ├── index.css               # Estilos globales y capas de Tailwind
│   └── main.tsx                # Punto de entrada de ReactDOM
├── index.html                  # HTML raíz con preloads de fuentes y meta SEO
├── tailwind.config.js          # Paleta personalizada y fuentes
└── vite.config.ts              # Configuración de bundling y proxy dev
```

---

## ⚡ Gestión de Estado Reactivo (Signals System)

Para emular el comportamiento reactivo síncrono y predecible de los **Angular Signals** sin introducir dependencias pesadas, se implementó en `src/core/signal.ts` un patrón reactivo basado en la API nativa de React 18 `useSyncExternalStore`:

```typescript
export interface WritableSignal<T> {
  (): T;
  set(value: T): void;
  update(fn: (prev: T) => T): void;
}

export function createSignal<T>(initialValue: T): WritableSignal<T>
export function useSignalValue<T>(signal: WritableSignal<T>): T
```

### Ventajas Técnicas:
1. **Suscripción sin re-renders fantasma**: Cada componente que consume `useSignalValue(signal)` solo se vuelve a renderizar cuando el valor del store cambia por referencia.
2. **Acceso imperativo desde servicios**: Los servicios (`auth.service.ts`, `loading.service.ts`, etc.) pueden leer el valor en cualquier momento invocando `signal()` sin depender de un hook de React.
3. **Persistencia y sincronización inmediata**: Permite enlazar señales con `localStorage` y emitir eventos cross-tab sin desincronizaciones de UI.

---

## 🔒 Capa de Red & Autenticación JWT

La capa de comunicación HTTP reside en `src/core/apiClient.ts` y se compone de un cliente nativo con la siguiente arquitectura:

```
[Componente / Servicio]
        │
        ▼
   [apiClient] ─── Inyecta Header Authorization: Bearer <access_token>
        │
        ├─► [Respuesta OK (200)] ──► Devuelve Payload JSON
        │
        └─► [Error HTTP 401]
                 │
                 ├──► Encola peticiones concurrentes (refreshWaiters)
                 ├──► Llama a endpoint /auth/refresh con refresh_token
                 ├──► Si es exitoso: Actualiza tokens en Storage y reintenta cola
                 └──► Si falla: Limpia credenciales y despacha evento 'sysmicon-auth-logout'
```

### Características Clave:
- **Token Refresh Concurrente**: Si 5 peticiones simultáneas reciben un 401, solo se efectúa un único llamado al backend para refrescar el token; las otras 4 peticiones esperan en una cola de promesas (`refreshWaiters`) y se re-ejecutan de forma transparente con el nuevo Bearer token.
- **Wrapper RxJS-compatible (`httpClient`)**: Para los servicios migrados desde Angular, se implementó una interfaz con método `.subscribe({ next, error })` que respeta la semántica previa facilitando la migración y reduciendo el riesgo de regresiones.

---

## 🛡️ Enrutamiento y Guardas de Seguridad

Las rutas y el control de acceso se orquestan en `src/guards/RouteGuards.tsx` utilizando `react-router-dom`:

| Guarda | Propósito | Comportamiento si no cumple |
| :--- | :--- | :--- |
| `<ProtectedRoute />` | Protege áreas que requieren usuario autenticado. | Redirige inmediatamente a `/login`. |
| `<RequireAdmin />` | Protege el portal administrativo (`/admin/*`). | Si no es admin, redirige a `/` con acceso restringido. |
| `<GuestRoute />` | Impide que un usuario ya logueado acceda a `/login` u `/olvide-contrasena`. | Redirige al dashboard `/admin` o al Home. |

---

## 👑 Regla de Autoprotección del Administrador

En el componente de gestión de cuentas `src/pages/admin/views/dash-usuarios/DashUsuarios.tsx`, se implementó de forma rigurosa la **Regla de Autoprotección del Administrador Activo**:

> ⚠️ **Principio de Seguridad**: Ningún administrador autenticado puede degradarse de rol a sí mismo ni eliminar su propia cuenta desde el panel de control. Esto previene bloqueos accidentales irreversibles del sistema administrativo.

```typescript
// Detección automática del usuario en sesión
const currentAdminId = authService.currentUser()?.id;

// Evaluación en lista de usuarios
const isSelf = user.id === currentAdminId;

// Los botones de acción de auto-eliminación o cambio de rol se inhabilitan visualmente:
<button
  disabled={isSelf}
  title={isSelf ? "No puedes modificar tu propia cuenta activa" : "Cambiar rol"}
  className={isSelf ? "opacity-30 cursor-not-allowed" : "hover:text-amber-500"}
>
```

---

## 🎨 Arquitectura de Componentes & Vistas

### 1. Vistas Públicas
- **Home**: Banner de alto impacto visual con video de fondo, bloque de misión, director showcase, collage arquitectónico interactivo y testimonios con valoraciones dinámicas.
- **Proyectos**: Catálogo con filtrado por categorías (Residencial, Comercial, Planos, Remodelación), vista de cuadrícula y modal lightbox de imágenes en alta resolución.
- **Cotizador & Diseñador de Planos**: Formularios interactivos por etapas con cálculo dinámico estimado y exportación / visualización de requerimientos arquitectónicos.
- **Nosotros**: Narrativa de la firma, valores corporativos y timeline interactivo.
- **Legal**: Términos y condiciones, políticas de privacidad y aviso de cookies conforme a regulaciones vigentes.

### 2. Portal Administrativo (`/admin`)
- **Dashboard Inicio**: Métricas de rendimiento, accesos rápidos y estado del sistema.
- **Analíticas**: Gráficos de tendencias, conteos de visitas y fuentes de tráfico.
- **Mensajes**: Bandeja de entrada de solicitudes de contacto y cotizaciones recibidas con filtros de estado.
- **Personalizar (CMS)**: Edición en tiempo real de contenidos de la web (títulos, descripciones, banners).
- **Usuarios**: Control de acceso de usuarios y roles con la regla de autoprotección activa.

---

## 🖌️ Diseño, Tipografía & Animaciones

- **TailwindCSS**: Tokens de diseño personalizados con la paleta de Sysmicon:
  - Primarios: `slate-950` (obsidiana base), `slate-900` (superficies elevadas), `slate-800` (bordes y divisores).
  - Acentos: `amber-500` / `amber-400` (dorado arquitectónico de alta gama).
- **Tipografía Exo 2**: Integrada localmente en `/assets/fonts/exo2/` para cero dependencia externa de CDN y máxima velocidad de renderizado de fuentes sin FOUT/FOIT.
- **AOS (Animate On Scroll)**: Inicializado centralizadamente en `App.tsx` con soporte para transiciones fluidas de 700ms y `once: true`.
- **Lucide React**: Reemplazo tipográfico de iconos por SVGs puros e inline, reduciendo el bundle size y mejorando la accesibilidad (a11y).

---

## 📱 Optimización de Multimedia & PWA

### Cloudinary Smart Delivery
En `src/utils/optimizedImage.ts`, las URLs de imágenes se transforman automáticamente para optimizar ancho de banda:
- `f_auto`: Selecciona automáticamente WebP o AVIF según el soporte del navegador.
- `q_auto`: Comprime inteligentemente la imagen manteniendo la nitidez arquitectónica.

### PWA (Progressive Web App)
- `manifest.webmanifest`: Definición de tema (`#0a0f1d`), orientación y logos adaptativos.
- `pwa.service.ts`: Captura del evento de navegador `beforeinstallprompt` y detección de plataformas (iOS standalone, Chrome/Edge, Android).
- `PwaInstallModal.tsx`: Experiencia personalizada de instalación en pantalla completa para usuarios móviles y de escritorio.

---

## 🔐 Seguridad y Gestión de Secretos

1. **Variables de entorno estrictas**:
   - Variables públicas del cliente deben incluir el prefijo `VITE_` (ej. `VITE_API_URL`).
   - Los archivos `.env`, `.env.development` y `.env.production` están rigurosamente ignorados en `.gitignore` tanto en la raíz como en el subdirectorio de frontend.
2. **Cero exposición de credenciales**:
   - Ni contraseñas de producción, ni tokens maestros, ni secretos de bases de datos están presentes en el frontend.
   - Todo token JWT se almacena de forma restringida y se renueva mediante canales autenticados.
3. **CI/CD Desacoplado**:
   - Los workflows de GitHub Actions cuentan con directivas `[skip ci]` y activación exclusivamente manual vía `workflow_dispatch` durante las fases de desarrollo local.

---

## 🚀 Guía de Desarrollo y Construcción

### Requisitos Previos
- **Node.js** v18+ o v20+ (LTS recomendado).
- **npm** v9+ o **pnpm**.

### 1. Instalación de dependencias
```bash
cd frontend-react
npm install
```

### 2. Ejecución en modo desarrollo (HMR ultra-rápido)
```bash
npm run dev
# Servidor local disponible en http://localhost:5173
```

### 3. Verificación de tipos y compilación para producción
```bash
npm run build
# Compila mediante TypeScript Compiler (tsc -b) y empaqueta en frontend-react/dist/
```

### 4. Previsualización del build de producción
```bash
npm run preview
# Servidor de preview local para validar el bundle generado
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
