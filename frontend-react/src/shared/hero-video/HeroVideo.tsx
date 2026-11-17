import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCmsService } from '../../services/cms.service';
import './HeroVideo.css';

export const HeroVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  const seekTimeoutRef = useRef<any>(null);

  const cmsService = useCmsService();
  const [videoSrc, setVideoSrc] = useState<string>(
    'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017834/sysmi-0_n3fxgd.mp4'
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [seekBadgeText, setSeekBadgeText] = useState<string | null>(null);

  void isMobile;

  const updateVideoSource = useCallback(() => {
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const newSrc = mobile
        ? 'https://res.cloudinary.com/dsv1gdgya/video/upload/f_auto,q_auto,w_720/v1785017824/sysmi-movil-0_kk2hr0.mp4'
        : 'https://res.cloudinary.com/dsv1gdgya/video/upload/f_auto,q_auto,w_1280/v1785017834/sysmi-0_n3fxgd.mp4';
      setVideoSrc((prev) => (prev !== newSrc ? newSrc : prev));
    }
  }, []);

  const playVideo = useCallback(() => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const pauseVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  useEffect(() => {
    updateVideoSource();
    window.addEventListener('resize', updateVideoSource);
    return () => {
      window.removeEventListener('resize', updateVideoSource);
    };
  }, [updateVideoSource]);

  useEffect(() => {
    if (videoRef.current) {
      const v = videoRef.current;
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

      if (hostRef.current) {
        observer.observe(hostRef.current);
      }
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
      pauseVideo();
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
    };
  }, [playVideo, pauseVideo]);

  const showSeekBadge = (text: string) => {
    setSeekBadgeText(text);
    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
    }
    seekTimeoutRef.current = setTimeout(() => {
      setSeekBadgeText(null);
    }, 1000);
  };

  const avanzar15Segundos = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const duration = v.duration || 60;
    const targetTime = (v.currentTime + 15) % duration;
    v.currentTime = targetTime;
    showSeekBadge('+15s');
  };

  const retroceder15Segundos = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const duration = v.duration || 60;
    let targetTime = v.currentTime - 15;
    if (targetTime < 0) {
      targetTime = Math.max(0, duration + targetTime);
    }
    v.currentTime = targetTime;
    showSeekBadge('-15s');
  };

  void avanzar15Segundos;
  void retroceder15Segundos;

  const scrollToNext = () => {
    const projectsEl = document.querySelector('app-projects') || document.getElementById('proyectos');
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={hostRef}
      className="hero-video-section relative w-full h-screen overflow-hidden bg-[#000814] flex items-center justify-center"
    >
      {/* VIDEO PLAYER RESPONSIVO CON REVEAL CINEMATOGRÁFICO DE ZOOM SUAVE */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="hero-bg-video absolute inset-0 w-full h-full object-cover"
        ></video>

        {/* GRADIENTES & AMBIENTE CINEMATOGRÁFICO DE LUXURY */}
        <div className="absolute inset-0 bg-black/45"></div>
        <div className="absolute inset-0 bg-radial-vignette opacity-65"></div>
      </div>

      {/* INSIGNIA DE ANIMACIÓN / INDICADOR DE SALTO 15 SEGUNDOS */}
      {seekBadgeText && (
        <div className="absolute z-30 inset-0 flex items-center justify-center pointer-events-none animate-fadeIn">
          <div className="px-6 py-3 rounded-2xl bg-black/70 border border-[#C2E1FF]/50 backdrop-blur-xl shadow-2xl text-center">
            <span className="font-mono text-xl sm:text-2xl font-bold text-[#C2E1FF] tracking-[0.2em] uppercase">
              {seekBadgeText}
            </span>
            <span className="block font-sans text-[10px] uppercase tracking-widest text-white/70 mt-0.5">
              Navegación de Video
            </span>
          </div>
        </div>
      )}

      {/* CONTENIDO CENTRAL DEL HERO CON ORQUESTACIÓN EN CASCADA */}
      <div className="container relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center pt-4">
        {/* Logo Hero Animado */}
        <div className="mb-3 sm:mb-5 flex justify-center animate-logo-entrance">
          <img
            src="assets/icons/logo-hero.png"
            alt="Sysmicon Logo"
            loading="eager"
            decoding="async"
            className="h-24 sm:h-32 md:h-40 lg:h-44 max-h-[200px] w-auto object-contain animate-logo-float drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)]"
          />
        </div>

        {/* Título Principal con Revelación Cinemática y Letra Más Grande */}
        <h1 className="hero-title-entrance font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.05] drop-shadow-2xl mb-7">
          {cmsService.config.hero_title_prefix || 'Diseñamos y'}{' '}
          <span className="font-serif italic font-normal text-[#C2E1FF]">
            {cmsService.config.hero_title_highlight || 'Construimos'}
          </span>
        </h1>

        {/* Botones de Acción Restaurados y Perfectamente Alineados */}
        <div className="hero-buttons-entrance flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link
            to="/cotiza-con-nosotros"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-white text-[#000814] hover:bg-[#C2E1FF] transition-all duration-500 font-sans text-xs sm:text-sm font-bold tracking-[0.18em] uppercase shadow-2xl hover:scale-105 whitespace-nowrap"
          >
            <span className="whitespace-nowrap">{cmsService.config.hero_btn_cotizar || 'Cotiza con nosotros'}</span>
            <svg
              className="w-4 h-4 shrink-0 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </Link>

          <button
            onClick={scrollToNext}
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 backdrop-blur-md transition-all duration-500 font-sans text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase whitespace-nowrap"
          >
            <span className="whitespace-nowrap">{cmsService.config.hero_btn_obras || 'Ver Obras & Proyectos'}</span>
          </button>
        </div>
      </div>

      {/* INDICATIVO DEL SCROLL CON REVEAL RETARDADO (CENTRO INFERIOR) */}
      <div
        onClick={scrollToNext}
        className="hero-scroll-entrance scroll-indicator-enhanced absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer group"
      >
        {/* Texto animado */}
        <span className="font-mono text-xs tracking-[0.3em] uppercase text-white/80 group-hover:text-[#C2E1FF] transition-colors mb-2">
          {cmsService.config.hero_scroll_text || 'DESLIZA PARA EXPLORAR'}
        </span>

        {/* Cápsula animada tipo Mouse VIP con pulso brillante */}
        <div className="w-6 h-10 rounded-full border-2 border-white/30 group-hover:border-[#C2E1FF] transition-all duration-300 flex justify-center p-1.5 relative shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(194,225,255,0.4)]">
          <div className="w-1.5 h-2.5 rounded-full bg-[#C2E1FF] animate-mouse-wheel"></div>
        </div>

        {/* Línea con haz de luz descendente */}
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#C2E1FF] via-white/30 to-transparent mt-2 overflow-hidden relative">
          <div className="w-full h-full bg-[#C2E1FF] animate-beam-drop"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroVideo;
