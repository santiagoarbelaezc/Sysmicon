import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ServiceCard } from '../service-card/ServiceCard';
import { useServiciosService } from '../../services/servicios.service';
import './ServicesSection.css';

export const ServicesSection: React.FC = () => {
  const serviciosService = useServiciosService();
  const servicios = serviciosService.servicios;

  const [activeServiceIndex, setActiveServiceIndex] = useState<number>(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  void direction;

  const autoPlayTimerRef = useRef<any>(null);
  const isWheelThrottledRef = useRef<boolean>(false);
  const touchStartXRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayTimerRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setDirection('next');
        setActiveServiceIndex((i) => (i + 1) % servicios.length);
      }
    }, 6000);
  }, [stopAutoPlay, servicios.length]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      stopAutoPlay();
    };
  }, [startAutoPlay, stopAutoPlay]);

  const pauseAutoPlay = () => {
    setIsPaused(true);
  };

  const resumeAutoPlay = () => {
    setIsPaused(false);
  };

  const nextService = (userInitiated = true) => {
    if (userInitiated) startAutoPlay();
    setDirection('next');
    const total = servicios.length;
    setActiveServiceIndex((i) => (i + 1) % total);
  };

  const prevService = () => {
    startAutoPlay();
    setDirection('prev');
    const total = servicios.length;
    setActiveServiceIndex((i) => (i - 1 + total) % total);
  };

  const goToService = (index: number) => {
    startAutoPlay();
    if (index === activeServiceIndex) return;
    setDirection(index > activeServiceIndex ? 'next' : 'prev');
    setActiveServiceIndex(index);
  };

  const onServicesWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (
      Math.abs(event.deltaX) <= Math.abs(event.deltaY) ||
      Math.abs(event.deltaX) < 15 ||
      isWheelThrottledRef.current
    ) {
      return;
    }

    isWheelThrottledRef.current = true;

    if (event.deltaX > 0) {
      nextService();
    } else {
      prevService();
    }

    setTimeout(() => {
      isWheelThrottledRef.current = false;
    }, 450);
  };

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length > 0) {
      touchStartXRef.current = event.touches[0].clientX;
    }
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.changedTouches.length > 0) {
      const touchEndX = event.changedTouches[0].clientX;
      const diff = touchStartXRef.current - touchEndX;

      if (Math.abs(diff) > 35) {
        if (diff > 0) {
          nextService();
        } else {
          prevService();
        }
      }
    }
  };

  return (
    <section
      id="servicios-section"
      className="services-section relative w-full py-12 sm:py-20 bg-white text-neutral-900 overflow-hidden font-sans"
    >
      <div className="w-full px-0 relative z-10">
        {/* Header de Sección Centrado & Sintético */}
        <div className="text-center max-w-4xl mx-auto space-y-2 mb-10 px-4 sm:px-6">
          <span className="font-mono text-xs tracking-[0.3em] text-neutral-400 font-semibold uppercase block">
            NUESTROS SERVICIOS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 font-bold leading-tight tracking-tight uppercase">
            SOLUCIONES ARQUITECTÓNICAS DE{' '}
            <span className="font-serif italic font-normal text-neutral-500">PRINCIPIO A FIN</span>
          </h2>
        </div>

        {/* Carrusel de Tarjetas de Servicios 100% Ancho Total (Edge-to-Edge) */}
        <div
          className="relative w-full"
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
          onWheel={onServicesWheel}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Botón de Navegación Izquierda (Flotante) */}
          <button
            onClick={() => prevService()}
            className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-13 lg:h-13 rounded-full border border-neutral-300 bg-white/95 backdrop-blur-md hover:bg-black hover:text-white text-neutral-900 flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 cursor-pointer group"
            title="Anterior Servicio"
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

          {/* Botón de Navegación Derecha (Flotante) */}
          <button
            onClick={() => nextService()}
            className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-13 lg:h-13 rounded-full border border-neutral-300 bg-white/95 backdrop-blur-md hover:bg-black hover:text-white text-neutral-900 flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 cursor-pointer group"
            title="Siguiente Servicio"
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

          {/* Track Deslizante de Servicios 100% Ancho Completo */}
          <div className="overflow-hidden w-full p-0 m-0">
            <div
              className="services-carousel-track flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] w-full"
              style={{ transform: `translateX(-${activeServiceIndex * 100}%)` }}
            >
              {servicios.map((s, i) => (
                <div
                  key={s.id}
                  className={`service-slide-item w-full shrink-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    activeServiceIndex === i
                      ? 'opacity-100 scale-100 z-10'
                      : 'opacity-40 scale-[0.98] pointer-events-none'
                  }`}
                >
                  <ServiceCard servicio={s} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicadores del Carrusel */}
        <div className="flex flex-col items-center gap-4 mt-8 px-4">
          <div className="flex items-center justify-center gap-3">
            {servicios.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToService(i)}
                className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer focus:outline-hidden ${
                  activeServiceIndex === i ? 'w-12 bg-black' : 'w-3 bg-neutral-300 hover:bg-neutral-400'
                }`}
                title={s.titulo}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
