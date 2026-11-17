import React, { useEffect, useState } from 'react';
import { crmService, useCrmService, ProyectoCrm, TareaCrm, ActividadCrm } from '../../../../services/crm.service';
import { adminService, useAdminService, MensajeAdmin } from '../../../../services/admin.service';

interface DashInicioProps {
  onNavigateSection?: (section: string) => void;
}

export const DashInicio: React.FC<DashInicioProps> = ({ onNavigateSection }) => {
  const { kpis, pipelineKanban, proyectos, tareas, actividades, cargando } = useCrmService();
  const { mensajes } = useAdminService();

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
  const tareasPendientes = tareas.filter((t) => !t.completada);

  // Conteo rápido por etapa en pipeline
  const conteoPorEtapa = {
    contacto: pipelineKanban?.contacto?.total_items ?? pipelineKanban?.contacto?.oportunidades?.length ?? 0,
    visita: pipelineKanban?.visita?.total_items ?? pipelineKanban?.visita?.oportunidades?.length ?? 0,
    propuesta: pipelineKanban?.propuesta?.total_items ?? pipelineKanban?.propuesta?.oportunidades?.length ?? 0,
    negociacion: pipelineKanban?.negociacion?.total_items ?? pipelineKanban?.negociacion?.oportunidades?.length ?? 0,
    ganado: pipelineKanban?.ganado?.total_items ?? pipelineKanban?.ganado?.oportunidades?.length ?? 0,
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* ── HEADER DE SECCIÓN NORMALIZADO ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e4e4e7]">
        <div>
          <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#71717a]">
            SISTEMA INTEGRAL &bull; PANEL EJECUTIVO
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#09090b] tracking-tight mt-1">
            Panel de <span className="font-light text-[#71717a]">Control</span>
          </h1>
          <p className="text-xs text-[#71717a] mt-1 font-medium">
            Resumen general del estado comercial, obras arquitectónicas en ejecución y solicitudes web.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => crmService.cargarTodo()}
            disabled={cargando}
            className="btn-secondary-white text-xs"
          >
            <span className={`material-symbols-rounded text-base ${cargando ? 'animate-spin' : ''}`}>sync</span>
            <span>Actualizar</span>
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

      {/* ── BENTO STATS SUMMARY NORMALIZADO ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Pipeline Comercial */}
        <div 
          onClick={() => onNavigateSection && onNavigateSection('pipeline')}
          className="stat-card stat-accent-blue py-4"
        >
          <span className="stat-card-label">VALOR ESTIMADO PIPELINE</span>
          <div className="stat-number text-2xl sm:text-3xl my-2 truncate" title={formatearMoneda(kpis.pipeline_valor_estimado)}>
            {formatearMoneda(kpis.pipeline_valor_estimado)}
          </div>
          <span className="stat-footer-text">{kpis.pipeline_oportunidades_activas} oportunidades en negociación</span>
        </div>

        {/* KPI 2: Obras en Ejecución */}
        <div 
          onClick={() => onNavigateSection && onNavigateSection('proyectos-crm')}
          className="stat-card stat-accent-green py-4"
        >
          <span className="stat-card-label">OBRAS EN EJECUCIÓN</span>
          <div className="stat-number text-2xl sm:text-3xl my-2">{kpis.proyectos_activos}</div>
          <span className="stat-footer-text">Tasa de éxito comercial: {kpis.tasa_conversion_ganadas}%</span>
        </div>

        {/* KPI 3: Clientes Registrados */}
        <div 
          onClick={() => onNavigateSection && onNavigateSection('clientes')}
          className="stat-card stat-accent-purple py-4"
        >
          <span className="stat-card-label">CLIENTES &amp; LEADS</span>
          <div className="stat-number text-2xl sm:text-3xl my-2">{kpis.clientes_totales}</div>
          <span className="stat-footer-text">{kpis.leads_ultimos_30_dias} registrados en los últimos 30 días</span>
        </div>

        {/* KPI 4: Solicitudes Web */}
        <div 
          onClick={() => onNavigateSection && onNavigateSection('mensajes')}
          className="stat-card stat-accent-red py-4"
        >
          <span className="stat-card-label">SOLICITUDES WEB</span>
          <div className="stat-number text-2xl sm:text-3xl my-2">{countSinLeer}</div>
          <span className="stat-footer-text">{mensajes.length} cotizaciones totales recibidas</span>
        </div>

      </div>

      {/* ── CUADRÍCULA BENTO PRINCIPAL (8 COLS OPERACIONES + 4 COLS GESTIÓN INMEDIATA) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ════════════════════════════════════════════════════
             COLUMNA IZQUIERDA (8 COLS): OBRAS + BITÁCORA
             ════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* BLOQUE A: Obras y Proyectos en Curso */}
          <div className="bento-card">
            <div className="bento-card-header">
              <div>
                <h3 className="bento-card-title">Obras y Proyectos en Curso</h3>
                <p className="bento-card-subtitle">Seguimiento de fases arquitectónicas, hitos constructivos y presupuesto</p>
              </div>
              {onNavigateSection && (
                <button
                  onClick={() => onNavigateSection('proyectos-crm')}
                  className="text-xs font-bold text-[#09090b] hover:underline uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver todas</span>
                  <span className="material-symbols-rounded text-sm">arrow_forward</span>
                </button>
              )}
            </div>

            {proyectos.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#e4e4e7] rounded-xl bg-[#fafafa]">
                <span className="material-symbols-rounded text-4xl text-[#a1a1aa] mb-2 block">foundation</span>
                <p className="text-sm font-semibold text-[#09090b]">
                  No hay obras activas en este momento
                </p>
                <p className="text-xs text-[#71717a] mt-1 max-w-sm mx-auto">
                  Las oportunidades ganadas en el Pipeline Comercial se convertirán automáticamente en obras aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {proyectos.slice(0, 4).map((p: ProyectoCrm) => (
                  <div 
                    key={p.id}
                    className="p-4 rounded-xl border border-[#e4e4e7] hover:border-[#a1a1aa] transition-all bg-[#fafafa] hover:bg-white"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="font-bold text-sm text-[#09090b]">
                            {p.nombre}
                          </h4>
                          <span className="status-badge info text-[0.65rem] uppercase">
                            FASE: {p.fase}
                          </span>
                        </div>
                        <span className="text-xs text-[#71717a] font-medium mt-1 block">
                          Cliente: <strong className="text-[#09090b]">{p.cliente?.nombre || 'Particular'}</strong> &bull; Responsable: {p.responsable?.nombre || 'Sin asignar'}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-mono font-bold text-[#09090b] block">
                          {formatearMoneda(p.presupuesto)}
                        </span>
                        <span className="text-[0.68rem] text-[#71717a] block">
                          Presupuesto
                        </span>
                      </div>
                    </div>

                    {/* Barra de progreso de Hitos */}
                    <div className="space-y-1 mt-3 pt-2.5 border-t border-[#e4e4e7]">
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

          {/* BLOQUE B: Bitácora de Actividades Recientes */}
          <div className="bento-card">
            <div className="bento-card-header">
              <div>
                <h3 className="bento-card-title">Bitácora de Actividades Recientes</h3>
                <p className="bento-card-subtitle">Registro cronológico de llamadas, visitas de obra, reuniones y notas técnicas del equipo</p>
              </div>
              <span className="status-badge neutral text-[0.68rem]">
                {actividades.length} REGISTROS
              </span>
            </div>

            {actividades.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-[#e4e4e7] rounded-xl bg-[#fafafa]">
                <span className="material-symbols-rounded text-3xl mb-1 text-[#a1a1aa] block">history</span>
                <p className="text-xs font-semibold text-[#71717a]">
                  Sin actividades registradas recientemente.
                </p>
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
                    {actividades.slice(0, 6).map((act: ActividadCrm) => (
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

        {/* ════════════════════════════════════════════════════
             COLUMNA DERECHA (4 COLS): TAREAS + EMBUDO + SOLICITUDES
             ════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* BLOQUE C: Tareas Prioritarias */}
          <div className="bento-card">
            <div className="bento-card-header">
              <div>
                <h3 className="bento-card-title">Tareas Prioritarias</h3>
                <p className="bento-card-subtitle">Pendientes de gestión y obra</p>
              </div>
              <span className="status-badge warning text-[0.65rem]">
                {tareasPendientes.length} PENDIENTES
              </span>
            </div>

            {tareas.length === 0 ? (
              <div className="text-center py-10 text-[#a1a1aa] border border-dashed border-[#e4e4e7] rounded-xl bg-[#fafafa]">
                <span className="material-symbols-rounded text-3xl mb-1 text-[#09090b] block">check_circle</span>
                <p className="text-xs font-semibold text-[#09090b]">
                  Todo al día. No hay tareas pendientes.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {tareas.slice(0, 6).map((t: TareaCrm) => (
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

            <div className="pt-3 mt-3 border-t border-[#f4f5f7]">
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

          {/* BLOQUE D: Embudo Comercial (Pipeline Funnel Summary) */}
          <div className="bento-card">
            <div className="bento-card-header">
              <div>
                <h3 className="bento-card-title">Embudo Comercial</h3>
                <p className="bento-card-subtitle">Distribución de oportunidades activas</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#09090b]">
                {kpis.pipeline_oportunidades_activas} EN CURSO
              </span>
            </div>

            <div className="space-y-2">
              {[
                { key: 'contacto', label: '1. Contacto Inicial', count: conteoPorEtapa.contacto },
                { key: 'visita', label: '2. Visita Técnica', count: conteoPorEtapa.visita },
                { key: 'propuesta', label: '3. Propuesta Enviada', count: conteoPorEtapa.propuesta },
                { key: 'negociacion', label: '4. Negociación', count: conteoPorEtapa.negociacion },
                { key: 'ganado', label: '5. Oportunidades Ganadas', count: conteoPorEtapa.ganado },
              ].map((etapa) => (
                <div key={etapa.key} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#fafafa] border border-[#e4e4e7]">
                  <span className="font-semibold text-[#09090b]">{etapa.label}</span>
                  <span className="font-mono font-bold text-[#09090b] px-2 py-0.5 rounded bg-white border border-[#e4e4e7]">
                    {etapa.count}
                  </span>
                </div>
              ))}
            </div>

            {onNavigateSection && (
              <div className="pt-3 mt-3 border-t border-[#f4f5f7]">
                <button
                  onClick={() => onNavigateSection('pipeline')}
                  className="w-full btn-primary-black text-xs justify-center"
                >
                  <span className="material-symbols-rounded text-base">view_kanban</span>
                  <span>Ver Kanban Completo</span>
                </button>
              </div>
            )}
          </div>

          {/* BLOQUE E: Solicitudes Web Recientes */}
          <div className="bento-card">
            <div className="bento-card-header">
              <div>
                <h3 className="bento-card-title">Solicitudes Recientes</h3>
                <p className="bento-card-subtitle">Consultas y cotizaciones recibidas</p>
              </div>
              {countSinLeer > 0 && (
                <span className="status-badge danger text-[0.65rem]">
                  {countSinLeer} SIN LEER
                </span>
              )}
            </div>

            {mensajes.length === 0 ? (
              <div className="text-center py-6 text-[#a1a1aa]">
                <p className="text-xs font-semibold text-[#71717a]">
                  Sin mensajes recibidos.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {mensajes.slice(0, 3).map((m: MensajeAdmin) => (
                  <div
                    key={m.id}
                    onClick={() => onNavigateSection && onNavigateSection('mensajes')}
                    className="p-3 rounded-xl border border-[#e4e4e7] hover:border-[#a1a1aa] transition-all cursor-pointer bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#09090b] truncate">{m.remitente || 'Contacto'}</span>
                      <span className="font-mono text-[0.65rem] text-[#71717a]">
                        {m.created_at || m.fecha ? new Date(m.created_at || m.fecha || '').toLocaleDateString() : 'Hoy'}
                      </span>
                    </div>
                    <p className="text-[0.72rem] text-[#71717a] line-clamp-1 mt-0.5">{m.asunto || m.contenido}</p>
                  </div>
                ))}
              </div>
            )}

            {onNavigateSection && (
              <div className="pt-3 mt-3 border-t border-[#f4f5f7]">
                <button
                  onClick={() => onNavigateSection('mensajes')}
                  className="w-full btn-secondary-white text-xs justify-center"
                >
                  <span className="material-symbols-rounded text-base">mail</span>
                  <span>Ir a Mensajes</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
