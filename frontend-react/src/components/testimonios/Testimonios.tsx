import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TestimonialCard } from '../testimonial-card/TestimonialCard';
import { useTestimoniosService } from '../../services/testimonios.service';
import './Testimonios.css';

export const Testimonios: React.FC = () => {
  const testimoniosService = useTestimoniosService();
  const testimonios = testimoniosService.testimonios;

  const [activeTestimonioIndex, setActiveTestimonioIndex] = useState<number>(0);
  const timerIdRef = useRef<any>(null);

  const stopTestimoniosCarousel = useCallback(() => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  const nextTestimonio = useCallback(() => {
    setActiveTestimonioIndex((idx) => (idx + 1) % testimonios.length);
  }, [testimonios.length]);

  const prevTestimonio = useCallback(() => {
    setActiveTestimonioIndex((idx) => (idx - 1 + testimonios.length) % testimonios.length);
  }, [testimonios.length]);

  const startTestimoniosCarousel = useCallback(() => {
    stopTestimoniosCarousel();
    timerIdRef.current = setInterval(() => {
      nextTestimonio();
    }, 6000);
  }, [stopTestimoniosCarousel, nextTestimonio]);

  useEffect(() => {
    startTestimoniosCarousel();
    return () => {
      stopTestimoniosCarousel();
    };
  }, [startTestimoniosCarousel, stopTestimoniosCarousel]);

  const setTestimonio = (index: number) => {
    setActiveTestimonioIndex(index);
    startTestimoniosCarousel();
  };

  return (
    <section
      id="testimonios-section"
      className="testimonials-section section-padding py-16 md:py-24 bg-[#FAFAFA] border-t border-b border-black/5"
    >
      <div className="container">
        <div className="section-header text-center mb-12">
          <div className="section-tag font-sans">
            <span className="tag-line"></span>
            <span>Voces de Excelencia</span>
            <span className="tag-line"></span>
          </div>
          <h2 className="title-lg font-serif text-gray-900">
            La experiencia de construir con <span className="text-gray-500 font-serif">Sysmicon</span>
          </h2>
          <div className="divider-wood"></div>
          <p className="subtitle mx-auto text-gray-600 max-w-xl">
            El testimonio más valioso de nuestro trabajo es la satisfacción y tranquilidad de las familias que habitan nuestras creaciones.
          </p>
        </div>

        {/* Testimonials Carousel Container */}
        <div className="relative w-full max-w-4xl mx-auto px-4 md:px-12 select-none group">
          {/* Carrusel Track viewport */}
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                width: `${testimonios.length * 100}%`,
                transform: `translateX(-${activeTestimonioIndex * (100 / testimonios.length)}%)`,
              }}
            >
              {testimonios.map((t, i) => (
                <div
                  key={t.id}
                  style={{ width: `${100 / testimonios.length}%` }}
                  className="px-2 md:px-4 flex-shrink-0"
                >
                  <TestimonialCard testimonio={t} index={i} />
                </div>
              ))}
            </div>
          </div>

          {/* Botón Navegación Izquierda */}
          <button
            onClick={prevTestimonio}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-gray-700 hover:text-wood-accent hover:border-wood-accent/30 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 z-20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Botón Navegación Derecha */}
          <button
            onClick={nextTestimonio}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-gray-700 hover:text-wood-accent hover:border-wood-accent/30 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 z-20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Indicadores (Dots) */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonios.map((_, i) => (
            <button
              key={i}
              onClick={() => setTestimonio(i)}
              className={`dot-indicator w-2.5 h-2.5 rounded-full bg-gray-300 transition-all cursor-pointer ${
                i === activeTestimonioIndex ? 'active w-8 bg-wood-accent shadow-sm' : ''
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonios;
