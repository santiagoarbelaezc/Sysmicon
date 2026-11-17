import React from 'react';
import { Link } from 'react-router-dom';
import './BannerCrearplano.css';

export const BannerCrearplano: React.FC = () => {
  return (
    <section className="config-banner relative w-full py-16 sm:py-20 lg:py-24 bg-white text-neutral-900 overflow-hidden font-sans">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12 relative z-10">
          {/* Texto Principal & Asesoría */}
          <div className="max-w-3xl space-y-3 text-left">
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 font-bold leading-tight tracking-tight uppercase">
              ASESÓRATE Y COTIZA TU OBRA CON{' '}
              <span className="font-serif italic font-normal text-neutral-500">ARQUITECTOS SENIOR</span>
            </h3>

            <p className="font-sans text-base sm:text-lg text-neutral-600 leading-relaxed font-light max-w-2xl">
              Recibe dirección ejecutiva, estudio de viabilidad técnica y un presupuesto integral blindado a la medida de tu proyecto.
            </p>
          </div>

          {/* Botón CTA Monocromático Blanco & Negro */}
          <div className="shrink-0">
            <Link
              to="/cotiza-con-nosotros"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 hover:scale-105 transition-all duration-300 shadow-sm cursor-pointer"
            >
              <span>Cotiza con Nosotros</span>
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
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerCrearplano;
