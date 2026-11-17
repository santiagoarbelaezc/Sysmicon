import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

export interface SlideNosotros {
  subtitle: string;
  title: string;
  titleHighlight: string;
  description: string;
  image: string;
}

const SLIDES: SlideNosotros[] = [
  {
    subtitle: 'SOBRE NOSOTROS',
    title: 'Arquitectura que trasciende',
    titleHighlight: 'el tiempo',
    description: '',
    image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_1920/v1785440099/6c62aa8e-b604-4c3a-a8c2-cb4ac61759a2_czyho0.jpg'
  },
  {
    subtitle: 'NUESTRA FILOSOFÍA',
    title: 'Sobriedad. Función.',
    titleHighlight: 'Autenticidad.',
    description: '',
    image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_1920/v1785440100/6df1340c-7691-4ed0-9d57-e8d0f2dc3566_upfx1e.jpg'
  },
  {
    subtitle: 'NUESTRA MISIÓN',
    title: 'Residencias extraordinarias',
    titleHighlight: 'llave en mano',
    description: '',
    image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_1920/v1785440122/ea5179e4-6a1a-4fc8-a4da-829c4592c314_t1a9il.jpg'
  },
  {
    subtitle: 'NUESTRO PROCESO',
    title: 'Liderazgo técnico integral',
    titleHighlight: '360°',
    description: '',
    image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_1920/v1785440111/a087b55c-2f1c-48a6-a2cd-80fc99502dc1_p8afun.jpg'
  },
  {
    subtitle: 'EXCELENCIA EN DETALLE',
    title: 'Precisión milimétrica y',
    titleHighlight: 'materialidad noble',
    description: '',
    image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_1920/v1785440103/50d3b6d5-e4fb-406f-8515-75f1235a0047_fnb4bu.jpg'
  }
];

export const About: React.FC = () => {
  const stickyWrapperRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const slides = SLIDES;

  useEffect(() => {
    const onWindowScroll = () => {
      if (typeof window === 'undefined' || !stickyWrapperRef.current) return;

      const wrapper = stickyWrapperRef.current;
      const rect = wrapper.getBoundingClientRect();
      const wrapperHeight = rect.height - window.innerHeight;

      if (wrapperHeight <= 0) return;

      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / wrapperHeight);

      const step = 1 / slides.length;
      const index = Math.min(slides.length - 1, Math.floor(progress / step));

      setActiveIndex(index);
    };

    window.addEventListener('scroll', onWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', onWindowScroll);
  }, [slides.length]);

  const scrollToIndex = (index: number) => {
    if (typeof window === 'undefined' || !stickyWrapperRef.current) return;

    const wrapper = stickyWrapperRef.current;
    const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    const wrapperHeight = wrapper.offsetHeight - window.innerHeight;
    const step = wrapperHeight / slides.length;

    const targetScroll = wrapperTop + step * index + 10;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <div id="nosotros-section" className="sticky-scroll-wrapper" ref={stickyWrapperRef}>
      <section className="banner-container relative w-full h-screen bg-black overflow-hidden flex items-center justify-center border-y border-neutral-900">
        {/* Capas fotográficas cinematográficas de fondo */}
        <div className="background-layers absolute inset-0 z-0">
          {slides.map((val, i) => (
            <div key={i} className={`bg-layer ${activeIndex === i ? 'active' : ''}`}>
              <img src={val.image} alt={val.title} className="bg-img" />
              <div className="overlay"></div>
              <div className="overlay-radial"></div>
            </div>
          ))}
        </div>

        {/* Marcas arquitectónicas de esquina (Estilo Cotiza / Hero) */}
        <div className="absolute top-8 inset-x-8 sm:inset-x-14 flex justify-between pointer-events-none select-none z-20 text-white/35 font-mono text-xs tracking-[0.25em]">
          <span>+ SYS_STUDIO</span>
          <span>FILOSOFÍA // 2026 +</span>
        </div>

        <div className="absolute bottom-8 inset-x-8 sm:inset-x-14 hidden sm:flex justify-between pointer-events-none select-none z-20 text-white/35 font-mono text-xs tracking-[0.25em]">
          <span>
            0{activeIndex + 1} // 0{slides.length}
          </span>
          <span className="animate-pulse">DESLIZA PARA EXPLORAR ↓</span>
        </div>

        {/* Contenido Central Pin (Pinnable layout con Letra Gigante y Menos Texto) */}
        <div className="content-wrapper-pin relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-12 flex items-center justify-center">
          {slides.map((val, i) => (
            <div key={i} className={`value-content-pin w-full ${activeIndex === i ? 'active' : ''}`}>
              <div className="text-content max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
                {/* Título Principal en Mayúsculas y Letra Extra Grande */}
                <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white tracking-tight leading-[1.02] uppercase drop-shadow-2xl">
                  {val.title} <br className="hidden sm:inline" />
                  <span className="font-serif italic font-normal text-neutral-300 uppercase">
                    {val.titleHighlight}
                  </span>
                </h2>

                {/* Botón de Acción de Lujo Ampliado en Mayúsculas */}
                <div className={`action-wrap pt-2 ${activeIndex === i ? 'show' : ''}`}>
                  <Link
                    to="/nosotros"
                    className="group/btn inline-flex items-center justify-center gap-3.5 px-9 sm:px-12 py-4.5 sm:py-5 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 transition-all duration-300 font-sans text-xs sm:text-sm font-bold tracking-[0.2em] uppercase shadow-[0_20px_60px_rgba(0,0,0,0.85)] hover:scale-105 cursor-pointer whitespace-nowrap"
                  >
                    <span>CONOCE NUESTRO ESTUDIO</span>
                    <svg
                      className="w-4 h-4 shrink-0 transform group-hover/btn:translate-x-1.5 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicador de Navegación / Barras de Progreso Minimalistas */}
        <div className="scroll-indicators absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 select-none">
          {slides.map((val, i) => (
            <button
              key={i}
              className={`nav-indicator-bar cursor-pointer ${activeIndex === i ? 'active' : ''}`}
              onClick={() => scrollToIndex(i)}
              aria-label={val.subtitle}
            ></button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
