import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, useAuthService } from '../../../services/auth.service';
import { adminService, useAdminService } from '../../../services/admin.service';
import { crmService, useCrmService } from '../../../services/crm.service';

// Estilos del Bento Grid Design System
import '../dashboard-bento.css';

// Importación de las vistas
import { DashInicio } from '../views/dash-inicio/DashInicio';
import { DashPipeline } from '../views/dash-crm-pipeline/DashPipeline';
import { DashClientes } from '../views/dash-crm-clientes/DashClientes';
import { DashProyectosCrm } from '../views/dash-crm-proyectos/DashProyectosCrm';
import { DashPqr } from '../views/dash-pqr/DashPqr';
import { DashPortafolio } from '../views/dash-portafolio/DashPortafolio';
import { DashAnaliticas } from '../views/dash-analiticas/DashAnaliticas';
import { DashPersonalizar } from '../views/dash-personalizar/DashPersonalizar';
import { DashUsuarios } from '../views/dash-usuarios/DashUsuarios';
import { DashMensajes } from '../views/dash-mensajes/DashMensajes';

export type AdminSection =
  | 'inicio'
  | 'pipeline'
  | 'clientes'
  | 'proyectos-crm'
  | 'pqr'
  | 'mensajes'
  | 'portafolio'
  | 'analiticas'
  | 'usuarios'
  | 'personalizar';

const VALID_SECTIONS: AdminSection[] = [
  'inicio',
  'pipeline',
  'clientes',
  'proyectos-crm',
  'pqr',
  'mensajes',
  'portafolio',
  'analiticas',
  'usuarios',
  'personalizar',
];

