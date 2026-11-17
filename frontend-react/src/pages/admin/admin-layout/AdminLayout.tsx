import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { adminService, useAdminService } from '../../../services/admin.service';

// Importación de las 5 vistas activas
import { DashInicio } from '../views/dash-inicio/DashInicio';
import { DashAnaliticas } from '../views/dash-analiticas/DashAnaliticas';
import { DashPersonalizar } from '../views/dash-personalizar/DashPersonalizar';
import { DashUsuarios } from '../views/dash-usuarios/DashUsuarios';
import { DashMensajes } from '../views/dash-mensajes/DashMensajes';

export type AdminSection = 'inicio' | 'analiticas' | 'personalizar' | 'usuarios' | 'mensajes';

function getInitialSection(): AdminSection {
  try {
    const saved = localStorage.getItem('sysmicon_admin_section') as AdminSection;
    const validSections: AdminSection[] = ['inicio', 'analiticas', 'personalizar', 'usuarios', 'mensajes'];
    return validSections.includes(saved) ? saved : 'inicio';
  } catch {
    return 'inicio';
  }
}

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { usuarios, mensajes } = useAdminService();

  const [seccionActiva, setSeccionActiva] = useState<AdminSection>(getInitialSection);
  const [sidebarAbierto, setSidebarAbierto] = useState<boolean>(true);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState<boolean>(false);

  useEffect(() => {
    adminService.cargarDatosReales();
  }, []);

  const setSeccion = (seccion: AdminSection) => {
    setSeccionActiva(seccion);
    try {
      localStorage.setItem('sysmicon_admin_section', seccion);
    } catch {}

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    }, 10);
  };

  const toggleSidebar = () => {
    setSidebarAbierto((v) => !v);
  };

  const toggleMenuMovil = () => {
    setMenuMovilAbierto((v) => !v);
  };

  const countMensajesSinLeer = useMemo(() => {
    return mensajes.filter((m) => !m.leido).length;
  }, [mensajes]);

  const cerrarSesionAdmin = async () => {
    await authService.logout(() => navigate('/'));
  };

  return (
    <div className="admin-theme private-portal min-h-screen flex overflow-hidden font-sans bg-[#fafafa] text-neutral-900 selection:bg-neutral-950 selection:text-white">
      
      {/* =====================================================
           SIDEBAR MONOCROMÁTICO (TIPOGRAFÍA AMPLIA Y MAYÚSCULAS)
           ===================================================== */}
      <aside
        className={`${
          sidebarAbierto ? 'w-72' : 'w-24'
        } hidden lg:flex flex-col bg-white border-r border-neutral-200 transition-all duration-300 z-30 shrink-0 select-none relative font-sans`}
      >
        {/* Header del Sidebar con Logo Institucional */}
        <div className="h-24 border-b border-neutral-200 flex items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3.5 overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 flex items-center justify-center text-white shrink-0 font-serif font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              S
            </div>
            {sidebarAbierto && (
              <div className="flex flex-col animate-fade-in">
                <span className="font-serif font-black text-xl tracking-[0.18em] text-neutral-950 uppercase leading-none">SYSMICON</span>
                <span className="text-xs uppercase tracking-[0.25em] font-mono font-bold text-neutral-400 mt-1.5">STUDIO ADMIN</span>
              </div>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl transition-colors text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 cursor-pointer"
            title={sidebarAbierto ? 'Colapsar menú' : 'Expandir menú'}
          >
            <svg
              className={`w-5 h-5 transition-transform ${!sidebarAbierto ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>

        {/* Menú de Navegación Organizado */}
        <nav className="flex-1 py-8 px-4 space-y-7 overflow-y-auto scrollbar-thin">
          
          {/* SECCIÓN: NAVEGACIÓN PRINCIPAL */}
          <div className="space-y-2">
            {sidebarAbierto && (
              <span className="px-3.5 font-mono text-xs font-black tracking-[0.25em] uppercase block mb-3 text-neutral-400">
                CONSOLA DE CONTROL
              </span>
            )}

            {/* 1. Inicio */}
            <button
              onClick={() => setSeccion('inicio')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                seccionActiva === 'inicio'
                  ? 'bg-neutral-950 text-white shadow-sm font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 font-semibold'
              }`}
            >
              <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              {sidebarAbierto && <span className="truncate tracking-wider uppercase">INICIO</span>}
            </button>

            {/* 2. Analíticas */}
            <button
              onClick={() => setSeccion('analiticas')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                seccionActiva === 'analiticas'
                  ? 'bg-neutral-950 text-white shadow-sm font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 font-semibold'
              }`}
            >
              <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              {sidebarAbierto && <span className="truncate tracking-wider uppercase">ANALÍTICAS</span>}
            </button>

            {/* 3. Mensajes & Cotizaciones */}
            <button
              onClick={() => setSeccion('mensajes')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                seccionActiva === 'mensajes'
                  ? 'bg-neutral-950 text-white shadow-sm font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 font-semibold'
              }`}
            >
              <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {sidebarAbierto && (
                <span className="truncate flex items-center justify-between w-full tracking-wider uppercase">
                  <span>MENSAJES</span>
                  {countMensajesSinLeer > 0 && (
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full font-mono transition-colors shadow-xs ${
                        seccionActiva === 'mensajes' ? 'bg-white text-neutral-950' : 'bg-neutral-950 text-white'
                      }`}
                    >
                      {countMensajesSinLeer}
                    </span>
                  )}
                </span>
              )}
            </button>

            {/* 4. Usuarios */}
            <button
              onClick={() => setSeccion('usuarios')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                seccionActiva === 'usuarios'
                  ? 'bg-neutral-950 text-white shadow-sm font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 font-semibold'
              }`}
            >
              <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              {sidebarAbierto && (
                <span className="truncate flex items-center justify-between w-full tracking-wider uppercase">
                  <span>USUARIOS</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-md font-mono font-bold ${
                      seccionActiva === 'usuarios'
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                    }`}
                  >
                    {usuarios.length}
                  </span>
                </span>
              )}
            </button>

            {/* 5. Configuración (Personalizar) */}
            <button
              onClick={() => setSeccion('personalizar')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all cursor-pointer group ${
                seccionActiva === 'personalizar'
                  ? 'bg-neutral-950 text-white shadow-sm font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 font-semibold'
              }`}
            >
              <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              {sidebarAbierto && <span className="truncate tracking-wider uppercase">CONFIGURACIÓN</span>}
            </button>

          </div>

          {/* SECCIÓN: ACCIONES Y SALIDA */}
          <div className="space-y-2 pt-6 border-t border-neutral-200">
            {sidebarAbierto && (
              <span className="px-3.5 font-mono text-xs font-black tracking-[0.25em] uppercase block mb-3 text-neutral-400">
                SITIO PÚBLICO
              </span>
            )}

            <Link
              to="/"
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all group uppercase tracking-wider"
            >
              <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              {sidebarAbierto && <span className="truncate">VER SITIO WEB</span>}
            </Link>

            <button
              onClick={cerrarSesionAdmin}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold text-neutral-500 hover:text-red-600 hover:bg-red-50/80 transition-all group cursor-pointer uppercase tracking-wider"
            >
              <svg className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              {sidebarAbierto && <span className="truncate">CERRAR SESIÓN</span>}
            </button>
          </div>

        </nav>

        {/* Footer Sidebar con Versión */}
        {sidebarAbierto && (
          <div className="p-5 border-t border-neutral-200 text-center font-mono text-xs uppercase tracking-widest text-neutral-400 font-bold">
            SYSMICON PORTAL • v2.4
          </div>
        )}

      </aside>

      {/* =====================================================
           CONTENEDOR PRINCIPAL DERECHA (HEADER + VISTAS)
           ===================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* TOP NAVBAR ADMIN (BREADCRUMB & ACCIONES TOP) */}
        <header className="h-24 border-b border-neutral-200 bg-white px-6 sm:px-12 flex items-center justify-between gap-6 shrink-0 z-20 relative font-sans">
          
          {/* Migas de Pan (Breadcrumbs) & Botón Móvil */}
          <div className="flex items-center gap-5">
            <button
              onClick={toggleMenuMovil}
              className="lg:hidden p-3 rounded-xl text-lg border border-neutral-200 bg-neutral-50 text-neutral-900 cursor-pointer hover:bg-neutral-100"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>

            {/* Breadcrumbs Estilo Arquitectónico con Letras Claras */}
            <div className="flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-wider">
              <span
                className="flex items-center gap-2 cursor-pointer text-neutral-400 hover:text-neutral-950 transition-colors"
                onClick={() => setSeccion('inicio')}
              >
                <span>CONSOLA</span>
              </span>
              <span className="text-neutral-300 font-light">/</span>
              <span className="text-neutral-950 font-black tracking-widest text-sm sm:text-base">
                {seccionActiva === 'personalizar' ? 'CONFIGURACIÓN Y CMS' : seccionActiva.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Acciones Derecha (Ver Sitio en Vivo + Perfil) */}
          <div className="flex items-center gap-5">
            
            {/* Botón Destacado: VER SITIO EN VIVO */}
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-neutral-950 hover:bg-black text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm hover:scale-105 cursor-pointer whitespace-nowrap"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>VER SITIO EN VIVO</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </Link>

            {/* Perfil Admin Monocromático */}
            <div className="flex items-center gap-3.5 pl-5 border-l border-neutral-200">
              <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-serif font-black text-base shadow-sm">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-sm font-black text-neutral-950 block leading-tight uppercase tracking-wider">ADMINISTRADOR</span>
                <span className="text-xs font-mono font-bold text-neutral-400 block mt-0.5 uppercase tracking-wider">DIRECTOR GENERAL</span>
              </div>
            </div>

          </div>

        </header>

        {/* ÁREA DE CONTENIDO (ADAPTABLE SIN SCROLL EXTERNO EN MENSAJES) */}
        <main
          className={
            seccionActiva === 'mensajes'
              ? 'flex-1 overflow-hidden p-6 sm:p-8 lg:p-10 flex flex-col min-h-0 bg-[#fafafa]'
              : 'flex-1 overflow-y-auto p-8 sm:p-12 lg:p-16 scrollbar-thin bg-[#fafafa]'
          }
        >
          <div
            className={
              seccionActiva === 'mensajes'
                ? 'max-w-[1750px] w-full mx-auto h-full flex flex-col flex-1 min-h-0'
                : 'max-w-[1750px] mx-auto pb-20'
            }
          >
            {/* RENDER DE LAS 5 SECCIONES ACTIVAS */}
            {seccionActiva === 'inicio' && <DashInicio />}
            {seccionActiva === 'analiticas' && <DashAnaliticas />}
            {seccionActiva === 'personalizar' && <DashPersonalizar />}
            {seccionActiva === 'usuarios' && <DashUsuarios />}
            {seccionActiva === 'mensajes' && (
              <div className="h-full flex flex-col flex-1 min-h-0">
                <DashMensajes />
              </div>
            )}
          </div>
        </main>

      </div>

      {/* DRAWER MÓVIL MONOCROMÁTICO */}
      {menuMovilAbierto && (
        <div className="fixed inset-0 z-50 lg:hidden flex animate-fade-in">
          <div onClick={toggleMenuMovil} className="fixed inset-0 bg-black/60 backdrop-blur-xs"></div>
          <aside className="w-72 border-r border-neutral-200 bg-white z-10 flex flex-col h-full relative font-sans">
            
            <div className="h-24 border-b border-neutral-200 flex items-center justify-between px-6">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-bold text-base">S</div>
                <span className="font-serif font-black text-base text-neutral-950 uppercase tracking-widest">SYSMICON ADMIN</span>
              </div>
              <button onClick={toggleMenuMovil} className="text-neutral-400 hover:text-neutral-950 font-bold text-xl p-2">✕</button>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              <button
                onClick={() => {
                  setSeccion('inicio');
                  toggleMenuMovil();
                }}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm flex items-center gap-3.5 transition-colors uppercase tracking-wider ${
                  seccionActiva === 'inicio'
                    ? 'bg-neutral-950 text-white font-bold'
                    : 'text-neutral-600 hover:bg-neutral-100 font-semibold'
                }`}
              >
                <span>INICIO</span>
              </button>
              <button
                onClick={() => {
                  setSeccion('analiticas');
                  toggleMenuMovil();
                }}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm flex items-center gap-3.5 transition-colors uppercase tracking-wider ${
                  seccionActiva === 'analiticas'
                    ? 'bg-neutral-950 text-white font-bold'
                    : 'text-neutral-600 hover:bg-neutral-100 font-semibold'
                }`}
              >
                <span>ANALÍTICAS</span>
              </button>
              <button
                onClick={() => {
                  setSeccion('mensajes');
                  toggleMenuMovil();
                }}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm flex items-center gap-3.5 transition-colors uppercase tracking-wider ${
                  seccionActiva === 'mensajes'
                    ? 'bg-neutral-950 text-white font-bold'
                    : 'text-neutral-600 hover:bg-neutral-100 font-semibold'
                }`}
              >
                <span>MENSAJES</span>
              </button>
              <button
                onClick={() => {
                  setSeccion('usuarios');
                  toggleMenuMovil();
                }}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm flex items-center gap-3.5 transition-colors uppercase tracking-wider ${
                  seccionActiva === 'usuarios'
                    ? 'bg-neutral-950 text-white font-bold'
                    : 'text-neutral-600 hover:bg-neutral-100 font-semibold'
                }`}
              >
                <span>USUARIOS</span>
              </button>
              <button
                onClick={() => {
                  setSeccion('personalizar');
                  toggleMenuMovil();
                }}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm flex items-center gap-3.5 transition-colors uppercase tracking-wider ${
                  seccionActiva === 'personalizar'
                    ? 'bg-neutral-950 text-white font-bold'
                    : 'text-neutral-600 hover:bg-neutral-100 font-semibold'
                }`}
              >
                <span>CONFIGURACIÓN</span>
              </button>
            </nav>

            <div className="p-6 border-t border-neutral-200">
              <Link to="/" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-neutral-950 text-white font-bold text-sm uppercase tracking-wider">
                <span>REGRESAR AL SITIO WEB</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

    </div>
  );
};

export default AdminLayout;
