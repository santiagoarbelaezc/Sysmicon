import React from 'react';
import './ArchitecturalScrollBlock.css';

export interface ArchitecturalScrollBlockProps {
  title?: string;
  code?: string;
}

export const ArchitecturalScrollBlock: React.FC<ArchitecturalScrollBlockProps> = ({
  title = 'INGENIERÍA & ESTRUCTURACIÓN 360°',
  code = 'EJE ESTRUCTURAL // 01',
}) => {
  return (
    <section className="architectural-scroll-section relative w-full py-16 md:py-24 bg-white text-[#111111] border-y border-black/10 overflow-hidden flex items-center justify-center">
      {/* RED CAD PLANO ARQUITECTÓNICO DE FONDO SUTIL */}
      <div className="absolute inset-0 bg-blueprint-grid-white opacity-40 pointer-events-none"></div>

      <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        {/* COMPOSICIÓN DE BLOQUES ARQUITECTÓNICOS RECTOS SISMORRESISTENTES (ANIMACIÓN DUAL SCROLL ABAJO Y ARRIBA) */}
        <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[220px] sm:min-h-[260px]">
          {/* BLOQUE IZQUIERDO: SEPARADO Y ANIMADO TANTO AL SUBIR COMO AL BAJAR SCROLL */}
          <div
            className="absolute -left-10 sm:-left-20 lg:-left-36 xl:-left-44 top-0 z-10 w-56 sm:w-80 h-16 sm:h-20 bg-gray-50/95 border border-black/20 rounded-none backdrop-blur-xl shadow-xl flex items-center px-6 gap-3 pointer-events-none"
            data-aos="fade-right"
            data-aos-duration="1100"
            data-aos-delay="100"
            data-aos-once="false"
            data-aos-mirror="true"
            data-aos-easing="ease-out-cubic"
          >
            <span className="w-2.5 h-2.5 bg-black animate-pulse"></span>
            <div className="flex flex-col text-left">
              <span className="font-mono text-[9px] uppercase tracking-widest text-gray-600 font-bold">
                MÓDULO DE FASE
              </span>
              <span className="font-sans text-xs text-gray-900 font-semibold">Estructuración A-01</span>
            </div>
          </div>

          {/* BLOQUE DERECHO: SEPARADO Y ANIMADO TANTO AL SUBIR COMO AL BAJAR SCROLL */}
          <div
            className="absolute -right-10 sm:-right-20 lg:-right-36 xl:-right-44 bottom-0 z-10 w-60 sm:w-84 h-16 sm:h-20 bg-gray-50/95 border border-black/20 rounded-none backdrop-blur-xl shadow-xl flex items-center px-6 justify-end gap-3 pointer-events-none"
            data-aos="fade-left"
            data-aos-duration="1100"
            data-aos-delay="200"
            data-aos-once="false"
            data-aos-mirror="true"
            data-aos-easing="ease-out-cubic"
          >
            <div className="flex flex-col text-right">
              <span className="font-mono text-[9px] uppercase tracking-widest text-gray-600 font-bold">
                COTA SISMORRESISTENTE
              </span>
              <span className="font-sans text-xs text-gray-900 font-semibold">Tolerancia 0.00mm</span>
            </div>
            <span className="w-2.5 h-2.5 bg-black animate-pulse"></span>
          </div>

          {/* BLOQUE CENTRAL: ANIMADO TANTO AL SUBIR COMO AL BAJAR SCROLL */}
          <div
            className="relative z-20 w-full max-w-3xl px-8 py-8 sm:py-12 rounded-none bg-white/95 border border-black/20 backdrop-blur-2xl text-center shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
            data-aos="fade-up"
            data-aos-duration="900"
            data-aos-once="false"
            data-aos-mirror="true"
            data-aos-easing="ease-out-cubic"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/10 font-mono text-[10px] tracking-[0.3em] uppercase text-gray-600 font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black"></span>
                <span>{code}</span>
              </div>
              <span>SYSMICON ARCHITECTURE</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#111111] tracking-tight leading-snug">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitecturalScrollBlock;
