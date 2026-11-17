import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import { useProyectosService, optimizeCloudinary } from '../../services/proyectos.service';
import { Proyecto } from '../../models/proyecto.model';
import { BannerVideo } from '../../components/banner-video/BannerVideo';
import { PhotoCollage, CollageItem } from '../../components/photo-collage/PhotoCollage';
import './ProyectosPage.css';

export const ProyectosPage: React.FC = () => {
  const { proyectos: allProyectos } = useProyectosService();
  const navigate = useNavigate();

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todas');

  // 12 imágenes seleccionadas — 3 por proyecto — para el collage editorial
  const galleryItems: CollageItem[] = useMemo(() => [
    // Casa M — Interior, Exterior, Detalle
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439939/c43394b0-0473-41e9-80c5-62d17fc7f4cb_urtyhv.jpg', 1200), projectLabel: 'CASA M', projectId: 'casaM' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439934/297313dd-f03c-41f9-a599-66aa95bbe707_btpq79.jpg', 1200), projectLabel: 'CASA M', projectId: 'casaM' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439927/686baa17-10c8-4ac7-a3bf-74d1b4e0e3fb_uxs66r.jpg', 1200), projectLabel: 'CASA M', projectId: 'casaM' },
    // Casa S19 — Vista aérea, Voladizo, Interior
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440076/dji_fly_20241221_104148_0591_1734879851956_photo_gmbz05.jpg', 1200), projectLabel: 'CASA S19', projectId: 'casaS19' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440075/DJI_20240527083954_0365_D_fpxe5f.jpg', 1200), projectLabel: 'CASA S19', projectId: 'casaS19' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440052/20240624_154845_h2bf0e.jpg', 1200), projectLabel: 'CASA S19', projectId: 'casaS19' },
    // Casa S23 — Jardín, Interior fluido, Detalle materialidad
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440122/ea5179e4-6a1a-4fc8-a4da-829c4592c314_t1a9il.jpg', 1200), projectLabel: 'CASA S23', projectId: 'casaS23' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440109/243315d3-e0c8-4791-8f0a-b341587e1c70_eshvqt.jpg', 1200), projectLabel: 'CASA S23', projectId: 'casaS23' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440100/6df1340c-7691-4ed0-9d57-e8d0f2dc3566_upfx1e.jpg', 1200), projectLabel: 'CASA S23', projectId: 'casaS23' },
    // Casa L — Piscina reflectante, Concreto & madera, Fachada
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439880/b2a056c1-0a5b-4aee-ab44-d1f868266cd8_xuvvnz.jpg', 1200), projectLabel: 'CASA L', projectId: 'casaL' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439875/390124c1-e70a-4713-b438-ada6247d4363_adxqt1.jpg', 1200), projectLabel: 'CASA L', projectId: 'casaL' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439869/0515c974-72ed-4747-a2b4-400fc4a61610_zz7mu0.jpg', 1200), projectLabel: 'CASA L', projectId: 'casaL' },
  ], []);

  const proyectos = useMemo(() => {
    if (categoriaSeleccionada === 'Todas') {
      return allProyectos;
    }
    return allProyectos.filter(p => p.categoria === categoriaSeleccionada);
  }, [allProyectos, categoriaSeleccionada]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        try {
          AOS.refreshHard();
        } catch {}
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const setCategoria = (cat: string): void => {
    setCategoriaSeleccionada(cat);
  };

  const abrirDossier = (proyecto: Proyecto): void => {
    navigate(`/proyecto/${proyecto.id}`);
  };

  return (
    <div className="min-h-screen bg-[#000814] text-white pt-24 pb-32 relative overflow-hidden">
      {/* Ambient light */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-white/[0.03] blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] rounded-full bg-[#C2E1FF]/[0.04] blur-[160px] pointer-events-none"></div>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      ></div>

      {/* Encabezado de Sección Centrado & Limpio */}
      <header
        className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 mb-10 relative z-10"
        data-aos="fade-up"
        data-aos-duration="900"
        data-aos-easing="ease-out-cubic"
      >
        <div className="section-header text-center max-w-4xl mx-auto border-b border-white/10 pb-8">
          <h1 className="title-lg font-serif text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase">
            DOSSIER DE PROYECTOS
          </h1>
        </div>
      </header>

      {/* Grilla Tipo Catálogo Ampliada de Máximo Ancho y Altura */}
      <main className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-6">
          {proyectos.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => abrirDossier(p)}
              className="group flex flex-col cursor-pointer"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
              data-aos-delay={idx * 120}
            >
              {/* Contenedor Poster Ampliado y Más Alto (Aspect Ratio 3:4.5) */}
              <div className="aspect-[3/4.5] relative overflow-hidden rounded-2xl bg-[#242424] shadow-2xl border border-white/15 group-hover:border-[#C2E1FF]/60 transition-all duration-500 min-h-[540px] lg:min-h-[640px] xl:min-h-[700px] w-full">
                {/* Background Photo con sutil Zoom */}
                <img
                  src={p.imagenUrl}
                  alt={p.titulo}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                />

                {/* Gradientes y sombras */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none"></div>

                {/* ESTILO 1: CORAL TITLE */}
                {(p.editorialStyle === 'coral-title' || !p.editorialStyle) && (
                  <>
                    <div className="absolute top-5 right-4 text-[9px] font-mono tracking-[0.3em] text-white/50 uppercase origin-top-right rotate-90 select-none">
                      {p.barcode || '0 600229402 1'} |||||
                    </div>

                    <div className="absolute bottom-[26%] left-6 right-6 flex flex-col items-start z-10">
                      <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#C2E1FF] uppercase leading-none drop-shadow-lg group-hover:translate-x-1 transition-transform duration-300">
                        {p.editorialTitle || p.titulo}
                      </h3>
                    </div>

                    {/* 3 miniaturas horizontales en la franja inferior */}
                    <div className="absolute inset-x-4 bottom-4 h-[22%] grid grid-cols-3 gap-2 z-20 rounded-xl overflow-hidden border border-white/20 bg-black/60 p-1.5 backdrop-blur-xs">
                      {(p.imagenesAdicionales || [p.imagenUrl]).slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${p.titulo} thumb ${i}`}
                          className="w-full h-full object-cover rounded-sm filter brightness-90 hover:brightness-110 transition-all"
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* ESTILO 2: WHITE BOLD VERTICAL */}
                {p.editorialStyle === 'white-bold' && (
                  <>
                    <div className="absolute right-6 top-12 bottom-20 z-10 flex items-center justify-center [writing-mode:vertical-rl] rotate-180">
                      <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-[0.2em] drop-shadow-2xl group-hover:scale-105 transition-transform duration-500">
                        {p.editorialTitle || p.titulo}
                      </h3>
                    </div>

                    {/* 3 miniaturas apiladas verticalmente en la izquierda */}
                    <div className="absolute left-4 top-10 bottom-10 w-24 flex flex-col gap-2 z-20 rounded-xl overflow-hidden border border-white/20 bg-black/60 p-1.5 backdrop-blur-xs">
                      {(p.imagenesAdicionales || [p.imagenUrl]).slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${p.titulo} thumb ${i}`}
                          className="w-full h-1/3 object-cover rounded-sm filter brightness-90 hover:brightness-110 transition-all"
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* ESTILO 3: RIBBON TAG */}
                {p.editorialStyle === 'ribbon-tag' && (
                  <>
                    <div className="absolute top-0 left-6 z-20">
                      <span className="inline-block bg-[#C2E1FF] text-[#000814] font-sans font-extrabold text-xs px-4 py-2.5 uppercase tracking-widest shadow-xl">
                        {p.editorialBadge || '+ DESTACADO'}
                      </span>
                    </div>

                    <div className="absolute top-[26%] left-6 z-10 right-8">
                      <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wide drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] group-hover:translate-x-1 transition-transform mb-2">
                        {p.editorialTitle || p.titulo}
                      </h3>
                    </div>

                    {/* 3 fotos en cuadrícula asimétrica */}
                    <div className="absolute inset-x-4 bottom-4 h-[24%] grid grid-cols-12 gap-2 z-20 rounded-xl overflow-hidden border border-white/20 bg-black/60 p-1.5 backdrop-blur-xs">
                      <div className="col-span-6 h-full">
                        <img
                          src={(p.imagenesAdicionales || [p.imagenUrl])[0]}
                          alt={`${p.titulo} 0`}
                          className="w-full h-full object-cover rounded-sm filter brightness-90 hover:brightness-110 transition-all"
                        />
                      </div>
                      <div className="col-span-3 h-full">
                        <img
                          src={(p.imagenesAdicionales || [p.imagenUrl])[1] || (p.imagenesAdicionales || [p.imagenUrl])[0]}
                          alt={`${p.titulo} 1`}
                          className="w-full h-full object-cover rounded-sm filter brightness-90 hover:brightness-110 transition-all"
                        />
                      </div>
                      <div className="col-span-3 h-full">
                        <img
                          src={(p.imagenesAdicionales || [p.imagenUrl])[2] || (p.imagenesAdicionales || [p.imagenUrl])[0]}
                          alt={`${p.titulo} 2`}
                          className="w-full h-full object-cover rounded-sm filter brightness-90 hover:brightness-110 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ESTILO 4: SPLIT GRID */}
                {p.editorialStyle === 'split-grid' && (
                  <>
                    <div className="absolute top-6 left-6 z-10">
                      <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase leading-[0.92] tracking-tight drop-shadow-xl">
                        {p.editorialTitle || p.titulo}
                      </h3>
                    </div>

                    <div className="absolute top-8 right-4 origin-top-right rotate-90 text-[9px] font-mono tracking-[0.28em] text-white/60 uppercase select-none">
                      {p.editorialSlogan || 'MEDELLÍN ES COLOR LADRILLO.'}
                    </div>

                    {/* 3 fotos en rejilla uniforme horizontal */}
                    <div className="absolute inset-x-4 bottom-4 h-[22%] grid grid-cols-3 gap-2 z-20 rounded-xl overflow-hidden border border-white/20 bg-black/60 p-1.5 backdrop-blur-xs">
                      {(p.imagenesAdicionales || [p.imagenUrl]).slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${p.titulo} thumb ${i}`}
                          className="w-full h-full object-cover rounded-sm filter brightness-90 hover:brightness-110 transition-all"
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Badge flotante superior derecho con código editorial */}
                <div className="absolute top-4 left-4 text-[10px] font-mono text-white/40 tracking-wider">
                  #{p.id.toUpperCase()}
                </div>
              </div>

              {/* SOLO EL BOTÓN 'CONOCE MÁS' DEBAJO DE LA TARJETA */}
              <div className="mt-4 flex items-center justify-start px-1">
                <div className="inline-flex items-center gap-2 text-[#C2E1FF] group-hover:text-white font-sans text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-colors">
                  <span>CONOCE MÁS</span>
                  <span className="text-base font-black group-hover:translate-x-1 transition-transform">+</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Si no hay proyectos con el filtro */}
        {proyectos.length === 0 && (
          <div className="py-20 text-center border border-white/10 rounded-2xl bg-white/[0.02]">
            <p className="text-gray-400 font-serif text-xl">
              No se encontraron proyectos en la categoría «{categoriaSeleccionada}»
            </p>
            <button
              onClick={() => setCategoria('Todas')}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#C2E1FF] text-[#000814] font-bold text-xs uppercase tracking-widest"
            >
              Ver Todos los Proyectos
            </button>
          </div>
        )}
      </main>

      {/* GALERÍA COLLAGE EDITORIAL (Debajo de los Pósters) */}
      <PhotoCollage collageItems={galleryItems} />

      {/* SECCIÓN INFERIOR EDITORIAL: BANNERS VIDEO CASA M & CASA L CON BANNER DE CONTACTO EN EL MEDIO */}
      <section className="w-full mt-24 space-y-20 relative z-10">
        {/* 1. Banner Video Casa M */}
        <BannerVideo
          videoSrc="https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017819/sysmi-1_mvv1wg.mp4"
          titulo="CASA"
          tituloHighlight="M"
          subtitulo="Residencia contemporánea donde la arquitectura de autor y la materialidad convergen en perfecta simetría."
          proyectoId="casaM"
          ctaText="VER PROYECTO"
          secondaryCtaText="VER DOSSIER COMPLETO"
        />

        {/* 2. Banner de Contacto Intermedio Rediseñado & Ampliado */}
        <section className="relative w-full py-20 sm:py-28 lg:py-32 bg-white text-neutral-900 overflow-hidden font-sans my-12 shadow-sm border-y border-neutral-200/80">
          <div className="max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-16">
              {/* Textos Principales con AOS en Cascada */}
              <div className="max-w-4xl space-y-4 text-left">
                <span
                  data-aos="fade-up"
                  data-aos-duration="800"
                  data-aos-easing="ease-out-cubic"
                  className="font-mono text-xs tracking-[0.3em] text-neutral-400 font-semibold uppercase block"
                >
                  ASESORÍA ARQUITECTÓNICA & PREVENTA
                </span>

                <h3
                  data-aos="fade-up"
                  data-aos-duration="900"
                  data-aos-delay="100"
                  data-aos-easing="ease-out-cubic"
                  className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-neutral-900 font-bold leading-[1.08] tracking-tight uppercase"
                >
                  ¿Tienes un terreno o un <span className="font-serif italic font-normal text-neutral-500">sueño en mente?</span>
                </h3>

                <p
                  data-aos="fade-up"
                  data-aos-duration="900"
                  data-aos-delay="200"
                  data-aos-easing="ease-out-cubic"
                  className="font-sans text-lg sm:text-xl md:text-2xl text-neutral-600 leading-relaxed font-light max-w-3xl pt-1"
                >
                  Nuestros arquitectos e ingenieros están listos para asesorarte. Agenda una consulta de viabilidad técnica y presupuestal sin costo.
                </p>
              </div>

              {/* Botones Ampliados con Animación AOS */}
              <div
                data-aos="fade-left"
                data-aos-duration="1000"
                data-aos-delay="300"
                data-aos-easing="ease-out-cubic"
                className="flex flex-wrap items-center gap-4 sm:gap-5 shrink-0 pt-2 lg:pt-0"
              >
                <Link
                  to="/cotiza-con-nosotros"
                  className="inline-flex items-center gap-3.5 px-10 py-5 rounded-full bg-black text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-neutral-800 hover:scale-105 transition-all duration-300 shadow-xl group/btn cursor-pointer whitespace-nowrap"
                >
                  <span>Agendar Cita</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover/btn:translate-x-1.5 transition-transform"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>

                <a
                  href="tel:+573108459210"
                  className="inline-flex items-center gap-3.5 px-9 py-5 rounded-full bg-transparent hover:bg-black text-neutral-900 hover:text-white border-2 border-neutral-300 hover:border-black font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-xs hover:scale-105 whitespace-nowrap"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>+57 (310) 845-9210</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Banner Video Casa L */}
        <div data-aos="fade-up" data-aos-duration="1000">
          <BannerVideo
            videoSrc="https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017752/sysmi-5_zakn8v.mp4"
            titulo="CASA"
            tituloHighlight="L"
            subtitulo="Villa campestre de alto standing con grandes superficies vidriadas y materialidad noble en perfecta armonía con el entorno."
            proyectoId="casaL"
            ctaText="VER PROYECTO"
            secondaryCtaText="VER DOSSIER COMPLETO"
          />
        </div>
      </section>
    </div>
  );
};

export default ProyectosPage;
