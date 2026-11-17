import React, { useState, useEffect } from 'react';
import {
  crmService,
  useCrmService,
  EtapaOportunidad,
  OportunidadCrm,
  ClienteCrm,
} from '../../../../services/crm.service';

const ETAPAS: { key: EtapaOportunidad; label: string; color: string; badge: string }[] = [
  { key: 'contacto', label: 'Primer Contacto', color: 'border-t-[#3b82f6]', badge: 'info' },
  { key: 'visita', label: 'Visita Técnica', color: 'border-t-[#8b5cf6]', badge: 'purple' },
  { key: 'propuesta', label: 'Propuesta', color: 'border-t-[#f59e0b]', badge: 'warning' },
  { key: 'negociacion', label: 'Negociación', color: 'border-t-[#06b6d4]', badge: 'neutral' },
  { key: 'ganado', label: 'Ganado (Obra)', color: 'border-t-[#16a34a]', badge: 'success' },
  { key: 'perdido', label: 'Perdido', color: 'border-t-[#dc2626]', badge: 'danger' },
];

export const DashPipeline: React.FC = () => {
  const { pipelineKanban, clientes, cargando } = useCrmService();

  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [modalPerdidoId, setModalPerdidoId] = useState<number | null>(null);
  const [motivoPerdida, setMotivoPerdida] = useState<string>('');
  const [notificacion, setNotificacion] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);

  // Formulario nueva oportunidad
  const [nuevoTitulo, setNuevoTitulo] = useState<string>('');
  const [nuevoClienteId, setNuevoClienteId] = useState<number | ''>('');
  const [nuevoTipoServicio, setNuevoTipoServicio] = useState<string>('diseno_construccion_integral');
  const [nuevoValorEstimado, setNuevoValorEstimado] = useState<string>('');
  const [nuevaProbabilidad, setNuevaProbabilidad] = useState<number>(50);
  const [nuevaFechaCierre, setNuevaFechaCierre] = useState<string>('');

  useEffect(() => {
    crmService.cargarPipelineKanban();
    crmService.cargarClientes();
  }, []);

  const formatearMoneda = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const mostrarNotificacion = (texto: string, tipo: 'success' | 'error' = 'success') => {
    setNotificacion({ texto, tipo });
    setTimeout(() => setNotificacion(null), 4000);
  };

  const handleCambiarEtapa = async (id: number, etapa: EtapaOportunidad) => {
    if (etapa === 'perdido') {
      setModalPerdidoId(id);
      setMotivoPerdida('');
      return;
    }

    const exito = await crmService.cambiarEtapaOportunidad(id, etapa);
    if (exito) {
      if (etapa === 'ganado') {
        mostrarNotificacion('¡Oportunidad Ganada! Se ha creado automáticamente la Obra en fase Diseño.', 'success');
      } else {
        mostrarNotificacion(`Oportunidad movida a: ${etapa.toUpperCase()}`);
      }
    } else {
      mostrarNotificacion('Error actualizando etapa de la oportunidad', 'error');
    }
  };

  const handleConfirmarPerdido = async () => {
    if (!modalPerdidoId || !motivoPerdida.trim()) {
      mostrarNotificacion('Debes indicar el motivo de la pérdida.', 'error');
      return;
    }

    const exito = await crmService.cambiarEtapaOportunidad(modalPerdidoId, 'perdido', motivoPerdida.trim());
    if (exito) {
      mostrarNotificacion('Oportunidad marcada como perdida con motivo registrado.');
      setModalPerdidoId(null);
      setMotivoPerdida('');
    } else {
      mostrarNotificacion('No fue posible actualizar la oportunidad.', 'error');
    }
  };

  const handleCrearOportunidad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || !nuevoClienteId) {
      mostrarNotificacion('El título y el cliente son obligatorios.', 'error');
      return;
    }

    const valor = parseFloat(nuevoValorEstimado.replace(/[^0-9]/g, '')) || 0;

    const op = await crmService.crearOportunidad({
      titulo: nuevoTitulo.trim(),
      cliente_id: Number(nuevoClienteId),
      tipo_servicio: nuevoTipoServicio,
      valor_estimado: valor,
      probabilidad: nuevaProbabilidad,
      fecha_cierre_estimada: nuevaFechaCierre || undefined,
    });

    if (op) {
      mostrarNotificacion('Oportunidad registrada exitosamente en el Pipeline.');
      setModalAbierto(false);
      setNuevoTitulo('');
      setNuevoClienteId('');
      setNuevoValorEstimado('');
      setNuevaFechaCierre('');
    } else {
      mostrarNotificacion('Error al registrar la oportunidad.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* ── ALERTA DE NOTIFICACIÓN FLOTANTE ── */}
      {notificacion && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl shadow-lg border text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 animate-bounce ${
            notificacion.tipo === 'success'
              ? 'bg-[#09090b] text-white border-[#27272a]'
              : 'bg-red-600 text-white border-red-700'
          }`}
        >
          <span className="material-symbols-rounded text-sm">
            {notificacion.tipo === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{notificacion.texto}</span>
        </div>
      )}

      {/* ── HEADER DE SECCIÓN ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e4e4e7]">
        <div>
          <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#71717a]">
            CRM COMERCIAL &bull; PIPELINE KANBAN
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#09090b] tracking-tight mt-1">
            Pipeline de <span className="font-light text-[#71717a]">Oportunidades</span>
          </h1>
          <p className="text-xs text-[#71717a] mt-1 font-medium">
            Mueve las oportunidades entre etapas comerciales. Al marcar &quot;Ganado&quot;, se crea automáticamente el proyecto de obra.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => crmService.cargarPipelineKanban()}
            disabled={cargando}
            className="btn-secondary-white text-xs"
          >
            <span className={`material-symbols-rounded text-base ${cargando ? 'animate-spin' : ''}`}>sync</span>
            <span>Actualizar</span>
          </button>
          <button
            onClick={() => setModalAbierto(true)}
            className="btn-primary-black text-xs"
          >
            <span className="material-symbols-rounded text-base">add</span>
            <span>Nueva Oportunidad</span>
          </button>
        </div>
      </div>

      {/* ── KANBAN GRID (6 COLUMNAS) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {ETAPAS.map((etapa) => {
          const colData = pipelineKanban[etapa.key];
          const items: OportunidadCrm[] = colData?.oportunidades || [];
          const totalValor = colData?.valor_acumulado || 0;

          return (
            <div
              key={etapa.key}
              className={`kanban-column border-t-4 ${etapa.color}`}
            >
              {/* Encabezado de Columna */}
              <div className="kanban-column-header">
                <div>
                  <span className="kanban-column-title">{etapa.label}</span>
                  <span className="text-[0.65rem] text-[#71717a] font-mono block mt-0.5">
                    {formatearMoneda(totalValor)}
                  </span>
                </div>
                <span className="kanban-column-count">{items.length}</span>
              </div>

              {/* Lista de Tarjetas */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-0.5 min-h-[380px]">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-[#a1a1aa] border border-dashed border-[#e4e4e7] rounded-xl my-auto">
                    <span className="material-symbols-rounded text-2xl mb-1">hourglass_empty</span>
                    <p className="text-[0.7rem] font-semibold">Sin oportunidades</p>
                  </div>
                ) : (
                  items.map((op: OportunidadCrm) => (
                    <div key={op.id} className="kanban-card group">
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <h4 className="font-bold text-xs text-[#09090b] leading-tight group-hover:text-[#2563eb] transition-colors">
                          {op.titulo}
                        </h4>
                        <span className="text-[0.65rem] font-mono font-bold text-[#71717a] bg-[#f4f5f7] px-1.5 py-0.5 rounded shrink-0">
                          {op.probabilidad}%
                        </span>
                      </div>

                      <p className="text-[0.7rem] text-[#71717a] font-medium truncate mb-2">
                        {op.cliente?.nombre || 'Cliente sin asignar'}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-[#f4f5f7] text-[0.72rem]">
                        <span className="font-mono font-black text-[#09090b]">
                          {formatearMoneda(op.valor_estimado)}
                        </span>
                      </div>

                      {op.motivo_perdida && (
                        <p className="text-[0.65rem] text-red-600 font-medium mt-1.5 bg-red-50 p-1.5 rounded border border-red-200">
                          Motivo: {op.motivo_perdida}
                        </p>
                      )}

                      {/* Selector Rápido de Etapa */}
                      <div className="mt-3 pt-2 border-t border-[#f4f5f7] flex items-center justify-between gap-1">
                        <span className="text-[0.62rem] uppercase font-bold text-[#a1a1aa]">Mover:</span>
                        <select
                          value={op.etapa}
                          onChange={(e) => handleCambiarEtapa(op.id, e.target.value as EtapaOportunidad)}
                          className="text-[0.68rem] font-bold bg-[#f4f5f7] border border-[#e4e4e7] rounded px-1.5 py-1 text-[#09090b] outline-none cursor-pointer hover:bg-white"
                        >
                          <option value="contacto">Contacto</option>
                          <option value="visita">Visita</option>
                          <option value="propuesta">Propuesta</option>
                          <option value="negociacion">Negociación</option>
                          <option value="ganado">Ganado</option>
                          <option value="perdido">Perdido</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MODAL: NUEVA OPORTUNIDAD ── */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e4e4e7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7] mb-5">
              <div>
                <span className="text-[0.68rem] font-black uppercase tracking-wider text-[#71717a]">
                  REGISTRO COMERCIAL
                </span>
                <h3 className="text-xl font-black text-[#09090b]">Nueva Oportunidad</h3>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="w-8 h-8 rounded-full bg-[#f4f5f7] text-[#71717a] hover:text-[#09090b] flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCrearOportunidad} className="space-y-4">
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Título de la Oportunidad *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Construcción Casa Campestre El Refugio"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="input-minimal"
                />
              </div>

              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Cliente Vinculado *
                </label>
                <select
                  required
                  value={nuevoClienteId}
                  onChange={(e) => setNuevoClienteId(e.target.value === '' ? '' : Number(e.target.value))}
                  className="input-minimal"
                >
                  <option value="">Selecciona un cliente...</option>
                  {clientes.map((c: ClienteCrm) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({c.tipo === 'empresa' ? 'Empresa' : 'Persona'}) - {c.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Tipo de Servicio
                  </label>
                  <select
                    value={nuevoTipoServicio}
                    onChange={(e) => setNuevoTipoServicio(e.target.value)}
                    className="input-minimal"
                  >
                    <option value="diseno_construccion_integral">Diseño y Construcción Integral</option>
                    <option value="diseno_arquitectonico">Diseño Arquitectónico</option>
                    <option value="construccion_obra_gris">Construcción Obra Gris</option>
                    <option value="remodelacion">Remodelación Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Valor Estimado (COP)
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 350000000"
                    value={nuevoValorEstimado}
                    onChange={(e) => setNuevoValorEstimado(e.target.value)}
                    className="input-minimal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Probabilidad de Éxito: {nuevaProbabilidad}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={nuevaProbabilidad}
                    onChange={(e) => setNuevaProbabilidad(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Fecha Cierre Estimada
                  </label>
                  <input
                    type="date"
                    value={nuevaFechaCierre}
                    onChange={(e) => setNuevaFechaCierre(e.target.value)}
                    className="input-minimal"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e4e4e7]">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="btn-secondary-white text-xs"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-black text-xs">
                  Guardar Oportunidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: MOTIVO DE PÉRDIDA OBLIGATORIO ── */}
      {modalPerdidoId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e4e4e7] rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center gap-2.5 text-red-600 mb-3">
              <span className="material-symbols-rounded text-2xl">warning</span>
              <h3 className="text-lg font-black text-[#09090b]">Marcar como Perdida</h3>
            </div>
            <p className="text-xs text-[#71717a] mb-4">
              Por regla de negocio del CRM, para cerrar una oportunidad en estado &quot;Perdido&quot; es obligatorio registrar el motivo exacto para análisis de conversión.
            </p>

            <textarea
              required
              rows={3}
              placeholder="Ej: El cliente optó por otra propuesta por presupuesto / Proyecto aplazado para 2027..."
              value={motivoPerdida}
              onChange={(e) => setMotivoPerdida(e.target.value)}
              className="w-full p-3 bg-[#f9f9f9] border border-[#e4e4e7] rounded-xl text-xs text-[#09090b] outline-none focus:bg-white focus:border-black mb-4"
            ></textarea>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalPerdidoId(null)}
                className="btn-secondary-white text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarPerdido}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Confirmar Pérdida
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
