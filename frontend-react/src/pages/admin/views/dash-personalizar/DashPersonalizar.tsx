import React, { useState, useEffect } from 'react';
import { cmsService, useCmsService, SiteConfig, DEFAULT_SITE_CONFIG } from '../../../../services/cms.service';
import { proyectosService, useProyectosService } from '../../../../services/proyectos.service';
import { Proyecto, CategoriaProyecto } from '../../../../models/proyecto.model';

interface GaleriaItem {
  file: File;
  previewUrl: string;
}

export const DashPersonalizar: React.FC = () => {
  const { config } = useCmsService();
  const { proyectos } = useProyectosService();

  const [tabActiva, setTabActiva] = useState<'proyectos' | 'home' | 'cotizador' | 'contacto'>('proyectos');
  const [guardando, setGuardando] = useState<boolean>(false);
  const [subiendoProyecto, setSubiendoProyecto] = useState<boolean>(false);
  const [mensajeAlerta, setMensajeAlerta] = useState<string>('');
  const [tipoAlerta, setTipoAlerta] = useState<'exito' | 'error'>('exito');

  // Foto de Portada Principal
  const [archivoPortada, setArchivoPortada] = useState<File | null>(null);
  const [portadaPreview, setPortadaPreview] = useState<string | null>(null);

  // Galería Adicional (Hasta 30 fotos)
  const [galeriaImagenes, setGaleriaImagenes] = useState<GaleriaItem[]>([]);

  // Estado del Modal de Eliminación de Proyecto
  const [proyectoAEliminar, setProyectoAEliminar] = useState<Proyecto | null>(null);
  const [eliminando, setEliminando] = useState<boolean>(false);

  const [formConfig, setFormConfig] = useState<SiteConfig>(() => ({
    ...DEFAULT_SITE_CONFIG,
    ...config,
  }));

  // Modelo del formulario de nuevo proyecto
  const [nuevoProyecto, setNuevoProyecto] = useState({
    titulo: '',
    subtitulo: '',
    categoria: 'Residencial' as CategoriaProyecto,
    descripcion: '',
    ubicacion: 'Llanogrande, Antioquia',
    area: 520,
    anio: 2026,
    destacado: true,
    caracteristicasStr: 'Estructura en concreto a la vista, Patio interior central, Iluminación indirecta, Ventanería con control solar',
    editorial_slogan: 'ARQUITECTURA DE ALTA PRECISIÓN Y PAISAJISMO.',
    editorial_style: 'coral-title',
    barcode: '0 600229402 1',
  });

  useEffect(() => {
    const sub = cmsService.fetchConfig().subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          setFormConfig({ ...DEFAULT_SITE_CONFIG, ...res.data });
        }
      },
      error: () => {},
    });
    return () => sub.unsubscribe();
  }, []);

  const mostrarBannerAlertaBool = formConfig.mostrar_banner_alerta === '1';

  const setMostrarBannerAlertaBool = (val: boolean) => {
    setFormConfig((prev) => ({
      ...prev,
      mostrar_banner_alerta: val ? '1' : '0',
    }));
  };

  const updateFormConfig = <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => {
    setFormConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const mostrarMensaje = (msg: string, tipo: 'exito' | 'error') => {
    setMensajeAlerta(msg);
    setTipoAlerta(tipo);
    setTimeout(() => {
      setMensajeAlerta((curr) => (curr === msg ? '' : curr));
    }, 7000);
  };

  // Selección de Foto de Portada
  const onArchivoPortadaSeleccionado = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setArchivoPortada(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setPortadaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const quitarPortada = () => {
    setArchivoPortada(null);
    setPortadaPreview(null);
  };

  // Selección de Múltiples Fotos para Galería (Hasta 30)
  const onImagenesGaleriaSeleccionadas = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const espacioDisponible = 30 - galeriaImagenes.length;

    if (espacioDisponible <= 0) {
      mostrarMensaje('Ya has alcanzado el límite máximo de 30 fotos para la galería.', 'error');
      return;
    }

    const archivosAceptados = Array.from(fileList).slice(0, espacioDisponible);

    if (fileList.length > espacioDisponible) {
      mostrarMensaje(`Se seleccionaron solo las primeras ${espacioDisponible} fotos para no superar el límite de 30.`, 'error');
    }

    archivosAceptados.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setGaleriaImagenes((items) => [
          ...items,
          { file, previewUrl: e.target?.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });

    event.target.value = '';
  };

  const eliminarFotoGaleria = (index: number) => {
    setGaleriaImagenes((items) => items.filter((_, i) => i !== index));
  };

  const limpiarGaleria = () => {
    setGaleriaImagenes([]);
  };

  const onCrearProyecto = (event: React.FormEvent) => {
    event.preventDefault();
    if (!nuevoProyecto.titulo || !archivoPortada) {
      mostrarMensaje('Por favor ingresa el nombre de la obra y sube la fotografía de portada.', 'error');
      return;
    }

    setSubiendoProyecto(true);
    setMensajeAlerta('');

    const formData = new FormData();
    formData.append('titulo', nuevoProyecto.titulo);
    formData.append('subtitulo', nuevoProyecto.subtitulo);
    formData.append('categoria', nuevoProyecto.categoria);
    formData.append('descripcion', nuevoProyecto.descripcion);
    formData.append('ubicacion', nuevoProyecto.ubicacion);
    formData.append('area_m2', String(nuevoProyecto.area));
    formData.append('anio', String(nuevoProyecto.anio));
    formData.append('destacado', nuevoProyecto.destacado ? '1' : '0');
    formData.append('editorial_title', nuevoProyecto.titulo);
    formData.append('editorial_subtitle', nuevoProyecto.subtitulo);
    formData.append('editorial_slogan', nuevoProyecto.editorial_slogan);
    formData.append('editorial_style', nuevoProyecto.editorial_style);
    formData.append('barcode', nuevoProyecto.barcode);

    // Foto de Portada Principal
    formData.append('imagen', archivoPortada);

    // Galería Adicional (Hasta 30 fotos)
    for (const item of galeriaImagenes) {
      formData.append('imagenes_adicionales[]', item.file);
    }

    // Características técnicas como JSON
    const caracteristicas = nuevoProyecto.caracteristicasStr
      .split(',')
      .map((s) => s.trim())
      .filter((s) => !!s);
    formData.append('caracteristicas', JSON.stringify(caracteristicas));

    proyectosService.crearProyectoApi(formData).subscribe({
      next: () => {
        setSubiendoProyecto(false);
        const totalFotos = 1 + galeriaImagenes.length;
        mostrarMensaje(
          `¡Obra «${nuevoProyecto.titulo}» publicada exitosamente con ${totalFotos} fotografías en el portafolio!`,
          'exito'
        );

        setNuevoProyecto((prev) => ({
          ...prev,
          titulo: '',
          subtitulo: '',
          descripcion: '',
        }));
        setArchivoPortada(null);
        setPortadaPreview(null);
        setGaleriaImagenes([]);
      },
      error: (err) => {
        setSubiendoProyecto(false);
        const errDesc = err?.error?.message || 'Error al conectar con el backend o Cloudinary.';
        mostrarMensaje(errDesc, 'error');
      },
    });
  };

  const abrirModalEliminar = (p: Proyecto) => {
    setProyectoAEliminar(p);
  };

  const cerrarModalEliminar = () => {
    if (!eliminando) {
      setProyectoAEliminar(null);
    }
  };

  const confirmarEliminar = () => {
    if (!proyectoAEliminar) return;

    setEliminando(true);
    proyectosService.eliminarProyectoApi(proyectoAEliminar.id).subscribe({
      next: () => {
        setEliminando(false);
        const titulo = proyectoAEliminar.titulo;
        setProyectoAEliminar(null);
        mostrarMensaje(`La obra «${titulo}» ha sido eliminada del catálogo.`, 'exito');
      },
      error: (err) => {
        setEliminando(false);
        const desc = err?.error?.message || 'Error al eliminar el proyecto en la base de datos.';
        mostrarMensaje(desc, 'error');
      },
    });
  };

  const guardarConfiguracion = () => {
    setGuardando(true);
    setMensajeAlerta('');

    cmsService.saveConfig(formConfig).subscribe({
      next: () => {
        setGuardando(false);
        mostrarMensaje('¡Configuración guardada exitosamente!', 'exito');
      },
      error: () => {
        setGuardando(false);
        mostrarMensaje('Error al guardar la configuración en la base de datos.', 'error');
      },
    });
  };

  return (
    <div className="space-y-10 animate-fade-in font-sans pb-28 max-w-[1650px] mx-auto">
      
      {/* ── HEADER DE SECCIÓN NORMALIZADO ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e4e4e7]">
        <div>
          <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#71717a]">
            CONFIGURACIÓN &bull; CONTENIDO DEL SITIO
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#09090b] tracking-tight mt-1">
            Personalizar <span className="font-light text-[#71717a]">Web</span>
          </h1>
          <p className="text-xs text-[#71717a] mt-1 font-medium">
            Editor de portadas, textos institucionales, showcase del director, canales de contacto y avisos visibles en la web pública.
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          {tabActiva !== 'proyectos' && (
            <button
              onClick={guardarConfiguracion}
              disabled={guardando}
              className="btn-primary-black text-xs"
            >
              <span className={`material-symbols-rounded text-base ${guardando ? 'animate-spin' : ''}`}>
                {guardando ? 'sync' : 'save'}
              </span>
              <span>{guardando ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ALERTA DE ÉXITO O ERROR */}
      {mensajeAlerta && (
        <div
          className={`p-5 rounded-2xl border-2 flex items-center justify-between animate-fade-in shadow-md ${
            tipoAlerta === 'exito'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-red-50 border-red-300 text-red-950'
          }`}
        >
          <div className="flex items-center gap-3 font-bold text-base">
            <span
              className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                tipoAlerta === 'exito' ? 'bg-emerald-600 animate-pulse' : 'bg-red-600'
              }`}
            ></span>
            <span>{mensajeAlerta}</span>
          </div>
          <button
            onClick={() => setMensajeAlerta('')}
            className="text-neutral-500 hover:text-neutral-950 p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
      )}

      {/* =====================================================
           NAVEGACIÓN PRINCIPAL (TABS MODERNIZADOS)
           ===================================================== */}
      <div className="bg-neutral-100/90 p-2 rounded-2xl border-2 border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-2 shadow-inner">
        
        {/* Tab 1: Proyectos */}
        <button
          onClick={() => setTabActiva('proyectos')}
          className={`py-4 px-5 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-3 border border-neutral-200 ${
            tabActiva === 'proyectos'
              ? 'bg-neutral-950 text-white shadow-lg'
              : 'bg-white/80 text-neutral-700 hover:text-neutral-950 hover:bg-white'
          }`}
        >
          <svg width="20" height="20" style={{ width: '20px', height: '20px', minWidth: '20px' }} className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
          <span>Proyectos</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
              tabActiva === 'proyectos' ? 'bg-white text-black' : 'bg-neutral-200 text-neutral-800'
            }`}
          >
            {proyectos.length}
          </span>
        </button>

        {/* Tab 2: Home */}
        <button
          onClick={() => setTabActiva('home')}
          className={`py-4 px-5 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-3 border border-neutral-200 ${
            tabActiva === 'home'
              ? 'bg-neutral-950 text-white shadow-lg'
              : 'bg-white/80 text-neutral-700 hover:text-neutral-950 hover:bg-white'
          }`}
        >
          <svg width="20" height="20" style={{ width: '20px', height: '20px', minWidth: '20px' }} className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Textos Home</span>
        </button>

        {/* Tab 3: Cotizador */}
        <button
          onClick={() => setTabActiva('cotizador')}
          className={`py-4 px-5 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-3 border border-neutral-200 ${
            tabActiva === 'cotizador'
              ? 'bg-neutral-950 text-white shadow-lg'
              : 'bg-white/80 text-neutral-700 hover:text-neutral-950 hover:bg-white'
          }`}
        >
          <svg width="20" height="20" style={{ width: '20px', height: '20px', minWidth: '20px' }} className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M7 7h10"/>
            <path d="M7 12h10"/>
            <path d="M7 17h10"/>
          </svg>
          <span>Cotizador</span>
        </button>

        {/* Tab 4: Canales */}
        <button
          onClick={() => setTabActiva('contacto')}
          className={`py-4 px-5 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-3 border border-neutral-200 ${
            tabActiva === 'contacto'
              ? 'bg-neutral-950 text-white shadow-lg'
              : 'bg-white/80 text-neutral-700 hover:text-neutral-950 hover:bg-white'
          }`}
        >
          <svg width="20" height="20" style={{ width: '20px', height: '20px', minWidth: '20px' }} className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>Canales</span>
        </button>

      </div>

      {/* ============================================================== */}
      {/* PESTAÑA 1: GESTIÓN DE PROYECTOS                                */}
      {/* ============================================================== */}
      {tabActiva === 'proyectos' && (
        <div className="space-y-16 animate-fade-in mt-10">
          
          {/* FORMULARIO INTEGRAL DE CREACIÓN DE PROYECTO CON MULTI-IMAGEN HASTA 30 FOTOS */}
          <div className="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-12 shadow-md">
            
            <div className="mb-10 pb-6 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Nueva Publicación</span>
                <h3 className="font-serif text-3xl sm:text-4xl font-black text-neutral-950 uppercase tracking-tight mt-1">
                  Publicar Obra en el Portafolio
                </h3>
                <p className="font-sans text-base text-neutral-600 font-normal mt-2">
                  Define la fotografía de portada, agrega hasta 30 imágenes de alta calidad para la galería y especifica todos los detalles constructivos.
                </p>
              </div>
              <div className="bg-neutral-100 border border-neutral-300 rounded-2xl px-5 py-3 text-right shrink-0">
                <span className="text-xs font-mono font-bold text-neutral-500 uppercase block">Galería Total</span>
                <span className="text-lg font-mono font-bold text-neutral-950">
                  {(portadaPreview ? 1 : 0) + galeriaImagenes.length} / 31 Fotos
                </span>
              </div>
            </div>

            <form onSubmit={onCrearProyecto} className="space-y-12">
              
              {/* ============================================================
                   BLOQUE 1: ZONA DE FOTOGRAFÍAS (PORTADA + GALERÍA HASTA 30)
                   ============================================================ */}
              <div className="bg-neutral-50 p-6 sm:p-8 rounded-3xl border-2 border-neutral-300 space-y-8">
                
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <div>
                    <h4 className="font-serif text-2xl font-black text-neutral-950 uppercase">
                      1. Fotografía de Portada &amp; Galería Completa
                    </h4>
                    <p className="text-sm text-neutral-600 mt-1">
                      Carga la portada principal de la obra y complementa con hasta 30 fotografías para el recorrido cinemático.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* PORTADA PRINCIPAL (Columna de 5) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900">
                        Fotografía de Portada <span className="text-red-600 font-black text-base">*</span>
                      </label>
                      <span className="text-xs font-mono font-bold text-neutral-500 uppercase">Principal (Catálogo &amp; Hero)</span>
                    </div>

                    <div className="relative w-full aspect-[4/3] bg-white border-2 border-dashed border-neutral-400 rounded-2xl flex flex-col items-center justify-center p-4 text-center hover:border-black hover:bg-neutral-100 transition-all cursor-pointer group overflow-hidden shadow-sm">
                      <input
                        type="file"
                        onChange={onArchivoPortadaSeleccionado}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        required={!archivoPortada}
                      />
                      
                      {/* Previsualización de Portada */}
                      {portadaPreview ? (
                        <div className="absolute inset-0 z-10 w-full h-full">
                          <img src={portadaPreview} alt="Portada Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl uppercase tracking-wider shadow-lg">Cambiar Foto de Portada</span>
                            <span className="text-white text-xs mt-2 font-mono">{archivoPortada?.name}</span>
                          </div>
                        </div>
                      ) : (
                        /* Estado Vacío */
                        <div className="relative z-0 pointer-events-none flex flex-col items-center px-4">
                          <div className="w-14 h-14 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg width="26" height="26" className="text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                          </div>
                          <span className="font-bold text-neutral-950 text-base">Subir Portada Oficial</span>
                          <span className="text-neutral-500 text-xs mt-1">Formato JPG o PNG de alta resolución</span>
                        </div>
                      )}
                    </div>

                    {archivoPortada && (
                      <div className="flex items-center justify-between p-3 bg-emerald-100/70 text-emerald-950 rounded-xl border border-emerald-300 text-sm font-semibold">
                        <span className="truncate max-w-[280px]">✓ {archivoPortada.name}</span>
                        <button
                          type="button"
                          onClick={quitarPortada}
                          className="text-emerald-900 hover:text-red-600 text-xs font-bold uppercase underline cursor-pointer"
                        >
                          Quitar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* GALERÍA MULTI-IMAGEN HASTA 30 FOTOS (Columna de 7) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900">
                          Galería del Proyecto (Hasta 30 fotos adicionales)
                        </label>
                        <span className="text-xs text-neutral-500">Fotografías de interiores, detalles constructivos, fachadas y planos.</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-bold px-3 py-1 bg-white rounded-lg border-2 border-neutral-300 text-neutral-800">
                          {galeriaImagenes.length} / 30 fotos
                        </span>
                        {galeriaImagenes.length > 0 && (
                          <button
                            type="button"
                            onClick={limpiarGaleria}
                            className="text-xs font-bold text-red-600 hover:text-red-800 uppercase tracking-wider underline cursor-pointer"
                          >
                            Vaciar
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Dropzone para Multi-Upload */}
                    <div className="relative w-full py-8 bg-white border-2 border-dashed border-neutral-400 rounded-2xl flex flex-col items-center justify-center px-6 text-center hover:border-black hover:bg-neutral-100 transition-all cursor-pointer group shadow-sm">
                      <input
                        type="file"
                        onChange={onImagenesGaleriaSeleccionadas}
                        multiple
                        accept="image/*"
                        disabled={galeriaImagenes.length >= 30}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                      />
                      
                      <div className="flex items-center gap-4 pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                          <svg width="24" height="24" className="text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-neutral-950 text-base block">
                            {galeriaImagenes.length >= 30 ? 'Límite de 30 fotos alcanzado' : 'Selecciona o arrastra varias imágenes a la vez'}
                          </span>
                          <span className="text-neutral-500 text-xs">Puedes seleccionar hasta 30 archivos de una sola vez</span>
                        </div>
                      </div>
                    </div>

                    {/* Grid de Miniaturas de las Fotos Cargadas */}
                    {galeriaImagenes.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[280px] overflow-y-auto p-3 bg-white rounded-2xl border-2 border-neutral-200">
                        {galeriaImagenes.map((item, i) => (
                          <div
                            key={i}
                            className="relative aspect-square rounded-xl overflow-hidden group border border-neutral-300 bg-neutral-100 shadow-xs"
                          >
                            <img src={item.previewUrl} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                            
                            {/* Badge con número de foto */}
                            <span className="absolute top-1 left-1 bg-black/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                              #{i + 1 < 10 ? '0' + (i + 1) : i + 1}
                            </span>

                            {/* Botón Eliminar Foto Individual */}
                            <button
                              type="button"
                              onClick={() => eliminarFotoGaleria(i)}
                              title="Eliminar de la galería"
                              className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer hover:bg-red-700"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            </button>

                            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate text-center">
                              {item.file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* ============================================================
                   BLOQUE 2: DATOS DE IDENTIFICACIÓN & CATEGORÍA
                   ============================================================ */}
              <div className="bg-neutral-50 p-6 sm:p-8 rounded-3xl border-2 border-neutral-300 space-y-6">
                
                <div className="border-b border-neutral-200 pb-4">
                  <h4 className="font-serif text-2xl font-black text-neutral-950 uppercase">
                    2. Información de la Obra &amp; Ubicación
                  </h4>
                  <p className="text-sm text-neutral-600 mt-1">Título editorial, categoría tipológica y zona geográfica.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  <div className="lg:col-span-6">
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                      Nombre de la Obra <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={nuevoProyecto.titulo}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, titulo: e.target.value }))}
                      name="p_titulo"
                      required
                      placeholder="Ej: CASA M o RESIDENCIA ALTOS DEL VALLE"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-400 text-neutral-950 font-serif text-2xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all shadow-sm"
                    />
                  </div>

                  <div className="lg:col-span-6">
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                      Subtítulo Conceptual / Editorial
                    </label>
                    <input
                      type="text"
                      value={nuevoProyecto.subtitulo}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, subtitulo: e.target.value }))}
                      name="p_subtitulo"
                      placeholder="Ej: Geometría minimalista integrada con materiales nobles y luz natural."
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>

                  <div className="lg:col-span-4">
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                      Categoría Tipológica <span className="text-red-600 font-bold">*</span>
                    </label>
                    <select
                      value={nuevoProyecto.categoria}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, categoria: e.target.value as CategoriaProyecto }))}
                      name="p_cat"
                      required
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-bold focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all cursor-pointer"
                    >
                      <option value="Residencial">Residencial</option>
                      <option value="Remodelación">Remodelación</option>
                      <option value="Arquitectura interior">Arquitectura interior</option>
                      <option value="Oficina">Oficina</option>
                    </select>
                  </div>

                  <div className="lg:col-span-4">
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                      Ubicación Geográfica
                    </label>
                    <input
                      type="text"
                      value={nuevoProyecto.ubicacion}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, ubicacion: e.target.value }))}
                      name="p_ubi"
                      placeholder="Ej: Llanogrande, Antioquia"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>

                  <div className="lg:col-span-4 flex items-center pt-2 lg:pt-8">
                    <label htmlFor="chkDest" className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-neutral-300 hover:border-black cursor-pointer transition-all w-full">
                      <input
                        type="checkbox"
                        checked={nuevoProyecto.destacado}
                        onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, destacado: e.target.checked }))}
                        id="chkDest"
                        name="p_dest"
                        className="w-6 h-6 rounded border-2 border-neutral-400 text-black focus:ring-black cursor-pointer accent-black shrink-0"
                      />
                      <div>
                        <span className="text-neutral-950 font-bold text-base block">Destacar en el Home</span>
                        <span className="text-xs text-neutral-500">Aparecerá en la portada del sitio</span>
                      </div>
                    </label>
                  </div>

                </div>

              </div>

              {/* ============================================================
                   BLOQUE 3: ESPECIFICACIONES TÉCNICAS Y ATRIBUTOS EDITORIALES
                   ============================================================ */}
              <div className="bg-neutral-50 p-6 sm:p-8 rounded-3xl border-2 border-neutral-300 space-y-6">
                
                <div className="border-b border-neutral-200 pb-4">
                  <h4 className="font-serif text-2xl font-black text-neutral-950 uppercase">
                    3. Especificaciones Técnicas &amp; Estilo de Revista
                  </h4>
                  <p className="text-sm text-neutral-600 mt-1">Métricas de ingeniería, materiales nobles y presentación editorial.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div>
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                      Área Construida (m²)
                    </label>
                    <input
                      type="number"
                      value={nuevoProyecto.area}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, area: Number(e.target.value) }))}
                      name="p_area"
                      placeholder="Ej: 520"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-mono text-base font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                      Año de Ejecución
                    </label>
                    <input
                      type="number"
                      value={nuevoProyecto.anio}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, anio: Number(e.target.value) }))}
                      name="p_anio"
                      placeholder="Ej: 2026"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-mono text-base font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                      Estilo de Tarjeta Editorial
                    </label>
                    <select
                      value={nuevoProyecto.editorial_style}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, editorial_style: e.target.value }))}
                      name="p_style"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-semibold focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all cursor-pointer"
                    >
                      <option value="coral-title">Coral Title (Editorial)</option>
                      <option value="white-bold">White Bold (Monocromático)</option>
                      <option value="ribbon-tag">Ribbon Tag (Cinta)</option>
                      <option value="split-grid">Split Grid (Dividido)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                      Código de Catálogo (Barcode)
                    </label>
                    <input
                      type="text"
                      value={nuevoProyecto.barcode}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, barcode: e.target.value }))}
                      name="p_barcode"
                      placeholder="Ej: 0 600229402 1"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-mono text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-6">
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                      Slogan / Remate Editorial
                    </label>
                    <input
                      type="text"
                      value={nuevoProyecto.editorial_slogan}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, editorial_slogan: e.target.value }))}
                      name="p_slogan"
                      placeholder="Ej: CONCRETO Y LUZ NATURAL EN EL ORIENTE ANTIOQUEÑO."
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-6">
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                      Atributos y Materiales Clave (Separados por coma)
                    </label>
                    <input
                      type="text"
                      value={nuevoProyecto.caracteristicasStr}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, caracteristicasStr: e.target.value }))}
                      name="p_caract"
                      placeholder="Ej: Concreto a la vista con duela, Patio interior central, Iluminación indirecta"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>

                </div>

              </div>

              {/* ============================================================
                   BLOQUE 4: MEMORIA DESCRIPTIVA
                   ============================================================ */}
              <div className="bg-neutral-50 p-6 sm:p-8 rounded-3xl border-2 border-neutral-300 space-y-4">
                <div className="border-b border-neutral-200 pb-4">
                  <h4 className="font-serif text-2xl font-black text-neutral-950 uppercase">
                    4. Memoria Descriptiva &amp; Concepto Arquitectónico
                  </h4>
                  <p className="text-sm text-neutral-600 mt-1">Escribe la visión de diseño, justificación espacial y experiencia de habitabilidad.</p>
                </div>

                <div>
                  <textarea
                    value={nuevoProyecto.descripcion}
                    onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, descripcion: e.target.value }))}
                    name="p_desc"
                    rows={5}
                    placeholder="Describe la volumetría del proyecto, la distribución espacial, los materiales nobles utilizados y cómo dialoga con el entorno natural..."
                    className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              {/* BARRA DE PUBLICACIÓN */}
              <div className="pt-6 border-t-2 border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="text-neutral-600 text-base font-medium">
                  Al publicar, la portada y las fotos de la galería serán procesadas y optimizadas en alta definición para la web y móviles.
                </div>

                <button
                  type="submit"
                  disabled={subiendoProyecto}
                  className="admin-btn-primary py-5 px-12 text-base font-bold uppercase tracking-widest shadow-2xl rounded-2xl hover:scale-[1.01] transition-transform cursor-pointer shrink-0"
                >
                  {!subiendoProyecto ? (
                    <span className="flex items-center gap-3">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Publicar Obra en Portafolio
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      Subiendo {(portadaPreview ? 1 : 0) + galeriaImagenes.length} Fotografías...
                    </span>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* ============================================================== */}
          {/* CATÁLOGO DE OBRAS ACTIVAS                                      */}
          {/* ============================================================== */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-neutral-200">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Portafolio Actual</span>
                <h3 className="font-serif text-3xl sm:text-4xl font-black text-neutral-950 uppercase tracking-tight mt-1">
                  Catálogo de Obras Publicadas
                </h3>
                <p className="font-sans text-base text-neutral-600 font-normal mt-1">
                  Total de obras registradas: <strong>{proyectos.length}</strong>
                </p>
              </div>
            </div>

            {proyectos.length === 0 ? (
              <div className="bg-neutral-50 rounded-3xl p-16 text-center border-2 border-neutral-300">
                <p className="text-neutral-600 font-bold text-lg">Aún no hay obras publicadas en el catálogo.</p>
                <p className="text-neutral-500 text-sm mt-1">Usa el formulario superior para añadir tu primer proyecto.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Project Card */}
                {proyectos.map((p) => (
                  <div
                    key={p.id}
                    className="group bg-white rounded-3xl border-2 border-neutral-300 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col hover:border-black"
                  >
                    {/* Imagen del Proyecto */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100">
                      <img src={p.imagenUrl} alt={p.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Categoría & Destacado */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-bold uppercase tracking-wider text-black shadow-md">
                          {p.categoria}
                        </span>
                        {p.destacado && (
                          <span className="px-3 py-1.5 bg-black/95 backdrop-blur-sm rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-md flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Home
                          </span>
                        )}
                      </div>

                      {/* Conteo de Galería */}
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-xs font-mono font-bold text-white shadow flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                          {(p.imagenesAdicionales?.length || 0) + 1} Fotografías
                        </span>
                      </div>
                      
                      {/* Botón Eliminar */}
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => abrirModalEliminar(p)}
                          title="Eliminar obra del portafolio"
                          className="w-11 h-11 bg-white/95 hover:bg-red-600 text-neutral-700 hover:text-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer hover:scale-110"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                        </button>
                      </div>
                    </div>

                    {/* Contenido de la Tarjeta */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-serif text-2xl font-bold text-neutral-950 leading-snug">{p.titulo}</h4>
                        <p className="text-base text-neutral-600 mt-1.5 line-clamp-1 font-medium">{p.ubicacion}</p>
                        {p.subtitulo && (
                          <p className="text-sm text-neutral-500 mt-2 line-clamp-2 leading-relaxed">{p.subtitulo}</p>
                        )}
                      </div>
                      
                      <div className="pt-4 flex items-center justify-between text-sm font-mono text-neutral-700 font-bold uppercase tracking-wider border-t-2 border-neutral-100">
                        <span className="bg-neutral-100 px-3 py-1 rounded-lg">{p.area ? p.area + ' m²' : 'Área N/D'}</span>
                        <span className="bg-neutral-100 px-3 py-1 rounded-lg">{p.anio || '2026'}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 2: TEXTOS DEL HOME                                     */}
      {/* ============================================================== */}
      {tabActiva === 'home' && (
        <div className="space-y-10 animate-fade-in mt-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Bloque Portada / Hero */}
            <div className="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7">
              <div className="pb-4 border-b border-neutral-200">
                <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Inicio Principal</span>
                <h3 className="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Portada / Hero</h3>
                <p className="font-sans text-base text-neutral-600 font-normal mt-1">Titular cinemático principal y botones del video inicial.</p>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Prefijo del Título</label>
                    <input
                      type="text"
                      value={formConfig.hero_title_prefix}
                      onChange={(e) => updateFormConfig('hero_title_prefix', e.target.value)}
                      placeholder="Ej: Diseñamos y"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Palabra Resaltada</label>
                    <input
                      type="text"
                      value={formConfig.hero_title_highlight}
                      onChange={(e) => updateFormConfig('hero_title_highlight', e.target.value)}
                      placeholder="Ej: Construimos"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Botón Principal (Cotizar)</label>
                    <input
                      type="text"
                      value={formConfig.hero_btn_cotizar}
                      onChange={(e) => updateFormConfig('hero_btn_cotizar', e.target.value)}
                      placeholder="Ej: Cotiza con nosotros"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Botón Secundario (Obras)</label>
                    <input
                      type="text"
                      value={formConfig.hero_btn_obras}
                      onChange={(e) => updateFormConfig('hero_btn_obras', e.target.value)}
                      placeholder="Ej: Ver Obras & Proyectos"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Indicador Inferior de Desplazamiento</label>
                  <input
                    type="text"
                    value={formConfig.hero_scroll_text}
                    onChange={(e) => updateFormConfig('hero_scroll_text', e.target.value)}
                    placeholder="Ej: DESLIZA PARA EXPLORAR"
                    className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Bloque Director Showcase (Juan Moreno) */}
            <div className="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7">
              <div className="pb-4 border-b border-neutral-200">
                <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Director General</span>
                <h3 className="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Director Showcase</h3>
                <p className="font-sans text-base text-neutral-600 font-normal mt-1">Datos, cargos y cifras clave de la dirección de obra.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Nombre del Director</label>
                    <input
                      type="text"
                      value={formConfig.director_name}
                      onChange={(e) => updateFormConfig('director_name', e.target.value)}
                      placeholder="Ej: JUAN MORENO"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-400 text-neutral-950 font-serif text-xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Cargo / Título</label>
                    <input
                      type="text"
                      value={formConfig.director_role}
                      onChange={(e) => updateFormConfig('director_role', e.target.value)}
                      placeholder="Ej: INGENIERO CIVIL"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Etiqueta Superior</label>
                  <input
                    type="text"
                    value={formConfig.director_tagline}
                    onChange={(e) => updateFormConfig('director_tagline', e.target.value)}
                    placeholder="Ej: LIDERAZGO & RIGOR TÉCNICO"
                    className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Titular de Excelencia</label>
                  <input
                    type="text"
                    value={formConfig.director_title}
                    onChange={(e) => updateFormConfig('director_title', e.target.value)}
                    placeholder="Ej: Ingeniería de Excelencia sin Concesiones"
                    className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block font-sans text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">Métrica 1 (Cifra)</label>
                    <input
                      type="text"
                      value={formConfig.director_stat1_number}
                      onChange={(e) => updateFormConfig('director_stat1_number', e.target.value)}
                      placeholder="7+"
                      className="w-full px-4 py-3 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-lg font-bold outline-none"
                    />
                    <input
                      type="text"
                      value={formConfig.director_stat1_label}
                      onChange={(e) => updateFormConfig('director_stat1_label', e.target.value)}
                      placeholder="AÑOS DE EXPERIENCIA"
                      className="w-full px-4 py-2 mt-2 rounded-lg bg-neutral-100 border border-neutral-300 text-neutral-700 text-xs font-mono font-bold uppercase outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">Métrica 2 (Cifra)</label>
                    <input
                      type="text"
                      value={formConfig.director_stat2_number}
                      onChange={(e) => updateFormConfig('director_stat2_number', e.target.value)}
                      placeholder="4+"
                      className="w-full px-4 py-3 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-lg font-bold outline-none"
                    />
                    <input
                      type="text"
                      value={formConfig.director_stat2_label}
                      onChange={(e) => updateFormConfig('director_stat2_label', e.target.value)}
                      placeholder="OBRAS EJECUTADAS"
                      className="w-full px-4 py-2 mt-2 rounded-lg bg-neutral-100 border border-neutral-300 text-neutral-700 text-xs font-mono font-bold uppercase outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SEGUNDA FILA: CASA M & NUESTRA MISIÓN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Bloque Casa M (Banner Video de Home) */}
            <div className="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7">
              <div className="pb-4 border-b border-neutral-200">
                <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Banner Video</span>
                <h3 className="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Obra Emblemática (Casa M)</h3>
                <p className="font-sans text-base text-neutral-600 font-normal mt-1">Titular y descripción de la sección de video cinemático en el Home.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Prefijo del Título</label>
                    <input
                      type="text"
                      value={formConfig.casam_title}
                      onChange={(e) => updateFormConfig('casam_title', e.target.value)}
                      placeholder="Ej: CASA"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Letra / Palabra Resaltada</label>
                    <input
                      type="text"
                      value={formConfig.casam_highlight}
                      onChange={(e) => updateFormConfig('casam_highlight', e.target.value)}
                      placeholder="Ej: M"
                      className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Descripción de la Obra</label>
                  <textarea
                    value={formConfig.casam_subtitle}
                    onChange={(e) => updateFormConfig('casam_subtitle', e.target.value)}
                    rows={3}
                    placeholder="Residencia contemporánea donde la arquitectura de autor..."
                    className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Texto del Botón</label>
                  <input
                    type="text"
                    value={formConfig.casam_btn}
                    onChange={(e) => updateFormConfig('casam_btn', e.target.value)}
                    placeholder="Ej: VER PROYECTO"
                    className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Bloque Nuestra Misión */}
            <div className="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7">
              <div className="pb-4 border-b border-neutral-200">
                <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Filosofía &amp; Propósito</span>
                <h3 className="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Nuestra Misión</h3>
                <p className="font-sans text-base text-neutral-600 font-normal mt-1">Manifiesto editorial sobre arquitectura y visión de Sysmicon.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Título de la Sección</label>
                  <input
                    type="text"
                    value={formConfig.mision_title}
                    onChange={(e) => updateFormConfig('mision_title', e.target.value)}
                    placeholder="Ej: Nuestra Misión"
                    className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-400 text-neutral-950 font-serif text-xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Manifiesto / Descripción</label>
                  <textarea
                    value={formConfig.mision_desc}
                    onChange={(e) => updateFormConfig('mision_desc', e.target.value)}
                    rows={5}
                    placeholder="Desarrollar proyectos a través de los conocimientos multidisciplinares..."
                    className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

          </div>

          {/* Bloque Pasos de Contacto (Steps Home) */}
          <div className="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-12 shadow-md space-y-8">
            <div className="pb-4 border-b border-neutral-200">
              <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Sección de Asesoría</span>
              <h3 className="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Pasos de Contacto (Home)</h3>
              <p className="font-sans text-base text-neutral-600 font-normal mt-1">El proceso de 3 pasos que guía al cliente antes del formulario.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Pregunta Titular</label>
                <input
                  type="text"
                  value={formConfig.steps_title}
                  onChange={(e) => updateFormConfig('steps_title', e.target.value)}
                  placeholder="Ej: ¿Tienes un terreno o un sueño en mente?"
                  className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-400 text-neutral-950 font-serif text-xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Subtítulo de Asesoría</label>
                <textarea
                  value={formConfig.steps_subtitle}
                  onChange={(e) => updateFormConfig('steps_subtitle', e.target.value)}
                  rows={3}
                  placeholder="Nuestros arquitectos e ingenieros están listos para asesorarte..."
                  className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-200">
              {/* Paso 01 */}
              <div className="bg-neutral-50 p-5 rounded-2xl border-2 border-neutral-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-black text-white">Paso 01</span>
                </div>
                <input
                  type="text"
                  value={formConfig.step1_title}
                  onChange={(e) => updateFormConfig('step1_title', e.target.value)}
                  placeholder="Habla con un Experto"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-base font-bold outline-none"
                />
                <textarea
                  value={formConfig.step1_desc}
                  onChange={(e) => updateFormConfig('step1_desc', e.target.value)}
                  rows={3}
                  placeholder="Te conectamos con un profesional..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-sm font-medium outline-none resize-none"
                ></textarea>
              </div>

              {/* Paso 02 */}
              <div className="bg-neutral-50 p-5 rounded-2xl border-2 border-neutral-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-black text-white">Paso 02</span>
                </div>
                <input
                  type="text"
                  value={formConfig.step2_title}
                  onChange={(e) => updateFormConfig('step2_title', e.target.value)}
                  placeholder="Obtén Claridad"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-base font-bold outline-none"
                />
                <textarea
                  value={formConfig.step2_desc}
                  onChange={(e) => updateFormConfig('step2_desc', e.target.value)}
                  rows={3}
                  placeholder="Definimos lo que realmente necesitas..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-sm font-medium outline-none resize-none"
                ></textarea>
              </div>

              {/* Paso 03 */}
              <div className="bg-neutral-50 p-5 rounded-2xl border-2 border-neutral-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-black text-white">Paso 03</span>
                </div>
                <input
                  type="text"
                  value={formConfig.step3_title}
                  onChange={(e) => updateFormConfig('step3_title', e.target.value)}
                  placeholder="Avanza con Seguridad"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-base font-bold outline-none"
                />
                <textarea
                  value={formConfig.step3_desc}
                  onChange={(e) => updateFormConfig('step3_desc', e.target.value)}
                  rows={3}
                  placeholder="Encontramos lo que encaja..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-sm font-medium outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 3: COTIZADOR                                           */}
      {/* ============================================================== */}
      {tabActiva === 'cotizador' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in mt-10">
          
          <div className="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7">
            <div className="pb-4 border-b border-neutral-200">
              <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Mensaje de Invitación</span>
              <h3 className="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Página de Cotización</h3>
              <p className="font-sans text-base text-neutral-600 font-normal mt-1">Ajusta el titular y el mensaje de apertura de /cotiza-con-nosotros.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Título Principal</label>
                <input
                  type="text"
                  value={formConfig.cotiza_title}
                  onChange={(e) => updateFormConfig('cotiza_title', e.target.value)}
                  placeholder="Ej: HABLEMOS DE TU PRÓXIMO PROYECTO"
                  className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-400 text-neutral-950 font-serif text-xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Subtítulo / Mensaje de Invitación</label>
                <textarea
                  value={formConfig.cotiza_subtitle}
                  onChange={(e) => updateFormConfig('cotiza_subtitle', e.target.value)}
                  rows={4}
                  placeholder="Déjanos tu mensaje y nos pondremos en contacto contigo lo antes posible..."
                  className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden shadow-inner">
            <div className="relative z-10 p-8 sm:p-10 rounded-3xl bg-black text-white shadow-2xl space-y-5 border border-white/10">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Vista Previa en Vivo (/cotiza-con-nosotros)
              </span>
              <h4 className="font-serif text-3xl sm:text-4xl font-light text-white leading-tight uppercase">
                {formConfig.cotiza_title}
              </h4>
              <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed pt-2 border-t border-white/15">
                {formConfig.cotiza_subtitle}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 4: CANALES Y ALERTA                                    */}
      {/* ============================================================== */}
      {tabActiva === 'contacto' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in mt-10">
          
          <div className="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7">
            <div className="pb-4 border-b border-neutral-200">
              <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Información Pública</span>
              <h3 className="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Canales de Contacto</h3>
              <p className="font-sans text-base text-neutral-600 font-normal mt-1">Datos que se muestran en el pie de página, botones de WhatsApp y llamadas.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Teléfono Visible</label>
                <input
                  type="text"
                  value={formConfig.telefono_contacto}
                  onChange={(e) => updateFormConfig('telefono_contacto', e.target.value)}
                  placeholder="Ej: +57 (310) 845-9210"
                  className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-mono text-base font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">WhatsApp Directo (Solo Números con código de país)</label>
                <input
                  type="text"
                  value={formConfig.whatsapp_contacto}
                  onChange={(e) => updateFormConfig('whatsapp_contacto', e.target.value)}
                  placeholder="Ej: 573108459210"
                  className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-mono text-base font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  value={formConfig.email_soporte}
                  onChange={(e) => updateFormConfig('email_soporte', e.target.value)}
                  placeholder="Ej: contacto@sysmicon.com"
                  className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Dirección / Ubicación de Oficina</label>
                <input
                  type="text"
                  value={formConfig.direccion_oficina}
                  onChange={(e) => updateFormConfig('direccion_oficina', e.target.value)}
                  placeholder="Ej: Calle 10A # 36-44, Piso 5, Medellín, Colombia"
                  className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Instagram (Usuario)</label>
                <input
                  type="text"
                  value={formConfig.instagram_handle}
                  onChange={(e) => updateFormConfig('instagram_handle', e.target.value)}
                  placeholder="Ej: @sysmicon"
                  className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-mono text-base font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7 self-start">
            <div className="pb-4 border-b border-neutral-200">
              <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Comunicado Global</span>
              <h3 className="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Banner Superior de Anuncios</h3>
              <p className="font-sans text-base text-neutral-600 font-normal mt-1">Activa una barra superior visible en todo el sitio para noticias o avisos.</p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 border-2 border-neutral-300 flex items-center gap-4">
              <input
                type="checkbox"
                checked={mostrarBannerAlertaBool}
                onChange={(e) => setMostrarBannerAlertaBool(e.target.checked)}
                id="chkBannerGlobal"
                className="w-6 h-6 rounded border-2 border-neutral-400 text-black focus:ring-black cursor-pointer accent-black"
              />
              <label htmlFor="chkBannerGlobal" className="text-neutral-950 font-bold text-base cursor-pointer block select-none">
                Activar Barra Global de Anuncios
              </label>
            </div>

            {mostrarBannerAlertaBool && (
              <div className="animate-fade-in space-y-5">
                <div>
                  <label className="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Mensaje del Banner</label>
                  <input
                    type="text"
                    value={formConfig.texto_banner_alerta}
                    onChange={(e) => updateFormConfig('texto_banner_alerta', e.target.value)}
                    placeholder="Escribe el anuncio o comunicado..."
                    className="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-400 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all"
                  />
                </div>
                
                <div className="p-5 rounded-2xl bg-neutral-950 text-white text-base font-sans flex items-center gap-3 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="font-medium">{formConfig.texto_banner_alerta || 'Escribe un mensaje para previsualizar...'}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL ELEGANTE DE CONFIRMACIÓN PARA ELIMINAR PROYECTO          */}
      {/* ============================================================== */}
      {proyectoAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          
          {/* Backdrop oscuro con desenfoque de cristal */}
          <div
            onClick={cerrarModalEliminar}
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
          ></div>

          {/* Tarjeta del Modal */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl border-2 border-neutral-300 shadow-2xl overflow-hidden animate-scale-up">
            
            {/* Encabezado / Alerta Visual */}
            <div className="p-6 sm:p-8 border-b border-neutral-200 bg-neutral-50 flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-inner">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
                </svg>
              </div>
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-red-600 uppercase block mb-1">
                  Acción Irreversible
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
                  ¿Eliminar esta Obra?
                </h3>
              </div>
            </div>

            {/* Cuerpo: Información de la Obra que se va a borrar */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-100 border border-neutral-200">
                <img
                  src={proyectoAEliminar.imagenUrl}
                  alt={proyectoAEliminar.titulo}
                  className="w-20 h-20 rounded-xl object-cover border border-neutral-300 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="px-2.5 py-0.5 rounded bg-white text-neutral-900 font-mono text-[10px] font-bold uppercase tracking-wider border border-neutral-200">
                    {proyectoAEliminar.categoria}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-neutral-950 truncate mt-1">
                    {proyectoAEliminar.titulo}
                  </h4>
                  <p className="font-sans text-xs text-neutral-500 truncate mt-0.5">
                    {proyectoAEliminar.ubicacion} &bull; {(proyectoAEliminar.imagenesAdicionales?.length || 0) + 1} Fotos en catálogo
                  </p>
                </div>
              </div>

              <p className="font-sans text-sm text-neutral-600 leading-relaxed">
                Esta acción eliminará permanentemente la obra del portafolio del sitio web, incluyendo su fotografía de portada, memoria descriptiva y todas las fotografías de la galería.
              </p>

            </div>

            {/* Pie del Modal: Botones de Acción */}
            <div className="p-6 sm:p-8 bg-neutral-50 border-t border-neutral-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              
              <button
                type="button"
                onClick={cerrarModalEliminar}
                disabled={eliminando}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border-2 border-neutral-300 hover:border-neutral-400 bg-white text-neutral-800 font-sans text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarEliminar}
                disabled={eliminando}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-sans text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {!eliminando ? (
                  <span className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Sí, Eliminar Obra
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Eliminando...
                  </span>
                )}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default DashPersonalizar;
