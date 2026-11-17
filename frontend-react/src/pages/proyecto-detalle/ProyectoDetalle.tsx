import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProyectosService } from '../../services/proyectos.service';
import './ProyectoDetalle.css';

export const ProyectoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProyectoById, proyectos } = useProyectosService();

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [animTrigger, setAnimTrigger] = useState<number>(0);
  const [isPanelExpanded, setIsPanelExpanded] = useState<boolean>(false);

  const lastScrollTimeRef = useRef<number>(0);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  const proyecto = useMemo(() => {
    if (!id) return null;
    return getProyectoById(id) || null;
  }, [id, proyectos, getProyectoById]);

  const allImages = useMemo(() => {
    if (!proyecto) return [];
    const rawList = [proyecto.imagenUrl, ...(proyecto.imagenesAdicionales || [])];
    const filtered = rawList.filter(
      img => !img.toUpperCase().includes('/EN USO/') && !img.toUpperCase().includes('\\EN USO\\')
    );
    const finalSet = filtered.length > 0 ? filtered : rawList;
    return Array.from(new Set(finalSet));
  }, [proyecto]);

  const scrollToActiveThumb = useCallback((idx: number) => {
    setTimeout(() => {
      const el = document.getElementById('thumb-item-' + idx);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 40);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    if (id) {
      const found = getProyectoById(id);
      if (found) {
        setCurrentImageIndex(0);
        setAnimTrigger(n => n + 1);
        scrollToActiveThumb(0);
      } else {
        navigate('/proyectos');
      }
    }
  }, [id, navigate, scrollToActiveThumb]);

  const regresar = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/proyectos');
    }
  }, [navigate]);

  const siguienteImagen = useCallback(() => {
    const total = allImages.length;
    if (total <= 1) return;
    setCurrentImageIndex(prev => {
      const nextIdx = (prev + 1) % total;
      scrollToActiveThumb(nextIdx);
      return nextIdx;
    });
    setAnimTrigger(n => n + 1);
  }, [allImages.length, scrollToActiveThumb]);

  const anteriorImagen = useCallback(() => {
    const total = allImages.length;
    if (total <= 1) return;
    setCurrentImageIndex(prev => {
      const nextIdx = (prev - 1 + total) % total;
      scrollToActiveThumb(nextIdx);
      return nextIdx;
    });
    setAnimTrigger(n => n + 1);
  }, [allImages.length, scrollToActiveThumb]);

  const seleccionarImagen = (index: number) => {
    setCurrentImageIndex(index);
    setAnimTrigger(n => n + 1);
    scrollToActiveThumb(index);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key === 'Escape' || key === 'Esc' || event.code === 'Escape') {
        event.preventDefault();
        regresar();
      } else if (key === 'ArrowLeft' || event.code === 'ArrowLeft') {
        event.preventDefault();
        anteriorImagen();
      } else if (key === 'ArrowRight' || event.code === 'ArrowRight') {
        event.preventDefault();
        siguienteImagen();
      }
    };

    const handleWheel = (event: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTimeRef.current < 300) return;

      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);

      if (absX > 15 || absY > 15) {
        if (absX >= absY) {
          if (event.deltaX > 15) {
            siguienteImagen();
            lastScrollTimeRef.current = now;
          } else if (event.deltaX < -15) {
            anteriorImagen();
            lastScrollTimeRef.current = now;
          }
        } else {
          if (event.deltaY > 30) {
            siguienteImagen();
            lastScrollTimeRef.current = now;
          } else if (event.deltaY < -30) {
            anteriorImagen();
            lastScrollTimeRef.current = now;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [regresar, anteriorImagen, siguienteImagen]);

  const onTouchStart = (event: React.TouchEvent) => {
    if (!event.touches[0]) return;
    touchStartXRef.current = event.touches[0].clientX;
    touchStartYRef.current = event.touches[0].clientY;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (!event.changedTouches[0]) return;
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    const diffX = endX - touchStartXRef.current;
    const diffY = endY - touchStartYRef.current;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX < 0) {
        siguienteImagen();
      } else {
        anteriorImagen();
      }
    }
  };

  const getMainImg = (): string => {
    if (allImages.length === 0) return '';
    return allImages[currentImageIndex % allImages.length];
  };

  const getDetailImg = (): string => {
    if (allImages.length <= 1) return allImages[0] || '';
    const nextIdx = (currentImageIndex + 1) % allImages.length;
    return allImages[nextIdx];
  };

  const solicitarAsesoria = () => {
    const titulo = proyecto ? proyecto.titulo : 'Proyecto';
    const msg = encodeURIComponent(`Hola Sysmicon, me interesa solicitar información sobre el proyecto ${titulo}.`);
    window.open(`https://wa.me/573108459210?text=${msg}`, '_blank');
  };

  const togglePanel = () => {
    setIsPanelExpanded(val => !val);
  };

  if (!proyecto) return null;

  const p = proyecto;

  return (
    <div className="w-screen h-screen fixed inset-0 z-[9999999] bg-[#000814] text-white flex flex-col lg:flex-row overflow-hidden select-none cursor-default">
      {/* HEADER MÓVIL (Solo visible en pantallas pequeñas) */}
      <div className="flex lg:hidden items-center justify-between px-4 py-3 bg-[#000814] border-b border-white/10 z-[70] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C2E1FF] animate-pulse"></span>
          <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">{p.titulo}</h3>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-[#C2E1FF] uppercase">
            {p.categoria || 'Residencial'}
          </span>
        </div>

        <button
          onClick={regresar}
          aria-label="Cerrar dossier"
          className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
        >
          <span>REGRESAR</span>
          <span className="font-black">✕</span>
        </button>
      </div>

      {/* Botón Regresar flotante superior izquierdo (DESKTOP) */}
      <button
        onClick={regresar}
        aria-label="Regresar"
        className="hidden lg:flex absolute top-4 left-4 z-[60] px-5 py-2.5 rounded-full bg-[#000814]/85 hover:bg-[#C2E1FF] text-white hover:text-[#00060e] border border-[#C2E1FF]/40 backdrop-blur-md font-sans text-xs font-extrabold tracking-[0.22em] uppercase items-center gap-2.5 transition-all duration-300 shadow-2xl hover:shadow-[0_0_25px_rgba(194,225,255,0.5)] hover:scale-105 cursor-pointer group"
      >
        <span className="text-base group-hover:-translate-x-1 transition-transform font-black">←</span>
        <span>REGRESAR</span>
      </button>

      {/* Botón Cerrar X flotante superior derecho (DESKTOP) */}
      <button
        onClick={regresar}
        aria-label="Cerrar dossier"
        className="hidden lg:flex absolute top-4 right-4 z-[60] w-10 h-10 rounded-full bg-[#000814]/85 hover:bg-[#C2E1FF] text-white hover:text-[#00060e] border border-[#C2E1FF]/40 backdrop-blur-md items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 cursor-pointer"
      >
        <span className="text-sm font-black">✕</span>
      </button>

      {/* COLUMNA IZQUIERDA: GALERÍA AMPLIA CON IMÁGENES MAXIMIZADAS */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`flex-1 lg:h-full relative bg-[#00040a] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden transition-all duration-500 min-h-0 ${
          isPanelExpanded ? 'lg:w-[72%] xl:w-[75%]' : 'lg:w-[94%] xl:w-[96%]'
        }`}
      >
        <div className="relative flex-1 w-full p-1 md:p-1.5 flex items-center justify-center overflow-hidden min-h-0">
          {/* Flecha Anterior */}
          {allImages.length > 1 && (
            <button
              onClick={e => {
                e.stopPropagation();
                anteriorImagen();
              }}
              aria-label="Imagen anterior"
              className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 md:w-14 md:h-14 rounded-full bg-[#000814]/80 hover:bg-[#001226]/90 text-white border border-white/25 hover:border-[#C2E1FF]/60 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-[1.05] cursor-pointer group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:-translate-x-0.5 transition-transform"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Grid de IMÁGENES */}
          <div className="w-full h-full max-w-[1800px] grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-center justify-center relative">
            {/* Foto Principal */}
            <div className="md:col-span-8 w-full h-full max-h-full rounded-xl sm:rounded-2xl overflow-hidden relative border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)] group bg-[#000814] flex items-center justify-center">
              <img
                key={`main-${animTrigger}`}
                src={getMainImg()}
                alt={`${p.titulo} vista principal`}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[1000ms] animate-visualizer-img"
              />
            </div>

            {/* Foto Secundarios (Desktop) */}
            {allImages.length > 1 && (
              <div className="hidden md:block md:col-span-4 h-[94%] max-h-full rounded-2xl overflow-hidden relative border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)] group bg-[#000814] self-center">
                <img
                  key={`detail-${animTrigger}`}
                  src={getDetailImg()}
                  alt={`${p.titulo} vista detalle`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[1000ms] animate-visualizer-img"
                />
              </div>
            )}
          </div>

          {/* Flecha Siguiente */}
          {allImages.length > 1 && (
            <button
              onClick={e => {
                e.stopPropagation();
                siguienteImagen();
              }}
              aria-label="Imagen siguiente"
              className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 md:w-14 md:h-14 rounded-full bg-[#000814]/80 hover:bg-[#001226]/90 text-white border border-white/25 hover:border-[#C2E1FF]/60 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-[1.05] cursor-pointer group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-0.5 transition-transform"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}
        </div>

        {/* Tira Inferior de Miniaturas Limpias */}
        {allImages.length > 1 && (
          <div className="h-16 sm:h-20 md:h-22 bg-[#00060f] border-t border-white/10 px-3 sm:px-4 py-2 flex items-center justify-start gap-2.5 overflow-x-auto overflow-y-hidden z-30 shrink-0 custom-modal-scrollbar">
            {allImages.map((m, idx) => (
              <div
                key={idx}
                id={`thumb-item-${idx}`}
                onClick={() => seleccionarImagen(idx)}
                className={`thumb-item w-16 h-12 sm:w-22 sm:h-14 md:w-24 md:h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all shrink-0 relative group ${
                  currentImageIndex === idx
                    ? 'border-[#C2E1FF] scale-105 opacity-100 ring-2 ring-[#C2E1FF]/50 shadow-lg'
                    : 'border-white/15 opacity-50 hover:opacity-85 hover:scale-100'
                }`}
              >
                <img src={m} alt={`${p.titulo} miniatura ${idx}`} className="w-full h-full object-cover" />
                {currentImageIndex === idx && <div className="absolute bottom-0 inset-x-0 h-1 bg-[#C2E1FF]"></div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PANEL INFERIOR MÓVIL (Solo visible en pantallas pequeñas) */}
      <div className="flex lg:hidden flex-col bg-white text-neutral-900 p-5 rounded-t-2xl shadow-2xl overflow-y-auto max-h-[38vh] shrink-0 border-t border-black/15">
        <div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto mb-3 shrink-0"></div>

        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            {p.ubicacion || 'Antioquia'} • {p.area || '580'} M²
          </span>
          <span className="font-sans text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-black text-white uppercase">
            Llave en Mano
          </span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-neutral-900 uppercase mb-1">{p.titulo}</h3>
        <p className="font-serif italic text-xs text-neutral-600 mb-4 font-normal">"{p.subtitulo}"</p>

        <a
          onClick={solicitarAsesoria}
          className="w-full py-3.5 px-6 rounded-full bg-black hover:bg-neutral-800 text-white font-sans text-xs tracking-widest font-extrabold uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>SOLICITAR ASESORÍA PRIVADA</span>
          <span className="text-sm font-black">→</span>
        </a>
      </div>

      {/* COLUMNA DERECHA: PANEL BLANCO EN DESKTOP */}
      <div
        onClick={() => !isPanelExpanded && togglePanel()}
        className={`hidden lg:flex h-full bg-white text-neutral-900 border-l border-black/15 shadow-2xl overflow-hidden flex-col transition-all duration-500 relative z-30 select-none ${
          isPanelExpanded
            ? 'lg:w-[28%] xl:w-[25%] p-5 lg:p-7'
            : 'lg:w-[56px] xl:w-[64px] p-2 items-center justify-between cursor-pointer hover:bg-neutral-100'
        }`}
      >
        {/* VISTA COLAPSADA: BARRA VERTICAL BLANCA ELEGANTE */}
        {!isPanelExpanded ? (
          <>
            <button
              onClick={e => {
                e.stopPropagation();
                togglePanel();
              }}
              title="Ver detalles del proyecto"
              className="mt-14 w-9 h-9 md:w-10 md:h-10 rounded-full bg-black text-white hover:bg-neutral-800 flex items-center justify-center transition-transform hover:scale-110 shrink-0 shadow-md"
            >
              <span className="text-xs font-mono font-bold">+</span>
            </button>

            <div
              onClick={togglePanel}
              className="my-auto py-8 [writing-mode:vertical-rl] rotate-180 flex items-center justify-center gap-4 cursor-pointer group"
            >
              <span className="font-serif text-2xl lg:text-3xl font-bold tracking-[0.2em] text-neutral-900 uppercase group-hover:text-black transition-colors">
                {p.titulo}
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-neutral-500 uppercase border-l border-black/30 pl-2">
                FICHA TÉCNICA
              </span>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                togglePanel();
              }}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-neutral-100 border border-black/20 hover:bg-black hover:text-white flex items-center justify-center text-black font-mono text-xs transition-all shrink-0"
            >
              →
            </button>
          </>
        ) : (
          /* VISTA EXPANDIDA: DETALLES DEL PROYECTO */
          <>
            <div className="shrink-0 flex items-center justify-between mt-12 mb-3 pb-2 border-b border-black/10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/15 text-[9px] font-mono text-black tracking-[0.25em] uppercase">
                <span>OBRA MAESTRA VIP</span>
              </div>

              <button
                onClick={e => {
                  e.stopPropagation();
                  togglePanel();
                }}
                className="px-3 py-1 rounded-full bg-neutral-100 border border-black/20 hover:bg-black hover:text-white text-[10px] font-mono tracking-widest uppercase transition-colors flex items-center gap-1"
              >
                <span>OCULTAR</span>
                <span>✕</span>
              </button>
            </div>

            <div className="shrink-0 my-2">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-neutral-900 uppercase tracking-[0.1em] leading-tight">
                {p.titulo}
              </h2>
              <p className="font-serif italic text-xs lg:text-sm text-neutral-600 mt-2 font-normal leading-relaxed">
                "{p.subtitulo}"
              </p>
            </div>

            <div className="py-5 border-y border-black/15 my-4 space-y-4 shrink-0">
              <div className="flex items-center justify-between font-mono text-xs text-neutral-800">
                <span className="text-neutral-500 tracking-[0.2em] uppercase">SUPERFICIE</span>
                <span className="font-serif text-xl lg:text-2xl text-neutral-900 font-bold tracking-wider">
                  {p.area || '580'} <span className="text-xs font-mono text-neutral-600">M²</span>
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs text-neutral-800">
                <span className="text-neutral-500 tracking-[0.2em] uppercase">SISTEMA</span>
                <span className="font-sans text-xs font-extrabold text-black tracking-widest uppercase">Llave en Mano</span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs text-neutral-800">
                <span className="text-neutral-500 tracking-[0.2em] uppercase">UBICACIÓN</span>
                <span className="font-serif text-base text-neutral-900 font-medium tracking-wider truncate max-w-[130px]">
                  {p.ubicacion || 'Antioquia'}
                </span>
              </div>
            </div>

            <div className="pt-2 mt-auto shrink-0 space-y-3">
              <a
                onClick={solicitarAsesoria}
                className="w-full py-4 px-6 rounded-full bg-black hover:bg-neutral-800 text-white font-sans text-xs tracking-[0.22em] font-extrabold uppercase transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>SOLICITAR ASESORÍA PRIVADA</span>
                <span className="text-sm font-black">→</span>
              </a>
              <div className="text-center">
                <span className="text-[9px] font-mono text-neutral-500 tracking-[0.24em] uppercase">
                  SYSMICON ARCHITECTS • MEDELLÍN
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProyectoDetalle;
