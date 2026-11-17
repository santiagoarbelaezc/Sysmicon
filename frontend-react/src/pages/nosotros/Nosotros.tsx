import React, { useEffect } from 'react';
import AOS from 'aos';
import { BRAND_CONFIG } from '../../core/app.constants';
import { DirectorShowcase } from '../../components/director-showcase/DirectorShowcase';
import './Nosotros.css';

export interface HistoriaNivel {
  id: string;
  numero: string;
  tag: string;
  titulo: string;
  texto: string;
  ubicacion: string;
  videoSrc?: string;
  imagenes: string[];
  tema: 'dark' | 'light';
  posicionClases: string;
  animacionAos: string;
  layoutTipo: 'video-left' | 'video-right' | 'video-center' | 'grid-asymmetric';
}

const HISTORIA_NIVELES: HistoriaNivel[] = [
  {
    id: 'nivel-01',
    numero: '01',
    tag: '01 // MATERIALIDAD & LUZ',
    titulo: 'CONCRETO, LUZ & PAISAJE',
    texto: 'Estructuras monolíticas concebidas a partir de la topografía del lote, donde la luz natural define el espacio y enaltece el entorno.',
    ubicacion: 'LLANOGRANDE • RESIDENCIA CASA M',
    videoSrc: 'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017834/sysmi-0_n3fxgd.mp4',
    imagenes: [
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439943/0bb0bfc3-d421-4b92-90ba-1bd3b1600bdf_pjfpj8.jpg',
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439941/e58a67a3-c6b1-48f9-8f07-c1e26511bab0_qfzwzo.jpg',
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439939/c43394b0-0473-41e9-80c5-62d17fc7f4cb_urtyhv.jpg',
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439937/bbcec1ca-0b24-40fc-b46a-acb7c676350a_kf7vfn.jpg'
    ],
    tema: 'dark',
    posicionClases: 'left-4 sm:left-10 lg:left-16 bottom-8 sm:bottom-12 lg:bottom-16',
    animacionAos: 'fade-right',
    layoutTipo: 'video-left'
  },
  {
    id: 'nivel-02',
    numero: '02',
    tag: '02 // INGENIERÍA CIVIL',
    titulo: 'VOLUMETRÍAS SUSPENDIDAS',
    texto: 'Voladizos panorámicos y cálculo estructural sismorresistente bajo norma NSR-10 que desafían la gravedad con absoluto rigor.',
    ubicacion: 'ENVIGADO • RESIDENCIA CASA S19',
    videoSrc: 'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017819/sysmi-1_mvv1wg.mp4',
    imagenes: [
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440068/DJI_20240427090700_0336_D_kstvtb.jpg',
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440076/dji_fly_20241221_104148_0591_1734879851956_photo_gmbz05.jpg',
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440075/DJI_20240527083954_0365_D_fpxe5f.jpg',
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440069/dji_fly_20241221_104006_0584_1734879871094_photo_v5cyrj.jpg'
    ],
    tema: 'light',
    posicionClases: 'right-4 sm:right-10 lg:right-16 bottom-8 sm:bottom-12 lg:bottom-16',
    animacionAos: 'fade-left',
    layoutTipo: 'video-right'
  },
  {
    id: 'nivel-03',
    numero: '03',
    tag: '03 // FLUIDEZ ESPACIAL',
    titulo: 'CERRAMIENTOS & MADERA',
    texto: 'Aperturas continuas hacia el bosque nativo mediante cancelería de gran formato y maderas nobles seleccionadas por su durabilidad.',
    ubicacion: 'EL RETIRO • RESIDENCIA CASA S23',
    videoSrc: 'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017752/sysmi-5_zakn8v.mp4',
    imagenes: [
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440109/243315d3-e0c8-4791-8f0a-b341587e1c70_eshvqt.jpg',
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440126/f3909659-36eb-40e5-9288-9667663de071_ajc48x.jpg',
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440125/efa7fc63-cff7-43b1-a674-e7dbc681e571_clgt0m.jpg',
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440122/ea5179e4-6a1a-4fc8-a4da-829c4592c314_t1a9il.jpg'
    ],
    tema: 'dark',
    posicionClases: 'left-4 sm:left-10 lg:left-16 bottom-8 sm:bottom-12 lg:bottom-16',
    animacionAos: 'fade-right',
    layoutTipo: 'video-left'
  },
  {
    id: 'nivel-04',
    numero: '04',
    tag: '04 // LLAVE EN MANO',
    titulo: 'CASA L & RIGOR DE AUTOR',
    texto: 'Diseño, ingeniería civil e interventoría técnica permanente bajo un mismo techo. Presupuesto blindado y fidelidad absoluta al diseño.',
    ubicacion: 'ALTO DE LAS PALMAS • RESIDENCIA CASA L',
    imagenes: [
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439869/0515c974-72ed-4747-a2b4-400fc4a61610_zz7mu0.jpg',
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439890/0f162d2a-e7d2-486c-b766-9ca67aaac26a_miymg5.jpg',
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439890/0c533cb5-672a-415b-9c14-67faf621322c_dbgg2b.jpg',
      'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439889/f1336b8f-9e01-4acd-a702-834368833f38_yiv1pp.jpg'
    ],
    tema: 'light',
    posicionClases: 'right-4 sm:right-10 lg:right-16 bottom-8 sm:bottom-12 lg:bottom-16',
    animacionAos: 'fade-left',
    layoutTipo: 'grid-asymmetric'
  }
];

