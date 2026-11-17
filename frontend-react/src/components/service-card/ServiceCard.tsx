import React from 'react';
import { Link } from 'react-router-dom';
import { Servicio } from '../../models/servicio.model';
import './ServiceCard.css';

export interface ServiceCardProps {
  servicio: Servicio;
  index?: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ servicio, index = 0 }) => {
  void index;

  return (
    <div className="service-card-wrapper border-y border-neutral-200/80 bg-white shadow-xs transition-all duration-500 overflow-hidden relative group w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] lg:min-h-[560px] w-full">
        {/* COLUMNA IMAGEN DESDE EL BORDE IZQUIERDO ABSOLUTO (Cols 1-7) */}
        <div className="lg:col-span-7 relative overflow-hidden bg-neutral-950 min-h-[360px] lg:min-h-full flex flex-col justify-between p-8 sm:p-12 lg:p-16 group/img order-1">
          {/* Imagen nativa para renderizado nítido */}
          {servicio.imagen && (
            <img
              src={servicio.imagen}
              alt={servicio.titulo}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover/img:scale-105 opacity-90"
            />
          )}

          {/* Gradiente elegante para contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40"></div>

          {/* TÍTULO EDITORIAL EN EL CENTRO DE LA FOTO */}
          <div className="relative z-20 text-center px-4 my-auto py-8 pointer-events-none transition-transform duration-500 group-hover/img:scale-[1.02]">
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-6xl font-light tracking-[0.16em] text-white uppercase drop-shadow-lg leading-tight">
              {servicio.titulo}
            </h3>
          </div>
        </div>

        {/* COLUMNA CONTENIDO HASTA EL BORDE DERECHO ABSOLUTO (Cols 8-12) */}
        <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-white relative order-2">
          {/* Contenido conciso y sintético */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-black"></span>
              <span className="font-mono text-xs tracking-widest text-neutral-500 uppercase font-bold block">
                {servicio.subtitulo}
              </span>
            </div>

            <h3 className="font-serif text-2xl lg:text-4xl font-bold text-neutral-900 mb-4 leading-tight uppercase tracking-tight">
              {servicio.titulo}
            </h3>

            <p className="font-sans text-neutral-600 text-base lg:text-lg leading-relaxed mb-8 font-light">
              {servicio.descripcion}
            </p>

            {/* Puntos clave ultraconcisos */}
            {servicio.caracteristicas && servicio.caracteristicas.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-8">
                {servicio.caracteristicas.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200/90 text-xs font-medium text-neutral-800 hover:bg-black hover:text-white transition-all duration-300 cursor-default"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0"></span>
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Botón CTA Estilo Píldora Negra */}
          <div className="pt-6 border-t border-neutral-100 flex items-center justify-start mt-auto">
            <Link
              to={`/cotiza-con-nosotros?servicio=${encodeURIComponent(servicio.titulo)}`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-sans text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 hover:scale-105 shadow-md cursor-pointer group/btn"
            >
              <span>COTIZAR SERVICIO</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover/btn:translate-x-1 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
