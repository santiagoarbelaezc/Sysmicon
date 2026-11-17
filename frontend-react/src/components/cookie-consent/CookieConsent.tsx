import React, { useState, useEffect } from 'react';
import { useCookieConsentService } from '../../services/cookie-consent.service';
import './CookieConsent.css';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
  timestamp?: string;
}

const STORAGE_KEY = 'app_cookie_consent_v1';

export const CookieConsent: React.FC = () => {
  const consentService = useCookieConsentService();

  const [activeTab, setActiveTab] = useState<'preferences' | 'legal'>('preferences');
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    preferences: true,
    marketing: false,
  });

  const isVisible = consentService.isVisible;
  const showModal = consentService.showModal;

  useEffect(() => {
    consentService.checkConsent();
    try {
      const savedConsent = localStorage.getItem(STORAGE_KEY);
      if (savedConsent) {
        const parsed = JSON.parse(savedConsent);
        setPreferences({
          necessary: true,
          analytics: !!parsed.analytics,
          preferences: !!parsed.preferences,
          marketing: !!parsed.marketing,
        });
      }
    } catch (e) {
      console.warn('Error reading cookie consent from localStorage:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistAndClose = (prefsToSave: CookiePreferences) => {
    try {
      const dataToSave: CookiePreferences = {
        ...prefsToSave,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Error saving cookie consent to localStorage:', e);
    }
    consentService.hideBanner();
  };

  const acceptAll = () => {
    const nextPrefs: CookiePreferences = {
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true,
    };
    setPreferences(nextPrefs);
    persistAndClose(nextPrefs);
  };

  const acceptEssential = () => {
    const nextPrefs: CookiePreferences = {
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    };
    setPreferences(nextPrefs);
    persistAndClose(nextPrefs);
  };

  const saveCustomPreferences = () => {
    const nextPrefs: CookiePreferences = {
      ...preferences,
      necessary: true,
    };
    setPreferences(nextPrefs);
    persistAndClose(nextPrefs);
  };

  const openModal = () => {
    consentService.openModal();
  };

  const closeModal = () => {
    consentService.closeModal();
  };

  const setTab = (tab: 'preferences' | 'legal') => {
    setActiveTab(tab);
  };

  return (
    <>
      {/* TARJETA FLOTANTE DE COOKIES (ESQUINA INFERIOR IZQUIERDA) */}
      {isVisible && (
        <div className="cookie-banner-wrapper animate-slide-up" role="region" aria-label="Consentimiento de cookies">
          <div className="cookie-card">
            <div className="cookie-card-header">
              <div className="cookie-icon-box">
                <svg className="cookie-svg-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.2" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="#002345" />
                  <circle cx="15" cy="9.5" r="1.8" fill="#002345" />
                  <circle cx="11.5" cy="13.5" r="1.5" fill="#002345" />
                  <circle cx="16" cy="15" r="1.2" fill="#002345" />
                  <circle cx="7.5" cy="14.5" r="1.4" fill="#002345" />
                </svg>
              </div>

              <div className="cookie-title-area">
                <h3 className="cookie-title">
                  USO DE COOKIES Y PRIVACIDAD <span className="cookie-badge-dot">●</span>
                </h3>
                <div className="cookie-pill-badge">LEY 1581 & RGPD</div>
              </div>
            </div>

            <div className="cookie-card-body">
              <p className="cookie-description">
                En <strong>Sysmicon</strong> utilizamos cookies propias y de terceros para optimizar la experiencia de navegación, analizar el tráfico y personalizar contenidos según la <strong>Ley 1581 de 2012 (Habeas Data)</strong> y el <strong>RGPD</strong>.
              </p>
            </div>

            <div className="cookie-card-actions">
              <button type="button" className="btn-cookie-primary" onClick={acceptAll}>
                Aceptar todas
              </button>
              <button type="button" className="btn-cookie-secondary" onClick={acceptEssential}>
                Solo esenciales
              </button>
              <button type="button" className="btn-cookie-link" onClick={openModal}>
                Configurar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIGURACIÓN Y DOCUMENTO LEGAL COMPLETO */}
      {showModal && (
        <div className="cookie-modal-backdrop animate-fade-in" onClick={closeModal}>
          <div
            className="cookie-modal-container animate-scale-up"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Modal Header */}
            <div className="cookie-modal-header">
              <div className="modal-header-title-box">
                <div className="modal-header-icon">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-current text-[#002345]">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 id="modal-title" className="modal-title">
                    Centro de Privacidad y Cookies
                  </h2>
                  <p className="modal-subtitle">Sysmicon S.A.S. • Protección de Datos Personales</p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={closeModal} aria-label="Cerrar modal">
                ✕
              </button>
            </div>

            {/* Modal Tabs Nav */}
            <div className="cookie-modal-tabs">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setTab('preferences')}
              >
                <svg viewBox="0 0 24 24" fill="none" className="tab-icon">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Configurar Preferencias
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'legal' ? 'active' : ''}`}
                onClick={() => setTab('legal')}
              >
                <svg viewBox="0 0 24 24" fill="none" className="tab-icon">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Documento Legal Completo
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="cookie-modal-body custom-scrollbar">
              {/* TAB 1: PREFERENCIAS */}
              {activeTab === 'preferences' && (
                <div className="tab-content space-y-5">
                  <p className="tab-intro-text">
                    Administre sus preferencias de cookies. Puede habilitar o deshabilitar cada categoría según sus necesidades. Las cookies estrictamente necesarias garantizan el funcionamiento básico de nuestro portal.
                  </p>

                  {/* Option 1: Necesarias */}
                  <div className="cookie-option-card">
                    <div className="option-info">
                      <div className="option-header">
                        <span className="option-title">Cookies Necesarias & Estrictamente Técnicas</span>
                        <span className="badge-required">Siempre activas</span>
                      </div>
                      <p className="option-desc">
                        Son indispensables para posibilitar la navegación segura, la autenticación en el portal, la gestión de sesiones y el correcto funcionamiento del sistema. No se pueden desactivar.
                      </p>
                    </div>
                    <div className="option-toggle">
                      <label className="switch disabled">
                        <input type="checkbox" checked disabled readOnly />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  {/* Option 2: Analíticas */}
                  <div className="cookie-option-card">
                    <div className="option-info">
                      <div className="option-header">
                        <span className="option-title">Cookies Analíticas y de Rendimiento</span>
                      </div>
                      <p className="option-desc">
                        Nos permiten medir de forma anónima el rendimiento de nuestras páginas, el flujo de usuarios y detectar eventuales errores de navegación para mejorar continuamente nuestros servicios.
                      </p>
                    </div>
                    <div className="option-toggle">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) =>
                            setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))
                          }
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  {/* Option 3: Preferencias */}
                  <div className="cookie-option-card">
                    <div className="option-info">
                      <div className="option-header">
                        <span className="option-title">Cookies de Preferencias y Funcionalidad</span>
                      </div>
                      <p className="option-desc">
                        Permiten recordar sus configuraciones de idioma, temas de interfaz o visualización arquitectónica preferida para ofrecer una navegación personalizada y fluida.
                      </p>
                    </div>
                    <div className="option-toggle">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={preferences.preferences}
                          onChange={(e) =>
                            setPreferences((prev) => ({ ...prev, preferences: e.target.checked }))
                          }
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  {/* Option 4: Marketing */}
                  <div className="cookie-option-card">
                    <div className="option-info">
                      <div className="option-header">
                        <span className="option-title">Cookies de Marketing y Publicidad Dirigida</span>
                      </div>
                      <p className="option-desc">
                        Se utilizan para mostrar ofertas comerciales, proyectos arquitectónicos relevantes y contenidos ajustados a su perfil de interés a través de nuestras redes y socios.
                      </p>
                    </div>
                    <div className="option-toggle">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) =>
                            setPreferences((prev) => ({ ...prev, marketing: e.target.checked }))
                          }
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DOCUMENTO LEGAL COMPLETO (HABEAS DATA Y RGPD) */}
              {activeTab === 'legal' && (
                <div className="tab-content legal-text-wrapper">
                  <div className="legal-section">
                    <h4>1. Marco Legal y Cumplimiento Normativo</h4>
                    <p>
                      En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> de Colombia (Habeas Data), el <strong>Decreto 1377 de 2013</strong> y el Reglamento General de Protección de Datos (<strong>RGPD - UE 2016/679</strong>), el presente documento establece la Política Integral de Tratamiento de Datos Personales y Uso de Cookies de <strong>SYSMICON S.A.S.</strong>
                    </p>
                  </div>

                  <div className="legal-section">
                    <h4>2. Identificación del Responsable del Tratamiento</h4>
                    <p>
                      <strong>Razón Social:</strong> SYSMICON S.A.S.<br />
                      <strong>Domicilio Principal:</strong> Colombia<br />
                      <strong>Canal Oficial de Atención Privacidad:</strong>{' '}
                      <a href="mailto:privacidad@sysmicon.com" className="legal-link">
                        privacidad@sysmicon.com
                      </a>{' '}
                      /{' '}
                      <a href="mailto:contacto@sysmicon.com" className="legal-link">
                        contacto@sysmicon.com
                      </a>
                      <br />
                      <strong>Objeto Social:</strong> Arquitectura, Ingeniería, Diseño, Consultoría y Construcción Integral.
                    </p>
                  </div>

                  <div className="legal-section">
                    <h4>3. Finalidad del Tratamiento de Datos Personales</h4>
                    <p>
                      Los datos personales capturados en nuestro portal mediante formularios, cookies o canales interactivos se tratarán para las siguientes finalidades:
                    </p>
                    <ul>
                      <li>Atención de requerimientos comerciales, cotizaciones de proyectos arquitectónicos y consultas técnicas.</li>
                      <li>Gestión de credenciales de acceso al Portal Privado y Dashboard de clientes/aliados.</li>
                      <li>Análisis estadístico anónimo del rendimiento del sitio web y optimización de la experiencia digital.</li>
                      <li>Envío de boletines institucionales, actualizaciones de proyectos o comunicaciones normativas (previo consentimiento expreso).</li>
                    </ul>
                  </div>

                  <div className="legal-section">
                    <h4>4. Derechos de los Titulares (Derechos ARCO)</h4>
                    <p>
                      De conformidad con el Artículo 8 de la Ley 1581 de 2012 y normativas internacionales equivalentes, usted como titular de la información posee los siguientes derechos:
                    </p>
                    <ul>
                      <li>
                        <strong>Acceso / Conocer:</strong> Solicitar prueba de la autorización otorgada y consultar sus datos personales almacenados.
                      </li>
                      <li>
                        <strong>Rectificación / Actualizar:</strong> Solicitar la corrección o actualización de datos parciales, inexactos o incompletos.
                      </li>
                      <li>
                        <strong>Cancelación / Suprimir:</strong> Solicitar la eliminación de sus datos cuando no exista un deber legal o contractual de permanecer en la base de datos.
                      </li>
                      <li>
                        <strong>Oposición / Revocar:</strong> Revocar la autorización otorgada para el tratamiento de sus datos o el uso de cookies no esenciales en cualquier momento.
                      </li>
                    </ul>
                  </div>

                  <div className="legal-section">
                    <h4>5. Procedimiento para el Ejercicio de Derechos ARCO</h4>
                    <p>
                      Para ejercer cualquiera de sus derechos ARCO, podrá enviar una solicitud escrita dirigida al Oficial de Protección de Datos al correo <strong>privacidad@sysmicon.com</strong> indicando:
                    </p>
                    <ol>
                      <li>Nombre completo y documento de identificación del titular.</li>
                      <li>Descripción clara de los hechos que dan lugar a la consulta, reclamo o revocatoria de consentimiento.</li>
                      <li>Dirección física o electrónica de notificación.</li>
                    </ol>
                    <p>
                      La solicitud será atendida en los términos legalmente fijados por la Ley 1581 de 2012 (máximo 10 días hábiles para consultas y 15 días hábiles para reclamos).
                    </p>
                  </div>

                  <div className="legal-section">
                    <h4>6. Exención de Responsabilidad sobre Datos de Terceros</h4>
                    <p>
                      SYSMICON S.A.S. no se hace responsable por el tratamiento de datos personales realizado por plataformas de terceros enlazadas de manera externa (tales como redes sociales, proveedores de pasarelas o servicios de alojamiento externo), los cuales se rigen por sus propias políticas de privacidad.
                    </p>
                  </div>

                  <div className="legal-section">
                    <h4>7. Autoridad de Control Competente</h4>
                    <p>
                      En Colombia, la autoridad encargada de velar por el cumplimiento del régimen de protección de datos personales es la <strong>Superintendencia de Industria y Comercio (SIC) - Delegatura para la Protección de Datos Personales</strong> (
                      <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer" className="legal-link">
                        www.sic.gov.co
                      </a>
                      ).
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="cookie-modal-footer">
              <button type="button" className="btn-cookie-secondary" onClick={acceptEssential}>
                Solo esenciales
              </button>
              <div className="footer-primary-group">
                <button type="button" className="btn-cookie-primary" onClick={saveCustomPreferences}>
                  Guardar preferencias
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
