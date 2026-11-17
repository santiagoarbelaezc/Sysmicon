import React, { useState, useEffect } from 'react';
import { httpClient } from '../../../../core/apiClient';
import { environment } from '../../../../core/env';

export interface PortafolioItem {
  id: number;
  titulo: string;
  categoria?: string;
  ubicacion?: string;
  descripcion?: string;
  activo: boolean;
  orden?: number;
  imagenes?: { id: number; url: string; orden: number }[];
}

export const DashPortafolio: React.FC = () => {
  const [proyectos, setProyectos] = useState<PortafolioItem[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [notificacion, setNotificacion] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);

  // Formulario nuevo portafolio
  const [titulo, setTitulo] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('Residencial');
  const [ubicacion, setUbicacion] = useState<string>('Armenia, Quindío');
  const [descripcion, setDescripcion] = useState<string>('');
  const [imagenUrl, setImagenUrl] = useState<string>('');

  const cargarPortafolio = async () => {
    setCargando(true);
    try {
      const res = await httpClient.get<{ success: boolean; data: PortafolioItem[] }>(
        `${environment.apiUrl}/admin/portafolio`
      ).toPromise();
      if (res?.success && res.data) {
        setProyectos(res.data);
      }
    } catch (err) {
      console.warn('Error al cargar portafolio:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPortafolio();
  }, []);

  const mostrarNotificacion = (texto: string, tipo: 'success' | 'error' = 'success') => {
    setNotificacion({ texto, tipo });
    setTimeout(() => setNotificacion(null), 3500);
  };

  const handleToggleActivo = async (id: number) => {
    try {
      const res = await httpClient.patch<{ success: boolean }>(
        `${environment.apiUrl}/admin/portafolio/${id}/toggle`,
        {}
      ).toPromise();
      if (res?.success) {
        setProyectos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, activo: !p.activo } : p))
        );
        mostrarNotificacion('Estado de visibilidad en web actualizado');
      }
    } catch {
      mostrarNotificacion('Error al actualizar visibilidad', 'error');
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este proyecto del portafolio web?')) return;

    try {
      const res = await httpClient.delete<{ success: boolean }>(
        `${environment.apiUrl}/admin/portafolio/${id}`
      ).toPromise();
      if (res?.success) {
        setProyectos((prev) => prev.filter((p) => p.id !== id));
        mostrarNotificacion('Proyecto eliminado del portafolio.');
      }
    } catch {
      mostrarNotificacion('Error al eliminar proyecto', 'error');
    }
  };

  const handleCrearProyecto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    try {
      const res = await httpClient.post<{ success: boolean; data: PortafolioItem }>(
        `${environment.apiUrl}/admin/portafolio`,
        {
          titulo: titulo.trim(),
          categoria,
          ubicacion: ubicacion.trim() || undefined,
          descripcion: descripcion.trim() || undefined,
        }
      ).toPromise();

      if (res?.success && res.data) {
        // Si ingresó una URL de imagen, asociarla
        if (imagenUrl.trim()) {
          await httpClient.post(
            `${environment.apiUrl}/admin/portafolio/${res.data.id}/imagenes`,
            { url: imagenUrl.trim() }
          ).toPromise();
        }

        mostrarNotificacion('Obra agregada exitosamente al portafolio web.');
        setModalAbierto(false);
        setTitulo('');
        setDescripcion('');
        setImagenUrl('');
        cargarPortafolio();
      }
    } catch {
      mostrarNotificacion('Error al crear proyecto en portafolio', 'error');
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
            CATÁLOGO ARQUITECTÓNICO &bull; SITIO PÚBLICO
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#09090b] tracking-tight mt-1">
            Portafolio <span className="font-light text-[#71717a]">Web</span>
          </h1>
          <p className="text-xs text-[#71717a] mt-1 font-medium">
            Administra las obras visibles en la galería pública del sitio y sus fotografías de alta resolución en Cloudinary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={cargarPortafolio}
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
            <span className="material-symbols-rounded text-base">add_photo_alternate</span>
            <span>Nueva Obra</span>
          </button>
        </div>
      </div>

      {/* ── GRID DE OBRAS DEL PORTAFOLIO ── */}
      {proyectos.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-[#e4e4e7] rounded-3xl text-[#a1a1aa]">
          <span className="material-symbols-rounded text-4xl mb-2">collections</span>
          <h4 className="text-sm font-bold text-[#09090b]">No hay proyectos en el portafolio</h4>
          <p className="text-xs text-[#71717a] mt-1">Registra tu primera obra arquitectónica para lucirla en la web.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {proyectos.map((p) => {
            const fotoPrincipal = p.imagenes?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800';

            return (
              <div key={p.id} className="bento-card p-4 flex flex-col justify-between group">
                <div>
                  <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-neutral-100 border border-[#e4e4e7]">
                    <img
                      src={fotoPrincipal}
                      alt={p.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="status-badge neutral text-[0.65rem] uppercase backdrop-blur-md bg-black/70 text-white">
                        {p.categoria || 'Arquitectura'}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`status-badge text-[0.65rem] uppercase ${
                        p.activo ? 'success' : 'danger'
                      }`}>
                        {p.activo ? 'Activo en Web' : 'Oculto'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-black text-sm text-[#09090b] mb-1">{p.titulo}</h3>
                  {p.ubicacion && (
                    <p className="text-[0.72rem] text-[#71717a] flex items-center gap-1 mb-2">
                      <span className="material-symbols-rounded text-xs">pin_drop</span>
                      <span>{p.ubicacion}</span>
                    </p>
                  )}
                  {p.descripcion && (
                    <p className="text-xs text-[#71717a] line-clamp-2 leading-relaxed">
                      {p.descripcion}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-4 border-t border-[#f4f5f7] flex items-center justify-between">
                  <button
                    onClick={() => handleToggleActivo(p.id)}
                    className="text-xs font-bold text-[#09090b] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-rounded text-sm">
                      {p.activo ? 'visibility_off' : 'visibility'}
                    </span>
                    <span>{p.activo ? 'Ocultar' : 'Publicar'}</span>
                  </button>

                  <button
                    onClick={() => handleEliminar(p.id)}
                    className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-rounded text-sm">delete</span>
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: NUEVA OBRA ── */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e4e4e7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7] mb-5">
              <div>
                <span className="text-[0.68rem] font-black uppercase tracking-wider text-[#71717a]">
                  PORTAFOLIO WEB
                </span>
                <h3 className="text-xl font-black text-[#09090b]">Nueva Obra Pública</h3>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="w-8 h-8 rounded-full bg-[#f4f5f7] text-[#71717a] flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCrearProyecto} className="space-y-4">
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Título de la Obra *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Villa Fontana &bull; Casa de Campo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="input-minimal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Categoría
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="input-minimal"
                  >
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Remodelación">Remodelación</option>
                    <option value="Interiorismo">Interiorismo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    className="input-minimal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  URL de Imagen Principal
                </label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/... o enlace de imagen"
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                  className="input-minimal"
                />
              </div>

              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1">
                  Descripción Arquitectónica
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles sobre área m², concepto estructural y acabados..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
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
                  Publicar Obra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
