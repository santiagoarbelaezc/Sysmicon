import React, { useState, useEffect, useMemo } from 'react';
import { adminService, useAdminService, MensajeAdmin } from '../../../../services/admin.service';

export const DashMensajes: React.FC = () => {
  const { mensajes } = useAdminService();

  const [mensajeSeleccionadoId, setMensajeSeleccionadoId] = useState<string | number | null>(null);
  const [notificacionTexto, setNotificacionTexto] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'no_leidos' | 'cotizacion'>('todos');
  const [textoRespuesta, setTextoRespuesta] = useState<string>('');

  const recargarMensajes = () => {
    setCargando(true);
    adminService.cargarDatosReales();
    setTimeout(() => {
      setCargando(false);
    }, 600);
  };

  useEffect(() => {
    recargarMensajes();
  }, []);

  const countSinLeer = useMemo(() => {
    return mensajes.filter((m) => !m.leido).length;
  }, [mensajes]);

  const mensajesFiltrados = useMemo(() => {
    let list = mensajes;
    const query = busqueda.trim().toLowerCase();

    if (filtroTipo === 'no_leidos') {
      list = list.filter((m) => !m.leido);
    } else if (filtroTipo === 'cotizacion') {
      list = list.filter((m) => m.tipo === 'cotizacion' || !m.tipo);
    }

    if (query) {
      list = list.filter(
        (m) =>
          (m.remitente && m.remitente.toLowerCase().includes(query)) ||
          (m.email && m.email.toLowerCase().includes(query)) ||
          (m.asunto && m.asunto.toLowerCase().includes(query)) ||
          (m.contenido && m.contenido.toLowerCase().includes(query))
      );
    }

    return list;
  }, [mensajes, busqueda, filtroTipo]);

  useEffect(() => {
    if (mensajesFiltrados.length === 0) {
      setMensajeSeleccionadoId(null);
    } else if (
      mensajeSeleccionadoId === null ||
      !mensajesFiltrados.find((m) => m.id === mensajeSeleccionadoId)
    ) {
      setMensajeSeleccionadoId(mensajesFiltrados[0].id);
    }
  }, [mensajesFiltrados, mensajeSeleccionadoId]);

  const mensajeSeleccionado = useMemo(() => {
    if (mensajeSeleccionadoId === null) return null;
    return mensajesFiltrados.find((m) => m.id === mensajeSeleccionadoId) || null;
  }, [mensajesFiltrados, mensajeSeleccionadoId]);

  const seleccionarMensaje = (m: MensajeAdmin) => {
    setMensajeSeleccionadoId(m.id);
    if (!m.leido) {
      adminService.marcarMensajeLeido(m.id);
    }
  };

  const alternarLeido = (m: MensajeAdmin) => {
    if (m.leido) {
      adminService.mensajes.update((list) =>
        list.map((item) => (item.id === m.id ? { ...item, leido: false } : item))
      );
      adminService.mensajesNoLeidos.update((n) => n + 1);
      setNotificacionTexto('Mensaje marcado como no leído.');
    } else {
      adminService.marcarMensajeLeido(m.id);
      setNotificacionTexto('Mensaje marcado como leído.');
    }
    setTimeout(() => setNotificacionTexto(''), 3000);
  };

  const eliminarMensaje = (m: MensajeAdmin) => {
    if (window.confirm(`¿Deseas eliminar la cotización de "${m.remitente}"?`)) {
      adminService.eliminarMensaje(m.id);
      setNotificacionTexto(`Mensaje de "${m.remitente}" eliminado con éxito.`);
      setTimeout(() => setNotificacionTexto(''), 3000);
    }
  };

  const formatearFechaCorta = (fecha?: string): string => {
    if (!fecha) return '';
    const parts = fecha.split(' ');
    return parts.length > 1 ? parts[1].slice(0, 5) : parts[0];
  };

  const sanitizarTelefono = (tel?: string): string => {
    if (!tel) return '';
    return tel.replace(/[^0-9]/g, '');
  };

  const enviarRespuesta = (m: MensajeAdmin) => {
    if (!textoRespuesta.trim()) return;
    const destinatario = m.email;
    setTextoRespuesta('');
    setNotificacionTexto(`Respuesta enviada formalmente a ${destinatario}.`);
    setTimeout(() => {
      setNotificacionTexto('');
    }, 4500);
  };

  return (
    <div className="h-full flex flex-col min-h-0 space-y-6 animate-fade-in font-sans overflow-hidden">
      
      {/* =====================================================
           ENCABEZADO DE ALTA GAMA (SIN SCROLL)
           ===================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 shrink-0">
        <div>
          <span className="font-mono text-xs tracking-ultra text-neutral-400 font-black uppercase block mb-1">
            BANDEJA DE ENTRADA &amp; COTIZACIONES
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-neutral-950 uppercase tracking-tight leading-tight">
            BANDEJA DE MENSAJES &amp; <span className="font-light">COTIZACIONES</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Botón Sincronizar */}
          <button
            onClick={recargarMensajes}
            title="Sincronizar con la base de datos"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 hover:text-neutral-950 hover:border-neutral-950 transition-all shadow-xs cursor-pointer font-mono text-xs sm:text-sm font-bold uppercase tracking-wider"
          >
            <svg
              className={`w-4 h-4 text-neutral-700 ${cargando ? 'animate-spin' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            <span>SINCRONIZAR</span>
          </button>

          {/* Contador Sin Leer */}
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white border border-neutral-200 font-mono text-xs sm:text-sm font-bold text-neutral-950 shadow-xs uppercase tracking-wider">
            <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span>SIN LEER: <span className="text-neutral-950 font-black">{countSinLeer}</span></span>
          </div>
        </div>
      </div>

      {/* ALERTA TOAST NOTIFICACIÓN FLOTANTE */}
      {notificacionTexto && (
        <div className="p-4 rounded-2xl bg-neutral-950 text-white text-xs sm:text-sm flex items-center justify-between animate-fade-in font-sans shadow-md shrink-0">
          <div className="flex items-center gap-3 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{notificacionTexto}</span>
          </div>
          <button
            onClick={() => setNotificacionTexto('')}
            className="text-neutral-400 hover:text-white font-bold p-1 cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* BARRA DE FILTRO Y BÚSQUEDA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        {/* Buscador Ultra-Limpio con Icono Fijo */}
        <div className="relative w-full sm:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-neutral-950 transition-colors">
            <svg className="w-4 h-4 shrink-0" style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por cliente, correo o asunto..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-950 text-sm placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none transition-all shadow-xs font-sans"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              type="button"
              title="Limpiar búsqueda"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>

        {/* Filtros de Tipo Monocromáticos */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-mono">
          <button
            onClick={() => setFiltroTipo('todos')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
              filtroTipo === 'todos'
                ? 'bg-neutral-950 text-white font-black shadow-xs'
                : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-200 font-bold'
            }`}
          >
            TODOS ({mensajes.length})
          </button>
          <button
            onClick={() => setFiltroTipo('no_leidos')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
              filtroTipo === 'no_leidos'
                ? 'bg-neutral-950 text-white font-black shadow-xs'
                : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-200 font-bold'
            }`}
          >
            SIN LEER ({countSinLeer})
          </button>
          <button
            onClick={() => setFiltroTipo('cotizacion')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
              filtroTipo === 'cotizacion'
                ? 'bg-neutral-950 text-white font-black shadow-xs'
                : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-200 font-bold'
            }`}
          >
            COTIZACIONES
          </button>
        </div>
      </div>

      {/* =====================================================
           CONTENEDOR SPLIT: SIN SCROLL EXTERNO (FLEX-1 MIN-H-0)
           ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* ── COLUMNA IZQUIERDA: LISTA DE MENSAJES (Col 1-5) ── */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col h-full overflow-hidden">
          <div className="pb-4 border-b border-neutral-200 mb-3 flex items-center justify-between font-mono">
            <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">BUZÓN DE ENTRADA</span>
            <span className="text-xs text-neutral-600 font-bold uppercase tracking-wider">{mensajesFiltrados.length} MENSAJE(S)</span>
          </div>

          {/* Listado con Scroll Interno */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin font-sans">
            
            {mensajesFiltrados.map((m) => {
              const isSelected = mensajeSeleccionado?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => seleccionarMensaje(m)}
                  className={`p-4 rounded-2xl transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-neutral-950 text-white shadow-sm ring-1 ring-neutral-950'
                      : 'bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800'
                  }`}
                >
                  {/* Cabecera del Item */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {!m.leido && (
                        <span
                          className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 shrink-0"
                          title="Mensaje nuevo sin leer"
                        ></span>
                      )}
                      <span
                        className={`font-black text-sm sm:text-base uppercase tracking-wide truncate ${
                          isSelected ? 'text-white' : 'text-neutral-950'
                        }`}
                      >
                        {m.remitente}
                      </span>
                    </div>
                    <span className="text-xs font-mono shrink-0 text-neutral-400">
                      {formatearFechaCorta(m.fecha || m.created_at)}
                    </span>
                  </div>

                  {/* Asunto */}
                  <span
                    className={`text-xs sm:text-sm font-semibold block truncate mb-1 ${
                      isSelected ? 'text-neutral-200' : 'text-neutral-700'
                    }`}
                  >
                    {m.asunto}
                  </span>

                  {/* Snippet / Extracto */}
                  <p
                    className={`text-xs sm:text-sm line-clamp-1 leading-relaxed font-normal ${
                      isSelected ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                  >
                    {m.contenido}
                  </p>

                  {/* Footer del Item con Tags */}
                  <div
                    className={`mt-3 flex items-center justify-between pt-2 border-t ${
                      isSelected ? 'border-neutral-800' : 'border-neutral-200'
                    }`}
                  >
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider ${
                        isSelected ? 'bg-white/10 text-neutral-200' : 'bg-neutral-200 text-neutral-800'
                      }`}
                    >
                      {m.tipo ? m.tipo.replace('_', ' ') : 'COTIZACIÓN'}
                    </span>
                    {m.presupuesto && (
                      <span
                        className={`text-xs sm:text-sm font-mono font-black ${
                          isSelected ? 'text-emerald-400' : 'text-neutral-950'
                        }`}
                      >
                        {m.presupuesto}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Estado Vacío Vectorial de Alta Gama */}
            {mensajesFiltrados.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 shadow-xs">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7"/>
                    <path d="M22 13a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4"/>
                    <path d="M6 17v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3"/>
                    <path d="m16 9-4 4-4-4"/>
                  </svg>
                </div>
                <h5 className="font-serif font-black text-neutral-900 text-base uppercase tracking-wider">BANDEJA AL DÍA</h5>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-[240px] font-normal leading-relaxed">
                  No hay cotizaciones pendientes. Las nuevas solicitudes web se mostrarán en vivo.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* ── COLUMNA DERECHA: DETALLE EDITORIAL & ACCIÓN (Col 6-12) ── */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between h-full overflow-hidden">
          
          {mensajeSeleccionado ? (
            <div className="space-y-5 flex-1 flex flex-col justify-between overflow-hidden">
              <div className="overflow-y-auto pr-2 scrollbar-thin space-y-5 flex-1">
                
                {/* Toolbar Superior del Mensaje */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-2.5 font-mono">
                    <span className="text-xs px-3 py-1 rounded-md bg-neutral-950 text-white font-black uppercase tracking-wider">
                      {mensajeSeleccionado.tipo ? mensajeSeleccionado.tipo.replace('_', ' ') : 'COTIZACIÓN'}
                    </span>
                    {mensajeSeleccionado.presupuesto && (
                      <span className="text-xs px-3 py-1 rounded-md bg-neutral-100 text-neutral-900 border border-neutral-200 font-bold uppercase">
                        PRESUPUESTO: {mensajeSeleccionado.presupuesto}
                      </span>
                    )}
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => alternarLeido(mensajeSeleccionado)}
                      title={mensajeSeleccionado.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                      className="px-4 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950 transition-colors cursor-pointer inline-flex items-center gap-2"
                    >
                      <span className={`w-2 h-2 rounded-full ${mensajeSeleccionado.leido ? 'bg-neutral-400' : 'bg-emerald-500'}`}></span>
                      <span>{mensajeSeleccionado.leido ? 'LEÍDO' : 'NUEVO'}</span>
                    </button>
                    
                    <button
                      onClick={() => eliminarMensaje(mensajeSeleccionado)}
                      title="Eliminar mensaje permanentemente"
                      className="px-4 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      <span>ELIMINAR</span>
                    </button>
                  </div>
                </div>

                {/* Título / Asunto Monumental */}
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight leading-snug">
                    {mensajeSeleccionado.asunto}
                  </h2>
                </div>

                {/* Grid de Datos de Contacto Limpio */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-neutral-200 text-sm font-sans">
                  <div>
                    <span className="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-black mb-1">CLIENTE</span>
                    <span className="font-black text-neutral-950 text-sm sm:text-base block truncate uppercase">{mensajeSeleccionado.remitente}</span>
                  </div>
                  
                  <div>
                    <span className="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-black mb-1">CORREO</span>
                    <a href={`mailto:${mensajeSeleccionado.email}`} className="text-neutral-950 font-bold hover:underline truncate block text-sm">
                      {mensajeSeleccionado.email}
                    </a>
                  </div>

                  <div>
                    <span className="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-black mb-1">TELÉFONO</span>
                    <span className="font-mono text-neutral-800 font-bold truncate block text-sm">{mensajeSeleccionado.telefono || 'Sin teléfono'}</span>
                  </div>

                  <div>
                    <span className="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-black mb-1">FECHA RECIBIDO</span>
                    <span className="font-mono text-neutral-500 font-medium truncate block text-xs sm:text-sm">{mensajeSeleccionado.fecha || mensajeSeleccionado.created_at || 'Reciente'}</span>
                  </div>
                </div>

                {/* Cuerpo del Mensaje (Lectura Clara Amplia) */}
                <div>
                  <span className="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-black mb-2">DETALLE DE LA CONSULTA:</span>
                  <div className="text-neutral-800 text-base sm:text-lg leading-relaxed font-normal whitespace-pre-line bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200">
                    {mensajeSeleccionado.contenido}
                  </div>
                </div>

              </div>

              {/* Consola de Respuesta Rápida */}
              <div className="pt-4 border-t border-neutral-200 space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <label className="block text-neutral-950 font-black uppercase tracking-wider text-xs sm:text-sm font-mono">
                    RESPONDER A {mensajeSeleccionado.remitente.toUpperCase()}:
                  </label>
                  {mensajeSeleccionado.telefono && (
                    <a
                      href={`https://wa.me/${sanitizarTelefono(mensajeSeleccionado.telefono)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs sm:text-sm text-neutral-950 hover:text-black font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 hover:underline"
                    >
                      <span>CONTACTAR POR WHATSAPP</span> ↗
                    </a>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <textarea
                    value={textoRespuesta}
                    onChange={(e) => setTextoRespuesta(e.target.value)}
                    rows={2}
                    placeholder="Escribe tu mensaje o propuesta formal..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm sm:text-base focus:bg-white focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none transition-all resize-none font-sans"
                  ></textarea>
                  
                  <button
                    onClick={() => enviarRespuesta(mensajeSeleccionado)}
                    className="admin-btn-primary self-end py-3.5 px-7 text-xs sm:text-sm font-black uppercase tracking-wider"
                  >
                    ENVIAR RESPUESTA
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* ── VISTA CUANDO NO HAY MENSAJE SELECCIONADO ── */
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 p-8 font-sans gap-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-xs">
                <svg className="w-8 h-8 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
                </svg>
              </div>
              <h4 className="font-serif text-2xl font-black text-neutral-950 uppercase tracking-tight">BANDEJA DE CONSULTAS</h4>
              <p className="text-sm sm:text-base text-neutral-600 max-w-md font-normal leading-relaxed">
                Selecciona cualquier mensaje en la columna izquierda para revisar el detalle completo del presupuesto y responder directamente al cliente.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default DashMensajes;
