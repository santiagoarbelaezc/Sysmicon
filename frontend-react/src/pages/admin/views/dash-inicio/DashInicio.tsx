import React, { useEffect, useMemo } from 'react';
import { adminService, useAdminService } from '../../../../services/admin.service';

export const DashInicio: React.FC = () => {
  const { mensajes, usuarios, analiticas } = useAdminService();

  useEffect(() => {
    adminService.cargarDatosReales();
  }, []);

  const countSinLeer = useMemo(() => {
    return mensajes.filter((m) => !m.leido).length;
  }, [mensajes]);

  const countConPresupuesto = useMemo(() => {
    return mensajes.filter((m) => Boolean(m.presupuesto)).length;
  }, [mensajes]);

  const maxVisitas = useMemo(() => {
    const list = analiticas.visitasDiarias;
    if (list.length === 0) return 100;
    return Math.max(...list.map((d) => d.visitas), 100);
  }, [analiticas.visitasDiarias]);

  const maxConversiones = useMemo(() => {
    const list = analiticas.visitasDiarias;
    if (list.length === 0) return 10;
    return Math.max(...list.map((d) => d.conversiones), 10);
  }, [analiticas.visitasDiarias]);

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      
      {/* ENCABEZADO DE SECCIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
        <div>
          <span className="font-mono text-xs sm:text-sm tracking-ultra text-neutral-400 font-black uppercase block mb-2">
            PANEL DE CONTROL DIRECTIVO
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 uppercase tracking-tight leading-[1.05]">
            SUPERVISIÓN &amp; <span className="font-light">RESUMEN GENERAL</span>
          </h1>
          <p className="font-sans text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mt-3 max-w-3xl">
            Monitoreo en tiempo real de cotizaciones, consultas web, directorio de usuarios y estado del sistema.
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-6 py-4 rounded-2xl bg-white border border-neutral-200 text-right font-mono shadow-xs">
            <span className="block text-xs text-neutral-400 uppercase tracking-widest font-black">BASE DE DATOS</span>
            <span className="text-neutral-950 font-black text-sm sm:text-base flex items-center justify-end gap-2.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> MYSQL CONECTADA
            </span>
          </div>
        </div>
      </div>

      {/* GRID DE 4 KPIS MONOCROMÁTICOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Cotizaciones Reales */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-7 sm:p-8 shadow-xs hover:border-neutral-400 hover:shadow-md transition-all group duration-300">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.2em] text-neutral-400">COTIZACIONES</span>
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-300">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-5xl sm:text-6xl font-black text-neutral-950 tracking-tight">{mensajes.length}</span>
            <span className="text-xs text-neutral-900 font-bold bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-lg font-mono uppercase tracking-wider">TOTAL</span>
          </div>
          <p className="text-sm text-neutral-600 font-normal mt-4">Solicitudes registradas en la web</p>
        </div>

        {/* KPI 2: Mensajes Sin Leer */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-7 sm:p-8 shadow-xs hover:border-neutral-400 hover:shadow-md transition-all group duration-300">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.2em] text-neutral-400">SIN LEER</span>
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-300">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-5xl sm:text-6xl font-black text-neutral-950 tracking-tight">{countSinLeer}</span>
            <span className="text-xs text-neutral-950 font-black bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-lg font-mono flex items-center gap-1.5 uppercase tracking-wider">
              {countSinLeer > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
              BANDEJA
            </span>
          </div>
          <p className="text-sm text-neutral-600 font-normal mt-4">Pendientes por responder</p>
        </div>

        {/* KPI 3: Usuarios Registrados */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-7 sm:p-8 shadow-xs hover:border-neutral-400 hover:shadow-md transition-all group duration-300">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.2em] text-neutral-400">COMUNIDAD</span>
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-300">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-5xl sm:text-6xl font-black text-neutral-950 tracking-tight">{usuarios.length}</span>
            <span className="text-xs text-neutral-800 font-bold bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-lg font-mono uppercase tracking-wider">ACTIVOS</span>
          </div>
          <p className="text-sm text-neutral-600 font-normal mt-4">Usuarios en la base de datos</p>
        </div>

        {/* KPI 4: Cotizaciones con Presupuesto */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-7 sm:p-8 shadow-xs hover:border-neutral-400 hover:shadow-md transition-all group duration-300">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.2em] text-neutral-400">PRESUPUESTOS</span>
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-300">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-5xl sm:text-6xl font-black text-neutral-950 tracking-tight">{countConPresupuesto}</span>
            <span className="text-xs text-white font-black bg-neutral-950 px-3 py-1 rounded-lg font-mono uppercase tracking-wider">LEADS</span>
          </div>
          <p className="text-sm text-neutral-600 font-normal mt-4">Con solicitud económica</p>
        </div>

      </div>

      {/* SECCIÓN INFERIOR: RENDIMIENTO & ACTIVIDAD DINÁMICA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico Semanal (Cols 1-2) */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-neutral-200">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">RENDIMIENTO Y TRÁFICO SEMANAL</h3>
                <p className="text-sm sm:text-base text-neutral-600 font-normal mt-1">Visitas registradas al portal web</p>
              </div>
              <span className="px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-800 font-mono font-bold uppercase tracking-wider shrink-0">ÚLTIMOS 7 DÍAS</span>
            </div>

            {/* Gráfico de barras monocromático */}
            {analiticas.visitasDiarias.length > 0 ? (
              <div className="h-64 flex items-end justify-between gap-4 pt-8 pb-4 border-b border-neutral-200 px-3">
                {analiticas.visitasDiarias.map((dia, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
                    <div className="w-full max-w-[52px] flex items-end justify-center gap-2 h-[85%]">
                      {/* Barra visitas (gris suave) */}
                      <div
                        className="w-5 bg-neutral-200 group-hover:bg-neutral-300 transition-all rounded-t-md relative"
                        style={{ height: `${(dia.visitas / (maxVisitas || 100)) * 100}%` }}
                      >
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-neutral-950 text-white px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono shadow-sm pointer-events-none">
                          {dia.visitas}
                        </span>
                      </div>
                      {/* Barra conversiones (negro profundo) */}
                      <div
                        className="w-5 bg-neutral-950 group-hover:bg-neutral-800 transition-all rounded-t-md relative"
                        style={{ height: `${(dia.conversiones / (maxConversiones || 10)) * 100}%` }}
                      >
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-neutral-950 text-white px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono shadow-sm pointer-events-none">
                          {dia.conversiones}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-neutral-600 group-hover:text-neutral-950 transition-colors font-mono uppercase">
                      {dia.dia}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-neutral-400 gap-3 border-b border-neutral-100">
                <svg className="w-10 h-10 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                <span className="text-sm text-neutral-500 font-mono uppercase tracking-wider">RECOPILANDO VISITAS DE LOS ÚLTIMOS 7 DÍAS...</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-6 text-sm text-neutral-600 font-sans">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2.5 font-medium"><span className="w-3.5 h-3.5 rounded-sm bg-neutral-200 inline-block"></span> VISITAS</span>
              <span className="flex items-center gap-2.5 font-medium"><span className="w-3.5 h-3.5 rounded-sm bg-neutral-950 inline-block"></span> LEADS / COTIZACIONES</span>
            </div>
            <span className="text-neutral-950 font-mono text-xs font-black uppercase tracking-wider">DATOS EN VIVO</span>
          </div>
        </div>

        {/* Actividad Reciente Dinámica (Col 3) */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-5 mb-5 border-b border-neutral-200">
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">ACTIVIDAD EN VIVO</h3>
              <p className="text-sm text-neutral-600 font-normal mt-1">Últimas solicitudes recibidas en la base de datos</p>
            </div>

            {/* Listado dinámico de mensajes reales */}
            {mensajes.length > 0 ? (
              <div className="space-y-4 font-sans max-h-80 overflow-y-auto scrollbar-thin pr-1">
                {mensajes.slice(0, 4).map((m) => (
                  <div key={m.id} className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm shadow-xs">
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-neutral-950 uppercase tracking-wide truncate">{m.remitente}</p>
                      <p className="text-xs sm:text-sm text-neutral-600 font-normal truncate mt-1">{m.asunto}</p>
                      <span className="text-xs text-neutral-400 mt-1.5 block font-mono">{m.fecha || m.created_at || 'Reciente'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-14 flex flex-col items-center justify-center text-center text-neutral-400 gap-3">
                <svg className="w-10 h-10 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span className="text-sm text-neutral-600 font-medium">Sin mensajes registrados aún.</span>
              </div>
            )}
          </div>

          <div className="pt-5 border-t border-neutral-200 mt-5 text-center">
            <span className="text-xs text-neutral-500 font-bold font-mono uppercase tracking-wider">● BASE DE DATOS MYSQL SINCRONIZADA</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashInicio;
