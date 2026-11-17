import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_CONFIG } from '../../core/app.constants';
import { useCmsService } from '../../services/cms.service';
import './Hero.css';

export interface HeroSlide {
  image: string;
  title: string;
  location: string;
}

const SLIDES: HeroSlide[] = [
  { image: 'assets/images/principal.jpg', title: 'Residencia Principal', location: 'Llanogrande, Medellín' },
  { image: 'assets/images/imagen1.jpg', title: 'Villa Serena', location: 'El Retiro, Antioquia' },
  { image: 'assets/images/imagen2.jpg', title: 'Casa Roble', location: 'Alto de las Palmas' },
  { image: 'assets/images/imagen3.jpg', title: 'Loft Cielo', location: 'El Poblado, Medellín' },
  { image: 'assets/images/imagen4.jpg', title: 'Interior Zen & Mármol', location: 'Envigado, Antioquia' },
  { image: 'assets/images/imagen5.jpg', title: 'Casa Mirador del Valle', location: 'La Calera, Bogotá' }
];

export const Hero: React.FC = () => {
  const brand = BRAND_CONFIG;
  void brand;
  const cms = useCmsService();

  const slides = SLIDES;
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const timerRef = useRef<any>(null);

  const stopCarousel = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide(val => (val + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(val => (val - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const startCarousel = useCallback(() => {
    stopCarousel();
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4000);
  }, [stopCarousel, nextSlide]);

  useEffect(() => {
    startCarousel();
    return () => {
      stopCarousel();
    };
  }, [startCarousel, stopCarousel]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.body.style.overflow !== 'hidden') {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          prevSlide();
          startCarousel();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          nextSlide();
          startCarousel();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide, startCarousel]);

  const setSlide = (index: number) => {
    setCurrentSlide(index);
    startCarousel();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      {/* Elegant Background Carousel with dream-like cross-dissolve */}
      <div className="hero-carousel">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`slide-bg ${currentSlide === i ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>
        ))}
        <div className="hero-overlay"></div>
      </div>

      {/* Flechas de navegación minimalistas y elegantes */}
      <button
        onClick={() => {
          prevSlide();
          startCarousel();
        }}
        className="hero-arrow hero-arrow-left group"
        aria-label="Anterior diapositiva"
      >
        <svg
          className="w-5 h-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-0.5 stroke-current"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={() => {
          nextSlide();
          startCarousel();
        }}
        className="hero-arrow hero-arrow-right group"
        aria-label="Siguiente diapositiva"
      >
        <svg
          className="w-5 h-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 stroke-current"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Elegant Carousel Indicator / Controls (Bottom Right) */}
      <div className="carousel-controls font-sans">
        <div className="slide-info-elegant">
          {/* Ubicación fina, sutil y espaciada */}
          <div className="flex items-center justify-end gap-2.5 mb-1.5">
            <span className="w-4 h-[1px] bg-wood-accent/80"></span>
            <span className="slide-loc font-mono text-[10px] uppercase tracking-[0.28em] text-white/80">
              {slides[currentSlide].location}
            </span>
          </div>

          {/* Título en Serif ligera y refinada */}
          <div className="slide-title font-serif text-base md:text-lg font-normal tracking-[0.06em] text-white">
            {slides[currentSlide].title}
          </div>
        </div>

        {/* Líneas indicadoras minimalistas ultrafinas */}
        <div className="carousel-indicators mt-3 justify-end">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`indicator-btn ${currentSlide === i ? 'active' : ''}`}
              aria-label={`Ir a ${slide.title}`}
            >
              <span className="progress-bar"></span>
            </button>
          ))}
        </div>
      </div>

      <div className="container hero-content flex flex-col items-center justify-center text-center relative z-10">
        {cms.config.hero_tagline && (
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white text-[11px] font-mono tracking-widest uppercase mb-4 animate-fade">
            {cms.config.hero_tagline}
          </div>
        )}

        <h1 className="hero-title font-serif text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl drop-shadow-2xl mb-6">
          {cms.config.hero_title ||
            `${cms.config.hero_title_prefix} ${cms.config.hero_title_highlight}` ||
            'Diseñamos y Construimos'}
        </h1>

        {cms.config.hero_subtitle && (
          <p className="hero-subtitle max-w-3xl mx-auto text-white text-base sm:text-lg md:text-xl font-light leading-relaxed mb-8">
            {cms.config.hero_subtitle}
          </p>
        )}

        <div className="hero-actions flex flex-wrap items-center justify-center gap-4 my-8">
          {/* Primary CTA: Cotiza con nosotros */}
          <Link to="/cotiza-con-nosotros" className="btn-primary">
            <span>{cms.config.hero_btn_text || cms.config.hero_btn_cotizar || 'Cotiza con nosotros'}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>

          {/* Secondary CTA: Conócenos */}
          <button onClick={() => scrollToSection('nosotros-section')} className="btn-secondary">
            <span>{cms.config.hero_btn_obras || 'Conócenos'}</span>
          </button>
        </div>
      </div>

      {/* Scroll Down indicator */}
      <div className="scroll-indicator" onClick={() => scrollToSection('nosotros-section')}>
        <span className="scroll-txt">Explorar</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};

export default Hero;
