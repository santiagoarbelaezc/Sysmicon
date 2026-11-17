import React from 'react';
import { Link } from 'react-router-dom';
import './PhotoCollage.css';

export interface CollageItem {
  url: string;
  projectLabel: string;
  projectId: string;
  span?: 'normal' | 'wide' | 'tall';
}

export interface PhotoCollageProps {
  collageItems?: CollageItem[];
}

export const PhotoCollage: React.FC<PhotoCollageProps> = ({ collageItems = [] }) => {
  if (collageItems.length === 0) {
    return null;
  }

  return (
    <section className="collage-section w-full bg-[#000814] py-16 sm:py-20 overflow-hidden">
      {/* Encabezado Sutil */}
      <div
        className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 mb-10"
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-easing="ease-out-cubic"
      >
        <div className="flex items-center gap-5">
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/40 font-semibold">
            GALERÍA DE DETALLES
          </span>
          <span className="flex-1 h-[1px] bg-white/10"></span>
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/40 font-semibold">
            {collageItems.length} FOTOGRAFÍAS
          </span>
        </div>
      </div>

      {/* COLLAGE GRID ASIMÉTRICO */}
      <div className="collage-grid w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6">
        {/* FILA 1: Grande (2 cols) + Mediana + Mediana */}
        <div className="collage-row row-1">
          {/* ITEM 1: Grande horizontal (col-span-2) */}
          {collageItems[0] && (
            <div
              className="collage-item item-wide"
              data-aos="fade-right"
              data-aos-duration="1100"
              data-aos-easing="ease-out-cubic"
            >
              <Link to={`/proyecto/${collageItems[0].projectId}`} className="collage-link">
                <img
                  src={collageItems[0].url}
                  alt={collageItems[0].projectLabel}
                  className="collage-img"
                  loading="lazy"
                />
                <div className="collage-overlay">
                  <span className="collage-label">{collageItems[0].projectLabel}</span>
                  <svg className="collage-arrow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          )}

          {/* ITEM 2: Mediana */}
          {collageItems[1] && (
            <div
              className="collage-item item-normal"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="150"
              data-aos-easing="ease-out-cubic"
            >
              <Link to={`/proyecto/${collageItems[1].projectId}`} className="collage-link">
                <img
                  src={collageItems[1].url}
                  alt={collageItems[1].projectLabel}
                  className="collage-img"
                  loading="lazy"
                />
                <div className="collage-overlay">
                  <span className="collage-label">{collageItems[1].projectLabel}</span>
                </div>
              </Link>
            </div>
          )}

          {/* ITEM 3: Mediana */}
          {collageItems[2] && (
            <div
              className="collage-item item-normal"
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="300"
              data-aos-easing="ease-out-cubic"
            >
              <Link to={`/proyecto/${collageItems[2].projectId}`} className="collage-link">
                <img
                  src={collageItems[2].url}
                  alt={collageItems[2].projectLabel}
                  className="collage-img"
                  loading="lazy"
                />
                <div className="collage-overlay">
                  <span className="collage-label">{collageItems[2].projectLabel}</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* FILA 2: Pequeña + Grande central (col-span-2) + Mediana */}
        <div className="collage-row row-2">
          {/* ITEM 4: Pequeña */}
          {collageItems[3] && (
            <div
              className="collage-item item-small"
              data-aos="fade-up"
              data-aos-duration="900"
              data-aos-delay="100"
              data-aos-easing="ease-out-cubic"
            >
              <Link to={`/proyecto/${collageItems[3].projectId}`} className="collage-link">
                <img
                  src={collageItems[3].url}
                  alt={collageItems[3].projectLabel}
                  className="collage-img"
                  loading="lazy"
                />
                <div className="collage-overlay">
                  <span className="collage-label">{collageItems[3].projectLabel}</span>
                </div>
              </Link>
            </div>
          )}

          {/* ITEM 5: Grande central (col-span-2) */}
          {collageItems[4] && (
            <div
              className="collage-item item-wide"
              data-aos="zoom-in"
              data-aos-duration="1100"
              data-aos-delay="200"
              data-aos-easing="ease-out-cubic"
            >
              <Link to={`/proyecto/${collageItems[4].projectId}`} className="collage-link">
                <img
                  src={collageItems[4].url}
                  alt={collageItems[4].projectLabel}
                  className="collage-img"
                  loading="lazy"
                />
                <div className="collage-overlay">
                  <span className="collage-label">{collageItems[4].projectLabel}</span>
                  <svg className="collage-arrow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          )}

          {/* ITEM 6: Mediana */}
          {collageItems[5] && (
            <div
              className="collage-item item-normal"
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="350"
              data-aos-easing="ease-out-cubic"
            >
              <Link to={`/proyecto/${collageItems[5].projectId}`} className="collage-link">
                <img
                  src={collageItems[5].url}
                  alt={collageItems[5].projectLabel}
                  className="collage-img"
                  loading="lazy"
                />
                <div className="collage-overlay">
                  <span className="collage-label">{collageItems[5].projectLabel}</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* FILA 3: Mediana + Mediana + Grande (col-span-2) */}
        <div className="collage-row row-3">
          {/* ITEM 7: Mediana */}
          {collageItems[6] && (
            <div
              className="collage-item item-normal"
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
              data-aos-easing="ease-out-cubic"
            >
              <Link to={`/proyecto/${collageItems[6].projectId}`} className="collage-link">
                <img
                  src={collageItems[6].url}
                  alt={collageItems[6].projectLabel}
                  className="collage-img"
                  loading="lazy"
                />
                <div className="collage-overlay">
                  <span className="collage-label">{collageItems[6].projectLabel}</span>
                </div>
              </Link>
            </div>
          )}

          {/* ITEM 8: Mediana */}
          {collageItems[7] && (
            <div
              className="collage-item item-normal"
              data-aos="fade-up"
              data-aos-duration="900"
              data-aos-delay="200"
              data-aos-easing="ease-out-cubic"
            >
              <Link to={`/proyecto/${collageItems[7].projectId}`} className="collage-link">
                <img
                  src={collageItems[7].url}
                  alt={collageItems[7].projectLabel}
                  className="collage-img"
                  loading="lazy"
                />
                <div className="collage-overlay">
                  <span className="collage-label">{collageItems[7].projectLabel}</span>
                </div>
              </Link>
            </div>
          )}

          {/* ITEM 9: Grande (col-span-2) */}
          {collageItems[8] && (
            <div
              className="collage-item item-wide"
              data-aos="fade-left"
              data-aos-duration="1100"
              data-aos-delay="300"
              data-aos-easing="ease-out-cubic"
            >
              <Link to={`/proyecto/${collageItems[8].projectId}`} className="collage-link">
                <img
                  src={collageItems[8].url}
                  alt={collageItems[8].projectLabel}
                  className="collage-img"
                  loading="lazy"
                />
                <div className="collage-overlay">
                  <span className="collage-label">{collageItems[8].projectLabel}</span>
                  <svg className="collage-arrow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* FILA 4: Grande (col-span-2) + Pequeña + Mediana (si hay más de 9 items) */}
        {collageItems.length >= 12 && (
          <div className="collage-row row-4">
            {/* ITEM 10: Pequeña */}
            {collageItems[9] && (
              <div
                className="collage-item item-small"
                data-aos="fade-up"
                data-aos-duration="900"
                data-aos-delay="50"
                data-aos-easing="ease-out-cubic"
              >
                <Link to={`/proyecto/${collageItems[9].projectId}`} className="collage-link">
                  <img
                    src={collageItems[9].url}
                    alt={collageItems[9].projectLabel}
                    className="collage-img"
                    loading="lazy"
                  />
                  <div className="collage-overlay">
                    <span className="collage-label">{collageItems[9].projectLabel}</span>
                  </div>
                </Link>
              </div>
            )}

            {/* ITEM 11: Grande (col-span-2) */}
            {collageItems[10] && (
              <div
                className="collage-item item-wide"
                data-aos="zoom-in"
                data-aos-duration="1100"
                data-aos-delay="150"
                data-aos-easing="ease-out-cubic"
              >
                <Link to={`/proyecto/${collageItems[10].projectId}`} className="collage-link">
                  <img
                    src={collageItems[10].url}
                    alt={collageItems[10].projectLabel}
                    className="collage-img"
                    loading="lazy"
                  />
                  <div className="collage-overlay">
                    <span className="collage-label">{collageItems[10].projectLabel}</span>
                    <svg className="collage-arrow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            )}

            {/* ITEM 12: Mediana */}
            {collageItems[11] && (
              <div
                className="collage-item item-normal"
                data-aos="fade-left"
                data-aos-duration="1000"
                data-aos-delay="300"
                data-aos-easing="ease-out-cubic"
              >
                <Link to={`/proyecto/${collageItems[11].projectId}`} className="collage-link">
                  <img
                    src={collageItems[11].url}
                    alt={collageItems[11].projectLabel}
                    className="collage-img"
                    loading="lazy"
                  />
                  <div className="collage-overlay">
                    <span className="collage-label">{collageItems[11].projectLabel}</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoCollage;
