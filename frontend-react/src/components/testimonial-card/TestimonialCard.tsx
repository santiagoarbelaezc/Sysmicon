import React from 'react';
import { Testimonio } from '../../models/testimonio.model';
import './TestimonialCard.css';

export interface TestimonialCardProps {
  testimonio: Testimonio;
  index?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonio, index = 0 }) => {
  const starsArray = Array(testimonio.calificacion).fill(0);

  return (
    <div className={`service-card testimonial-card ${index % 2 === 1 ? 'card-alt' : ''}`}>
      {/* Trazos esquineros arquitectónicos decorativos */}
      <div className="arch-plan-box-top"></div>
      <div className="arch-plan-box-bottom"></div>
      <div className="arch-corner-line"></div>

      {/* Columna izquierda: Número e ícono de comillas de diseño */}
      <div className="card-left-col">
        <span className="card-number font-serif">0{index + 1}</span>

        <div className="icon-box">
          {/* Icono de comillas vectoriales elegantes */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H5c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 3-2 5-5 6v4zm11 0c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-3c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 3-2 5-5 6v4z" />
          </svg>
        </div>
      </div>

      {/* Columna derecha: Comentario, Estrellas y Datos del cliente */}
      <div className="card-right-col">
        <div>
          {/* Calificación en estrellas doradas */}
          <div className="stars-container mb-2">
            {starsArray.map((_, i) => (
              <span key={i} className="text-amber-500 text-sm">
                ★
              </span>
            ))}
          </div>

          <p className="card-desc font-sans italic">“{testimonio.comentario}”</p>

          <div className="arch-divider"></div>

          <h4 className="card-title font-serif text-lg mb-1">{testimonio.cliente}</h4>
        </div>

        <div className="card-footer-test font-sans flex flex-col gap-0.5 text-xs text-gray-500 pt-3 border-t border-black/5">
          <span className="font-bold text-gray-700">{testimonio.puesto}</span>
          <span className="text-wood-light font-medium flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="11" r="3" />
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
            </svg>
            {testimonio.proyectoNombre}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
