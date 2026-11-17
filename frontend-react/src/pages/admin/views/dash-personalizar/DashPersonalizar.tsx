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
          className={`p-4 rounded-xl border flex items-center justify-between animate-fade-in text-xs font-semibold ${
            tipoAlerta === 'exito'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-rounded text-base">
              {tipoAlerta === 'exito' ? 'check_circle' : 'error'}
            </span>
            <span>{mensajeAlerta}</span>
          </div>
          <button
            onClick={() => setMensajeAlerta('')}
            className="text-[#71717a] hover:text-[#09090b] p-1 rounded-md transition-colors cursor-pointer"
          >
            <span className="material-symbols-rounded text-base">close</span>
          </button>
        </div>
      )}

      {/* =====================================================
           NAVEGACIÓN PRINCIPAL (TABS BENTO NORMALIZADOS)
           ===================================================== */}
      <div className="bg-[#f4f5f7] p-1.5 rounded-xl border border-[#e4e4e7] grid grid-cols-2 md:grid-cols-4 gap-1.5">
        
        {/* Tab 1: Proyectos */}
        <button
          type="button"
          onClick={() => setTabActiva('proyectos')}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
            tabActiva === 'proyectos'
              ? 'bg-[#09090b] text-white shadow-xs'
              : 'bg-white text-[#71717a] hover:text-[#09090b] border border-[#e4e4e7]'
          }`}
        >
          <span className="material-symbols-rounded text-base">apartment</span>
          <span>Proyectos</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              tabActiva === 'proyectos' ? 'bg-white/20 text-white' : 'bg-[#f4f5f7] text-[#09090b]'
            }`}
          >
            {proyectos.length}
          </span>
        </button>

        {/* Tab 2: Home */}
        <button
          type="button"
          onClick={() => setTabActiva('home')}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
            tabActiva === 'home'
              ? 'bg-[#09090b] text-white shadow-xs'
              : 'bg-white text-[#71717a] hover:text-[#09090b] border border-[#e4e4e7]'
          }`}
        >
          <span className="material-symbols-rounded text-base">home</span>
          <span>Textos Home</span>
        </button>

        {/* Tab 3: Cotizador */}
        <button
          type="button"
          onClick={() => setTabActiva('cotizador')}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
            tabActiva === 'cotizador'
              ? 'bg-[#09090b] text-white shadow-xs'
              : 'bg-white text-[#71717a] hover:text-[#09090b] border border-[#e4e4e7]'
          }`}
        >
          <span className="material-symbols-rounded text-base">request_quote</span>
          <span>Cotizador</span>
        </button>

        {/* Tab 4: Canales */}
        <button
          type="button"
          onClick={() => setTabActiva('contacto')}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
            tabActiva === 'contacto'
              ? 'bg-[#09090b] text-white shadow-xs'
              : 'bg-white text-[#71717a] hover:text-[#09090b] border border-[#e4e4e7]'
          }`}
        >
          <span className="material-symbols-rounded text-base">call</span>
          <span>Canales & Avisos</span>
        </button>

      </div>

      {/* ============================================================== */}
      {/* PESTAÑA 1: GESTIÓN DE PROYECTOS                                */}
      {/* ============================================================== */}
      {tabActiva === 'proyectos' && (
        <div className="space-y-8 animate-fade-in mt-6">
          
          {/* FORMULARIO INTEGRAL DE CREACIÓN DE PROYECTO */}
          <div className="bento-card">
            
            <div className="mb-6 pb-4 border-b border-[#e4e4e7] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase">
                  NUEVA PUBLICACIÓN
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#09090b] tracking-tight mt-0.5">
                  Publicar Obra en el <span className="font-light text-[#71717a]">Portafolio</span>
                </h3>
                <p className="text-xs text-[#71717a] mt-1 font-medium">
                  Define la fotografía de portada, agrega hasta 30 imágenes de alta calidad para la galería y especifica todos los detalles constructivos.
                </p>
              </div>
              <div className="bg-[#f4f5f7] border border-[#e4e4e7] rounded-xl px-4 py-2 text-right shrink-0">
                <span className="text-[0.65rem] font-mono font-bold text-[#71717a] uppercase block">Galería Total</span>
                <span className="text-sm font-mono font-bold text-[#09090b]">
                  {(portadaPreview ? 1 : 0) + galeriaImagenes.length} / 31 Fotos
                </span>
              </div>
            </div>

            <form onSubmit={onCrearProyecto} className="space-y-8">
              
              {/* ============================================================
                   BLOQUE 1: ZONA DE FOTOGRAFÍAS (PORTADA + GALERÍA HASTA 30)
                   ============================================================ */}
              <div className="bg-[#fafafa] p-5 sm:p-6 rounded-xl border border-[#e4e4e7] space-y-6">
                
                <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
                  <div>
                    <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase block">
                      SECCIÓN 01 &bull; MULTIMEDIA
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#09090b] tracking-tight mt-0.5">
                      Fotografía de Portada &amp; Galería Completa
                    </h4>
                    <p className="text-xs text-[#71717a] mt-0.5 font-medium">
                      Carga la portada principal de la obra y complementa con hasta 30 fotografías para el recorrido cinemático.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* PORTADA PRINCIPAL (Columna de 5) */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b]">
                        Fotografía de Portada <span className="text-red-500 font-bold">*</span>
                      </label>
                      <span className="text-[0.68rem] font-mono text-[#71717a] uppercase">Catálogo &amp; Hero</span>
                    </div>

                    <div className="relative w-full aspect-[4/3] bg-white border border-dashed border-[#d4d4d8] rounded-xl flex flex-col items-center justify-center p-4 text-center hover:border-[#09090b] hover:bg-[#fafafa] transition-all cursor-pointer group overflow-hidden">
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
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-3">
                            <span className="btn-primary-black text-[0.7rem] py-1.5 px-3">Cambiar Portada</span>
                            <span className="text-white text-[0.7rem] mt-2 font-mono truncate max-w-full">{archivoPortada?.name}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative z-0 pointer-events-none flex flex-col items-center px-4">
                          <div className="w-10 h-10 rounded-full bg-[#f4f5f7] border border-[#e4e4e7] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <span className="material-symbols-rounded text-xl text-[#71717a]">add_photo_alternate</span>
                          </div>
                          <span className="font-bold text-[#09090b] text-xs">Subir Portada Principal</span>
                          <span className="text-[#71717a] text-[0.7rem] mt-0.5">JPG o PNG de alta resolución</span>
                        </div>
                      )}
                    </div>

                    {archivoPortada && (
                      <div className="flex items-center justify-between p-2.5 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 text-xs font-semibold">
                        <span className="truncate max-w-[240px] flex items-center gap-1.5">
                          <span className="material-symbols-rounded text-sm">check</span>
                          {archivoPortada.name}
                        </span>
                        <button
                          type="button"
                          onClick={quitarPortada}
                          className="text-red-600 hover:text-red-800 text-[0.7rem] font-bold uppercase cursor-pointer"
                        >
                          Quitar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* GALERÍA MULTI-IMAGEN (Columna de 7) */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b]">
                          Galería del Proyecto (Hasta 30 fotos adicionales)
                        </label>
                        <span className="text-[0.7rem] text-[#71717a]">Detalles constructivos, interiores, planos y acabados.</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-white rounded-lg border border-[#e4e4e7] text-[#09090b]">
                          {galeriaImagenes.length} / 30
                        </span>
                        {galeriaImagenes.length > 0 && (
                          <button
                            type="button"
                            onClick={limpiarGaleria}
                            className="text-xs font-bold text-red-600 hover:text-red-800 underline cursor-pointer"
                          >
                            Vaciar
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Dropzone para Multi-Upload */}
                    <div className="relative w-full py-6 bg-white border border-dashed border-[#d4d4d8] rounded-xl flex flex-col items-center justify-center px-4 text-center hover:border-[#09090b] hover:bg-[#fafafa] transition-all cursor-pointer group">
                      <input
                        type="file"
                        onChange={onImagenesGaleriaSeleccionadas}
                        multiple
                        accept="image/*"
                        disabled={galeriaImagenes.length >= 30}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                      />
                      
                      <div className="flex items-center gap-3 pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-[#f4f5f7] border border-[#e4e4e7] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                          <span className="material-symbols-rounded text-xl text-[#71717a]">collections</span>
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-[#09090b] text-xs block">
                            {galeriaImagenes.length >= 30 ? 'Límite de 30 fotos alcanzado' : 'Selecciona o arrastra varias fotografías'}
                          </span>
                          <span className="text-[#71717a] text-[0.7rem]">Puedes seleccionar hasta 30 archivos en lote</span>
                        </div>
                      </div>
                    </div>

                    {/* Grid de Miniaturas */}
                    {galeriaImagenes.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[220px] overflow-y-auto p-2 bg-white rounded-xl border border-[#e4e4e7]">
                        {galeriaImagenes.map((item, i) => (
                          <div
                            key={i}
                            className="relative aspect-square rounded-lg overflow-hidden group border border-[#e4e4e7] bg-[#f4f5f7]"
                          >
                            <img src={item.previewUrl} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 bg-black/80 text-white text-[9px] font-mono font-bold px-1 py-0.2 rounded">
                              #{i + 1 < 10 ? '0' + (i + 1) : i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => eliminarFotoGaleria(i)}
                              title="Eliminar de la galería"
                              className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-700"
                            >
                              <span className="material-symbols-rounded text-[12px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* ============================================================
                   BLOQUE 2: INFORMACIÓN DE LA OBRA & UBICACIÓN
                   ============================================================ */}
              <div className="bg-[#fafafa] p-5 sm:p-6 rounded-xl border border-[#e4e4e7] space-y-5">
                
                <div className="border-b border-[#e4e4e7] pb-3">
                  <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase block">
                    SECCIÓN 02 &bull; IDENTIFICACIÓN
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[#09090b] tracking-tight mt-0.5">
                    Información de la Obra &amp; Ubicación
                  </h4>
                  <p className="text-xs text-[#71717a] mt-0.5 font-medium">Título de proyecto, categoría tipológica y zona geográfica.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  
                  <div className="lg:col-span-6">
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">
                      Nombre de la Obra <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={nuevoProyecto.titulo}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, titulo: e.target.value }))}
                      name="p_titulo"
                      required
                      placeholder="Ej: Residencia Altos del Valle o Casa M"
                      className="input-minimal"
                    />
                  </div>

                  <div className="lg:col-span-6">
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">
                      Subtítulo Conceptual / Editorial
                    </label>
                    <input
                      type="text"
                      value={nuevoProyecto.subtitulo}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, subtitulo: e.target.value }))}
                      name="p_subtitulo"
                      placeholder="Ej: Geometría minimalista integrada con materiales nobles y luz natural."
                      className="input-minimal"
                    />
                  </div>

                  <div className="lg:col-span-4">
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">
                      Categoría Tipológica <span className="text-red-500 font-bold">*</span>
                    </label>
                    <select
                      value={nuevoProyecto.categoria}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, categoria: e.target.value as CategoriaProyecto }))}
                      name="p_cat"
                      required
                      className="input-minimal"
                    >
                      <option value="Residencial">Residencial</option>
                      <option value="Remodelación">Remodelación</option>
                      <option value="Arquitectura interior">Arquitectura interior</option>
                      <option value="Oficina">Oficina</option>
                    </select>
                  </div>

                  <div className="lg:col-span-4">
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">
                      Ubicación Geográfica
                    </label>
                    <input
                      type="text"
                      value={nuevoProyecto.ubicacion}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, ubicacion: e.target.value }))}
                      name="p_ubi"
                      placeholder="Ej: Llanogrande, Antioquia"
                      className="input-minimal"
                    />
                  </div>

                  <div className="lg:col-span-4 flex items-center pt-2 sm:pt-6">
                    <label htmlFor="chkDest" className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-[#e4e4e7] hover:border-[#09090b] cursor-pointer transition-all w-full">
                      <input
                        type="checkbox"
                        checked={nuevoProyecto.destacado}
                        onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, destacado: e.target.checked }))}
                        id="chkDest"
                        name="p_dest"
                        className="w-4 h-4 rounded border-[#d4d4d8] text-[#09090b] focus:ring-0 cursor-pointer accent-[#09090b] shrink-0"
                      />
                      <div>
                        <span className="text-[#09090b] font-bold text-xs block">Destacar en el Home</span>
                        <span className="text-[0.68rem] text-[#71717a]">Aparecerá en el portal principal</span>
                      </div>
                    </label>
                  </div>

                </div>

              </div>

              {/* ============================================================
                   BLOQUE 3: ESPECIFICACIONES TÉCNICAS Y METRAJE
                   ============================================================ */}
              <div className="bg-[#fafafa] p-5 sm:p-6 rounded-xl border border-[#e4e4e7] space-y-5">
                
                <div className="border-b border-[#e4e4e7] pb-3">
                  <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase block">
                    SECCIÓN 03 &bull; FICHA TÉCNICA
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[#09090b] tracking-tight mt-0.5">
                    Especificaciones Técnicas &amp; Presentación
                  </h4>
                  <p className="text-xs text-[#71717a] mt-0.5 font-medium">Métricas de ingeniería, materiales nobles y estilo de tarjeta.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div>
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">
                      Área Construida (m²)
                    </label>
                    <input
                      type="number"
                      value={nuevoProyecto.area}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, area: Number(e.target.value) }))}
                      name="p_area"
                      placeholder="Ej: 520"
                      className="input-minimal font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">
                      Año de Ejecución
                    </label>
                    <input
                      type="number"
                      value={nuevoProyecto.anio}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, anio: Number(e.target.value) }))}
                      name="p_anio"
                      placeholder="Ej: 2026"
                      className="input-minimal font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">
                      Estilo de Tarjeta Editorial
                    </label>
                    <select
                      value={nuevoProyecto.editorial_style}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, editorial_style: e.target.value }))}
                      name="p_style"
                      className="input-minimal"
                    >
                      <option value="coral-title">Coral Title (Editorial)</option>
                      <option value="white-bold">White Bold (Monocromático)</option>
                      <option value="ribbon-tag">Ribbon Tag (Cinta)</option>
                      <option value="split-grid">Split Grid (Dividido)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">
                      Código de Catálogo
                    </label>
                    <input
                      type="text"
                      value={nuevoProyecto.barcode}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, barcode: e.target.value }))}
                      name="p_barcode"
                      placeholder="Ej: 0 600229402 1"
                      className="input-minimal font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-6">
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">
                      Slogan / Remate Editorial
                    </label>
                    <input
                      type="text"
                      value={nuevoProyecto.editorial_slogan}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, editorial_slogan: e.target.value }))}
                      name="p_slogan"
                      placeholder="Ej: Concreto y luz natural en el Oriente Antioqueño."
                      className="input-minimal"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-6">
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">
                      Atributos y Materiales Clave (Separados por coma)
                    </label>
                    <input
                      type="text"
                      value={nuevoProyecto.caracteristicasStr}
                      onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, caracteristicasStr: e.target.value }))}
                      name="p_caract"
                      placeholder="Ej: Concreto a la vista con duela, Patio interior central, Iluminación indirecta"
                      className="input-minimal"
                    />
                  </div>

                </div>

              </div>

              {/* ============================================================
                   BLOQUE 4: MEMORIA DESCRIPTIVA
                   ============================================================ */}
              <div className="bg-[#fafafa] p-5 sm:p-6 rounded-xl border border-[#e4e4e7] space-y-4">
                <div className="border-b border-[#e4e4e7] pb-3">
                  <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase block">
                    SECCIÓN 04 &bull; MEMORIA
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[#09090b] tracking-tight mt-0.5">
                    Memoria Descriptiva &amp; Concepto Arquitectónico
                  </h4>
                  <p className="text-xs text-[#71717a] mt-0.5 font-medium">Escribe la visión de diseño, justificación espacial y experiencia de habitabilidad.</p>
                </div>

                <div>
                  <textarea
                    value={nuevoProyecto.descripcion}
                    onChange={(e) => setNuevoProyecto((prev) => ({ ...prev, descripcion: e.target.value }))}
                    name="p_desc"
                    rows={4}
                    placeholder="Describe la volumetría del proyecto, la distribución espacial, los materiales nobles utilizados..."
                    className="input-minimal resize-none"
                  ></textarea>
                </div>
              </div>

              {/* BARRA DE ACCIÓN */}
              <div className="pt-4 border-t border-[#e4e4e7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-[#71717a] font-medium">
                  Al publicar, la portada y las fotos de la galería serán optimizadas en alta definición para la web pública.
                </div>

                <button
                  type="submit"
                  disabled={subiendoProyecto}
                  className="btn-primary-black text-xs shrink-0"
                >
                  {!subiendoProyecto ? (
                    <>
                      <span className="material-symbols-rounded text-base">publish</span>
                      <span>Publicar Obra en Portafolio</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-rounded text-base animate-spin">sync</span>
                      <span>Subiendo {(portadaPreview ? 1 : 0) + galeriaImagenes.length} Fotografías...</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* ============================================================== */}
          {/* CATÁLOGO DE OBRAS ACTIVAS                                      */}
          {/* ============================================================== */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e4e4e7]">
              <div>
                <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase">
                  PORTAFOLIO ACTUAL
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#09090b] tracking-tight mt-0.5">
                  Catálogo de <span className="font-light text-[#71717a]">Obras Publicadas</span>
                </h3>
                <p className="text-xs text-[#71717a] mt-1 font-medium">
                  Total de obras registradas en el sitio: <strong>{proyectos.length}</strong>
                </p>
              </div>
            </div>

            {proyectos.length === 0 ? (
              <div className="text-center py-12 text-[#a1a1aa] border border-dashed border-[#e4e4e7] rounded-xl bg-white">
                <span className="material-symbols-rounded text-3xl mb-1 text-[#71717a]">apartment</span>
                <p className="text-sm font-semibold text-[#09090b]">Aún no hay obras publicadas en el catálogo.</p>
                <p className="text-xs text-[#71717a] mt-0.5">Usa el formulario superior para añadir tu primer proyecto.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proyectos.map((p) => (
                  <div
                    key={p.id}
                    className="group bg-white rounded-2xl border border-[#e4e4e7] overflow-hidden shadow-xs hover:shadow-md hover:border-[#09090b] transition-all flex flex-col"
                  >
                    {/* Imagen del Proyecto */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#f4f5f7]">
                      <img src={p.imagenUrl} alt={p.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Categoría & Destacado */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[0.68rem] font-extrabold uppercase tracking-wider text-[#09090b] border border-[#e4e4e7] shadow-xs">
                          {p.categoria}
                        </span>
                        {p.destacado && (
                          <span className="px-2.5 py-1 bg-[#09090b]/90 backdrop-blur-sm rounded-lg text-[0.68rem] font-extrabold uppercase tracking-wider text-white shadow-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Home
                          </span>
                        )}
                      </div>

                      {/* Conteo de Galería */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md rounded-md text-[0.68rem] font-mono font-bold text-white shadow flex items-center gap-1">
                          <span className="material-symbols-rounded text-xs">photo_camera</span>
                          {(p.imagenesAdicionales?.length || 0) + 1} fotos
                        </span>
                      </div>
                      
                      {/* Botón Eliminar */}
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => abrirModalEliminar(p)}
                          title="Eliminar obra del portafolio"
                          className="w-8 h-8 bg-white/95 hover:bg-red-600 text-[#71717a] hover:text-white backdrop-blur-sm rounded-lg flex items-center justify-center shadow-xs transition-all cursor-pointer"
                        >
                          <span className="material-symbols-rounded text-base">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Contenido de la Tarjeta */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-base text-[#09090b] leading-snug line-clamp-1">{p.titulo}</h4>
                        <p className="text-xs text-[#71717a] mt-1 line-clamp-1 font-medium">{p.ubicacion}</p>
                        {p.subtitulo && (
                          <p className="text-xs text-[#a1a1aa] mt-1.5 line-clamp-2 leading-relaxed">{p.subtitulo}</p>
                        )}
                      </div>
                      
                      <div className="pt-3 flex items-center justify-between text-xs font-mono text-[#71717a] font-semibold border-t border-[#f4f5f7]">
                        <span className="bg-[#f4f5f7] px-2 py-0.5 rounded text-[0.7rem]">{p.area ? p.area + ' m²' : 'Área N/D'}</span>
                        <span className="bg-[#f4f5f7] px-2 py-0.5 rounded text-[0.7rem]">{p.anio || '2026'}</span>
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
        <div className="space-y-6 animate-fade-in mt-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Bloque Portada / Hero */}
            <div className="bento-card space-y-5">
              <div className="pb-3 border-b border-[#e4e4e7]">
                <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase">
                  INICIO PRINCIPAL
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#09090b] tracking-tight mt-0.5">
                  Portada / Hero Principal
                </h3>
                <p className="text-xs text-[#71717a] mt-0.5 font-medium">Titular cinemático principal y botones del video inicial.</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Prefijo del Título</label>
                    <input
                      type="text"
                      value={formConfig.hero_title_prefix}
                      onChange={(e) => updateFormConfig('hero_title_prefix', e.target.value)}
                      placeholder="Ej: Diseñamos y"
                      className="input-minimal"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Palabra Resaltada</label>
                    <input
                      type="text"
                      value={formConfig.hero_title_highlight}
                      onChange={(e) => updateFormConfig('hero_title_highlight', e.target.value)}
                      placeholder="Ej: Construimos"
                      className="input-minimal font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Botón Principal (Cotizar)</label>
                    <input
                      type="text"
                      value={formConfig.hero_btn_cotizar}
                      onChange={(e) => updateFormConfig('hero_btn_cotizar', e.target.value)}
                      placeholder="Ej: Cotiza con nosotros"
                      className="input-minimal"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Botón Secundario (Obras)</label>
                    <input
                      type="text"
                      value={formConfig.hero_btn_obras}
                      onChange={(e) => updateFormConfig('hero_btn_obras', e.target.value)}
                      placeholder="Ej: Ver Obras & Proyectos"
                      className="input-minimal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Indicador Inferior de Desplazamiento</label>
                  <input
                    type="text"
                    value={formConfig.hero_scroll_text}
                    onChange={(e) => updateFormConfig('hero_scroll_text', e.target.value)}
                    placeholder="Ej: DESLIZA PARA EXPLORAR"
                    className="input-minimal"
                  />
                </div>
              </div>
            </div>

            {/* Bloque Director Showcase */}
            <div className="bento-card space-y-5">
              <div className="pb-3 border-b border-[#e4e4e7]">
                <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase">
                  DIRECTOR GENERAL
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#09090b] tracking-tight mt-0.5">
                  Showcase de Dirección
                </h3>
                <p className="text-xs text-[#71717a] mt-0.5 font-medium">Datos, cargos y cifras clave de la dirección de obra.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Nombre del Director</label>
                    <input
                      type="text"
                      value={formConfig.director_name}
                      onChange={(e) => updateFormConfig('director_name', e.target.value)}
                      placeholder="Ej: Juan Moreno"
                      className="input-minimal font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Cargo / Título</label>
                    <input
                      type="text"
                      value={formConfig.director_role}
                      onChange={(e) => updateFormConfig('director_role', e.target.value)}
                      placeholder="Ej: Ingeniero Civil"
                      className="input-minimal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Etiqueta Superior</label>
                  <input
                    type="text"
                    value={formConfig.director_tagline}
                    onChange={(e) => updateFormConfig('director_tagline', e.target.value)}
                    placeholder="Ej: LIDERAZGO & RIGOR TÉCNICO"
                    className="input-minimal"
                  />
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Titular de Excelencia</label>
                  <input
                    type="text"
                    value={formConfig.director_title}
                    onChange={(e) => updateFormConfig('director_title', e.target.value)}
                    placeholder="Ej: Ingeniería de Excelencia sin Concesiones"
                    className="input-minimal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[0.68rem] font-extrabold uppercase tracking-wider text-[#71717a] mb-1">Métrica 1 (Cifra)</label>
                    <input
                      type="text"
                      value={formConfig.director_stat1_number}
                      onChange={(e) => updateFormConfig('director_stat1_number', e.target.value)}
                      placeholder="7+"
                      className="input-minimal font-mono font-bold"
                    />
                    <input
                      type="text"
                      value={formConfig.director_stat1_label}
                      onChange={(e) => updateFormConfig('director_stat1_label', e.target.value)}
                      placeholder="AÑOS DE EXPERIENCIA"
                      className="input-minimal text-xs mt-1.5 uppercase font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] font-extrabold uppercase tracking-wider text-[#71717a] mb-1">Métrica 2 (Cifra)</label>
                    <input
                      type="text"
                      value={formConfig.director_stat2_number}
                      onChange={(e) => updateFormConfig('director_stat2_number', e.target.value)}
                      placeholder="4+"
                      className="input-minimal font-mono font-bold"
                    />
                    <input
                      type="text"
                      value={formConfig.director_stat2_label}
                      onChange={(e) => updateFormConfig('director_stat2_label', e.target.value)}
                      placeholder="OBRAS EJECUTADAS"
                      className="input-minimal text-xs mt-1.5 uppercase font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SEGUNDA FILA: CASA M & NUESTRA MISIÓN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Bloque Casa M (Banner Video de Home) */}
            <div className="bento-card space-y-5">
              <div className="pb-3 border-b border-[#e4e4e7]">
                <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase">
                  BANNER VIDEO
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#09090b] tracking-tight mt-0.5">
                  Obra Emblemática (Casa M)
                </h3>
                <p className="text-xs text-[#71717a] mt-0.5 font-medium">Titular y descripción de la sección de video cinemático en el Home.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Prefijo del Título</label>
                    <input
                      type="text"
                      value={formConfig.casam_title}
                      onChange={(e) => updateFormConfig('casam_title', e.target.value)}
                      placeholder="Ej: CASA"
                      className="input-minimal"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Letra / Palabra Resaltada</label>
                    <input
                      type="text"
                      value={formConfig.casam_highlight}
                      onChange={(e) => updateFormConfig('casam_highlight', e.target.value)}
                      placeholder="Ej: M"
                      className="input-minimal font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Descripción de la Obra</label>
                  <textarea
                    value={formConfig.casam_subtitle}
                    onChange={(e) => updateFormConfig('casam_subtitle', e.target.value)}
                    rows={3}
                    placeholder="Residencia contemporánea donde la arquitectura de autor..."
                    className="input-minimal resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Texto del Botón</label>
                  <input
                    type="text"
                    value={formConfig.casam_btn}
                    onChange={(e) => updateFormConfig('casam_btn', e.target.value)}
                    placeholder="Ej: VER PROYECTO"
                    className="input-minimal"
                  />
                </div>
              </div>
            </div>

            {/* Bloque Nuestra Misión */}
            <div className="bento-card space-y-5">
              <div className="pb-3 border-b border-[#e4e4e7]">
                <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase">
                  FILOSOFÍA &amp; PROPÓSITO
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#09090b] tracking-tight mt-0.5">
                  Nuestra Misión Institucional
                </h3>
                <p className="text-xs text-[#71717a] mt-0.5 font-medium">Manifiesto editorial sobre arquitectura y visión de Sysmicon.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Título de la Sección</label>
                  <input
                    type="text"
                    value={formConfig.mision_title}
                    onChange={(e) => updateFormConfig('mision_title', e.target.value)}
                    placeholder="Ej: Nuestra Misión"
                    className="input-minimal font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Manifiesto / Descripción</label>
                  <textarea
                    value={formConfig.mision_desc}
                    onChange={(e) => updateFormConfig('mision_desc', e.target.value)}
                    rows={4}
                    placeholder="Desarrollar proyectos a través de los conocimientos multidisciplinares..."
                    className="input-minimal resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

          </div>

          {/* Bloque Pasos de Contacto (Steps Home) */}
          <div className="bento-card space-y-5">
            <div className="pb-3 border-b border-[#e4e4e7]">
              <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase">
                SECCIÓN DE ASESORÍA
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#09090b] tracking-tight mt-0.5">
                Pasos de Contacto (Home)
              </h3>
              <p className="text-xs text-[#71717a] mt-0.5 font-medium">El proceso de 3 pasos que guía al cliente antes del formulario de cotización.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Pregunta Titular</label>
                <input
                  type="text"
                  value={formConfig.steps_title}
                  onChange={(e) => updateFormConfig('steps_title', e.target.value)}
                  placeholder="Ej: ¿Tienes un terreno o un sueño en mente?"
                  className="input-minimal"
                />
              </div>

              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Subtítulo de Asesoría</label>
                <textarea
                  value={formConfig.steps_subtitle}
                  onChange={(e) => updateFormConfig('steps_subtitle', e.target.value)}
                  rows={2}
                  placeholder="Nuestros arquitectos e ingenieros están listos para asesorarte..."
                  className="input-minimal resize-none"
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-[#e4e4e7]">
              {/* Paso 01 */}
              <div className="bg-[#fafafa] p-4 rounded-xl border border-[#e4e4e7] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#09090b] text-white">Paso 01</span>
                </div>
                <input
                  type="text"
                  value={formConfig.step1_title}
                  onChange={(e) => updateFormConfig('step1_title', e.target.value)}
                  placeholder="Habla con un Experto"
                  className="input-minimal font-semibold"
                />
                <textarea
                  value={formConfig.step1_desc}
                  onChange={(e) => updateFormConfig('step1_desc', e.target.value)}
                  rows={3}
                  placeholder="Te conectamos con un profesional..."
                  className="input-minimal text-xs resize-none"
                ></textarea>
              </div>

              {/* Paso 02 */}
              <div className="bg-[#fafafa] p-4 rounded-xl border border-[#e4e4e7] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#09090b] text-white">Paso 02</span>
                </div>
                <input
                  type="text"
                  value={formConfig.step2_title}
                  onChange={(e) => updateFormConfig('step2_title', e.target.value)}
                  placeholder="Obtén Claridad"
                  className="input-minimal font-semibold"
                />
                <textarea
                  value={formConfig.step2_desc}
                  onChange={(e) => updateFormConfig('step2_desc', e.target.value)}
                  rows={3}
                  placeholder="Definimos lo que realmente necesitas..."
                  className="input-minimal text-xs resize-none"
                ></textarea>
              </div>

              {/* Paso 03 */}
              <div className="bg-[#fafafa] p-4 rounded-xl border border-[#e4e4e7] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#09090b] text-white">Paso 03</span>
                </div>
                <input
                  type="text"
                  value={formConfig.step3_title}
                  onChange={(e) => updateFormConfig('step3_title', e.target.value)}
                  placeholder="Avanza con Seguridad"
                  className="input-minimal font-semibold"
                />
                <textarea
                  value={formConfig.step3_desc}
                  onChange={(e) => updateFormConfig('step3_desc', e.target.value)}
                  rows={3}
                  placeholder="Encontramos lo que encaja..."
                  className="input-minimal text-xs resize-none"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in mt-6">
          
          <div className="bento-card space-y-5">
            <div className="pb-3 border-b border-[#e4e4e7]">
              <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase">
                MENSAJE DE INVITACIÓN
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#09090b] tracking-tight mt-0.5">
                Página de Cotización
              </h3>
              <p className="text-xs text-[#71717a] mt-0.5 font-medium">Ajusta el titular y el mensaje de apertura de /cotiza-con-nosotros.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Título Principal</label>
                <input
                  type="text"
                  value={formConfig.cotiza_title}
                  onChange={(e) => updateFormConfig('cotiza_title', e.target.value)}
                  placeholder="Ej: HABLEMOS DE TU PRÓXIMO PROYECTO"
                  className="input-minimal font-semibold"
                />
              </div>
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Subtítulo / Mensaje de Invitación</label>
                <textarea
                  value={formConfig.cotiza_subtitle}
                  onChange={(e) => updateFormConfig('cotiza_subtitle', e.target.value)}
                  rows={4}
                  placeholder="Déjanos tu mensaje y nos pondremos en contacto contigo lo antes posible..."
                  className="input-minimal resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bento-card flex flex-col justify-center bg-[#fafafa]">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#09090b] text-white shadow-xl space-y-4 border border-[#27272a]">
              <span className="text-[0.68rem] uppercase font-mono tracking-widest text-emerald-400 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Vista Previa en Vivo (/cotiza-con-nosotros)
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {formConfig.cotiza_title}
              </h4>
              <p className="text-sm text-neutral-300 font-light leading-relaxed pt-2 border-t border-white/10">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in mt-6">
          
          <div className="bento-card space-y-5">
            <div className="pb-3 border-b border-[#e4e4e7]">
              <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase">
                INFORMACIÓN PÚBLICA
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#09090b] tracking-tight mt-0.5">
                Canales de Contacto Directo
              </h3>
              <p className="text-xs text-[#71717a] mt-0.5 font-medium">Datos que se muestran en el pie de página, botones de WhatsApp y llamadas.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Teléfono Visible</label>
                <input
                  type="text"
                  value={formConfig.telefono_contacto}
                  onChange={(e) => updateFormConfig('telefono_contacto', e.target.value)}
                  placeholder="Ej: +57 (310) 845-9210"
                  className="input-minimal font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">WhatsApp Directo (Solo Números con código de país)</label>
                <input
                  type="text"
                  value={formConfig.whatsapp_contacto}
                  onChange={(e) => updateFormConfig('whatsapp_contacto', e.target.value)}
                  placeholder="Ej: 573108459210"
                  className="input-minimal font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Correo Electrónico</label>
                <input
                  type="email"
                  value={formConfig.email_soporte}
                  onChange={(e) => updateFormConfig('email_soporte', e.target.value)}
                  placeholder="Ej: contacto@sysmicon.com"
                  className="input-minimal"
                />
              </div>
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Dirección / Ubicación de Oficina</label>
                <input
                  type="text"
                  value={formConfig.direccion_oficina}
                  onChange={(e) => updateFormConfig('direccion_oficina', e.target.value)}
                  placeholder="Ej: Calle 10A # 36-44, Piso 5, Medellín, Colombia"
                  className="input-minimal"
                />
              </div>
              <div>
                <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Instagram (Usuario)</label>
                <input
                  type="text"
                  value={formConfig.instagram_handle}
                  onChange={(e) => updateFormConfig('instagram_handle', e.target.value)}
                  placeholder="Ej: @sysmicon"
                  className="input-minimal font-mono"
                />
              </div>
            </div>
          </div>

          <div className="bento-card space-y-5 self-start">
            <div className="pb-3 border-b border-[#e4e4e7]">
              <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-[#71717a] uppercase">
                COMUNICADO GLOBAL
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#09090b] tracking-tight mt-0.5">
                Barra Superior de Anuncios
              </h3>
              <p className="text-xs text-[#71717a] mt-0.5 font-medium">Activa una barra superior visible en todo el sitio para noticias o avisos.</p>
            </div>

            <div className="bg-[#fafafa] rounded-xl p-4 border border-[#e4e4e7] flex items-center gap-3">
              <input
                type="checkbox"
                checked={mostrarBannerAlertaBool}
                onChange={(e) => setMostrarBannerAlertaBool(e.target.checked)}
                id="chkBannerGlobal"
                className="w-4 h-4 rounded border-[#d4d4d8] text-[#09090b] focus:ring-0 cursor-pointer accent-[#09090b]"
              />
              <label htmlFor="chkBannerGlobal" className="text-[#09090b] font-bold text-xs cursor-pointer block select-none">
                Activar Barra Global de Anuncios en el Sitio Web
              </label>
            </div>

            {mostrarBannerAlertaBool && (
              <div className="animate-fade-in space-y-4">
                <div>
                  <label className="block text-[0.72rem] font-extrabold uppercase tracking-wider text-[#09090b] mb-1.5">Mensaje del Anuncio</label>
                  <input
                    type="text"
                    value={formConfig.texto_banner_alerta}
                    onChange={(e) => updateFormConfig('texto_banner_alerta', e.target.value)}
                    placeholder="Escribe el anuncio o comunicado..."
                    className="input-minimal"
                  />
                </div>
                
                <div className="p-4 rounded-xl bg-[#09090b] text-white text-xs flex items-center gap-2.5 shadow-md border border-[#27272a]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="font-medium truncate">{formConfig.texto_banner_alerta || 'Escribe un mensaje para previsualizar...'}</span>
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
            className="absolute inset-0 bg-[#09090b]/70 backdrop-blur-sm transition-opacity"
          ></div>

          {/* Tarjeta del Modal */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-[#e4e4e7] shadow-2xl overflow-hidden animate-scale-up">
            
            {/* Encabezado / Alerta Visual */}
            <div className="p-6 border-b border-[#e4e4e7] bg-[#fafafa] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-xl">delete_forever</span>
              </div>
              <div>
                <span className="text-[0.68rem] font-mono font-extrabold tracking-widest text-red-600 uppercase block mb-0.5">
                  ACCIÓN IRREVERSIBLE
                </span>
                <h3 className="text-lg font-black text-[#09090b] tracking-tight">
                  ¿Eliminar esta Obra del Portafolio?
                </h3>
              </div>
            </div>

            {/* Cuerpo: Información de la Obra que se va a borrar */}
            <div className="p-6 space-y-4">
              
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#f4f5f7] border border-[#e4e4e7]">
                <img
                  src={proyectoAEliminar.imagenUrl}
                  alt={proyectoAEliminar.titulo}
                  className="w-16 h-16 rounded-lg object-cover border border-[#e4e4e7] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="px-2 py-0.5 rounded bg-white text-[#09090b] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#e4e4e7]">
                    {proyectoAEliminar.categoria}
                  </span>
                  <h4 className="font-bold text-sm text-[#09090b] truncate mt-1">
                    {proyectoAEliminar.titulo}
                  </h4>
                  <p className="text-xs text-[#71717a] truncate mt-0.5">
                    {proyectoAEliminar.ubicacion} &bull; {(proyectoAEliminar.imagenesAdicionales?.length || 0) + 1} fotos
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#71717a] leading-relaxed">
                Esta acción eliminará permanentemente la obra del portafolio en la web pública, incluyendo su fotografía de portada, memoria descriptiva y todas las fotografías de la galería.
              </p>

            </div>

            {/* Pie del Modal: Botones de Acción */}
            <div className="p-5 bg-[#fafafa] border-t border-[#e4e4e7] flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
              
              <button
                type="button"
                onClick={cerrarModalEliminar}
                disabled={eliminando}
                className="btn-secondary-white text-xs w-full sm:w-auto"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarEliminar}
                disabled={eliminando}
                className="btn-primary-black bg-red-600 hover:bg-red-700 text-white text-xs w-full sm:w-auto flex items-center justify-center gap-1.5"
              >
                {!eliminando ? (
                  <>
                    <span className="material-symbols-rounded text-base">delete</span>
                    <span>Sí, Eliminar Obra</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-rounded text-base animate-spin">sync</span>
                    <span>Eliminando...</span>
                  </>
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
