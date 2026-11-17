import React, { useState, useEffect, useMemo } from 'react';
import { adminService, useAdminService, UsuarioAdmin } from '../../../../services/admin.service';
import { useAuthService } from '../../../../services/auth.service';

export const DashUsuarios: React.FC = () => {
  const { usuarios } = useAdminService();
  const { currentUser } = useAuthService();

  const [filtroRol, setFiltroRol] = useState<string>('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');

  useEffect(() => {
    adminService.cargarDatosReales();
  }, []);

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
      alert('Operación denegada: Un administrador no puede suspender su propia cuenta.');
      return;
    }
    if (esUltimoAdminActivo(u)) {
      alert('Operación denegada: No se puede suspender al único administrador activo del sistema.');
      return;
    }
    adminService.toggleEstadoUsuario(u.id);
  };

  const eliminarUsuario = (u: UsuarioAdmin) => {
    if (esUsuarioActual(u)) {
      alert('Operación denegada: Un administrador no puede retirar o eliminar su propia cuenta.');
      return;
    }
    if (esUltimoAdminActivo(u)) {
      alert('Operación denegada: No se puede retirar al único administrador activo del sistema.');
      return;
    }
    if (window.confirm(`¿Deseas retirar al usuario "${u.nombre}" del portal?`)) {
      adminService.eliminarUsuario(u.id);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      
      {/* ENCABEZADO DE SECCIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
        <div>
          <span className="font-mono text-xs sm:text-sm tracking-ultra text-neutral-400 font-black uppercase block mb-2">
            DIRECTORIO INSTITUCIONAL
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 uppercase tracking-tight leading-[1.05]">
            COMUNIDAD &amp; <span className="font-light">USUARIOS DEL PORTAL</span>
          </h1>
          <p className="font-sans text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mt-3 max-w-3xl">
            Gestión de propietarios, arquitectos, colaboradores y administradores con acceso a la plataforma.
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-neutral-950 bg-white px-6 py-3.5 rounded-2xl border border-neutral-200 shadow-xs">
            TOTAL REGISTRADOS: {usuarios.length}
          </span>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS MONOCROMÁTICOS */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Buscador */}
        <div className="relative w-full sm:w-[460px]">
          <svg className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            placeholder="Buscar por nombre o correo electrónico..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm sm:text-base placeholder:text-neutral-400 focus:bg-white focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none transition-all font-sans"
          />
        </div>

        {/* Filtros de Rol Monocromáticos */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-sans">
          <button
            onClick={() => setFiltroRol('todos')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              filtroRol === 'todos'
                ? 'bg-neutral-950 text-white font-black shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/80 font-bold'
            }`}
          >
            TODOS
          </button>
          <button
            onClick={() => setFiltroRol('propietario')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              filtroRol === 'propietario'
                ? 'bg-neutral-950 text-white font-black shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/80 font-bold'
            }`}
          >
            PROPIETARIOS
          </button>
          <button
            onClick={() => setFiltroRol('arquitecto')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              filtroRol === 'arquitecto'
                ? 'bg-neutral-950 text-white font-black shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/80 font-bold'
            }`}
          >
            ARQUITECTOS
          </button>
          <button
            onClick={() => setFiltroRol('inversionista')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              filtroRol === 'inversionista'
                ? 'bg-neutral-950 text-white font-black shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/80 font-bold'
            }`}
          >
            INVERSIONISTAS
          </button>
        </div>

      </div>

      {/* TABLA DE USUARIOS BLANCA Y MODERNA */}
      <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/90 text-xs font-black text-neutral-500 uppercase tracking-widest font-mono">
                <th className="py-5 px-8">USUARIO &amp; CONTACTO</th>
                <th className="py-5 px-6">ROL EN PORTAL</th>
                <th className="py-5 px-6">PROYECTOS NUBE</th>
                <th className="py-5 px-6">FECHA REGISTRO</th>
                <th className="py-5 px-6">ESTADO</th>
                <th className="py-5 px-8 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm font-sans">
              {usuariosFiltrados.map((u) => {
                const isSelf = esUsuarioActual(u);
                const stateClasses =
                  u.estado === 'activo'
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                    : u.estado === 'pendiente'
                    ? 'bg-amber-50 text-amber-950 border-amber-300'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-300';

                return (
                  <tr key={u.id} className="hover:bg-neutral-50/80 transition-colors group">
                    
                    {/* Col 1: Nombre y Email */}
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center font-serif font-black text-neutral-950 shrink-0 text-base shadow-xs">
                          {u.nombre.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-neutral-950 text-base block leading-tight uppercase tracking-wide">{u.nombre}</span>
                            {isSelf && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-900 text-white tracking-widest uppercase">
                                TÚ
                              </span>
                            )}
                          </div>
                          <span className="text-neutral-600 text-sm block font-normal mt-1">{u.email}</span>
                          <span className="text-neutral-400 text-xs font-mono mt-0.5 block">{u.telefono}</span>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Rol */}
                    <td className="py-5 px-6 font-mono">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                          u.rol === 'admin'
                            ? 'bg-neutral-950 text-white'
                            : 'bg-neutral-100 text-neutral-900 border border-neutral-200'
                        }`}
                      >
                        {u.rol}
                      </span>
                    </td>

                    {/* Col 3: Proyectos */}
                    <td className="py-5 px-6 font-mono font-bold text-neutral-800">
                      <span className="bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-semibold uppercase">
                        {u.proyectosGuardados} OBRAS
                      </span>
                    </td>

                    {/* Col 4: Fecha */}
                    <td className="py-5 px-6 text-neutral-600 font-mono text-sm font-medium">
                      {u.fechaRegistro}
                    </td>

                    {/* Col 5: Estado */}
                    <td className="py-5 px-6">
                      <button
                        onClick={() => toggleEstado(u)}
                        disabled={isSelf}
                        title={isSelf ? 'No puedes suspender tu propia cuenta activa' : 'Cambiar estado del usuario'}
                        className={`px-4 py-1.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all ${stateClasses} ${
                          isSelf ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${u.estado === 'activo' ? 'bg-emerald-500' : 'bg-neutral-400'}`}></span>
                        <span>{u.estado}</span>
                      </button>
                    </td>

                    {/* Col 6: Acciones */}
                    <td className="py-5 px-8 text-right">
                      <button
                        onClick={() => eliminarUsuario(u)}
                        disabled={isSelf}
                        title={isSelf ? 'No puedes retirar tu propia cuenta activa' : 'Retirar Usuario'}
                        className={`px-4 py-2 rounded-xl transition-colors text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                          isSelf
                            ? 'opacity-25 cursor-not-allowed text-neutral-400'
                            : 'text-neutral-400 hover:text-red-600 hover:bg-red-50/80 cursor-pointer'
                        }`}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        <span>RETIRAR</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>

          {usuariosFiltrados.length === 0 && (
            <div className="py-24 text-center text-neutral-400 flex flex-col items-center justify-center gap-3">
              <svg className="w-12 h-12 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span className="text-base text-neutral-500 font-sans">No se encontraron usuarios registrados en la base de datos.</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default DashUsuarios;