function getInitialSection(): AdminSection {
  try {
    const saved = localStorage.getItem('sysmicon_admin_section') as AdminSection;
    return VALID_SECTIONS.includes(saved) ? saved : 'inicio';
  } catch {
    return 'inicio';
  }
}

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthService();
  const { mensajes } = useAdminService();
  const { kpis, pqrs } = useCrmService();

  const [seccionActiva, setSeccionActiva] = useState<AdminSection>(getInitialSection);
  const [sidebarAbierto, setSidebarAbierto] = useState<boolean>(true);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState<boolean>(false);

  useEffect(() => {
    adminService.cargarDatosReales();
    crmService.cargarTodo();
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

  const countPqrPendientes = useMemo(() => {
    return pqrs.filter((p) => p.estado === 'radicado' || p.estado === 'en_tramite').length;
  }, [pqrs]);

  const cerrarSesionAdmin = async () => {
    await authService.logout(() => navigate('/'));
  };

  return (
    <div className="admin-dashboard-bento flex min-h-screen overflow-hidden selection:bg-black selection:text-white">
      
      {/* =====================================================
           SIDEBAR OSCURO BENTO (#0a0a0a)
           ===================================================== */}
      <aside
        className={`bento-sidebar ${
          sidebarAbierto ? 'w-[250px]' : 'w-[72px]'
        } hidden lg:flex flex-col shrink-0 select-none relative z-30 transition-all duration-300`}
      >
        {/* Header del Sidebar */}
        <div className="h-[74px] border-b border-[#1a1a1a] flex items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-black text-base shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              S
            </div>
            {sidebarAbierto && (
              <div className="flex flex-col animate-fade-in">
                <span className="font-black text-sm tracking-[0.14em] text-white uppercase leading-none">
                  SYSMICON
                </span>
                <span className="text-[0.62rem] uppercase tracking-[0.2em] font-mono font-bold text-[#a1a1aa] mt-1">
                  STUDIO CRM
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-[#71717a] hover:text-white hover:bg-[#141416] transition-colors cursor-pointer"
            title={sidebarAbierto ? 'Colapsar barra lateral' : 'Expandir barra lateral'}
          >
            <span className={`material-symbols-rounded text-lg transition-transform ${!sidebarAbierto ? 'rotate-180' : ''}`}>
              keyboard_double_arrow_left
            </span>
          </button>
        </div>

        {/* Navegación Modular Bento */}
        <nav className="flex-1 py-5 px-3 space-y-6 overflow-y-auto scrollbar-thin">
          
          {/* GRUPO 1: CONSOLA PRINCIPAL */}
          <div className="space-y-1">
            {sidebarAbierto && (
              <span className="px-3 text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#71717a] block mb-2">
                CONSOLA
              </span>
            )}

            <button
              onClick={() => setSeccion('inicio')}
              className={`bento-sidebar-item ${seccionActiva === 'inicio' ? 'active' : ''}`}
              title="Panel de Control General"
            >
              <span className="material-symbols-rounded text-lg">dashboard</span>
              {sidebarAbierto && <span>Inicio &amp; Resumen</span>}
            </button>
          </div>

          {/* GRUPO 2: CRM & OPERACIONES */}
          <div className="space-y-1">
            {sidebarAbierto && (
              <span className="px-3 text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#71717a] block mb-2">
                CRM &amp; OPERACIONES
              </span>
            )}

            <button
              onClick={() => setSeccion('pipeline')}
              className={`bento-sidebar-item ${seccionActiva === 'pipeline' ? 'active' : ''}`}
              title="Pipeline Kanban Comercial"
            >
              <span className="material-symbols-rounded text-lg">view_kanban</span>
              {sidebarAbierto && (
                <span className="flex items-center justify-between w-full">
                  <span>Pipeline Kanban</span>
                  {kpis.pipeline_oportunidades_activas > 0 && (
                    <span className="text-[0.65rem] px-2 py-0.5 rounded-full font-mono font-bold bg-[#141416] border border-[#27272a] text-[#a1a1aa]">
                      {kpis.pipeline_oportunidades_activas}
                    </span>
                  )}
                </span>
              )}
            </button>

            <button
              onClick={() => setSeccion('clientes')}
              className={`bento-sidebar-item ${seccionActiva === 'clientes' ? 'active' : ''}`}
              title="Directorio de Clientes CRM"
            >
              <span className="material-symbols-rounded text-lg">contacts</span>
              {sidebarAbierto && <span>Clientes &amp; Leads</span>}
            </button>

            <button
              onClick={() => setSeccion('proyectos-crm')}
              className={`bento-sidebar-item ${seccionActiva === 'proyectos-crm' ? 'active' : ''}`}
              title="Proyectos de Construcción CRM"
            >
              <span className="material-symbols-rounded text-lg">foundation</span>
              {sidebarAbierto && (
                <span className="flex items-center justify-between w-full">
                  <span>Obras en Ejecución</span>
                  {kpis.proyectos_activos > 0 && (
                    <span className="text-[0.65rem] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {kpis.proyectos_activos}
                    </span>
                  )}
                </span>
              )}
            </button>
          </div>

          {/* GRUPO 3: ATENCIÓN AL CLIENTE & LEADS */}
          <div className="space-y-1">
            {sidebarAbierto && (
              <span className="px-3 text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#71717a] block mb-2">
                ATENCIÓN &amp; WEB
              </span>
            )}

            <button
              onClick={() => setSeccion('mensajes')}
              className={`bento-sidebar-item ${seccionActiva === 'mensajes' ? 'active' : ''}`}
              title="Bandeja de Mensajes y Cotizaciones"
            >
              <span className="material-symbols-rounded text-lg">mail</span>
              {sidebarAbierto && (
                <span className="flex items-center justify-between w-full">
                  <span>Mensajes Web</span>
                  {countMensajesSinLeer > 0 && (
                    <span className="text-[0.65rem] px-2 py-0.5 rounded-full font-mono font-bold bg-red-600 text-white">
                      {countMensajesSinLeer}
                    </span>
                  )}
                </span>
              )}
            </button>

            <button
              onClick={() => setSeccion('pqr')}
              className={`bento-sidebar-item ${seccionActiva === 'pqr' ? 'active' : ''}`}
              title="Peticiones, Quejas y Reclamos"
            >
              <span className="material-symbols-rounded text-lg">support_agent</span>
              {sidebarAbierto && (
                <span className="flex items-center justify-between w-full">
                  <span>Sistema PQR</span>
                  {countPqrPendientes > 0 && (
                    <span className="text-[0.65rem] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {countPqrPendientes}
                    </span>
                  )}
                </span>
              )}
            </button>

            <button
              onClick={() => setSeccion('portafolio')}
              className={`bento-sidebar-item ${seccionActiva === 'portafolio' ? 'active' : ''}`}
              title="Portafolio de Obras Web"
            >
              <span className="material-symbols-rounded text-lg">collections</span>
              {sidebarAbierto && <span>Portafolio Web</span>}
            </button>
          </div>

          {/* GRUPO 4: ANÁLISIS & ADMINISTRACIÓN */}
          <div className="space-y-1">
            {sidebarAbierto && (
              <span className="px-3 text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#71717a] block mb-2">
                ADMINISTRACIÓN
              </span>
            )}

            <button
              onClick={() => setSeccion('analiticas')}
              className={`bento-sidebar-item ${seccionActiva === 'analiticas' ? 'active' : ''}`}
              title="Analíticas de Tráfico Web"
            >
              <span className="material-symbols-rounded text-lg">analytics</span>
              {sidebarAbierto && <span>Analíticas</span>}
            </button>

            <button
              onClick={() => setSeccion('usuarios')}
              className={`bento-sidebar-item ${seccionActiva === 'usuarios' ? 'active' : ''}`}
              title="Directorio de Usuarios Staff"
            >
              <span className="material-symbols-rounded text-lg">manage_accounts</span>
              {sidebarAbierto && <span>Usuarios Staff</span>}
            </button>

            <button
              onClick={() => setSeccion('personalizar')}
              className={`bento-sidebar-item ${seccionActiva === 'personalizar' ? 'active' : ''}`}
              title="Configuración General del Sitio"
            >
              <span className="material-symbols-rounded text-lg">settings</span>
              {sidebarAbierto && <span>Configuración</span>}
            </button>
          </div>

          {/* ACCIONES Y SALIDA */}
          <div className="pt-4 border-t border-[#1a1a1a] space-y-1">
            <Link
              to="/"
              className="bento-sidebar-item hover:text-white"
              title="Ir al sitio público"
            >
              <span className="material-symbols-rounded text-lg">open_in_new</span>
              {sidebarAbierto && <span>Ver Sitio Web</span>}
            </Link>

            <button
              onClick={cerrarSesionAdmin}
              className="bento-sidebar-item text-red-400 hover:text-red-300 hover:bg-red-950/30"
              title="Cerrar Sesión Segura"
            >
              <span className="material-symbols-rounded text-lg">logout</span>
              {sidebarAbierto && <span>Cerrar Sesión</span>}
            </button>
          </div>

        </nav>

        {/* Footer del Sidebar */}
        {sidebarAbierto && (
          <div className="p-4 border-t border-[#1a1a1a] text-center font-mono text-[0.65rem] uppercase tracking-widest text-[#71717a] font-bold">
            SYSMICON &bull; LARAVEL 12 CRM
          </div>
        )}
      </aside>

      {/* =====================================================
           CONTENEDOR CENTRAL: HEADER STICKY + CANVAS CLARO
           ===================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* HEADER STICKY (74px, Blanco Puro, Borde 1.5px) */}
        <header className="bento-header shrink-0">
          
          {/* Breadcrumbs y Toggle Móvil */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMenuMovil}
              className="lg:hidden p-2 rounded-lg border border-[#e4e4e7] bg-[#f4f5f7] text-[#09090b] cursor-pointer"
            >
              <span className="material-symbols-rounded text-xl">menu</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono">
              <span
                onClick={() => setSeccion('inicio')}
                className="text-[#71717a] hover:text-[#09090b] transition-colors cursor-pointer"
              >
                CONSOLA
              </span>
              <span className="text-[#a1a1aa]">/</span>
              <span className="text-[#09090b] font-black">
                {seccionActiva.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Acciones Derecha */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
            >
              <span className="status-dot"></span>
              <span>SITIO EN VIVO</span>
            </Link>

            {/* Perfil de Staff */}
            <div className="flex items-center gap-3 pl-4 border-l border-[#e4e4e7]">
              <div className="w-9 h-9 rounded-xl bg-[#09090b] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                {currentUser?.nombre ? currentUser.nombre.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-black text-[#09090b] block leading-tight uppercase">
                  {currentUser?.nombre || 'Administrador'}
                </span>
                <span className="text-[0.65rem] font-mono font-bold text-[#71717a] block uppercase">
                  ROL: {currentUser?.rol || 'admin'}
                </span>
              </div>
            </div>
          </div>

        </header>

        {/* CANVAS PRINCIPAL (Fondo #f4f5f7, max-w 1600px) */}
        <main
          className={
            seccionActiva === 'mensajes'
              ? 'flex-1 overflow-hidden p-5 sm:p-7 flex flex-col min-h-0 bg-[#f4f5f7]'
              : 'flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-thin bg-[#f4f5f7]'
          }
        >
          <div
            className={
              seccionActiva === 'mensajes'
                ? 'max-w-[1600px] w-full mx-auto h-full flex flex-col flex-1 min-h-0'
                : 'max-w-[1600px] mx-auto pb-16'
            }
          >
            {/* RENDER DE LA SECCIÓN ACTIVA */}
            {seccionActiva === 'inicio' && (
              <DashInicio onNavigateSection={(sec) => setSeccion(sec as AdminSection)} />
            )}
            {seccionActiva === 'pipeline' && <DashPipeline />}
            {seccionActiva === 'clientes' && <DashClientes />}
            {seccionActiva === 'proyectos-crm' && <DashProyectosCrm />}
            {seccionActiva === 'pqr' && <DashPqr />}
            {seccionActiva === 'portafolio' && <DashPortafolio />}
            {seccionActiva === 'mensajes' && (
              <div className="h-full flex flex-col flex-1 min-h-0">
                <DashMensajes />
              </div>
            )}
            {seccionActiva === 'analiticas' && <DashAnaliticas />}
            {seccionActiva === 'usuarios' && <DashUsuarios />}
            {seccionActiva === 'personalizar' && <DashPersonalizar />}
          </div>
        </main>

      </div>

      {/* DRAWER MÓVIL */}
      {menuMovilAbierto && (
        <div className="fixed inset-0 z-50 lg:hidden flex animate-fade-in">
          <div onClick={toggleMenuMovil} className="fixed inset-0 bg-black/60 backdrop-blur-xs"></div>
          <aside className="w-72 bg-[#0a0a0a] border-r border-[#1a1a1a] z-10 flex flex-col h-full relative text-white">
            <div className="h-[74px] border-b border-[#1a1a1a] flex items-center justify-between px-5">
              <span className="font-black text-sm text-white uppercase tracking-wider">SYSMICON CRM</span>
              <button onClick={toggleMenuMovil} className="text-[#a1a1aa] hover:text-white p-2">✕</button>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto text-xs">
              <button
                onClick={() => { setSeccion('inicio'); toggleMenuMovil(); }}
                className={`bento-sidebar-item ${seccionActiva === 'inicio' ? 'active' : ''}`}
              >
                <span className="material-symbols-rounded text-lg">dashboard</span>
                <span>Inicio</span>
              </button>
              <button
                onClick={() => { setSeccion('pipeline'); toggleMenuMovil(); }}
                className={`bento-sidebar-item ${seccionActiva === 'pipeline' ? 'active' : ''}`}
              >
                <span className="material-symbols-rounded text-lg">view_kanban</span>
                <span>Pipeline Kanban</span>
              </button>
              <button
                onClick={() => { setSeccion('clientes'); toggleMenuMovil(); }}
                className={`bento-sidebar-item ${seccionActiva === 'clientes' ? 'active' : ''}`}
              >
                <span className="material-symbols-rounded text-lg">contacts</span>
                <span>Clientes CRM</span>
              </button>
              <button
                onClick={() => { setSeccion('proyectos-crm'); toggleMenuMovil(); }}
                className={`bento-sidebar-item ${seccionActiva === 'proyectos-crm' ? 'active' : ''}`}
              >
                <span className="material-symbols-rounded text-lg">foundation</span>
                <span>Obras en Ejecución</span>
              </button>
              <button
                onClick={() => { setSeccion('pqr'); toggleMenuMovil(); }}
                className={`bento-sidebar-item ${seccionActiva === 'pqr' ? 'active' : ''}`}
              >
                <span className="material-symbols-rounded text-lg">support_agent</span>
                <span>Sistema PQR</span>
              </button>
              <button
                onClick={() => { setSeccion('mensajes'); toggleMenuMovil(); }}
                className={`bento-sidebar-item ${seccionActiva === 'mensajes' ? 'active' : ''}`}
              >
                <span className="material-symbols-rounded text-lg">mail</span>
                <span>Mensajes Web</span>
              </button>
              <button
                onClick={() => { setSeccion('portafolio'); toggleMenuMovil(); }}
                className={`bento-sidebar-item ${seccionActiva === 'portafolio' ? 'active' : ''}`}
              >
                <span className="material-symbols-rounded text-lg">collections</span>
                <span>Portafolio Web</span>
              </button>
              <button
                onClick={() => { setSeccion('analiticas'); toggleMenuMovil(); }}
                className={`bento-sidebar-item ${seccionActiva === 'analiticas' ? 'active' : ''}`}
              >
                <span className="material-symbols-rounded text-lg">analytics</span>
                <span>Analíticas</span>
              </button>
              <button
                onClick={() => { setSeccion('usuarios'); toggleMenuMovil(); }}
                className={`bento-sidebar-item ${seccionActiva === 'usuarios' ? 'active' : ''}`}
              >
                <span className="material-symbols-rounded text-lg">manage_accounts</span>
                <span>Usuarios Staff</span>
              </button>
              <button
                onClick={() => { setSeccion('personalizar'); toggleMenuMovil(); }}
                className={`bento-sidebar-item ${seccionActiva === 'personalizar' ? 'active' : ''}`}
              >
                <span className="material-symbols-rounded text-lg">settings</span>
                <span>Configuración</span>
              </button>
            </nav>

            <div className="p-4 border-t border-[#1a1a1a]">
              <Link to="/" className="w-full btn-primary-white justify-center text-xs">
                <span>Ir al Sitio Web</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

    </div>
  );
};

export default AdminLayout;
