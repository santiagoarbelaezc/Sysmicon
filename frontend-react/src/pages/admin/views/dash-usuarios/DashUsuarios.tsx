import React, { useState, useEffect, useMemo } from 'react';
import { adminService, useAdminService, UsuarioAdmin } from '../../../../services/admin.service';
import { useAuthService } from '../../../../services/auth.service';
import { httpClient } from '../../../../core/apiClient';
import { environment } from '../../../../core/env';

export const DashUsuarios: React.FC = () => {
  const { usuarios } = useAdminService();
  const { currentUser } = useAuthService();

  const [filtroRol, setFiltroRol] = useState<string>('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [notificacion, setNotificacion] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);

  // Formulario nuevo usuario staff
  const [nuevoNombre, setNuevoNombre] = useState<string>('');
  const [nuevoEmail, setNuevoEmail] = useState<string>('');
  const [nuevoTelefono, setNuevoTelefono] = useState<string>('');
  const [nuevoRol, setNuevoRol] = useState<'admin' | 'arquitecto' | 'comercial'>('comercial');
  const [nuevoPassword, setNuevoPassword] = useState<string>('Sysmicon-123');

  useEffect(() => {
    adminService.cargarDatosReales();
  }, []);

  const mostrarNotificacion = (texto: string, tipo: 'success' | 'error' = 'success') => {
    setNotificacion({ texto, tipo });
    setTimeout(() => setNotificacion(null), 3500);
  };

  const usuariosFiltrados = useMemo(() => {
    const lista = usuarios;
    const termino = terminoBusqueda.toLowerCase().trim();
    const rol = filtroRol;

    return lista.filter((u: UsuarioAdmin) => {
      const cumpleRol = rol === 'todos' || u.rol === rol;
      const cumpleBusqueda =
        !termino ||
        (u.nombre && u.nombre.toLowerCase().includes(termino)) ||
        (u.email && u.email.toLowerCase().includes(termino));
      return cumpleRol && cumpleBusqueda;
    });
  }, [usuarios, terminoBusqueda, filtroRol]);

  const esUsuarioActual = (u: UsuarioAdmin): boolean => {
    if (!currentUser) return false;
    const sameId =
      currentUser.id !== undefined &&
      u.id !== undefined &&
      String(currentUser.id) === String(u.id);
    const sameEmail =
      !!currentUser.email &&
      !!u.email &&
      currentUser.email.toLowerCase().trim() === u.email.toLowerCase().trim();
    return sameId || sameEmail;
  };

  const esUltimoAdminActivo = (u: UsuarioAdmin): boolean => {
    if (u.rol !== 'admin' || u.estado !== 'activo') return false;
    const adminsActivos = usuarios.filter((item) => item.rol === 'admin' && item.estado === 'activo');
    return adminsActivos.length <= 1;
  };

  const toggleEstado = (u: UsuarioAdmin) => {
    if (esUsuarioActual(u)) {
      mostrarNotificacion('Operación denegada: Un administrador no puede suspender su propia cuenta.', 'error');
      return;
    }
    if (esUltimoAdminActivo(u)) {
      mostrarNotificacion('Operación denegada: No se puede suspender al único administrador activo.', 'error');
      return;
    }
    adminService.toggleEstadoUsuario(u.id);
    mostrarNotificacion(`Estado de "${u.nombre}" actualizado.`);
  };

  const eliminarUsuario = (u: UsuarioAdmin) => {
    if (esUsuarioActual(u)) {
      mostrarNotificacion('Operación denegada: Un administrador no puede eliminar su propia cuenta.', 'error');
      return;
    }
    if (esUltimoAdminActivo(u)) {
      mostrarNotificacion('Operación denegada: No se puede eliminar al único administrador activo.', 'error');
      return;
    }
    if (window.confirm(`¿Deseas retirar al usuario "${u.nombre}" del portal?`)) {
      adminService.eliminarUsuario(u.id);
      mostrarNotificacion(`Usuario "${u.nombre}" eliminado.`);
    }
  };

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim() || !nuevoEmail.trim()) {
      mostrarNotificacion('Nombre y correo son obligatorios.', 'error');
      return;
    }

    try {
      const res = await httpClient.post<{ success: boolean; data: UsuarioAdmin }>(
        `${environment.apiUrl}/admin/usuarios`,
        {
          nombre: nuevoNombre.trim(),
          email: nuevoEmail.trim().toLowerCase(),
          telefono: nuevoTelefono.trim() || undefined,
          rol: nuevoRol,
          password: nuevoPassword || 'Sysmicon-123',
        }
      ).toPromise();

      if (res?.success) {
        mostrarNotificacion('Usuario Staff creado exitosamente.');
        setModalAbierto(false);
        setNuevoNombre('');
        setNuevoEmail('');
        setNuevoTelefono('');
        adminService.cargarDatosReales();
      }
    } catch {
      mostrarNotificacion('Error al registrar usuario.', 'error');
    }
  };

  const adminCount = usuarios.filter((u) => u.rol === 'admin').length;
  const arquiCount = usuarios.filter((u) => u.rol === 'arquitecto').length;
  const comerCount = usuarios.filter((u) => u.rol === 'comercial').length;

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
            ADMINISTRACIÓN &bull; SEGURIDAD &amp; ACCESOS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#09090b] tracking-tight mt-1">
            Usuarios del <span className="font-light text-[#71717a]">Staff</span>
          </h1>
          <p className="text-xs text-[#71717a] mt-1 font-medium">
            Equipo interno con acceso al panel: Administradores, Arquitectos y Comerciales del CRM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => adminService.cargarDatosReales()}
            className="btn-secondary-white text-xs"
          >
            <span className="material-symbols-rounded text-base">sync</span>
            <span>Refrescar</span>
          </button>
          <button
            onClick={() => setModalAbierto(true)}
            className="btn-primary-black text-xs"
          >
            <span className="material-symbols-rounded text-base">person_add</span>
            <span>Nuevo Staff</span>
          </button>
        </div>
      </div>

      {/* ── STAT CARDS BENTO ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stat-card stat-accent-blue py-3.5">
          <span className="stat-card-label">TOTAL STAFF</span>
          <div className="stat-number text-2xl my-1.5">{usuarios.length}</div>
          <span className="stat-footer-text">Equipo con acceso activo</span>
        </div>

        <div className="stat-card stat-accent-red py-3.5">
          <span className="stat-card-label">ADMINISTRADORES</span>
          <div className="stat-number text-2xl my-1.5">{adminCount}</div>
          <span className="stat-footer-text">Control total con 2FA</span>
        </div>

        <div className="stat-card stat-accent-purple py-3.5">
          <span className="stat-card-label">ARQUITECTOS</span>
          <div className="stat-number text-2xl my-1.5">{arquiCount}</div>
          <span className="stat-footer-text">Obras, diseño y planos</span>
        </div>

        <div className="stat-card stat-accent-green py-3.5">
          <span className="stat-card-label">COMERCIALES</span>
          <div className="stat-number text-2xl my-1.5">{comerCount}</div>
          <span className="stat-footer-text">Pipeline y clientes CRM</span>
        </div>
      </div>

      {/* ── TABLA BENTO CON FILTROS ── */}
      <div className="bento-card">
        {/* Barra de Búsqueda y Filtros */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
          <div className="input-minimal-wrapper w-full sm:max-w-md">
            <span className="material-symbols-rounded input-icon">search</span>
            <input
              type="text"
              placeholder="Buscar por nombre o correo electrónico..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              className="input-minimal"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            {['todos', 'admin', 'arquitecto', 'comercial'].map((r) => (
              <button
                key={r}
                onClick={() => setFiltroRol(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  filtroRol === r
                    ? 'bg-[#09090b] text-white shadow-xs'
                    : 'bg-[#f4f5f7] border border-[#e4e4e7] text-[#71717a] hover:text-[#09090b]'
                }`}
              >
                {r === 'todos' ? 'Todos' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        {usuariosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-[#a1a1aa] border border-dashed border-[#e4e4e7] rounded-xl">
            <span className="material-symbols-rounded text-3xl mb-1">badge</span>
            <p className="text-sm font-semibold">No se encontraron usuarios con este criterio</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>USUARIO</th>
                  <th>CORREO / TELÉFONO</th>
                  <th>ROL ASIGNADO</th>
                  <th>ESTADO</th>
                  <th className="text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((u: UsuarioAdmin) => {
                  const isCurrent = esUsuarioActual(u);

                  return (
                    <tr key={u.id} className={isCurrent ? 'bg-amber-50/30' : ''}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#09090b] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {u.nombre ? u.nombre.slice(0, 2).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-[#09090b] flex items-center gap-1.5">
                              <span>{u.nombre}</span>
                              {isCurrent && (
                                <span className="text-[0.62rem] font-bold bg-[#09090b] text-white px-1.5 py-0.2 rounded font-mono">
                                  TÚ
                                </span>
                              )}
                            </div>
                            <span className="text-[0.7rem] text-[#71717a]">
                              {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Miembro activo'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-xs font-semibold text-[#09090b]">{u.email}</div>
                        <span className="text-[0.7rem] text-[#71717a] font-mono">
                          {u.telefono || 'Sin teléfono'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge uppercase text-[0.65rem] ${
                          u.rol === 'admin' ? 'danger' :
                          u.rol === 'arquitecto' ? 'purple' : 'info'
                        }`}>
                          {u.rol}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge uppercase text-[0.65rem] ${
                          u.estado === 'activo' ? 'success' : 'danger'
                        }`}>
                          {u.estado}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => toggleEstado(u)}
                            disabled={isCurrent}
                            title={isCurrent ? 'No puedes suspenderte a ti mismo' : 'Cambiar estado'}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-colors cursor-pointer ${
                              isCurrent
                                ? 'opacity-40 cursor-not-allowed border-neutral-200'
                                : u.estado === 'activo'
                                ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                                : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            }`}
                          >
                            {u.estado === 'activo' ? 'Suspender' : 'Activar'}
                          </button>

                          <button
                            onClick={() => eliminarUsuario(u)}
                            disabled={isCurrent}
                            title={isCurrent ? 'No puedes eliminarte a ti mismo' : 'Eliminar usuario'}
                            className={`p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer ${
                              isCurrent ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                          >
                            <span className="material-symbols-rounded text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL: NUEVO USUARIO STAFF ── */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e4e4e7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7] mb-5">
              <div>
                <span className="text-[0.68rem] font-black uppercase tracking-wider text-[#71717a]">
                  ACCESO INSTITUCIONAL
                </span>
                <h3 className="text-xl font-black text-[#09090b]">Nuevo Miembro Staff</h3>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="w-8 h-8 rounded-full bg-[#f4f5f7] text-[#71717a] flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCrearUsuario} className="space-y-4">
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Gómez"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="input-minimal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="laura@sysmicon.com"
                    value={nuevoEmail}
                    onChange={(e) => setNuevoEmail(e.target.value)}
                    className="input-minimal"
                  />
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="+57 310 999 8888"
                    value={nuevoTelefono}
                    onChange={(e) => setNuevoTelefono(e.target.value)}
                    className="input-minimal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Rol de Sistema *
                  </label>
                  <select
                    value={nuevoRol}
                    onChange={(e) => setNuevoRol(e.target.value as 'admin' | 'arquitecto' | 'comercial')}
                    className="input-minimal"
                  >
                    <option value="comercial">Comercial / CRM</option>
                    <option value="arquitecto">Arquitecto de Obra</option>
                    <option value="admin">Administrador General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Contraseña Inicial *
                  </label>
                  <input
                    type="text"
                    required
                    value={nuevoPassword}
                    onChange={(e) => setNuevoPassword(e.target.value)}
                    className="input-minimal font-mono"
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
                  Crear Miembro Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
