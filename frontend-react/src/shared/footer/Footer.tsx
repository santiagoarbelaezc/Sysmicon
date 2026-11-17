import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BRAND_CONFIG, CONTACT_INFO, NAV_LINKS, LEGAL_LINKS } from '../../core/app.constants';
import { useCookieConsentService } from '../../services/cookie-consent.service';
import { useCmsService } from '../../services/cms.service';
import './Footer.css';

export const Footer: React.FC = () => {
  const cmsService = useCmsService();
  const brand = BRAND_CONFIG;
  const contact = CONTACT_INFO;
  const navLinks = NAV_LINKS;
  const legalLinks = LEGAL_LINKS;
  const cookieService = useCookieConsentService();
  const location = useLocation();

  const isCotizaPage = location.pathname.includes('cotiza');

  const openCookieModal = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    cookieService.openModal();
  };

  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const subscribeNewsletter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setIsSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer className="footer-host relative bg-white text-neutral-900 border-t border-black/20 overflow-hidden font-sans pt-16 sm:pt-20 lg:pt-24 pb-10">
      {/* Líneas superiores e inferiores principales de plano arquitectónico (Estilo Login) */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-black/40 to-transparent"></div>

      {/* Guías laterales verticales de extremo a extremo con crucetas "+" */}
      <div className="absolute left-6 md:left-10 top-8 bottom-8 hidden lg:flex flex-col justify-between items-center pointer-events-none select-none z-20">
        <span className="text-black/40 font-mono text-xs font-bold">+</span>
        <div className="w-[1px] flex-1 bg-gradient-to-b from-transparent via-black/20 to-transparent my-6"></div>
        <span className="text-black/40 font-mono text-xs font-bold">+</span>
      </div>
      <div className="absolute right-6 md:right-10 top-8 bottom-8 hidden lg:flex flex-col justify-between items-center pointer-events-none select-none z-20">
        <span className="text-black/40 font-mono text-xs font-bold">+</span>
        <div className="w-[1px] flex-1 bg-gradient-to-b from-transparent via-black/20 to-transparent my-6"></div>
        <span className="text-black/40 font-mono text-xs font-bold">+</span>
      </div>

      <div className="max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
        {/* TOP CTA BANNER VIP DE ALTA ELEGANCIA MEJORADO (OCULTO EN PÁGINA COTIZA) */}
        {!isCotizaPage && (
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-neutral-50 via-white to-neutral-50 border border-black/20 hover:border-black/50 shadow-lg p-8 sm:p-12 lg:p-16 mb-16 lg:mb-20 transition-all duration-500 group">
            {/* Líneas de acento top/bottom internas del banner */}
            <div className="absolute top-0 inset-x-8 h-[1px] bg-black/15"></div>
            <div className="absolute bottom-0 inset-x-8 h-[1px] bg-black/15"></div>
            <div className="absolute left-6 top-4 text-black/30 font-mono text-[10px] select-none pointer-events-none tracking-widest">+ PROYECTO 01</div>
            <div className="absolute right-6 top-4 text-black/30 font-mono text-[10px] select-none pointer-events-none tracking-widest">+ ESTUDIO 02</div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12 relative z-10">
              <div className="max-w-3xl space-y-4">
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 font-normal leading-tight tracking-tight">
                  ¿Listo para materializar la residencia de tus sueños?
                </h3>

                <p className="font-sans text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-2xl">
                  Inicia hoy el diseño arquitectónico de alto nivel con presupuesto optimizado, visualización hiperrealista y ejecución llave en mano.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  to="/cotiza-con-nosotros"
                  className="inline-flex items-center gap-3.5 px-9 py-4 sm:py-5 rounded-full bg-black text-white font-extrabold text-xs uppercase tracking-widest hover:bg-neutral-800 hover:scale-105 transition-all duration-300 shadow-xl group/btn"
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
                    className="group-hover/btn:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* LÍNEA DIVISORA ARQUITECTÓNICA CON GUÍAS PUNTEADAS */}
        <div className="relative w-full my-6 flex items-center justify-between">
          <span className="text-black/30 font-mono text-xs">+ GRID 01</span>
          <div className="flex-1 h-[1px] border-b border-dashed border-black/25 mx-4"></div>
          <span className="text-black/30 font-mono text-xs">+ GRID 02</span>
        </div>

        {/* MAIN FOOTER GRID EXPANDIDO A TODO LO ANCHO CON SEPARADORES VERTICALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-10 xl:gap-14 py-12 border-y border-black/20 relative">
          {/* COLUMNA 1: MARCA CON LOGO HERO BLANCO Y NEGRO (Cols 1-4) */}
          <div className="lg:col-span-4 space-y-6 lg:pr-6 relative">
            {/* Separador vertical derecha para desktop */}
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-black/15 to-transparent"></div>

            <Link to="/" className="group flex items-center gap-3.5 w-fit">
              <img
                src="assets/icons/logo-hero-blanconegro.png"
                alt="Sysmicon Logo"
                className="h-20 sm:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed font-normal max-w-md">
              {brand.description}
            </p>

            {/* Redes Sociales */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Sysmicon"
                className="w-12 h-12 rounded-2xl bg-neutral-100 border border-black/20 hover:border-black hover:bg-black hover:text-white flex items-center justify-center text-neutral-800 transition-all duration-300 group/soc"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover/soc:scale-110 transition-transform"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de Sysmicon"
                className="w-12 h-12 rounded-2xl bg-neutral-100 border border-black/20 hover:border-black hover:bg-black hover:text-white flex items-center justify-center text-neutral-800 transition-all duration-300 group/soc"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Sysmicon"
                className="w-12 h-12 rounded-2xl bg-neutral-100 border border-black/20 hover:border-black hover:bg-black hover:text-white flex items-center justify-center text-neutral-800 transition-all duration-300 group/soc"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN (Cols 5-6) */}
          <div className="lg:col-span-2 space-y-5 lg:px-3 relative">
            {/* Separador vertical derecha para desktop */}
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-black/15 to-transparent"></div>

            <h4 className="font-serif text-lg font-bold uppercase tracking-[0.16em] text-neutral-900 relative pb-3 flex items-center justify-between">
              <span>Navegación</span>
              <span className="font-mono text-xs text-black/40 font-semibold">+01</span>
            </h4>
            <div className="w-full h-[1px] bg-black"></div>

            <ul className="space-y-4 pt-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-neutral-700 hover:text-black text-base font-medium flex items-center gap-2.5 group/link transition-all duration-300"
                  >
                    <span className="w-2 h-2 rounded-full bg-black opacity-0 group-hover/link:opacity-100 transition-opacity"></span>
                    <span className="group-hover/link:translate-x-1.5 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/cotiza-con-nosotros"
                  className="text-black font-bold text-base flex items-center gap-2 group/link transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
                  <span className="group-hover/link:translate-x-1.5 transition-transform">Cotización Privada</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: CONTACTO DIRECTO (Cols 7-9) */}
          <div className="lg:col-span-3 space-y-5 lg:px-4 relative">
            {/* Separador vertical derecha para desktop */}
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-black/15 to-transparent"></div>

            <h4 className="font-serif text-lg font-bold uppercase tracking-[0.16em] text-neutral-900 relative pb-3 flex items-center justify-between">
              <span>Contacto Directo</span>
              <span className="font-mono text-xs text-black/40 font-semibold">+02</span>
            </h4>
            <div className="w-full h-[1px] bg-black"></div>

            <ul className="space-y-4 pt-2">
              <li className="group flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-black/20 flex items-center justify-center shrink-0 text-black mt-0.5 group-hover:bg-black group-hover:text-white transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="text-neutral-700 text-sm sm:text-base leading-relaxed pt-1 group-hover:text-black transition-colors">
                  {cmsService.config.direccion_oficina || contact.address}
                </span>
              </li>

              <li className="group flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-black/20 flex items-center justify-center shrink-0 text-black group-hover:bg-black group-hover:text-white transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <a
                  href={`tel:${cmsService.config.telefono_contacto || contact.phone}`}
                  className="text-neutral-700 text-sm sm:text-base font-medium group-hover:text-black transition-colors"
                >
                  {cmsService.config.telefono_contacto || contact.phone}
                </a>
              </li>

              <li className="group flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-black/20 flex items-center justify-center shrink-0 text-black group-hover:bg-black group-hover:text-white transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <a
                  href={`mailto:${cmsService.config.email_soporte || contact.email}`}
                  className="text-neutral-700 text-sm sm:text-base group-hover:text-black transition-colors"
                >
                  {cmsService.config.email_soporte || contact.email}
                </a>
              </li>

              <li className="group flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-black/20 flex items-center justify-center shrink-0 text-black group-hover:bg-black group-hover:text-white transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-700 text-sm sm:text-base group-hover:text-black transition-colors"
                >
                  {cmsService.config.instagram_handle || contact.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: JOURNAL & NEWSLETTER (Cols 10-12) */}
          <div className="lg:col-span-3 space-y-5 lg:pl-4">
            <h4 className="font-serif text-lg font-bold uppercase tracking-[0.16em] text-neutral-900 relative pb-3 flex items-center justify-between">
              <span>Journal</span>
              <span className="font-mono text-xs text-black/40 font-semibold">+03</span>
            </h4>
            <div className="w-full h-[1px] bg-black"></div>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal pt-2">
              Suscríbete para recibir avances de obra y arquitectura contemporánea.
            </p>

            {!isSubscribed ? (
              <form className="mt-4" onSubmit={subscribeNewsletter}>
                <div className="relative flex items-center rounded-full bg-neutral-100 border border-black/20 focus-within:border-black transition-all duration-300 p-1.5 shadow-inner">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    name="email"
                    placeholder="Correo electrónico"
                    required
                    className="w-full bg-transparent px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none font-sans"
                  />
                  <button
                    type="submit"
                    className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black text-white transition-all duration-300 hover:bg-neutral-800 cursor-pointer"
                    aria-label="Suscribirse"
                  >
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
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-4 p-4 rounded-2xl bg-black/5 border border-black/15 text-neutral-900 text-sm flex items-center gap-2.5 font-sans">
                <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping shrink-0"></span>
                <span>✓ ¡Suscrito con éxito!</span>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & LEGAL LINKS DE ANCHO COMPLETO CON DIVISOR */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-sm text-neutral-600 gap-4">
          <div className="font-normal flex items-center gap-3">
            <span className="font-mono text-black/40 text-xs font-semibold">+ COPYRIGHT</span>
            <span className="text-sm">
              &copy; {currentYear} <strong className="text-neutral-900 font-semibold">{brand.name} S.A.S.</strong> Todos los derechos reservados.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs sm:text-sm">
            {legalLinks.map((leg) => (
              <Link
                key={leg.fragment}
                to={`${leg.path}#${leg.fragment}`}
                className="hover:text-black font-medium transition-colors uppercase tracking-wider"
              >
                {leg.label}
              </Link>
            ))}
            <a
              href="#"
              onClick={openCookieModal}
              className="hover:text-black font-semibold transition-colors uppercase tracking-wider text-black cursor-pointer"
            >
              Configuración de Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
