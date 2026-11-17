import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import AOS from 'aos';
import { CONTACT_INFO, BRAND_CONFIG } from '../../core/app.constants';
import { useCmsService } from '../../services/cms.service';
import { environment } from '../../core/env';
import { httpClient } from '../../core/apiClient';
import { DirectorShowcase } from '../../components/director-showcase/DirectorShowcase';
import './CotizaConNosotros.css';

export interface EtapaCotizacion {
  etapa: string;
  tag: string;
  titulo: string;
  desc: string;
  code: string;
}

export const CotizaConNosotros: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { config } = useCmsService();
  const apiUrl = environment.apiUrl;
  const contact = CONTACT_INFO;
  const brand = BRAND_CONFIG;

  const casaLVideoRef = useRef<HTMLVideoElement | null>(null);
  const sectionVideoRef = useRef<HTMLVideoElement | null>(null);

  const sectionVideo = 'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017819/sysmi-1_mvv1wg.mp4';
  const casaLVideo = 'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017752/sysmi-5_zakn8v.mp4';

  const [nombre, setNombre] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [servicioInteres, setServicioInteres] = useState<string>('Diseño y Construcción Integral');
  const [mensaje, setMensaje] = useState<string>('');

  const [cargando, setCargando] = useState<boolean>(false);
  const [enviado, setEnviado] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const proyectoParam = searchParams.get('proyecto');
    const servicioParam = searchParams.get('servicio');
    if (proyectoParam) {
      setMensaje(
        `Hola, estoy interesado/a en un proyecto arquitectónico con características similares a la obra "${proyectoParam}". Quisiera agendar una consulta técnica.`
      );
    }
    if (servicioParam) {
      setServicioInteres(servicioParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        AOS.refresh();
      } catch {}

      if (casaLVideoRef.current) {
        casaLVideoRef.current.muted = true;
        casaLVideoRef.current.play().catch(() => {});
      }
      if (sectionVideoRef.current) {
        sectionVideoRef.current.muted = true;
        sectionVideoRef.current.play().catch(() => {});
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const wa = (config.whatsapp_contacto || '573108459210').replace(/[^0-9]/g, '');
  const telText = telefono ? ` | Tel: ${telefono}` : '';
  const servText = servicioInteres ? ` | Interés: ${servicioInteres}` : '';
  const waText = `Hola Sysmicon, me gustaría cotizar mi proyecto arquitectónico. Mi nombre es ${
    nombre || 'un cliente interesado'
  }. Correo: ${correo}${telText}${servText}. ${mensaje ? 'Mensaje: ' + mensaje : ''}`;
  const whatsappUrl = `https://wa.me/${wa}?text=${encodeURIComponent(waText)}`;

  const scrollToCotizador = () => {
    if (typeof document !== 'undefined') {
      const el = document.getElementById('formulario-cotizacion');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const onSubmit = () => {
    if (!nombre || !correo) {
      setErrorMsg('Por favor completa tu nombre y correo electrónico.');
      return;
    }
    setCargando(true);
    setErrorMsg('');

    const payload = {
      nombre,
      email: correo,
      telefono,
      asunto: `Cotización: ${servicioInteres || 'Arquitectura Residencial'}`,
      mensaje: mensaje || 'Solicitud de asesoría y cotización arquitectónica personalizada',
      contenido: mensaje || 'Solicitud de asesoría y cotización arquitectónica personalizada',
      tipo_servicio: servicioInteres || 'Arquitectura Residencial / Obra Nueva'
    };

    httpClient.post(`${apiUrl}/cotizacion`, payload).subscribe({
      next: () => {
        setCargando(false);
        setEnviado(true);
      },
      error: () => {
        setCargando(false);
        setEnviado(true);
      }
    });
  };

  const enviarMensaje = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    onSubmit();
  };

  const nuevaConsulta = () => {
    setNombre('');
    setCorreo('');
    setTelefono('');
    setMensaje('');
    setEnviado(false);
    setErrorMsg('');
  };

  // Prevent unused warning while keeping fidelity
  void contact;
  void brand;

  return (
    <div className="cotiza-page min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white w-full">
      {/* ========================================================================
           1. HERO DE APERTURA CINEMÁTICO (INMERSIVO - SIN NAVBAR INICIAL)
           ======================================================================== */}
      <section className="hero-cotiza relative w-full h-[88vh] min-h-[600px] max-h-[900px] bg-black text-white flex flex-col justify-between overflow-hidden border-b border-neutral-900">
        {/* Video de fondo cinemático en loop con máscara de viñeta */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <video
            ref={casaLVideoRef}
            className="w-full h-full object-cover filter brightness-[0.45] contrast-[1.12] saturate-[1.05] scale-[1.02]"
            src={casaLVideo}
            autoPlay
            muted
            loop
            playsInline
          ></video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70 pointer-events-none"></div>
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90 pointer-events-none"></div>
        </div>

        {/* Guías y marcas de plano arquitectónico "+" */}
        <div className="absolute top-8 inset-x-8 sm:inset-x-14 flex justify-between pointer-events-none select-none z-10 text-white/30 font-mono text-xs">
          <span>+ SYS_STUDIO</span>
          <span>ESTUDIO DE COTIZACIÓN +</span>
        </div>

        {/* Contenedor central del Hero (Sin el texto 'COTIZACIÓN • ASESORÍA DE AUTOR') */}
        <div className="relative z-10 max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-16 pt-20 sm:pt-28 my-auto w-full">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-white font-bold tracking-tight uppercase leading-[1.02] mb-5 drop-shadow-2xl">
            {config.cotiza_title || 'HABLEMOS DE TU PRÓXIMO'}{' '}
            <span className="font-serif italic font-normal text-neutral-300">PROYECTO</span>
          </h1>

          <p className="font-sans text-lg sm:text-2xl text-white/85 font-light leading-relaxed max-w-3xl mb-8">
            {config.cotiza_subtitle ||
              'Diseño de autor, cálculo estructural sismorresistente NSR-10 y presupuesto blindado sin sobrecostos. Haz realidad tu visión arquitectónica.'}
          </p>

          {/* Botones de Acción Inmediata */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={scrollToCotizador}
              className="group inline-flex items-center justify-center gap-3.5 px-8 sm:px-10 py-4 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 transition-all duration-300 font-sans text-xs sm:text-sm font-bold tracking-[0.2em] uppercase shadow-2xl hover:scale-105 cursor-pointer whitespace-nowrap"
            >
              <span>INICIAR COTIZACIÓN</span>
              <svg
                className="w-4 h-4 shrink-0 transform group-hover:translate-y-0.5 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-4 rounded-full bg-white/[0.1] hover:bg-white/[0.2] text-white border border-white/25 hover:border-white/50 backdrop-blur-md transition-all duration-300 font-sans text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase whitespace-nowrap cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 1.636 6.015L.195 23.518l5.656-1.484A11.95 11.95 0 0 0 11.944 24C18.575 24 24 18.627 24 12S18.575 0 11.944 0zm5.457 14.52c-.299-.15-1.768-.872-2.042-.971-.274-.1-.474-.15-.674.15-.2.299-.774.971-.949 1.171-.174.2-.349.224-.648.075-.3-.15-1.263-.465-2.404-1.482-.888-.792-1.488-1.769-1.663-2.068-.175-.3-.018-.462.132-.611.135-.135.299-.35.449-.524.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.674-1.624-.924-2.224-.243-.585-.49-.505-.674-.515l-.574-.01c-.2 0-.524.075-.799.375-.274.3-1.048 1.024-1.048 2.497 0 1.474 1.073 2.898 1.223 3.098.15.2 2.112 3.223 5.116 4.522.715.309 1.274.494 1.708.632.718.228 1.371.196 1.889.119.578-.086 1.768-.723 2.017-1.422.249-.699.249-1.299.174-1.423-.075-.124-.274-.199-.574-.349z" />
              </svg>
              <span>WHATSAPP DIRECTO</span>
            </a>
          </div>
        </div>

        {/* Indicador de Scroll hacia el formulario (Centro Inferior) */}
        <div
          onClick={scrollToCotizador}
          className="relative z-10 flex flex-col items-center justify-center pb-6 cursor-pointer group select-none"
        >
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/70 group-hover:text-white transition-colors mb-2">
            DESLIZA PARA COTIZAR
          </span>
          <div className="w-5 h-9 rounded-full border border-white/30 flex justify-center p-1 group-hover:border-white transition-colors">
            <div className="w-1.5 h-2 rounded-full bg-white animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* ========================================================================
           2. SECCIÓN DE COTIZACIÓN MINIMALISTA (CON VIDEO DE FONDO Y SIN IMÁGENES)
           ======================================================================== */}
      <section
        className="cotizador-studio-section relative w-full bg-black text-white py-16 sm:py-24 border-b border-neutral-900 overflow-hidden"
        id="formulario-cotizacion"
      >
        {/* Video de Fondo Cinemático para la Sección de Formulario */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <video
            ref={sectionVideoRef}
            className="w-full h-full object-cover filter brightness-[0.32] contrast-[1.18] saturate-[1.1] scale-[1.02]"
            src={sectionVideo}
            autoPlay
            muted
            loop
            playsInline
          ></video>
          {/* Capa de oscurecimiento y viñeta sutil */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12">
          {/* Tarjeta Flotante Minimalista de Cristal (Aún más amplia) */}
          <div className="max-w-6xl xl:max-w-[1280px] mx-auto" data-aos="fade-up" data-aos-duration="950">
            <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-neutral-950/85 text-white border border-white/20 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)]">
              {/* Formulario Activo */}
              {!enviado ? (
                <form onSubmit={enviarMensaje} className="space-y-6 sm:space-y-7">
                  {/* GRID DE CAMPOS: 2 COLUMNAS EN TABLET/DESKTOP */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    {/* TU NOMBRE */}
                    <div className="space-y-2">
                      <label
                        htmlFor="cotiza-nombre"
                        className="block font-mono text-xs sm:text-[13px] tracking-[0.2em] text-neutral-300 uppercase font-semibold"
                      >
                        NOMBRE COMPLETO *
                      </label>
                      <input
                        type="text"
                        id="cotiza-nombre"
                        name="nombre"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        required
                        placeholder="Tu nombre completo"
                        className="w-full bg-white/[0.05] border border-white/20 rounded-2xl px-5 sm:px-6 py-4 sm:py-4.5 text-white placeholder-neutral-500 font-sans text-base sm:text-lg focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                      />
                    </div>

                    {/* CORREO ELECTRÓNICO */}
                    <div className="space-y-2">
                      <label
                        htmlFor="cotiza-correo"
                        className="block font-mono text-xs sm:text-[13px] tracking-[0.2em] text-neutral-300 uppercase font-semibold"
                      >
                        CORREO ELECTRÓNICO *
                      </label>
                      <input
                        type="email"
                        id="cotiza-correo"
                        name="correo"
                        value={correo}
                        onChange={e => setCorreo(e.target.value)}
                        required
                        placeholder="correo@ejemplo.com"
                        className="w-full bg-white/[0.05] border border-white/20 rounded-2xl px-5 sm:px-6 py-4 sm:py-4.5 text-white placeholder-neutral-500 font-sans text-base sm:text-lg focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                      />
                    </div>

                    {/* TELÉFONO / WHATSAPP */}
                    <div className="space-y-2">
                      <label
                        htmlFor="cotiza-telefono"
                        className="block font-mono text-xs sm:text-[13px] tracking-[0.2em] text-neutral-300 uppercase font-semibold"
                      >
                        TELÉFONO / WHATSAPP
                      </label>
                      <input
                        type="tel"
                        id="cotiza-telefono"
                        name="telefono"
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                        placeholder="+57 300 000 0000"
                        className="w-full bg-white/[0.05] border border-white/20 rounded-2xl px-5 sm:px-6 py-4 sm:py-4.5 text-white placeholder-neutral-500 font-sans text-base sm:text-lg focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                      />
                    </div>

                    {/* TIPO DE SERVICIO */}
                    <div className="space-y-2">
                      <label
                        htmlFor="cotiza-servicio"
                        className="block font-mono text-xs sm:text-[13px] tracking-[0.2em] text-neutral-300 uppercase font-semibold"
                      >
                        TIPO DE SERVICIO
                      </label>
                      <div className="relative">
                        <select
                          id="cotiza-servicio"
                          name="servicioInteres"
                          value={servicioInteres}
                          onChange={e => setServicioInteres(e.target.value)}
                          className="w-full appearance-none bg-neutral-900 border border-white/20 rounded-2xl px-5 sm:px-6 py-4 sm:py-4.5 pr-12 text-white font-sans text-base sm:text-lg focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all cursor-pointer"
                        >
                          <option value="Diseño y Construcción Integral">Diseño y Construcción Integral</option>
                          <option value="Diseño Arquitectónico de Autor">Diseño Arquitectónico (Planos & 3D)</option>
                          <option value="Construcción Llave en Mano">Construcción Integral Llave en Mano</option>
                          <option value="Cálculo Estructural & Sismorresistencia (NSR-10)">Cálculo Estructural (NSR-10)</option>
                          <option value="Consultoría de Lote & Viabilidad Técnica">Consultoría de Lote & Viabilidad</option>
                          <option value="Remodelación de Alta Gama">Remodelación de Alta Gama</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-neutral-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* DETALLES DEL PROYECTO (ANCHO COMPLETO) */}
                    <div className="space-y-2 md:col-span-2">
                      <label
                        htmlFor="cotiza-mensaje"
                        className="block font-mono text-xs sm:text-[13px] tracking-[0.2em] text-neutral-300 uppercase font-semibold"
                      >
                        DETALLES DEL PROYECTO
                      </label>
                      <textarea
                        id="cotiza-mensaje"
                        name="mensaje"
                        rows={5}
                        value={mensaje}
                        onChange={e => setMensaje(e.target.value)}
                        placeholder="Ubicación, área estimada en m², requerimientos o dudas específicas..."
                        className="w-full bg-white/[0.05] border border-white/20 rounded-2xl px-5 sm:px-6 py-4 sm:py-4.5 text-white placeholder-neutral-500 font-sans text-base sm:text-lg focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* Mensaje de Error */}
                  {errorMsg && (
                    <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-sm font-sans flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Botón de Envío */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={cargando}
                      className="group w-full py-5 sm:py-5.5 px-8 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 disabled:opacity-50 transition-all duration-300 font-sans text-sm sm:text-base font-bold tracking-[0.2em] uppercase shadow-2xl flex items-center justify-center gap-3 cursor-pointer"
                    >
                      {!cargando ? <span>ENVIAR SOLICITUD</span> : <span>PROCESANDO...</span>}
                      {!cargando && (
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* ESTADO DE ÉXITO (CONFIRMACIÓN) */
                <div className="py-10 px-6 rounded-2xl bg-white/[0.05] border border-white/20 text-center space-y-5">
                  <div className="w-14 h-14 rounded-full bg-white text-neutral-950 flex items-center justify-center mx-auto text-xl font-bold shadow-2xl">
                    ✓
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif text-2xl sm:text-3xl font-bold uppercase text-white">¡SOLICITUD ENVIADA!</h4>
                    <p className="text-neutral-300 text-sm font-sans max-w-md mx-auto leading-relaxed">
                      Hemos recibido tus datos. Un director de proyecto se comunicará contigo a la brevedad.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center pt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-sans text-xs font-bold tracking-wider uppercase transition-all shadow-lg hover:scale-105 cursor-pointer"
                    >
                      WHATSAPP INMEDIATO →
                    </a>
                    <button
                      onClick={nuevaConsulta}
                      className="px-6 py-3 rounded-full bg-white/[0.1] hover:bg-white/[0.2] border border-white/20 text-white text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      NUEVA CONSULTA
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Barra Directa con Botones Grandes (WhatsApp & Email) */}
            <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center gap-4 sm:gap-5">
              <span className="font-mono text-xs sm:text-[13px] tracking-[0.25em] text-neutral-400 uppercase font-semibold">
                O contáctanos directamente:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3.5 px-8 sm:px-10 py-4.5 sm:py-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-sans text-xs sm:text-sm font-bold tracking-[0.18em] uppercase shadow-[0_10px_35px_rgba(16,185,129,0.35)] hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 1.636 6.015L.195 23.518l5.656-1.484A11.95 11.95 0 0 0 11.944 24C18.575 24 24 18.627 24 12S18.575 0 11.944 0zm5.457 14.52c-.299-.15-1.768-.872-2.042-.971-.274-.1-.474-.15-.674.15-.2.299-.774.971-.949 1.171-.174.2-.349.224-.648.075-.3-.15-1.263-.465-2.404-1.482-.888-.792-1.488-1.769-1.663-2.068-.175-.3-.018-.462.132-.611.135-.135.299-.35.449-.524.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.674-1.624-.924-2.224-.243-.585-.49-.505-.674-.515l-.574-.01c-.2 0-.524.075-.799.375-.274.3-1.048 1.024-1.048 2.497 0 1.474 1.073 2.898 1.223 3.098.15.2 2.112 3.223 5.116 4.522.715.309 1.274.494 1.708.632.718.228 1.371.196 1.889.119.578-.086 1.768-.723 2.017-1.422.249-.699.249-1.299.174-1.423-.075-.124-.274-.199-.574-.349z" />
                  </svg>
                  <span>WHATSAPP DIRECTO</span>
                </a>

                <a
                  href={`mailto:${config.email_soporte || 'redes.sysmicon@gmail.com'}`}
                  className="group inline-flex items-center justify-center gap-3.5 px-8 sm:px-10 py-4.5 sm:py-5 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-white border border-white/25 hover:border-white/50 backdrop-blur-md font-sans text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-xl hover:scale-105 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 text-neutral-300 shrink-0 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{config.email_soporte || 'redes.sysmicon@gmail.com'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
           3. RESPALDO TÉCNICO ING. JUAN MORENO (DIRECTOR SHOWCASE)
           ======================================================================== */}
      <div className="w-full bg-white pt-10 sm:pt-14 pb-12 sm:pb-16">
        <div
          className="w-full max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-16"
          data-aos="fade-up"
          data-aos-duration="900"
        >
          <DirectorShowcase />
        </div>
      </div>
    </div>
  );
};

export default CotizaConNosotros;
