import React, { useState, useEffect, useMemo } from 'react';
import {
  crmService,
  useCrmService,
  ClienteCrm,
  TipoCliente,
  OrigenCliente,
} from '../../../../services/crm.service';

export const DashClientes: React.FC = () => {
  const { clientes, cargando } = useCrmService();

  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [clienteDetalle, setClienteDetalle] = useState<ClienteCrm | null>(null);
  const [notificacion, setNotificacion] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);

  // Formulario nuevo cliente
  const [nombre, setNombre] = useState<string>('');
  const [tipo, setTipo] = useState<TipoCliente>('persona');
  const [documento, setDocumento] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [ciudad, setCiudad] = useState<string>('Armenia, Quindío');
  const [direccion, setDireccion] = useState<string>('');
  const [origen, setOrigen] = useState<OrigenCliente>('web');
  const [notas, setNotas] = useState<string>('');

  useEffect(() => {
    crmService.cargarClientes();
  }, []);

  const mostrarNotificacion = (texto: string, tipo: 'success' | 'error' = 'success') => {
    setNotificacion({ texto, tipo });
    setTimeout(() => setNotificacion(null), 3500);
  };

  const clientesFiltrados = useMemo(() => {
    let list = clientes;
    const q = busqueda.trim().toLowerCase();

    if (filtroTipo !== 'todos') {
      list = list.filter((c) => c.tipo === filtroTipo);
    }

    if (q) {
      list = list.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.telefono && c.telefono.includes(q)) ||
          (c.ciudad && c.ciudad.toLowerCase().includes(q))
      );
    }

    return list;
  }, [clientes, busqueda, filtroTipo]);

  const handleCrearCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      mostrarNotificacion('Nombre y correo son obligatorios.', 'error');
      return;
    }

    const nuevo = await crmService.crearCliente({
      nombre: nombre.trim(),
      tipo,
      documento: documento.trim() || undefined,
      email: email.trim().toLowerCase(),
      telefono: telefono.trim() || undefined,
      ciudad: ciudad.trim() || undefined,
      direccion: direccion.trim() || undefined,
      origen,
      notas: notas.trim() || undefined,
    });

    if (nuevo) {
      mostrarNotificacion('Cliente registrado exitosamente en el CRM.');
      setModalAbierto(false);
      setNombre('');
      setDocumento('');
      setEmail('');
      setTelefono('');
      setNotas('');
    } else {
      mostrarNotificacion('Error al registrar el cliente.', 'error');
    }
  };

  const personasCount = clientes.filter((c) => c.tipo === 'persona').length;
  const empresasCount = clientes.filter((c) => c.tipo === 'empresa').length;

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
            CRM &bull; DIRECTORIO CORPORATIVO
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#09090b] tracking-tight mt-1">
            Gestión de <span className="font-light text-[#71717a]">Clientes</span>
          </h1>
          <p className="text-xs text-[#71717a] mt-1 font-medium">
            Base centralizada de personas y empresas vinculadas a proyectos arquitectónicos y de construcción.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => crmService.cargarClientes()}
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
            <span className="material-symbols-rounded text-base">person_add</span>
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* ── BENTO STATS SUMMARY ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card stat-accent-blue py-4">
          <span className="stat-card-label">CLIENTES TOTALES</span>
          <div className="stat-number text-3xl my-2">{clientes.length}</div>
          <span className="stat-footer-text">Base de datos CRM sincronizada</span>
        </div>

        <div className="stat-card stat-accent-green py-4">
          <span className="stat-card-label">PARTICULARES (PERSONAS)</span>
          <div className="stat-number text-3xl my-2">{personasCount}</div>
          <span className="stat-footer-text">Clientes residenciales directos</span>
        </div>

        <div className="stat-card stat-accent-purple py-4">
          <span className="stat-card-label">EMPRESAS &bull; INVERSIONISTAS</span>
          <div className="stat-number text-3xl my-2">{empresasCount}</div>
          <span className="stat-footer-text">Desarrollos y contrataciones comerciales</span>
        </div>
      </div>

      {/* ── TABLA BENTO CON FILTROS Y BÚSQUEDA ── */}
      <div className="bento-card">
        {/* Barra de Filtros */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
          <div className="input-minimal-wrapper w-full sm:max-w-md">
            <span className="material-symbols-rounded input-icon">search</span>
            <input
              type="text"
              placeholder="Buscar por nombre, email, teléfono o ciudad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-minimal"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[0.68rem] font-bold text-[#71717a] uppercase tracking-wider">Tipo:</span>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="text-xs font-semibold bg-[#f4f5f7] border border-[#e4e4e7] rounded-lg px-2.5 py-1.5 text-[#09090b] outline-none"
            >
              <option value="todos">Todos ({clientes.length})</option>
              <option value="persona">Personas ({personasCount})</option>
              <option value="empresa">Empresas ({empresasCount})</option>
            </select>
          </div>
        </div>

        {/* Tabla de Clientes */}
        {clientesFiltrados.length === 0 ? (
          <div className="text-center py-12 text-[#a1a1aa] border border-dashed border-[#e4e4e7] rounded-xl">
            <span className="material-symbols-rounded text-3xl mb-1">person_search</span>
            <p className="text-sm font-semibold">No se encontraron clientes con el criterio de búsqueda</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>CLIENTE / RAZÓN SOCIAL</th>
                  <th>TIPO</th>
                  <th>CONTACTO</th>
                  <th>CIUDAD / UBICACIÓN</th>
                  <th>ORIGEN</th>
                  <th className="text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((c: ClienteCrm) => (
                  <tr key={c.id}>
                    <td>
                      <div className="font-bold text-sm text-[#09090b]">{c.nombre}</div>
                      {c.documento && (
                        <span className="text-[0.7rem] font-mono text-[#71717a]">
                          Doc: {c.documento}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge uppercase text-[0.65rem] ${
                        c.tipo === 'empresa' ? 'purple' : 'info'
                      }`}>
                        {c.tipo}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs text-[#09090b] font-medium">{c.email}</div>
                      {c.telefono && (
                        <span className="text-[0.7rem] font-mono text-[#71717a]">
                          {c.telefono}
                        </span>
                      )}
                    </td>
                    <td className="text-[#71717a] font-medium text-xs">
                      {c.ciudad || 'No especificada'}
                    </td>
                    <td>
                      <span className="status-badge neutral uppercase text-[0.65rem]">
                        {c.origen}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => setClienteDetalle(c)}
                        className="px-3 py-1.5 rounded-lg border border-[#e4e4e7] text-xs font-bold text-[#09090b] hover:bg-[#09090b] hover:text-white transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <span className="material-symbols-rounded text-sm">visibility</span>
                        <span>Ver Ficha</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL: NUEVO CLIENTE ── */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e4e4e7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7] mb-5">
              <div>
                <span className="text-[0.68rem] font-black uppercase tracking-wider text-[#71717a]">
                  REGISTRO CRM
                </span>
                <h3 className="text-xl font-black text-[#09090b]">Registrar Nuevo Cliente</h3>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="w-8 h-8 rounded-full bg-[#f4f5f7] text-[#71717a] hover:text-[#09090b] flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCrearCliente} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Tipo de Cliente *
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as TipoCliente)}
                    className="input-minimal"
                  >
                    <option value="persona">Persona Natural</option>
                    <option value="empresa">Empresa / Jurídico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Canal de Origen
                  </label>
                  <select
                    value={origen}
                    onChange={(e) => setOrigen(e.target.value as OrigenCliente)}
                    className="input-minimal"
                  >
                    <option value="web">Página Web</option>
                    <option value="referido">Referido</option>
                    <option value="redes">Redes Sociales</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Nombre Completo / Razón Social *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Inversiones Los Rosales S.A.S. / Carlos Mendoza"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="input-minimal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Cédula / NIT
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 901234567-8"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    className="input-minimal"
                  />
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej: +57 310 123 4567"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="input-minimal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contacto@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-minimal"
                  />
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    className="input-minimal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="Ej: Cra 14 # 19N-40"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="input-minimal"
                />
              </div>

              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Notas Internas
                </label>
                <textarea
                  rows={2}
                  placeholder="Observaciones de interés sobre el cliente o presupuesto..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full p-2.5 bg-[#f9f9f9] border border-[#eeeeee] rounded-xl text-xs text-[#09090b] outline-none"
                ></textarea>
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
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DETALLE / FICHA DE CLIENTE ── */}
      {clienteDetalle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e4e4e7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7] mb-4">
              <div>
                <span className="text-[0.68rem] font-black uppercase tracking-wider text-[#71717a]">
                  FICHA DE CONTACTO CRM
                </span>
                <h3 className="text-xl font-black text-[#09090b]">{clienteDetalle.nombre}</h3>
              </div>
              <button
                onClick={() => setClienteDetalle(null)}
                className="w-8 h-8 rounded-full bg-[#f4f5f7] text-[#71717a] hover:text-[#09090b] flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
                <div>
                  <span className="text-[#71717a] font-bold uppercase text-[0.65rem] block">Correo:</span>
                  <span className="font-semibold text-[#09090b]">{clienteDetalle.email}</span>
                </div>
                <div>
                  <span className="text-[#71717a] font-bold uppercase text-[0.65rem] block">Teléfono:</span>
                  <span className="font-semibold text-[#09090b]">{clienteDetalle.telefono || 'Sin registrar'}</span>
                </div>
                <div>
                  <span className="text-[#71717a] font-bold uppercase text-[0.65rem] block">Documento:</span>
                  <span className="font-mono text-[#09090b]">{clienteDetalle.documento || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#71717a] font-bold uppercase text-[0.65rem] block">Ciudad:</span>
                  <span className="font-semibold text-[#09090b]">{clienteDetalle.ciudad || 'N/A'}</span>
                </div>
              </div>

              {clienteDetalle.notas && (
                <div className="p-3.5 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
                  <span className="text-[#71717a] font-bold uppercase text-[0.65rem] block mb-1">Notas:</span>
                  <p className="text-[#09090b] leading-relaxed">{clienteDetalle.notas}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-5 mt-4 border-t border-[#e4e4e7]">
              <button
                onClick={() => setClienteDetalle(null)}
                className="btn-primary-black text-xs"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
