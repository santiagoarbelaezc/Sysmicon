import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BRAND_CONFIG, NAV_LINKS } from '../../core/app.constants';
import { useAuthService } from '../../services/auth.service';
import { usePwaService } from '../../services/pwa.service';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const authService = useAuthService();
  const pwaService = usePwaService();
  const location = useLocation();
  const navigate = useNavigate();

  const brandName = BRAND_CONFIG.name;
  const navLinks = NAV_LINKS;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isHoveredTop, setIsHoveredTop] = useState<boolean>(false);
  const [isInsideNosotrosSection, setIsInsideNosotrosSection] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<'ES' | 'EN'>('ES');

  const checkScroll = useCallback(() => {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    setIsScrolled(scrollOffset > 40);

    if (typeof document !== 'undefined') {
      const nosotrosEl = document.getElementById('nosotros-section');
      if (nosotrosEl) {
        const rect = nosotrosEl.getBoundingClientRect();
        const active = rect.top <= 120 && rect.bottom >= 120;
        setIsInsideNosotrosSection(active);
      } else {
        setIsInsideNosotrosSection(false);
      }
    }
  }, []);

  useEffect(() => {
    checkScroll();
  }, [location.pathname, checkScroll]);

  useEffect(() => {
    const handleScroll = () => {
      checkScroll();
    };
    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientY <= 75) {
        setIsHoveredTop(true);
      } else if (event.clientY > 110) {
        setIsHoveredTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [checkScroll]);

  const isNavbarVisible = (() => {
    if (isMobileMenuOpen) return true;

    if (isInsideNosotrosSection && !isHoveredTop) {
      return false;
    }

    const currentUrl = location.pathname.split('?')[0];
    const isHeroOrCotiza = currentUrl === '/' || currentUrl === '' || currentUrl === '/cotiza-con-nosotros';
    if (!isHeroOrCotiza) return true;

    return isScrolled || isHoveredTop;
  })();

  const onMouseEnterHeader = () => {
    setIsHoveredTop(true);
  };

  const onMouseLeaveHeader = () => {
    if (!isScrolled) {
      setIsHoveredTop(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => {
      const next = !prev;
      if (next) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return next;
    });
  };

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  const abrirGuiaPwa = () => {
    closeMobileMenu();
    pwaService.openInstallModal();
  };

  const onNavLinkClick = (_link: { label: string; path: string }) => {
    closeMobileMenu();
  };

  void currentLang;
  void setCurrentLang;

  const user = authService.currentUser;

  return (
    <div className="navbar-host">
      <header
        className={`navbar always-white-scrolled ${!isNavbarVisible ? 'navbar-hidden' : 'navbar-visible'}`}
        onMouseEnter={onMouseEnterHeader}
        onMouseLeave={onMouseLeaveHeader}
      >
        <div className="w-full max-w-[1800px] mx-auto px-6 md:px-14 navbar-container flex items-center justify-between">
          {/* Logo Elegante con Tamaño Equilibrado */}
          <Link to="/" className="navbar-logo group flex items-center gap-3 z-[1001]" onClick={closeMobileMenu}>
            <img
              src="assets/icons/logo-sysmico-navbar.png"
              alt="Sysmicon"
              className="w-9 h-9 md:w-10 md:h-10 object-contain transition-transform duration-500 group-hover:scale-105"
            />
            <span className="logo-text font-serif tracking-[0.2em] text-lg md:text-xl font-medium uppercase">
              {brandName}
            </span>
          </Link>

          {/* Desktop Nav Links (Tamaño Equilibrado) */}
          <nav className="desktop-nav">
            <ul className="nav-list flex items-center gap-8 lg:gap-11">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => onNavLinkClick(link)}
                    className={({ isActive }) =>
                      `nav-link font-sans text-xs md:text-[13.5px] tracking-[0.16em] uppercase font-medium ${isActive ? 'active' : ''}`
                    }
                  >
                    <span>{link.label}</span>
                    <span className="link-underline"></span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Right Actions (Acciones Equilibradas) */}
          <div className="desktop-actions flex items-center gap-5">
            {/* Auth Links / User Profile */}
            <div className="auth-links flex items-center gap-5 font-sans">
              {!authService.isLoggedIn && (
                <Link
                  to="/login"
                  className="auth-link-ingresar text-xs md:text-[13.5px] uppercase tracking-[0.16em] transition-colors py-1 font-medium"
                >
                  Ingresar
                </Link>
              )}

              {user && (
                <Link
                  to="/admin"
                  title="Ir al Portal Admin"
                  className="auth-btn-admin flex items-center gap-2 px-3.5 py-1 rounded-full border shadow-sm transition-all cursor-pointer"
                >
                  <span className="auth-user-avatar w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center">
                    {user.nombre.charAt(0)}
                  </span>
                  <span className="auth-user-name font-sans text-xs tracking-wider truncate max-w-[110px]">
                    {user.nombre}
                  </span>
                  <span className="auth-user-badge text-[9px] font-mono tracking-widest px-2 py-0.5 rounded uppercase">
                    ADMIN
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      authService.logout(navigate);
                    }}
                    title="Cerrar sesión"
                    className="auth-logout-btn font-bold ml-1 transition-colors cursor-pointer relative z-10 text-xs"
                  >
                    ✕
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Trigger */}
          <button
            className={`mobile-toggle flex flex-col justify-between w-8 h-[20px] z-[1001] ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Abrir menú de navegación"
          >
            <span className="bar bar-1"></span>
            <span className="bar bar-2"></span>
            <span className="bar bar-3"></span>
          </button>
        </div>

        {/* Fullscreen Mobile Menu Overlay (Sobrio y de Alta Joyería Arquitectónica) */}
        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-content">
            <ul className="mobile-nav-list">
              {navLinks.map((link, i) => (
                <li key={link.path} style={{ transitionDelay: `${i * 90}ms` }}>
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => onNavLinkClick(link)}
                    className={({ isActive }) =>
                      `mobile-nav-link font-serif text-3xl font-light uppercase tracking-[0.15em] ${isActive ? 'active' : ''}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mobile-menu-footer">
              {/* Mobile Auth */}
              <div className="flex flex-col items-center justify-center gap-4 my-4 font-sans text-base w-full max-w-xs">
                {!authService.isLoggedIn && (
                  <div className="flex items-center justify-center w-full">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="px-8 py-3 rounded-full border border-white/25 bg-white/[0.06] hover:bg-white hover:text-black text-white font-sans text-xs font-semibold tracking-[0.22em] uppercase transition-all"
                    >
                      Ingresar
                    </Link>
                  </div>
                )}

                {/* Botón Guia Instalar PWA */}
                <button
                  onClick={abrirGuiaPwa}
                  className="w-full py-3.5 px-6 rounded-full bg-[#C2E1FF]/10 hover:bg-[#C2E1FF] text-white hover:text-[#000814] border border-[#C2E1FF]/40 font-mono text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg mt-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>INSTALAR APP MÓVIL</span>
                </button>

                {user && (
                  <div className="flex flex-col gap-3 bg-[#000814] px-5 py-4 rounded-2xl border border-[#C2E1FF]/30 w-full shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-[#C2E1FF] text-[#000814] font-bold text-xs flex items-center justify-center">
                          {user.nombre.charAt(0)}
                        </span>
                        <span className="font-sans text-xs tracking-wider text-white truncate max-w-[130px]">
                          {user.nombre}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          authService.logout(navigate);
                          closeMobileMenu();
                        }}
                        className="text-[10px] bg-red-950/60 text-red-300 border border-red-800/40 px-2.5 py-1 rounded-md uppercase tracking-wider"
                      >
                        Salir
                      </button>
                    </div>
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="w-full text-center py-2 rounded-xl bg-[#C2E1FF] text-[#000814] font-semibold text-xs tracking-[0.18em] uppercase transition-all"
                    >
                      Portal Admin
                    </Link>
                  </div>
                )}
              </div>

              <div className="mobile-socials mt-4">
                <a
                  href="https://www.instagram.com/sysmicon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-[#C2E1FF] transition-colors"
                >
                  INSTAGRAM • @SYSMICON
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
