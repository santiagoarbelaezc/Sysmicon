import React, { useEffect, useState } from 'react';
import { crmService, useCrmService, ProyectoCrm, TareaCrm, ActividadCrm } from '../../../../services/crm.service';
import { adminService, useAdminService } from '../../../../services/admin.service';

interface DashInicioProps {
  onNavigateSection?: (section: string) => void;
}

export const DashInicio: React.FC<DashInicioProps> = ({ onNavigateSection }) => {
  const { kpis, proyectos, tareas, actividades, cargando } = useCrmService();
  const { mensajes, analiticas } = useAdminService();

  const [tareaSeleccionada, setTareaSeleccionada] = useState<number | null>(null);

  useEffect(() => {
    crmService.cargarTodo();
    adminService.cargarDatosReales();
  }, []);

  const formatearMoneda = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleToggleTarea = async (id: number) => {
    setTareaSeleccionada(id);
    await crmService.toggleTarea(id);
    setTareaSeleccionada(null);
  };

  const countSinLeer = mensajes.filter((m) => !m.leido).length;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* ── ENCABEZADO MINIMALISTA BENTO ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e4e4e7]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#71717a]">
              SISTEMA INTEGRAL DE GESTIÓN &amp; CRM
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#09090b] tracking-tight mt-1">
            Panel de Control <span className="font-light text-[#71717a]">Operativo</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => crmService.cargarTodo()}
            disabled={cargando}
            className="btn-secondary-white text-xs"
            title="Sincronizar datos"
          >
            <span className={`material-symbols-rounded text-base ${cargando ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{cargando ? 'Sincronizando...' : 'Actualizar'}</span>
          </button>
          {onNavigateSection && (
            <button
              onClick={() => onNavigateSection('pipeline')}
              className="btn-primary-black text-xs"
            >
              <span className="material-symbols-rounded text-base">view_kanban</span>
              <span>Ver Pipeline</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 4 STAT CARDS BENTO CON BORDES IZQUIERDOS TEMÁTICOS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Clientes Totales */}
        <div 
          onClick={() => onNavigateSection && onNavigateSection('clientes')}
          className="stat-card stat-accent-blue"
        >
          <div className="stat-card-top">
            <span className="stat-card-label">CLIENTES REGISTRADOS</span>
            <div className="stat-card-icon-box stat-icon-blue">
              <span className="material-symbols-rounded text-lg">group</span>
            </div>
          </div>
          <div className="stat-number">{kpis.clientes_totales}</div>
          <div className="stat-card-footer">
            <span className="stat-footer-text">{kpis.leads_ultimos_30_dias} leads en los últimos 30 días</span>
            <span className="stat-footer-arrow">→</span>
          </div>
        </div>

        {/* KPI 2: Valor Estimado del Pipeline */}
        <div 
          onClick={() => onNavigateSection && onNavigateSection('pipeline')}
          className="stat-card stat-accent-green"
        >
          <div className="stat-card-top">
            <span className="stat-card-label">PIPELINE COMERCIAL</span>
            <div className="stat-card-icon-box stat-icon-green">
              <span className="material-symbols-rounded text-lg">payments</span>
            </div>
          </div>
          <div className="stat-number text-xl sm:text-2xl truncate" title={formatearMoneda(kpis.pipeline_valor_estimado)}>
            {formatearMoneda(kpis.pipeline_valor_estimado)}
          </div>
          <div className="stat-card-footer">
            <span className="stat-footer-text">{kpis.pipeline_oportunidades_activas} oportunidades en negociación</span>
            <span className="stat-footer-arrow">→</span>
          </div>
        </div>

        {/* KPI 3: Proyectos de Obra Activos */}
        <div 
          onClick={() => onNavigateSection && onNavigateSection('proyectos-crm')}
          className="stat-card stat-accent-amber"
        >
          <div className="stat-card-top">
            <span className="stat-card-label">OBRAS EN EJECUCIÓN</span>
            <div className="stat-card-icon-box stat-icon-amber">
              <span className="material-symbols-rounded text-lg">construction</span>
            </div>
          </div>
          <div className="stat-number">{kpis.proyectos_activos}</div>
          <div className="stat-card-footer">
            <span className="stat-footer-text">Tasa de éxito: {kpis.tasa_conversion_ganadas}%</span>
            <span className="stat-footer-arrow">→</span>
          </div>
        </div>

        {/* KPI 4: Solicitudes Web Sin Leer */}
        <div 
          onClick={() => onNavigateSection && onNavigateSection('mensajes')}
          className="stat-card stat-accent-red"
        >
          <div className="stat-card-top">
            <span className="stat-card-label">SOLICITUDES WEB</span>
            <div className="stat-card-icon-box stat-icon-red">
              <span className="material-symbols-rounded text-lg">mark_email_unread</span>
            </div>
          </div>
          <div className="stat-number">{countSinLeer}</div>
          <div className="stat-card-footer">
            <span className="stat-footer-text">{mensajes.length} cotizaciones totales recibidas</span>
            <span className="stat-footer-arrow">→</span>
          </div>
        </div>

      </div>

      {/* ── BENTO HERO CARD OSCURO (#0a0a0a) ── */}
      <div className="bento-welcome">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="bento-badge">
              <span className="status-dot"></span> EN VIVO &bull; SYSMICON ARCHITECTURE CRM
            </span>
            <h2 className="bento-title">
              Centro de Mando <span className="bento-title-accent">Directivo</span>
            </h2>
            <p className="bento-desc">
              Supervisa el ciclo de vida completo de cada proyecto: desde la prospección del lead comercial hasta la entrega física de la obra, con seguimiento riguroso de hitos, tareas y cronogramas.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {onNavigateSection && (
                <>
                  <button
                    onClick={() => onNavigateSection('pipeline')}
                    className="btn-primary-white"
                  >
                    <span className="material-symbols-rounded text-base">rocket_launch</span>
                    <span>Gestionar Pipeline Kanban</span>
                  </button>
                  <button
                    onClick={() => onNavigateSection('clientes')}
                    className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-base">person_add</span>
                    <span>Directorio de Clientes</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-72 shrink-0">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-white/50 block">CONVERSIÓN</span>
              <span className="text-2xl font-black text-white mt-1 block">{kpis.tasa_conversion_ganadas}%</span>
              <span className="text-[0.7rem] text-emerald-400 mt-1 block">Oportunidades ganadas</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-white/50 block">VISITAS WEB</span>
              <span className="text-2xl font-black text-white mt-1 block">
                {analiticas.visitasDiarias.reduce((acc, d) => acc + d.visitas, 0) || 1280}
              </span>
              <span className="text-[0.7rem] text-white/70 mt-1 block">Tráfico registrado</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CUADRÍCULA ASIMÉTRICA BENTO (2/3 + 1/3) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Obras en Curso con Hitos (8 cols) */}
        <div className="lg:col-span-8 bento-card">
          <div className="bento-card-header">
            <div>
              <h3 className="bento-card-title">Obras y Proyectos en Curso</h3>
              <p className="bento-card-subtitle">Seguimiento de fases arquitectónicas y porcentaje de hitos completados</p>
            </div>
            {onNavigateSection && (
              <button
                onClick={() => onNavigateSection('proyectos-crm')}
                className="text-xs font-bold text-[#09090b] hover:underline uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todos</span>
                <span className="material-symbols-rounded text-sm">arrow_forward</span>
              </button>
            )}
          </div>

          {proyectos.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#e4e4e7] rounded-2xl">
              <span className="material-symbols-rounded text-4xl text-[#a1a1aa] mb-2">apartment</span>
              <p className="text-sm font-semibold text-[#71717a]">No hay obras activas en este momento</p>
              <p className="text-xs text-[#a1a1aa] mt-1">Las oportunidades ganadas en el CRM se convertirán automáticamente en obras aquí.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proyectos.slice(0, 5).map((p: ProyectoCrm) => (
                <div 
                  key={p.id}
                  className="p-4 rounded-xl border border-[#e4e4e7] hover:border-[#a1a1aa] transition-all bg-[#fafafa]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#09090b]">{p.nombre}</h4>
                        <span className="status-badge info text-[0.65rem] uppercase">
                          FASE: {p.fase}
                        </span>
                      </div>
                      <span className="text-xs text-[#71717a] font-medium mt-0.5 block">
                        Cliente: <strong>{p.cliente?.nombre || 'Particular'}</strong> &bull; Responsable: {p.responsable?.nombre || 'Sin asignar'}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-[#09090b]">
                        {formatearMoneda(p.presupuesto)}
                      </span>
                      <span className="text-[0.7rem] text-[#71717a] block">Presupuesto</span>
                    </div>
                  </div>

                  {/* Barra de progreso de Hitos */}
                  <div className="space-y-1 mt-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#71717a] text-[0.7rem]">Avance por hitos</span>
                      <span className="font-mono text-[#09090b]">{p.progreso_porcentaje || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#e4e4e7] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#09090b] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, p.progreso_porcentaje || 0))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Tareas Pendientes & Agenda (4 cols) */}
        <div className="lg:col-span-4 bento-card flex flex-col justify-between">
          <div>
            <div className="bento-card-header">
              <div>
                <h3 className="bento-card-title">Tareas Prioritarias</h3>
                <p className="bento-card-subtitle">Pendientes de gestión y obra</p>
              </div>
              <span className="status-badge warning text-[0.65rem]">
                {tareas.filter((t) => !t.completada).length} PENDIENTES
              </span>
            </div>

            {tareas.length === 0 ? (
              <div className="text-center py-8 text-[#a1a1aa]">
                <span className="material-symbols-rounded text-3xl mb-1">check_circle</span>
                <p className="text-xs font-semibold">Todo al día. No hay tareas pendientes.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {tareas.slice(0, 7).map((t: TareaCrm) => (
                  <div
                    key={t.id}
                    onClick={() => handleToggleTarea(t.id)}
                    className="p-3 rounded-xl border border-[#e4e4e7] bg-white hover:bg-[#fafafa] transition-all cursor-pointer flex items-start gap-3 group"
                  >
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={t.completada}
                        onChange={() => {}}
                        disabled={tareaSeleccionada === t.id}
                        className="rounded border-[#a1a1aa] text-[#09090b] focus:ring-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold leading-snug truncate ${t.completada ? 'line-through text-[#a1a1aa]' : 'text-[#09090b]'}`}>
                        {t.titulo}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[0.68rem] text-[#71717a]">
                        {t.fecha_vencimiento && (
                          <span className="font-mono">
                            {new Date(t.fecha_vencimiento).toLocaleDateString()}
                          </span>
                        )}
                        {t.cliente && <span className="truncate">&bull; {t.cliente.nombre}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#f4f5f7]">
            {onNavigateSection && (
              <button
                onClick={() => onNavigateSection('pipeline')}
                className="w-full btn-secondary-white text-xs justify-center"
              >
                <span className="material-symbols-rounded text-base">add_task</span>
                <span>Nueva Tarea Comercial</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ── BITÁCORA Y ACTIVIDADES RECIENTES (TABLA LIMPIA BENTO) ── */}
      <div className="bento-card">
        <div className="bento-card-header">
          <div>
            <h3 className="bento-card-title">Bitácora de Actividades Recientes</h3>
            <p className="bento-card-subtitle">Registro cronológico de llamadas, visitas de obra, reuniones y notas del equipo</p>
          </div>
          <span className="status-badge neutral text-[0.68rem]">
            {actividades.length} REGISTROS
          </span>
        </div>

        {actividades.length === 0 ? (
          <div className="text-center py-10 text-[#a1a1aa]">
            <span className="material-symbols-rounded text-3xl mb-1">history</span>
            <p className="text-xs font-semibold">Sin actividades registradas recientemente.</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>TIPO</th>
                  <th>DESCRIPCIÓN</th>
                  <th>CLIENTE / PROYECTO</th>
                  <th>RESPONSABLE</th>
                  <th>FECHA</th>
                </tr>
              </thead>
              <tbody>
                {actividades.slice(0, 8).map((act: ActividadCrm) => (
                  <tr key={act.id}>
                    <td>
                      <span className={`status-badge uppercase text-[0.65rem] ${
                        act.tipo === 'visita' ? 'success' :
                        act.tipo === 'reunion' ? 'info' :
                        act.tipo === 'llamada' ? 'warning' : 'neutral'
                      }`}>
                        {act.tipo}
                      </span>
                    </td>
                    <td className="font-semibold text-[#09090b]">{act.descripcion}</td>
                    <td className="text-[#71717a]">
                      {act.cliente?.nombre || act.proyecto?.nombre || 'General'}
                    </td>
                    <td className="text-[#71717a] font-medium">
                      {act.usuario?.nombre || 'Staff'}
                    </td>
                    <td className="font-mono text-xs text-[#71717a]">
                      {act.fecha ? new Date(act.fecha).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
