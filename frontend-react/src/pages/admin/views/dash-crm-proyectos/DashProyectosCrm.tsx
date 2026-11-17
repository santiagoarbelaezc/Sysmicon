import React, { useState, useEffect, useMemo } from 'react';
import {
  crmService,
  useCrmService,
  ProyectoCrm,
  HitoCrm,
  FaseProyecto,
  EstadoProyecto,
  ClienteCrm,
} from '../../../../services/crm.service';

export const DashProyectosCrm: React.FC = () => {
  const { proyectos, clientes, cargando } = useCrmService();

  const [filtroFase, setFiltroFase] = useState<string>('todos');
  const [modalProyectoAbierto, setModalProyectoAbierto] = useState<boolean>(false);
  const [modalHitoProyectoId, setModalHitoProyectoId] = useState<number | null>(null);
  const [nuevoHitoNombre, setNuevoHitoNombre] = useState<string>('');
  const [nuevoHitoFecha, setNuevoHitoFecha] = useState<string>('');
  const [notificacion, setNotificacion] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);

  // Formulario nuevo proyecto
  const [nombre, setNombre] = useState<string>('');
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [tipo, setTipo] = useState<string>('vivienda');
  const [fase, setFase] = useState<FaseProyecto>('diseno');
  const [presupuesto, setPresupuesto] = useState<string>('');
  const [direccionObra, setDireccionObra] = useState<string>('');
  const [fechaInicio, setFechaInicio] = useState<string>('');

  useEffect(() => {
    crmService.cargarProyectos();
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
    setTimeout(() => setNotificacion(null), 3500);
  };

  const proyectosFiltrados = useMemo(() => {
    if (filtroFase === 'todos') return proyectos;
    return proyectos.filter((p) => p.fase === filtroFase);
  }, [proyectos, filtroFase]);

  const handleToggleHito = async (hitoId: number) => {
    const exito = await crmService.toggleHito(hitoId);
    if (exito) {
      mostrarNotificacion('Hito de avance actualizado');
    }
  };

  const handleCrearHito = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalHitoProyectoId || !nuevoHitoNombre.trim()) return;

    const res = await crmService.crearHito({
      proyecto_id: modalHitoProyectoId,
      nombre: nuevoHitoNombre.trim(),
      fecha_estimada: nuevoHitoFecha || undefined,
    });

    if (res) {
      mostrarNotificacion('Hito añadido al cronograma de obra.');
      setModalHitoProyectoId(null);
      setNuevoHitoNombre('');
      setNuevoHitoFecha('');
    } else {
      mostrarNotificacion('Error al crear el hito.', 'error');
    }
  };

  const handleCrearProyecto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !clienteId) {
      mostrarNotificacion('Nombre y cliente son obligatorios.', 'error');
      return;
    }

    const valPresupuesto = parseFloat(presupuesto.replace(/[^0-9]/g, '')) || 0;

    const res = await crmService.crearProyecto({
      nombre: nombre.trim(),
      cliente_id: Number(clienteId),
      tipo,
      fase,
      estado: 'activo' as EstadoProyecto,
      presupuesto: valPresupuesto,
      direccion_obra: direccionObra.trim() || undefined,
      fecha_inicio: fechaInicio || undefined,
    });

    if (res) {
      mostrarNotificacion('Proyecto de obra registrado exitosamente.');
      setModalProyectoAbierto(false);
      setNombre('');
      setClienteId('');
      setPresupuesto('');
      setDireccionObra('');
    } else {
      mostrarNotificacion('Error al crear el proyecto.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* ── NOTIFICACIÓN TOAST ── */}
      {notificacion && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl shadow-lg border text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 animate-bounce ${
            notificacion.tipo === 'success' ? 'bg-[#09090b] text-white border-[#27272a]' : 'bg-red-600 text-white'
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
            CRM &bull; CONTROL DE EJECUCIÓN &amp; OBRAS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#09090b] tracking-tight mt-1">
            Proyectos de <span className="font-light text-[#71717a]">Construcción</span>
          </h1>
          <p className="text-xs text-[#71717a] mt-1 font-medium">
            Seguimiento de cronogramas, fases de licencias y ejecución, hitos de avance y presupuestos contratados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => crmService.cargarProyectos()}
            disabled={cargando}
            className="btn-secondary-white text-xs"
          >
            <span className={`material-symbols-rounded text-base ${cargando ? 'animate-spin' : ''}`}>sync</span>
            <span>Actualizar</span>
          </button>
          <button
            onClick={() => setModalProyectoAbierto(true)}
            className="btn-primary-black text-xs"
          >
            <span className="material-symbols-rounded text-base">add</span>
            <span>Nueva Obra</span>
          </button>
        </div>
      </div>

      {/* ── FILTROS POR FASE ── */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {['todos', 'diseno', 'licencias', 'obra', 'entregado'].map((f) => (
          <button
            key={f}
            onClick={() => setFiltroFase(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              filtroFase === f
                ? 'bg-[#09090b] text-white shadow-xs'
                : 'bg-white border border-[#e4e4e7] text-[#71717a] hover:text-[#09090b]'
            }`}
          >
            {f === 'todos' ? 'Todas las Obras' : `Fase ${f}`}
          </button>
        ))}
      </div>

      {/* ── GRID DE TARJETAS BENTO DE PROYECTOS ── */}
      {proyectosFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-[#e4e4e7] rounded-3xl text-[#a1a1aa]">
          <span className="material-symbols-rounded text-4xl mb-2">construction</span>
          <h4 className="text-sm font-bold text-[#09090b]">No se encontraron proyectos en esta fase</h4>
          <p className="text-xs text-[#71717a] mt-1">Crea una nueva obra o gana una oportunidad desde el Pipeline.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {proyectosFiltrados.map((p: ProyectoCrm) => (
            <div key={p.id} className="bento-card flex flex-col justify-between">
              <div>
                {/* Cabecera del Proyecto */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[0.65rem] font-bold text-[#71717a] uppercase tracking-wider">
                      CLIENTE: {p.cliente?.nombre || 'Particular'}
                    </span>
                    <h3 className="text-base font-black text-[#09090b] mt-0.5">{p.nombre}</h3>
                    {p.direccion_obra && (
                      <p className="text-xs text-[#71717a] mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-rounded text-sm">location_on</span>
                        <span>{p.direccion_obra}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className={`status-badge uppercase text-[0.65rem] ${
                      p.fase === 'obra' ? 'warning' :
                      p.fase === 'entregado' ? 'success' :
                      p.fase === 'licencias' ? 'purple' : 'info'
                    }`}>
                      FASE: {p.fase}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#09090b] mt-1">
                      {formatearMoneda(p.presupuesto)}
                    </span>
                  </div>
                </div>

                {/* Barra de Progreso de Hitos */}
                <div className="p-3.5 rounded-xl bg-[#fafafa] border border-[#e4e4e7] mb-4">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#71717a] text-[0.7rem] uppercase tracking-wider">Avance General</span>
                    <span className="font-mono text-[#09090b]">{p.progreso_porcentaje || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#e4e4e7] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#09090b] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, p.progreso_porcentaje || 0))}%` }}
                    ></div>
                  </div>
                </div>

                {/* Lista de Hitos */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[#71717a]">
                      HITOS DE CONSTRUCCIÓN ({p.hitos?.length || 0})
                    </span>
                    <button
                      onClick={() => {
                        setModalHitoProyectoId(p.id);
                        setNuevoHitoNombre('');
                        setNuevoHitoFecha('');
                      }}
                      className="text-[0.68rem] font-bold text-[#2563eb] hover:underline uppercase inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-rounded text-sm">add</span>
                      <span>Añadir Hito</span>
                    </button>
                  </div>

                  {(!p.hitos || p.hitos.length === 0) ? (
                    <p className="text-xs text-[#a1a1aa] italic py-1">Sin hitos programados todavía.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {p.hitos.map((h: HitoCrm) => (
                        <div
                          key={h.id}
                          onClick={() => handleToggleHito(h.id)}
                          className="flex items-center justify-between p-2 rounded-lg border border-[#e4e4e7] bg-white hover:bg-[#fafafa] transition-colors cursor-pointer text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={h.completado}
                              onChange={() => {}}
                              className="rounded border-[#a1a1aa] text-[#09090b] focus:ring-0 cursor-pointer"
                            />
                            <span className={h.completado ? 'line-through text-[#a1a1aa]' : 'text-[#09090b] font-medium'}>
                              {h.nombre}
                            </span>
                          </div>
                          {h.fecha_estimada && (
                            <span className="text-[0.65rem] font-mono text-[#71717a]">
                              {new Date(h.fecha_estimada).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pie de tarjeta */}
              <div className="pt-3 border-t border-[#f4f5f7] flex items-center justify-between text-xs text-[#71717a]">
                <span>Responsable: <strong>{p.responsable?.nombre || 'Equipo Sysmicon'}</strong></span>
                {p.fecha_inicio && (
                  <span className="font-mono text-[0.7rem]">Inicio: {p.fecha_inicio}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL: NUEVA OBRA / PROYECTO ── */}
      {modalProyectoAbierto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e4e4e7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7] mb-5">
              <div>
                <span className="text-[0.68rem] font-black uppercase tracking-wider text-[#71717a]">
                  CRM DE OBRAS
                </span>
                <h3 className="text-xl font-black text-[#09090b]">Nuevo Proyecto de Obra</h3>
              </div>
              <button
                onClick={() => setModalProyectoAbierto(false)}
                className="w-8 h-8 rounded-full bg-[#f4f5f7] text-[#71717a] hover:text-[#09090b] flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCrearProyecto} className="space-y-4">
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Nombre de la Obra *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Residencia Campestre Los Sauces"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="input-minimal"
                />
              </div>

              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Cliente Vinculado *
                </label>
                <select
                  required
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value === '' ? '' : Number(e.target.value))}
                  className="input-minimal"
                >
                  <option value="">Selecciona el cliente...</option>
                  {clientes.map((c: ClienteCrm) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Fase Inicial
                  </label>
                  <select
                    value={fase}
                    onChange={(e) => setFase(e.target.value as FaseProyecto)}
                    className="input-minimal"
                  >
                    <option value="diseno">Fase Diseño</option>
                    <option value="licencias">Fase Licencias</option>
                    <option value="obra">Fase Obra</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Presupuesto Contratado (COP)
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 450000000"
                    value={presupuesto}
                    onChange={(e) => setPresupuesto(e.target.value)}
                    className="input-minimal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Dirección o Ubicación de Obra
                </label>
                <input
                  type="text"
                  placeholder="Ej: Km 4 Vía La Tebaida, Armenia"
                  value={direccionObra}
                  onChange={(e) => setDireccionObra(e.target.value)}
                  className="input-minimal"
                />
              </div>

              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Fecha de Inicio de Obra
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="input-minimal"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e4e4e7]">
                <button
                  type="button"
                  onClick={() => setModalProyectoAbierto(false)}
                  className="btn-secondary-white text-xs"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-black text-xs">
                  Guardar Obra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: AÑADIR HITO ── */}
      {modalHitoProyectoId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e4e4e7] rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7] mb-4">
              <h3 className="text-base font-black text-[#09090b]">Nuevo Hito de Construcción</h3>
              <button
                onClick={() => setModalHitoProyectoId(null)}
                className="w-7 h-7 rounded-full bg-[#f4f5f7] text-[#71717a] flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCrearHito} className="space-y-4">
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Nombre del Hito *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cimentación terminada / Vaciado de losa / Cubierta"
                  value={nuevoHitoNombre}
                  onChange={(e) => setNuevoHitoNombre(e.target.value)}
                  className="input-minimal"
                />
              </div>

              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Fecha Estimada de Cumplimiento
                </label>
                <input
                  type="date"
                  value={nuevoHitoFecha}
                  onChange={(e) => setNuevoHitoFecha(e.target.value)}
                  className="input-minimal"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e4e4e7]">
                <button
                  type="button"
                  onClick={() => setModalHitoProyectoId(null)}
                  className="btn-secondary-white text-xs"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-black text-xs">
                  Guardar Hito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
