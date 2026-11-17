import React, { useState, useEffect, useMemo } from 'react';
import {
  crmService,
  useCrmService,
  PqrCrm,
  EstadoPqr,
} from '../../../../services/crm.service';

export const DashPqr: React.FC = () => {
  const { pqrs, cargando } = useCrmService();

  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [pqrSeleccionado, setPqrSeleccionado] = useState<PqrCrm | null>(null);
  const [modalResponderAbierto, setModalResponderAbierto] = useState<boolean>(false);
  const [textoRespuesta, setTextoRespuesta] = useState<string>('');
  const [notificacion, setNotificacion] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);

  useEffect(() => {
    crmService.cargarPqrs();
  }, []);

  const mostrarNotificacion = (texto: string, tipo: 'success' | 'error' = 'success') => {
    setNotificacion({ texto, tipo });
    setTimeout(() => setNotificacion(null), 3500);
  };

  const pqrsFiltrados = useMemo(() => {
    let list = pqrs;
    const q = busqueda.trim().toLowerCase();

    if (filtroEstado !== 'todos') {
      list = list.filter((p) => p.estado === filtroEstado);
    }

    if (q) {
      list = list.filter(
        (p) =>
          p.radicado.toLowerCase().includes(q) ||
          p.nombre_completo.toLowerCase().includes(q) ||
          p.correo.toLowerCase().includes(q) ||
          p.asunto.toLowerCase().includes(q)
      );
    }

    return list;
  }, [pqrs, busqueda, filtroEstado]);

  const handleResponder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pqrSeleccionado || !textoRespuesta.trim()) return;

    const exito = await crmService.responderPqr(pqrSeleccionado.id, textoRespuesta.trim());
    if (exito) {
      mostrarNotificacion(`Respuesta formal registrada para radicado ${pqrSeleccionado.radicado}.`);
      setModalResponderAbierto(false);
      setTextoRespuesta('');
      setPqrSeleccionado(null);
    } else {
      mostrarNotificacion('Error al enviar la respuesta.', 'error');
    }
  };

  const handleCambiarEstado = async (id: number, estado: EstadoPqr) => {
    const exito = await crmService.cambiarEstadoPqr(id, estado);
    if (exito) {
      mostrarNotificacion('Estado del PQR actualizado');
    }
  };

  const calcularDiasRestantes = (fechaLimite?: string) => {
    if (!fechaLimite) return null;
    const fin = new Date(fechaLimite);
    const hoy = new Date();
    const diff = Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
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
            ATENCIÓN AL CLIENTE &bull; TRÁMITES LEGALES
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#09090b] tracking-tight mt-1">
            Gestión de <span className="font-light text-[#71717a]">PQRs</span>
          </h1>
          <p className="text-xs text-[#71717a] mt-1 font-medium">
            Radicación y respuestas formales a peticiones, quejas, reclamos y sugerencias dentro del plazo legal de 15 días.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => crmService.cargarPqrs()}
            disabled={cargando}
            className="btn-secondary-white text-xs"
          >
            <span className={`material-symbols-rounded text-base ${cargando ? 'animate-spin' : ''}`}>sync</span>
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* ── BENTO CARD CON TABLA DE PQRS ── */}
      <div className="bento-card">
        {/* Barra de Filtros */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
          <div className="input-minimal-wrapper w-full sm:max-w-md">
            <span className="material-symbols-rounded input-icon">search</span>
            <input
              type="text"
              placeholder="Buscar por radicado, ciudadano, correo o asunto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-minimal"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[0.68rem] font-bold text-[#71717a] uppercase tracking-wider">Estado:</span>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="text-xs font-semibold bg-[#f4f5f7] border border-[#e4e4e7] rounded-lg px-2.5 py-1.5 text-[#09090b] outline-none"
            >
              <option value="todos">Todos los Estados</option>
              <option value="radicado">Radicado</option>
              <option value="en_tramite">En Trámite</option>
              <option value="respondido">Respondido</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        {pqrsFiltrados.length === 0 ? (
          <div className="text-center py-12 text-[#a1a1aa] border border-dashed border-[#e4e4e7] rounded-xl">
            <span className="material-symbols-rounded text-3xl mb-1">mark_chat_read</span>
            <p className="text-sm font-semibold">No hay PQRs registradas con este filtro</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>RADICADO</th>
                  <th>TIPO</th>
                  <th>CIUDADANO</th>
                  <th>ASUNTO</th>
                  <th>PLAZO LEGAL</th>
                  <th>ESTADO</th>
                  <th className="text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {pqrsFiltrados.map((pqr: PqrCrm) => {
                  const diasRestantes = calcularDiasRestantes(pqr.fecha_limite_respuesta);
                  const estaVencido = diasRestantes !== null && diasRestantes < 0;

                  return (
                    <tr key={pqr.id}>
                      <td className="font-mono font-bold text-xs text-[#09090b]">
                        {pqr.radicado}
                      </td>
                      <td>
                        <span className={`status-badge uppercase text-[0.65rem] ${
                          pqr.tipo === 'queja' || pqr.tipo === 'reclamo' ? 'danger' :
                          pqr.tipo === 'peticion' ? 'info' : 'success'
                        }`}>
                          {pqr.tipo}
                        </span>
                      </td>
                      <td>
                        <div className="font-bold text-xs text-[#09090b]">{pqr.nombre_completo}</div>
                        <span className="text-[0.7rem] text-[#71717a]">{pqr.correo}</span>
                      </td>
                      <td className="max-w-[220px]">
                        <div className="font-semibold text-xs text-[#09090b] truncate">{pqr.asunto}</div>
                        <p className="text-[0.68rem] text-[#71717a] truncate">{pqr.descripcion}</p>
                      </td>
                      <td>
                        {pqr.estado === 'respondido' || pqr.estado === 'cerrado' ? (
                          <span className="text-[0.7rem] text-[#16a34a] font-bold">Atendido</span>
                        ) : diasRestantes !== null ? (
                          <span className={`text-[0.7rem] font-bold font-mono px-2 py-0.5 rounded ${
                            estaVencido ? 'bg-red-100 text-red-700' :
                            diasRestantes <= 3 ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-[#09090b]'
                          }`}>
                            {estaVencido ? `Venció hace ${Math.abs(diasRestantes)}d` : `${diasRestantes} días rest.`}
                          </span>
                        ) : '-'}
                      </td>
                      <td>
                        <select
                          value={pqr.estado}
                          onChange={(e) => handleCambiarEstado(pqr.id, e.target.value as EstadoPqr)}
                          className="text-[0.68rem] font-bold bg-[#f4f5f7] border border-[#e4e4e7] rounded px-2 py-1 text-[#09090b] outline-none"
                        >
                          <option value="radicado">Radicado</option>
                          <option value="en_tramite">En Trámite</option>
                          <option value="respondido">Respondido</option>
                          <option value="cerrado">Cerrado</option>
                        </select>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => {
                            setPqrSeleccionado(pqr);
                            setTextoRespuesta(pqr.respuesta || '');
                            setModalResponderAbierto(true);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-[#e4e4e7] text-xs font-bold text-[#09090b] hover:bg-[#09090b] hover:text-white transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-rounded text-sm">reply</span>
                          <span>{pqr.respuesta ? 'Ver / Editar' : 'Responder'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL: RESPONDER PQR ── */}
      {modalResponderAbierto && pqrSeleccionado && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e4e4e7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7] mb-4">
              <div>
                <span className="text-[0.68rem] font-black uppercase tracking-wider text-[#71717a]">
                  RESPUESTA FORMAL A RADICADO
                </span>
                <h3 className="text-xl font-black text-[#09090b]">{pqrSeleccionado.radicado}</h3>
              </div>
              <button
                onClick={() => setModalResponderAbierto(false)}
                className="w-8 h-8 rounded-full bg-[#f4f5f7] text-[#71717a] flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fafafa] border border-[#e4e4e7] mb-4 text-xs space-y-1.5">
              <p><strong>Ciudadano:</strong> {pqrSeleccionado.nombre_completo} &bull; {pqrSeleccionado.correo}</p>
              <p><strong>Asunto:</strong> {pqrSeleccionado.asunto}</p>
              <p className="text-[#71717a] text-[0.72rem] leading-relaxed pt-1 border-t border-[#e4e4e7]">
                &quot;{pqrSeleccionado.descripcion}&quot;
              </p>
            </div>

            <form onSubmit={handleResponder} className="space-y-4">
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Texto de Respuesta Formal *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Redacta la respuesta técnica o jurídica que se notificará al solicitante..."
                  value={textoRespuesta}
                  onChange={(e) => setTextoRespuesta(e.target.value)}
                  className="w-full p-3 bg-[#f9f9f9] border border-[#eeeeee] rounded-xl text-xs text-[#09090b] outline-none focus:bg-white focus:border-black"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e4e4e7]">
                <button
                  type="button"
                  onClick={() => setModalResponderAbierto(false)}
                  className="btn-secondary-white text-xs"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-black text-xs">
                  Guardar y Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
