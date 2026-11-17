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
  const totalVisitas = analiticas.visitasDiarias.reduce((acc, d) => acc + d.visitas, 0) || 1280;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* ── ENCABEZADO MONOCROMÁTICO CON TIPOGRAFÍA ARQUITECTÓNICA ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#e4e4e7]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#09090b]"></span>
            <span className="text-[0.68rem] font-mono font-bold uppercase tracking-[0.16em] text-[#71717a]">
              CONSOLA PRINCIPAL &bull; SYSMICON ARCHITECTURE CRM
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#09090b] uppercase tracking-[0.14em] mt-1.5 leading-tight">
            PANEL DE CONTROL <span className="text-[#a1a1aa] font-medium">&bull; RESUMEN GENERAL</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => crmService.cargarTodo()}
            disabled={cargando}
            className="btn-secondary-white font-mono text-xs uppercase tracking-[0.12em] font-bold"
            title="Sincronizar datos"
          >
            <span className={`material-symbols-rounded text-base ${cargando ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{cargando ? 'SINCRONIZANDO...' : 'ACTUALIZAR'}</span>
          </button>

          {onNavigateSection && (
            <button
              onClick={() => onNavigateSection('pipeline')}
              className="btn-primary-black font-mono text-xs uppercase tracking-[0.12em] font-bold"
            >
              <span className="material-symbols-rounded text-base">view_kanban</span>
              <span>VER PIPELINE</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 4 STAT CARDS BENTO 100% MONOCROMÁTICAS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Clientes Totales */}
        <div 
          onClick={() => onNavigateSection && onNavigateSection('clientes')}
          className="stat-card"
        >
          <div className="stat-card-top">
            <span className="stat-card-label">CLIENTES REGISTRADOS</span>
            <div className="stat-card-icon-box">
              <span className="material-symbols-rounded text-lg">group</span>
            </div>
          </div>
          <div className="stat-number">{kpis.clientes_totales}</div>
          <div className="stat-card-footer">
            <span className="stat-footer-text">{kpis.leads_ultimos_30_dias} LEADS (ÚLTIMOS 30 DÍAS)</span>
            <span className="stat-footer-arrow">→</span>
          </div>
        </div>

        {/* KPI 2: Valor Estimado del Pipeline */}
        <div 
          onClick={() => onNavigateSection && onNavigateSection('pipeline')}
          className="stat-card"
        >
          <div className="stat-card-top">
            <span className="stat-card-label">VALOR ESTIMADO PIPELINE</span>
            <div className="stat-card-icon-box">
              <span className="material-symbols-rounded text-lg">payments</span>
            </div>
          </div>
          <div className="stat-number text-xl sm:text-2xl truncate" title={formatearMoneda(kpis.pipeline_valor_estimado)}>
            {formatearMoneda(kpis.pipeline_valor_estimado)}
          </div>
          <div className="stat-card-footer">
            <span className="stat-footer-text">{kpis.pipeline_oportunidades_activas} EN NEGOCIACIÓN</span>
            <span className="stat-footer-arrow">→</span>
          </div>
        </div>

        {/* KPI 3: Obras de Construcción Activas */}
        <div 
          onClick={() => onNavigateSection && onNavigateSection('proyectos-crm')}
          className="stat-card"
        >
          <div className="stat-card-top">
            <span className="stat-card-label">OBRAS EN EJECUCIÓN</span>
            <div className="stat-card-icon-box">
              <span className="material-symbols-rounded text-lg">foundation</span>
            </div>
          </div>
          <div className="stat-number">{kpis.proyectos_activos}</div>
          <div className="stat-card-footer">
            <span className="stat-footer-text">CONVERSIÓN: {kpis.tasa_conversion_ganadas}%</span>
            <span className="stat-footer-arrow">→</span>
          </div>
        </div>

        {/* KPI 4: Solicitudes Web Sin Leer */}
        <div 
          onClick={() => onNavigateSection && onNavigateSection('mensajes')}
          className="stat-card"
        >
          <div className="stat-card-top">
            <span className="stat-card-label">SOLICITUDES WEB</span>
            <div className="stat-card-icon-box">
              <span className="material-symbols-rounded text-lg">mark_email_unread</span>
            </div>
          </div>
          <div className="stat-number">{countSinLeer}</div>
          <div className="stat-card-footer">
            <span className="stat-footer-text">{mensajes.length} COTIZACIONES TOTALES</span>
            <span className="stat-footer-arrow">→</span>
          </div>
        </div>

      </div>

      {/* ── BENTO HERO CARD OSCURO (#0a0a0a) ── */}
      <div className="bento-welcome">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div>
            <div className="bento-badge">
              <span className="status-dot"></span>
              <span>SISTEMA EN VIVO &bull; SYSMICON ARCHITECTURE</span>
            </div>
            
            <h2 className="bento-title">
              CONSOLA DIRECTIVA <span className="bento-title-accent">&bull; CONTROL OPERATIVO</span>
            </h2>
            
            <p className="bento-desc">
              Supervisión integral de cada obra y oportunidad: prospección comercial de leads, control arquitectónico riguroso y seguimiento cronológico de hitos, tareas y bitácora técnica.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {onNavigateSection && (
                <>
                  <button
                    onClick={() => onNavigateSection('pipeline')}
                    className="btn-primary-white"
                  >
                    <span className="material-symbols-rounded text-base">view_kanban</span>
                    <span>GESTIONAR PIPELINE</span>
                  </button>

                  <button
                    onClick={() => onNavigateSection('clientes')}
                    className="px-4 py-2.5 rounded-xl border border-[#27272a] bg-[#141416] hover:bg-[#1f1f23] text-white font-bold text-xs uppercase tracking-[0.12em] transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-rounded text-base">person_add</span>
                    <span>DIRECTORIO DE CLIENTES</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Métricas Monocromáticas del Hero */}
          <div className="grid grid-cols-2 gap-3.5 lg:w-80 shrink-0">
            <div className="p-4 rounded-xl bg-[#141416] border border-[#27272a]">
              <span className="text-[0.65rem] font-mono font-bold uppercase tracking-[0.14em] text-[#a1a1aa] block">
                CONVERSIÓN
              </span>
              <span className="text-2xl font-mono font-black text-white mt-1 block">
                {kpis.tasa_conversion_ganadas}%
              </span>
              <span className="text-[0.68rem] font-mono text-[#71717a] mt-1 block uppercase">
                Oportunidades ganadas
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#141416] border border-[#27272a]">
              <span className="text-[0.65rem] font-mono font-bold uppercase tracking-[0.14em] text-[#a1a1aa] block">
                TRÁFICO WEB
              </span>
              <span className="text-2xl font-mono font-black text-white mt-1 block">
                {totalVisitas}
              </span>
              <span className="text-[0.68rem] font-mono text-[#71717a] mt-1 block uppercase">
                Visitas registradas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CUADRÍCULA ASIMÉTRICA BENTO (8 cols + 4 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Obras y Proyectos en Curso (8 cols) */}
        <div className="lg:col-span-8 bento-card">
          <div className="bento-card-header">
            <div>
              <h3 className="bento-card-title">OBRAS Y PROYECTOS EN CURSO</h3>
              <p className="bento-card-subtitle">Seguimiento de fases arquitectónicas y porcentaje de hitos completados</p>
            </div>
            {onNavigateSection && (
              <button
                onClick={() => onNavigateSection('proyectos-crm')}
                className="text-xs font-mono font-bold text-[#09090b] hover:text-[#71717a] uppercase tracking-[0.12em] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>VER TODOS</span>
                <span className="material-symbols-rounded text-sm">arrow_forward</span>
              </button>
            )}
          </div>

          {proyectos.length === 0 ? (
            <div className="text-center py-14 border border-dashed border-[#e4e4e7] rounded-xl bg-[#fafafa]">
              <span className="material-symbols-rounded text-4xl text-[#a1a1aa] mb-2 block">apartment</span>
              <p className="text-xs font-mono font-bold uppercase tracking-[0.12em] text-[#09090b]">
                NO HAY OBRAS ACTIVAS EN ESTE MOMENTO
              </p>
              <p className="text-xs text-[#71717a] mt-1 max-w-sm mx-auto">
                Las oportunidades marcadas como "Ganadas" en el Pipeline se convertirán automáticamente en obras en ejecución.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {proyectos.slice(0, 5).map((p: ProyectoCrm) => (
                <div 
                  key={p.id}
                  className="p-4 rounded-xl border border-[#e4e4e7] hover:border-[#09090b] transition-all bg-white hover:shadow-xs group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="font-black text-sm uppercase tracking-wide text-[#09090b]">
                          {p.nombre}
                        </h4>
                        <span className="bg-[#09090b] text-white font-mono text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          FASE: {p.fase}
                        </span>
                      </div>
                      <span className="text-[0.72rem] text-[#71717a] font-medium mt-1 block">
                        Cliente: <strong className="text-[#09090b]">{p.cliente?.nombre || 'Particular'}</strong> &bull; Responsable: {p.responsable?.nombre || 'Sin asignar'}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-mono font-black text-[#09090b] block">
                        {formatearMoneda(p.presupuesto)}
                      </span>
                      <span className="text-[0.65rem] font-mono uppercase tracking-wider text-[#71717a] block">
                        PRESUPUESTO TOTAL
                      </span>
                    </div>
                  </div>

                  {/* Barra de progreso de Hitos */}
                  <div className="space-y-1.5 mt-3 pt-2.5 border-t border-[#f4f5f7]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#71717a] font-mono text-[0.68rem] uppercase tracking-wider">
                        AVANCE DE HITOS
                      </span>
                      <span className="font-mono font-bold text-[#09090b] text-xs">
                        {p.progreso_porcentaje || 0}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#e4e4e7] rounded-full overflow-hidden">
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

        {/* Columna Derecha: Tareas Prioritarias (4 cols) */}
        <div className="lg:col-span-4 bento-card flex flex-col justify-between">
          <div>
            <div className="bento-card-header">
              <div>
                <h3 className="bento-card-title">TAREAS PRIORITARIAS</h3>
                <p className="bento-card-subtitle">Pendientes de gestión y obra</p>
              </div>
              <span className="bg-[#09090b] text-white font-mono text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {tareas.filter((t) => !t.completada).length} PENDIENTES
              </span>
            </div>

            {tareas.length === 0 ? (
              <div className="text-center py-10 text-[#a1a1aa] border border-dashed border-[#e4e4e7] rounded-xl bg-[#fafafa]">
                <span className="material-symbols-rounded text-3xl mb-1 text-[#09090b] block">check_circle</span>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#09090b]">
                  TODO AL DÍA
                </p>
                <p className="text-[0.72rem] text-[#71717a] mt-1">
                  No hay tareas pendientes en la agenda.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {tareas.slice(0, 7).map((t: TareaCrm) => (
                  <div
                    key={t.id}
                    onClick={() => handleToggleTarea(t.id)}
                    className="p-3 rounded-xl border border-[#e4e4e7] bg-white hover:border-[#09090b] transition-all cursor-pointer flex items-start gap-3 group"
                  >
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={t.completada}
                        onChange={() => {}}
                        disabled={tareaSeleccionada === t.id}
                        className="rounded border-[#a1a1aa] text-[#09090b] focus:ring-0 cursor-pointer accent-[#09090b]"
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
                className="w-full btn-secondary-white font-mono text-xs uppercase tracking-[0.12em] font-bold justify-center"
              >
                <span className="material-symbols-rounded text-base">add_task</span>
                <span>NUEVA TAREA COMERCIAL</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ── BITÁCORA Y ACTIVIDADES RECIENTES (TABLA MONOCROMÁTICA BENTO) ── */}
      <div className="bento-card">
        <div className="bento-card-header">
          <div>
            <h3 className="bento-card-title">BITÁCORA DE ACTIVIDADES RECIENTES</h3>
            <p className="bento-card-subtitle">Registro cronológico de llamadas, visitas de obra, reuniones y notas técnicas del equipo</p>
          </div>
          <span className="border border-[#e4e4e7] bg-[#f4f5f7] text-[#09090b] font-mono text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
            {actividades.length} REGISTROS
          </span>
        </div>

        {actividades.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#e4e4e7] rounded-xl bg-[#fafafa]">
            <span className="material-symbols-rounded text-3xl mb-1 text-[#a1a1aa] block">history</span>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#09090b]">
              SIN ACTIVIDADES REGISTRADAS RECIENTEMENTE
            </p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="font-black tracking-[0.14em]">TIPO</th>
                  <th className="font-black tracking-[0.14em]">DESCRIPCIÓN</th>
                  <th className="font-black tracking-[0.14em]">CLIENTE / PROYECTO</th>
                  <th className="font-black tracking-[0.14em]">RESPONSABLE</th>
                  <th className="font-black tracking-[0.14em]">FECHA</th>
                </tr>
              </thead>
              <tbody>
                {actividades.slice(0, 8).map((act: ActividadCrm) => (
                  <tr key={act.id}>
                    <td>
                      <span className={`font-mono text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        act.tipo === 'visita'
                          ? 'bg-[#09090b] text-white'
                          : act.tipo === 'reunion'
                          ? 'bg-[#f4f5f7] text-[#09090b] border border-[#e4e4e7]'
                          : act.tipo === 'llamada'
                          ? 'border border-[#27272a] text-[#09090b]'
                          : 'bg-[#fafafa] text-[#71717a] border border-[#e4e4e7]'
                      }`}>
                        {act.tipo}
                      </span>
                    </td>
                    <td className="font-bold text-[#09090b]">{act.descripcion}</td>
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
