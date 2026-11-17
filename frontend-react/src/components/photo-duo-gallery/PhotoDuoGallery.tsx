import React from 'react';
import { Link } from 'react-router-dom';
import { CollageItem } from '../photo-collage/PhotoCollage';
import './PhotoDuoGallery.css';

export interface PhotoDuoGalleryProps {
  items?: CollageItem[];
}

export const PhotoDuoGallery: React.FC<PhotoDuoGalleryProps> = ({ items = [] }) => {
  if (items.length === 0) {
    return null;
  }

  const pairs: CollageItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }

  return (
    <section className="duo-gallery-section w-full bg-[#000814] py-10 overflow-hidden">
      {/* Encabezado sutil */}
      <div
        className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 mb-8"
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-easing="ease-out-cubic"
      >
        <div className="flex items-center gap-5">
          <span className="flex-1 h-[1px] bg-white/10"></span>
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/40 font-semibold whitespace-nowrap">
            DETALLES DE OBRA
          </span>
          <span className="flex-1 h-[1px] bg-white/10"></span>
        </div>
      </div>

      {/* PARES DE IMÁGENES */}
      <div className="w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 flex flex-col gap-[6px]">
        {pairs.map((pair, pairIdx) => (
          <div
            key={pairIdx}
            className={`duo-row grid gap-[6px] ${
              pairIdx % 2 === 0 ? 'duo-row-normal' : 'duo-row-reversed'
            }`}
          >
            {/* IMAGEN 1 del par */}
            <div
              className="duo-item"
              data-aos={pairIdx % 2 === 0 ? 'fade-right' : 'fade-left'}
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
              data-aos-delay={pairIdx * 80}
            >
              <Link to={`/proyecto/${pair[0].projectId}`} className="duo-link">
                <img src={pair[0].url} alt={pair[0].projectLabel} className="duo-img" loading="lazy" />
                <div className="duo-overlay">
                  <span className="duo-label">{pair[0].projectLabel}</span>
                  <svg className="duo-arrow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>

            {/* IMAGEN 2 del par (si existe) */}
            {pair[1] ? (
              <div
                className="duo-item"
                data-aos={pairIdx % 2 === 0 ? 'fade-left' : 'fade-right'}
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
                data-aos-delay={pairIdx * 80 + 150}
              >
                <Link to={`/proyecto/${pair[1].projectId}`} className="duo-link">
                  <img src={pair[1].url} alt={pair[1].projectLabel} className="duo-img" loading="lazy" />
                  <div className="duo-overlay">
                    <span className="duo-label">{pair[1].projectLabel}</span>
                    <svg className="duo-arrow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            ) : (
              /* Si el par tiene solo 1 imagen, mostrar placeholder decorativo */
              <div
                className="duo-item duo-item-placeholder"
                data-aos="fade-left"
                data-aos-duration="800"
                data-aos-delay={pairIdx * 80 + 150}
              ></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoDuoGallery;
