<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=120&section=header&animation=fadeIn" />
</div>

<h1 align="center">🏛️ Sysmicon - Frontend SPA & PWA</h1>

<h3 align="center">🚀 Plataforma Web Progresiva en Angular 18 para Arquitectura, Diseño y Construcción</h3>

<p align="center">
  Experiencia digital interactiva y de alto impacto visual para la firma <b>Sysmicon</b>.<br>
  Incluye catálogo de obras de ingeniería, cotizador inteligente con exportación PDF, diseño responsive PWA y panel administrativo completo.
</p>

---

## 📋 **Descripción del Proyecto**

El **Frontend de Sysmicon** es una Single Page Application (SPA) convertida en Progressive Web App (PWA), construida sobre el ecosistema moderno de **Angular 18**. Ofrece una interfaz de usuario minimalista y fluida orientada al sector del diseño arquitectónico, remodelación y construcción civil.

Integra componentes standalone, animaciones por scroll (AOS), diseño con utilidades TailwindCSS, soporte offline y un **Dashboard Administrativo Privado** para la gestión de contenido, usuarios y telemetría de interacción.

> 📱 **PWA Habilitada:** Aplicación instalable en dispositivos móviles y de escritorio mediante Service Worker y Web App Manifest.

---

## 🏗️ **Dashboard Administrativo**

El panel de administración privado (`/admin`) permite a la dirección de Sysmicon gestionar de forma autónoma:
- **Gestión de Proyectos:** Creación, edición, categorización y carga de fotografías en alta resolución.
- **Control de Usuarios & Seguridad:** Alta y baja de roles de administración con protección nativa contra autoeliminación.
- **Telemetría & Analítica:** Seguimiento de visualizaciones, clics en cotizaciones e interacciones clave.
- **Bandeja de Mensajes:** Monitoreo y respuesta de solicitudes de contacto de potenciales clientes.

---

## 🔧 **Stack Tecnológico**

### **Core Frontend**
<div align="center">
  <img src="https://img.shields.io/badge/Angular-18.2-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/PWA-Service_Worker-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" />
</div>

### **Estilos & UI / UX**
<div align="center">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/AOS-Animate_On_Scroll-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/jsPDF-4.2-FF5722?style=for-the-badge&logo=adobe-acrobat-reader&logoColor=white" />
</div>

### **Entorno & Alojamiento**
<div align="center">
  <img src="https://img.shields.io/badge/Apache_SPA-RewriteRules-D22128?style=for-the-badge&logo=apache&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Hostinger-Production-673DE6?style=for-the-badge&logo=hostinger&logoColor=white" />
</div>

---

## 🌟 **Funcionalidades Destacadas**

### **📐 Cotizador Arquitectónico Inteligente**
- Cálculo dinámico de costos estimados según metraje cuadrado, tipo de obra (habitacional, comercial, remodelación) y acabados.
- Generación y descarga instantánea de cotizaciones formales en formato **PDF** mediante `jsPDF`.

### **🖼️ Showcase de Portafolio & Proyectos**
- Visualización en cuadrícula interactiva con filtros por categorías (Residencial, Comercial, Planos, Urbanismo).
- Vista en detalle con galería de imágenes optimizadas y ficha técnica descriptiva.

### **📲 Modo PWA & Experiencia Offline**
- Banner y modal de instalación personalizado para Android, iOS y navegadores de escritorio.
- Almacenamiento en caché de assets estáticos y fuentes Exo 2 para visualización instantánea.

---

## 📂 **Estructura Modular del Código**

```text
frontend/src/app/
├── components/          # Bloques visuales reutilizables (banners, galerías, modales)
├── guards/              # Guards de navegación (AuthGuard, AdminGuard)
├── models/              # Interfaces y contratos de datos TypeScript
├── pages/               # Vistas principales (Inicio, Portafolio, Detalle, Cotizador)
│   └── admin/           # Dashboard privado (Usuarios, Analítica, Proyectos, CMS)
├── pipes/               # Transformadores de datos (optimización de imágenes)
├── services/            # Lógica de negocio y consumo HTTP del API Bridge
└── shared/              # Elementos globales (Navbar, Footer, Hero Video, Modales)
```

---

## 🚀 **Cómo ejecutar el Frontend en Local**

### 1. Prerrequisitos
- Node.js 20.x o superior.
- NPM 10.x o superior.
- Angular CLI (`npm install -g @angular/cli@18`).

### 2. Instalación de Dependencias
```bash
cd frontend
npm ci
```

### 3. Configuración de Entornos
Los archivos de configuración se encuentran en `src/environments/`:
- `environment.ts`: Apunta a la API local (`http://localhost:8000`).
- `environment.prod.ts`: Apunta al API Bridge de producción (`/backend_php`).

### 4. Servidor de Desarrollo
```bash
ng serve
```
Abre tu navegador en `http://localhost:4200/`. La aplicación se recargará automáticamente al detectar cambios en el código fuente.

### 5. Compilación para Producción
```bash
ng build --configuration production
```
Los artefactos compilados y optimizados se generarán en la carpeta `dist/frontend/browser/`.

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
