import React from 'react';
import { Link } from 'react-router-dom';
import { Proyecto } from '../../models/proyecto.model';
import './ProjectCard.css';

export interface ProjectCardProps {
  proyecto: Proyecto;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ proyecto }) => {
  return (
    <div className="project-card">
      <div className="img-container">
        <img src={proyecto.imagenUrl} alt={proyecto.titulo} loading="lazy" className="project-img" />

        {/* Top Tags */}
        <div className="project-tags font-sans">
          <span className="tag-cat">{proyecto.categoria}</span>
          <span className="tag-year">{proyecto.anio}</span>
        </div>

        {/* Hover Overlay Content */}
        <div className="project-overlay">
          <div className="overlay-content">
            <span className="project-loc font-sans">📍 {proyecto.ubicacion}</span>
            <h3 className="project-title font-serif">{proyecto.titulo}</h3>
            <p className="project-sub font-sans">{proyecto.subtitulo}</p>

            <div className="project-meta font-sans">
              <span>
                Área: <strong>{proyecto.area} m²</strong>
              </span>
            </div>

            <p className="project-desc font-sans">{proyecto.descripcion}</p>

            {/* Features preview */}
            <div className="project-features font-sans">
              {proyecto.caracteristicas.slice(0, 2).map((f, i) => (
                <span key={i} className="feat-pill">
                  ▪ {f}
                </span>
              ))}
            </div>

            <Link
              to={`/cotiza-con-nosotros?proyecto=${encodeURIComponent(proyecto.titulo)}`}
              className="overlay-btn"
            >
              <span>Solicitar Proyecto Similar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
          </div>
        </div>
      </div>

      {/* Bottom Label for simple view */}
      <div className="project-footer">
        <div>
          <h4 className="footer-title font-serif">{proyecto.titulo}</h4>
          <span className="footer-loc font-sans">{proyecto.ubicacion}</span>
        </div>
        <div className="footer-area font-serif">
          {proyecto.area} <small>m²</small>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
