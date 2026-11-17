import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProyectosService } from '../../services/proyectos.service';
import { useCmsService } from '../../services/cms.service';
import './BannerVideo.css';

export interface BannerVideoProps {
  videoSrc?: string;
  logoSrc?: string;
  badgeText?: string;
  titulo?: string;
  tituloHighlight?: string;
  subtitulo?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  showCta?: boolean;
  proyectoId?: string;
}

const DEFAULT_SUBTITULO =
  'Residencia contemporánea donde la arquitectura de autor y la materialidad convergen en perfecta simetría.';

export const BannerVideo: React.FC<BannerVideoProps> = ({
  videoSrc = 'https://res.cloudinary.com/dsv1gdgya/video/upload/f_auto,q_auto,w_1000/v1785017819/sysmi-1_mvv1wg.mp4',
  logoSrc = 'assets/icons/logo-hero.png',
  badgeText = '',
  titulo = 'CASA',
  tituloHighlight = 'M',
  subtitulo = DEFAULT_SUBTITULO,
  ctaText = 'VER PROYECTO',
  ctaLink = '/proyectos',
  secondaryCtaText = 'VER DOSSIER COMPLETO',
  secondaryCtaLink = '/proyectos',
  showCta = true,
  proyectoId = 'casaM',
}) => {
  const proyectosService = useProyectosService();
  void proyectosService;
  void badgeText;
  void ctaLink;
  void secondaryCtaLink;

  const navigate = useNavigate();
  const cmsService = useCmsService();

  const sectionElementRef = useRef<HTMLElement | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  const displayTitulo = titulo !== 'CASA' ? titulo : cmsService.config.casam_title || 'CASA';
  const displayTituloHighlight =
    tituloHighlight !== 'M' ? tituloHighlight : cmsService.config.casam_highlight || 'M';
  const displaySubtitulo =
    subtitulo !== DEFAULT_SUBTITULO
      ? subtitulo
      : cmsService.config.casam_subtitle || DEFAULT_SUBTITULO;
  const displayCtaText =
    ctaText !== 'VER PROYECTO' ? ctaText : cmsService.config.casam_btn || 'VER PROYECTO';

  const playVideo = useCallback(() => {
    if (videoElementRef.current && videoElementRef.current.paused) {
      const v = videoElementRef.current;
      v.muted = true;
      v.play().catch(() => {});
    }
  }, []);

  const pauseVideo = useCallback(() => {
    if (videoElementRef.current) {
      videoElementRef.current.pause();
    }
  }, []);

  useEffect(() => {
    if (videoElementRef.current) {
      const v = videoElementRef.current;
      v.muted = true;
      v.play().catch(() => {});
    }

    let observer: IntersectionObserver | undefined;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              playVideo();
            } else {
              pauseVideo();
            }
          });
        },
        { threshold: 0.1 }
      );

      if (sectionElementRef.current) {
        observer.observe(sectionElementRef.current);
      }
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
      pauseVideo();
    };
  }, [playVideo, pauseVideo]);

  const abrirProyecto = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate(`/proyecto/${proyectoId || 'casaM'}`);
  };

  return (
    <div className="banner-video-host">
      <section
        ref={sectionElementRef}
        className="banner-video-section relative w-full h-[90vh] sm:h-screen min-h-[700px] max-h-[950px] overflow-hidden bg-[#000814] flex items-center justify-center select-none border-y border-white/10 group"
      >
        {/* VIDEO PLAYER NÍTIDO Y BRILLANTE DE FONDO */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            ref={videoElementRef}
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-95 transition-opacity duration-1000 ease-out"
          ></video>

          {/* SUPERPOSICIÓN LIGERA PARA MÁXIMA CLARIDAD Y BRILLO DEL VIDEO */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30"></div>
        </div>

        {/* CONTENIDO CENTRAL DEL BANNER */}
        <div className="container relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center py-12">
          {/* Logo Hero Centrado */}
          {logoSrc && (
            <div className="mb-4 sm:mb-6 flex justify-center">
              <img
                src={logoSrc}
                alt="Sysmicon Logo"
                className="h-28 sm:h-36 md:h-44 lg:h-48 max-h-[220px] w-auto object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          {/* Título Principal */}
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-wider leading-[1.05] drop-shadow-2xl mb-4 uppercase">
            {displayTitulo}{' '}
            <span className="font-serif italic font-normal text-[#C2E1FF]">{displayTituloHighlight}</span>
          </h2>

          {/* Subtítulo Breve Conciso */}
          <p className="font-sans text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto font-light leading-relaxed mb-8 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            {displaySubtitulo}
          </p>

          {/* Botones de Acción Estilo Hero */}
          {showCta && (
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <button
                onClick={abrirProyecto}
                className="group/btn inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-white text-[#000814] hover:bg-[#C2E1FF] transition-all duration-500 font-sans text-xs font-bold tracking-[0.24em] uppercase shadow-2xl hover:scale-105 cursor-pointer"
              >
                <span>{displayCtaText}</span>
                <svg
                  className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </button>

              {secondaryCtaText && (
                <button
                  onClick={abrirProyecto}
                  className="group/btn inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 backdrop-blur-md transition-all duration-500 font-sans text-xs font-semibold tracking-[0.2em] uppercase cursor-pointer"
                >
                  <span>{secondaryCtaText}</span>
                  <svg
                    className="w-4 h-4 transform group-hover/btn:translate-x-1.5 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BannerVideo;
