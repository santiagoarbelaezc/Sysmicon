import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import './App.css';

import { Navbar } from './shared/navbar/Navbar';
import { Footer } from './shared/footer/Footer';
import { PwaInstallModal } from './shared/pwa-install-modal/PwaInstallModal';
import { CookieConsent } from './components/cookie-consent/CookieConsent';

import { Home } from './pages/home/Home';
import { ProyectosPage } from './pages/proyectos-page/ProyectosPage';
import { ProyectoDetalle } from './pages/proyecto-detalle/ProyectoDetalle';
import { AgendarCita } from './pages/agendar-cita/AgendarCita';
import { CotizaConNosotros } from './pages/cotiza-con-nosotros/CotizaConNosotros';
import { Nosotros } from './pages/nosotros/Nosotros';
import { LegalPage } from './pages/legal-page/LegalPage';
import { Login } from './pages/login/Login';
import { OlvideContrasena } from './pages/olvide-contrasena/OlvideContrasena';
import { AdminLayout } from './pages/admin/admin-layout/AdminLayout';

import { ProtectedRoute, GuestRoute } from './guards/RouteGuards';
import { useCmsService } from './services/cms.service';
import { useLoadingService } from './services/loading.service';
import { useProyectosService } from './services/proyectos.service';
import { analyticsService } from './services/analytics.service';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Sysmicon | Diseño y Construcción de Viviendas',
  '/proyectos': 'Galería de Proyectos | Portafolio Sysmicon',
  '/agendar-cita': 'Agendar Cita Privada | Consultoría Sysmicon',
  '/cotiza-con-nosotros': 'Cotiza con Nosotros | Sysmicon Arquitectura & Construcción',
  '/nosotros': 'Nosotros | Filosofía y Arquitectura Sysmicon',
  '/legal': 'Centro Legal & Transparencia | Sysmicon',
  '/login': 'Acceso Privado | Portal Sysmicon',
  '/olvide-mi-contrasena': 'Recuperar Contraseña | Portal Sysmicon',
  '/admin': 'Portal Directivo | Sysmicon Admin',
};

export const App: React.FC = () => {
  const location = useLocation();
  const { config } = useCmsService();
  const { isLoading, showTemporarily } = useLoadingService();
  const { proyectoModalActivo } = useProyectosService();

  useEffect(() => {
    const initialPath = window.location.pathname;
    if (initialPath.includes('/login') || initialPath.includes('/registro')) {
      showTemporarily(1100, 'Accediendo al Portal Privado...');
    } else if (initialPath.includes('/admin')) {
      showTemporarily(1100, 'Cargando Panel del Dashboard...');
    }

    try {
      AOS.init({
        duration: 900,
        once: false,
        easing: 'ease-out-cubic',
        offset: 60,
        delay: 0,
        mirror: false,
      });
      if (typeof document !== 'undefined') {
        document.body.classList.add('aos-ready');
      }
    } catch (e) {
      console.warn('AOS initialization warning:', e);
    }
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/proyecto/')) {
      document.title = 'Dossier de Proyecto | Sysmicon Studio';
    } else if (ROUTE_TITLES[path]) {
      document.title = ROUTE_TITLES[path];
    } else {
      document.title = 'Sysmicon | Diseño y Construcción de Viviendas';
    }

    analyticsService.track(path);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      try {
        AOS.refresh();
      } catch {}
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const showNavbar =
    !location.pathname.includes('/proyecto/') &&
    !proyectoModalActivo &&
    !location.pathname.includes('/admin') &&
    !location.pathname.includes('/olvide-mi-contrasena');

  const showFooter =
    !location.pathname.includes('/proyecto/') &&
    !location.pathname.includes('/login') &&
    !location.pathname.includes('/registro') &&
    !location.pathname.includes('/admin') &&
    !location.pathname.includes('/olvide-mi-contrasena');

  return (
    <>
      <div className="app-layout">
        {/* BANNER GLOBAL DE COMUNICADOS (CONFIGURABLE DESDE EL DASHBOARD) */}
        {config.mostrar_banner_alerta === '1' && config.texto_banner_alerta && (
          <div className="w-full bg-neutral-950 text-white text-xs sm:text-sm font-sans py-2.5 px-4 text-center border-b border-white/10 relative z-50 flex items-center justify-center gap-3 animate-fade-in shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="font-medium tracking-wide">{config.texto_banner_alerta}</span>
          </div>
        )}

        {showNavbar && <Navbar />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/proyectos" element={<ProyectosPage />} />
            <Route path="/proyecto/:id" element={<ProyectoDetalle />} />
            <Route path="/agendar-cita" element={<AgendarCita />} />
            <Route path="/agendar" element={<Navigate to="/agendar-cita" replace />} />
            <Route path="/cotiza-con-nosotros" element={<CotizaConNosotros />} />
            <Route path="/crea-tu-diseno" element={<Navigate to="/cotiza-con-nosotros" replace />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Navigate to="/cotiza-con-nosotros" replace />} />
            <Route path="/legal" element={<LegalPage />} />

            {/* Rutas de Autenticación (con GuestGuard) */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route path="/registro" element={<Navigate to="/login" replace />} />
            <Route path="/olvide-mi-contrasena" element={<OlvideContrasena />} />

            {/* Ruta Privada de Administración (Protegida estrictamente con ProtectedRoute) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {showFooter && <Footer />}
      </div>

      <PwaInstallModal />
      <CookieConsent />

      {/* PANTALLA DE CARGA ELEGANTE SYSMICON */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#060606]/98 backdrop-blur-2xl flex flex-col items-center justify-center z-[999999] animate-fade">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          ></div>

          <div
            className="absolute w-[450px] h-[450px] rounded-full bg-wood-accent/10 blur-[130px] pointer-events-none animate-pulse"
            style={{ animationDuration: '4s' }}
          ></div>

          <div className="flex flex-col items-center justify-center max-w-md text-center select-none relative z-10 px-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border border-white/10 border-t-wood-accent animate-spin"
                style={{ animationDuration: '2s' }}
              ></div>
              <div
                className="absolute w-28 h-28 rounded-full border border-dashed border-white/15 animate-spin"
                style={{ animationDuration: '5s', animationDirection: 'reverse' }}
              ></div>
              <div
                className="absolute w-20 h-20 rounded-full bg-wood-accent/15 animate-pulse"
                style={{ animationDuration: '2.5s' }}
              ></div>
              <img
                src="/assets/icons/logo-sysmico.png"
                alt="Sysmicon Logo"
                className="w-16 h-16 object-contain relative z-10 filter drop-shadow-[0_0_20px_rgba(212,175,55,0.6)] animate-pulse"
                style={{ animationDuration: '2s' }}
              />
            </div>

            <div className="mt-8 w-40 h-[2px] bg-white/10 rounded-full mx-auto overflow-hidden relative shadow-inner">
              <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-wood-accent to-transparent animate-progress"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