const PILARES_METODOLOGIA = [
  {
    etapa: '01',
    tag: 'FASE CONCEPTUAL',
    titulo: 'Diseño de Autor',
    desc: 'Anteproyecto 3D a la medida y estudio bioclimático a partir del terreno.'
  },
  {
    etapa: '02',
    tag: 'INGENIERÍA CIVIL',
    titulo: 'Cálculo & Blindaje',
    desc: 'Estructura sismorresistente NSR-10 y presupuesto cerrado sin sobrecostos.'
  },
  {
    etapa: '03',
    tag: 'CONSTRUCCIÓN',
    titulo: 'Dirección Residente',
    desc: 'Supervisión técnica diaria en obra y reportes quincenales transparentes.'
  },
  {
    etapa: '04',
    tag: 'HABITABILIDAD',
    titulo: 'Llave en Mano',
    desc: 'Entrega impecable con sistemas testeados y 10 años de garantía estructural.'
  }
];

export const Nosotros: React.FC = () => {
  const brand = BRAND_CONFIG;
  void brand;

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        AOS.refresh();
      } catch {}
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="nosotros-page min-h-screen bg-white text-neutral-900 pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-14 font-sans selection:bg-neutral-900 selection:text-white w-full">
      {/* =====================================================
           1. ENCABEZADO DE HISTORIA (Con Padding Equilibrado)
           ===================================================== */}
      <header
        className="w-full max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-16 mb-8 sm:mb-12"
        data-aos="fade-up"
        data-aos-duration="850"
        data-aos-easing="ease-out-cubic"
      >
        <div className="inline-block mb-2">
          <span className="font-mono text-xs sm:text-sm tracking-[0.3em] text-neutral-600 font-bold uppercase">
            6 AÑOS DE TRAYECTORIA
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-neutral-900 font-bold tracking-tight uppercase leading-[1.02] mb-2">
          NUESTRA HISTORIA <span className="font-serif italic font-normal text-neutral-500">ARQUITECTÓNICA</span>
        </h1>

        <p className="font-sans text-lg sm:text-2xl text-neutral-600 font-light leading-relaxed max-w-5xl">
          Elevamos los estándares de la arquitectura residencial en el Oriente Antioqueño, combinando sensibilidad de autor con rigor constructivo, transparencia e ingeniería sismorresistente.
        </p>
      </header>

      {/* =====================================================
           2. NIVELES FOTOGRÁFICOS CONTINUOS CON COLLAGE & VIDEO
           ===================================================== */}
      <section className="story-section w-full bg-black text-white mb-0 pb-0 border-b border-neutral-900" id="historia-section">
        <div className="w-full flex flex-col p-0 m-0 space-y-0">
          {HISTORIA_NIVELES.map(nivel => (
            <div
              key={nivel.id}
              className="relative w-full h-[540px] sm:h-[640px] lg:h-[740px] bg-black overflow-hidden group border-b border-neutral-900 last:border-none"
            >
              {/* COLLAGE GRID ASIMÉTRICO (TIPO VIDEO-LEFT) */}
              {nivel.layoutTipo === 'video-left' && (
                <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 p-2 sm:p-3">
                  {/* Ranura 1: Gran Video / Fotografía Principal */}
                  <div className="md:col-span-7 h-[300px] md:h-full rounded-2xl overflow-hidden relative bg-black shadow-inner group/media">
                    {nivel.videoSrc ? (
                      <video
                        src={nivel.videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover filter brightness-[0.88] group-hover/media:brightness-95 transition-all duration-700"
                      ></video>
                    ) : (
                      nivel.imagenes[0] && (
                        <img
                          src={nivel.imagenes[0]}
                          alt={nivel.titulo}
                          className="w-full h-full object-cover filter brightness-[0.90] group-hover/media:scale-105 transition-all duration-700"
                        />
                      )
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none"></div>
                  </div>

                  {/* Ranura 2: Mosaico Secundario de 3 Fotos */}
                  <div className="md:col-span-5 flex flex-col gap-2 sm:gap-3 h-[240px] md:h-full">
                    <div className="flex-1 min-h-0 rounded-2xl overflow-hidden relative bg-neutral-900 shadow-sm group/media">
                      <img
                        src={nivel.imagenes[1]}
                        alt={nivel.titulo}
                        className="w-full h-full object-cover filter brightness-[0.88] group-hover/media:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                    </div>

                    <div className="flex-1 min-h-0 grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="h-full rounded-2xl overflow-hidden relative bg-neutral-900 shadow-sm group/media">
                        <img
                          src={nivel.imagenes[2]}
                          alt={nivel.titulo}
                          className="w-full h-full object-cover filter brightness-[0.88] group-hover/media:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                      </div>

                      <div className="h-full rounded-2xl overflow-hidden relative bg-neutral-900 shadow-sm group/media">
                        <img
                          src={nivel.imagenes[3] || nivel.imagenes[0]}
                          alt={nivel.titulo}
                          className="w-full h-full object-cover filter brightness-[0.88] group-hover/media:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* COLLAGE GRID ASIMÉTRICO (TIPO VIDEO-RIGHT) */}
              {nivel.layoutTipo === 'video-right' && (
                <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 p-2 sm:p-3">
                  {/* Ranura 1: Mosaico Secundario de 3 Fotos */}
                  <div className="md:col-span-5 flex flex-col gap-2 sm:gap-3 h-[240px] md:h-full order-2 md:order-1">
                    <div className="flex-1 min-h-0 rounded-2xl overflow-hidden relative bg-neutral-900 shadow-sm group/media">
                      <img
                        src={nivel.imagenes[1]}
                        alt={nivel.titulo}
                        className="w-full h-full object-cover filter brightness-[0.88] group-hover/media:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                    </div>

                    <div className="flex-1 min-h-0 grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="h-full rounded-2xl overflow-hidden relative bg-neutral-900 shadow-sm group/media">
                        <img
                          src={nivel.imagenes[2]}
                          alt={nivel.titulo}
                          className="w-full h-full object-cover filter brightness-[0.88] group-hover/media:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                      </div>

                      <div className="h-full rounded-2xl overflow-hidden relative bg-neutral-900 shadow-sm group/media">
                        <img
                          src={nivel.imagenes[3] || nivel.imagenes[0]}
                          alt={nivel.titulo}
                          className="w-full h-full object-cover filter brightness-[0.88] group-hover/media:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  {/* Ranura 2: Gran Video / Fotografía Principal */}
                  <div className="md:col-span-7 h-[300px] md:h-full rounded-2xl overflow-hidden relative bg-black shadow-inner group/media order-1 md:order-2">
                    {nivel.videoSrc ? (
                      <video
                        src={nivel.videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover filter brightness-[0.88] group-hover/media:brightness-95 transition-all duration-700"
                      ></video>
                    ) : (
                      nivel.imagenes[0] && (
                        <img
                          src={nivel.imagenes[0]}
                          alt={nivel.titulo}
                          className="w-full h-full object-cover filter brightness-[0.90] group-hover/media:scale-105 transition-all duration-700"
                        />
                      )
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none"></div>
                  </div>
                </div>
              )}

              {/* COLLAGE GRID ASIMÉTRICO (TIPO GRID ASYMMETRIC) */}
              {nivel.layoutTipo === 'grid-asymmetric' && (
                <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 p-2 sm:p-3">
                  {/* Foto Grande 1 */}
                  <div className="md:col-span-6 h-[260px] md:h-full rounded-2xl overflow-hidden relative bg-neutral-900 shadow-sm group/media">
                    <img
                      src={nivel.imagenes[0]}
                      alt={nivel.titulo}
                      className="w-full h-full object-cover filter brightness-[0.88] group-hover/media:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none"></div>
                  </div>

                  {/* Foto Vertical 2 */}
                  <div className="md:col-span-3 h-[220px] md:h-full rounded-2xl overflow-hidden relative bg-neutral-900 shadow-sm group/media">
                    <img
                      src={nivel.imagenes[1]}
                      alt={nivel.titulo}
                      className="w-full h-full object-cover filter brightness-[0.88] group-hover/media:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                  </div>

                  {/* Fotos 3 y 4 Apiladas */}
                  <div className="md:col-span-3 flex flex-col gap-2 sm:gap-3 h-[240px] md:h-full">
                    <div className="flex-1 min-h-0 rounded-2xl overflow-hidden relative bg-neutral-900 shadow-sm group/media">
                      <img
                        src={nivel.imagenes[2]}
                        alt={nivel.titulo}
                        className="w-full h-full object-cover filter brightness-[0.88] group-hover/media:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex-1 min-h-0 rounded-2xl overflow-hidden relative bg-neutral-900 shadow-sm group/media">
                      <img
                        src={nivel.imagenes[3] || nivel.imagenes[0]}
                        alt={nivel.titulo}
                        className="w-full h-full object-cover filter brightness-[0.88] group-hover/media:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CONTENEDOR FLOTANTE DE TEXTO ARQUITECTÓNICO */}
              <div
                className={`absolute p-8 sm:p-12 lg:p-14 rounded-2xl sm:rounded-3xl max-w-lg sm:max-w-2xl lg:max-w-3xl transition-transform duration-700 shadow-[0_30px_70px_rgba(0,0,0,0.55)] z-20 pointer-events-auto ${
                  nivel.posicionClases
                } ${
                  nivel.tema === 'dark'
                    ? 'bg-black/92 text-white border-2 border-white/25 backdrop-blur-2xl'
                    : 'bg-white/95 text-neutral-900 border-2 border-neutral-300 backdrop-blur-2xl'
                }`}
                data-aos={nivel.animacionAos}
                data-aos-duration="1000"
                data-aos-offset="100"
                data-aos-easing="ease-out-cubic"
              >
                <h2
                  className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold uppercase leading-[1.08] mb-3 sm:mb-4 ${
                    nivel.tema === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {nivel.titulo}
                </h2>

                <p
                  className={`font-sans text-base sm:text-xl lg:text-2xl font-light leading-relaxed m-0 ${
                    nivel.tema === 'dark' ? 'text-white/85' : 'text-neutral-700'
                  }`}
                >
                  {nivel.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
           3. METODOLOGÍA (Ciclo Constructivo Sysmicon)
           ===================================================== */}
      <div className="w-full max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-16 mt-10 sm:mt-14 lg:mt-16">
        <section className="methodology-section w-full mb-12 sm:mb-16 pb-12 sm:pb-16 border-b border-neutral-200/80">
          <div
            className="max-w-4xl mb-8 sm:mb-10 text-left space-y-2"
            data-aos="fade-up"
            data-aos-duration="850"
            data-aos-easing="ease-out-cubic"
          >
            <span className="font-mono text-xs tracking-[0.3em] text-neutral-600 font-semibold uppercase block">
              METODOLOGÍA // EL PROCESO SYSMICON
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-neutral-900 font-bold tracking-tight uppercase leading-[1.05]">
              EL CICLO CONSTRUCTIVO <span className="font-serif italic font-normal text-neutral-500">DE AUTOR</span>
            </h2>

            <p className="font-sans text-base sm:text-xl text-neutral-600 font-light leading-relaxed max-w-3xl pt-0.5">
              Nuestra metodología paso a paso para garantizar la excelencia desde la primera línea en el plano hasta el momento de habitar tu hogar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PILARES_METODOLOGIA.map((m, i) => (
              <div
                key={m.etapa}
                className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-neutral-50/60 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 flex flex-col justify-between group shadow-2xs cursor-default select-none"
                data-aos="fade-up"
                data-aos-delay={i * 100}
                data-aos-duration="850"
                data-aos-easing="ease-out-cubic"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-xs tracking-[0.2em] text-neutral-600 group-hover:text-emerald-400 font-bold uppercase">
                      ETAPA {m.etapa}
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-neutral-600 group-hover:text-neutral-400 font-semibold uppercase">
                      {m.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase leading-snug group-hover:text-white text-neutral-900">
                    {m.titulo}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-neutral-600 group-hover:text-neutral-300 font-light leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200/70 group-hover:border-neutral-800 transition-colors mt-5 flex items-center justify-between font-mono text-[10px] text-neutral-600 group-hover:text-neutral-400 uppercase font-semibold">
                  <span>SYS_STAGE // {m.etapa}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 group-hover:bg-emerald-400"></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
             4. DIRECTOR SHOWCASE COMPONENT
             ===================================================== */}
        <div className="w-full pb-4 sm:pb-6" data-aos="fade-up" data-aos-duration="900">
          <DirectorShowcase />
        </div>
      </div>
    </div>
  );
};

export default Nosotros;
