import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OlvideContrasena.css';

export const OlvideContrasena: React.FC = () => {
  const navigate = useNavigate();

  const [paso, setPaso] = useState<'email' | 'enviado'>('email');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const onEnviarRecuperacion = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      setErrorMessage('Por favor ingresa tu correo electrónico registrado.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');

    await new Promise(resolve => setTimeout(resolve, 1800));

    setIsSubmitting(false);
    setPaso('enviado');
  };

  const volverAlLogin = () => {
    navigate('/login');
  };

  const reenviarCorreo = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Correo reenviado exitosamente. Revisa tu bandeja de entrada.');
    }, 1500);
  };

  return (
    <div className="private-portal">
      <div className="w-full h-screen bg-[#080808] text-white flex overflow-hidden font-sans fixed inset-0 z-0">
        {/* Contenedor Principal al 100% de ancho y exactamente h-screen */}
        <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-12 relative z-10">
          {/* ========== COLUMNA IZQUIERDA: FORMULARIO (Cols 1-5) ========== */}
          <div className="lg:col-span-5 h-screen px-6 sm:px-10 md:px-14 lg:px-16 pt-24 pb-4 relative bg-[#0B0B0B] overflow-hidden order-2 lg:order-1">
            {/* Fondo de iluminación ambiental sutil */}
            <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-wood-accent/8 blur-[160px] pointer-events-none"></div>
            <div className="absolute bottom-20 right-0 w-64 h-64 rounded-full bg-blue-900/10 blur-[120px] pointer-events-none"></div>

            {/* Marcos esquineros arquitectónicos */}
            <div className="absolute top-24 left-8 w-12 h-12 border-t border-l border-wood-accent/30 pointer-events-none hidden sm:block"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-wood-accent/30 pointer-events-none hidden sm:block"></div>

            <div className="max-w-md w-full mx-auto relative z-10 h-full flex flex-col justify-center">
              {/* ===== PASO 1: INGRESO DE EMAIL ===== */}
              {paso === 'email' && (
                <div className="animate-fade">
                  {/* Encabezado del Portal */}
                  <div className="mb-5">
                    <div className="flex items-center gap-3 mb-3">
                      <img src="assets/icons/logo-sysmico.png" alt="Sysmicon" className="w-9 h-9 object-contain" />
                      <span className="font-serif tracking-wider text-xs uppercase text-wood-light font-bold">
                        Sysmicon Arquitectura
                      </span>
                    </div>

                    {/* Ícono central decorativo */}
                    <div className="w-12 h-12 rounded-2xl bg-wood-accent/10 border border-wood-accent/30 flex items-center justify-center mb-4 shadow-lg shadow-wood-accent/10">
                      <svg
                        className="w-7 h-7 text-wood-light"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        <circle cx="12" cy="16" r="1" fill="currentColor" />
                      </svg>
                    </div>

                    <h1 className="font-serif text-2xl font-bold text-white tracking-tight leading-snug mb-2">
                      ¿Olvidaste tu<br />
                      <span className="text-wood-light">Contraseña?</span>
                    </h1>
                    <p className="text-gray-400 text-xs font-sans leading-relaxed">
                      No te preocupes. Ingresa el correo con el que te registraste y te enviaremos las instrucciones para restablecerla.
                    </p>
                  </div>

                  {/* Separador decorativo */}
                  <div className="w-full h-[1px] bg-gradient-to-r from-wood-accent/40 via-white/10 to-transparent mb-5"></div>

                  {/* Alerta de Error */}
                  {errorMessage && (
                    <div className="w-full p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs mb-5 flex items-center gap-3 animate-fade shadow-md">
                      <svg
                        className="w-5 h-5 shrink-0 text-red-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Formulario de recuperación */}
                  <form onSubmit={onEnviarRecuperacion} className="w-full space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 font-serif">
                        Correo Electrónico Registrado *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-500">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </span>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          name="email"
                          required
                          placeholder="ej. carlos@sysmicon.com"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#141414] border border-white/15 text-white placeholder-gray-600 focus:border-wood-accent focus:outline-none transition-all text-sm"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-2 font-sans">
                        Revisa también tu carpeta de spam si no lo ves en unos minutos.
                      </p>
                    </div>

                    {/* Botón principal */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-white hover:bg-gray-100 text-black font-serif font-bold text-xs tracking-widest uppercase shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {!isSubmitting && (
                        <>
                          <svg
                            className="w-4 h-4 text-black"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                          <span>Enviar Instrucciones</span>
                        </>
                      )}
                      {isSubmitting && (
                        <span className="animate-pulse font-sans flex items-center gap-2">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                            <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
                          </svg>
                          Enviando enlace...
                        </span>
                      )}
                    </button>

                    {/* Separador */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-[1px] bg-white/10"></div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-sans">o</span>
                      <div className="flex-1 h-[1px] bg-white/10"></div>
                    </div>

                    {/* Volver al login */}
                    <button
                      type="button"
                      onClick={volverAlLogin}
                      className="w-full py-3 rounded-xl bg-transparent hover:bg-white/5 text-gray-300 hover:text-white border border-white/10 hover:border-white/25 font-sans font-bold text-xs tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      Volver al Inicio de Sesión
                    </button>
                  </form>

                  {/* Pie de página */}
                  <div className="mt-5 pt-3 border-t border-white/10 text-center flex items-center justify-between text-[11px] text-gray-500 font-sans">
                    <span>© 2026 Sysmicon — Oriente Antioqueño</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Servidor Seguro SSL
                    </span>
                  </div>
                </div>
              )}

              {/* ===== PASO 2: EMAIL ENVIADO (CONFIRMACIÓN) ===== */}
              {paso === 'enviado' && (
                <div className="animate-fade text-center">
                  {/* Ícono de éxito animado */}
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div
                      className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-ping"
                      style={{ animationDuration: '3s' }}
                    ></div>
                    <div className="w-24 h-24 rounded-full bg-emerald-950/60 border border-emerald-600/40 flex items-center justify-center mx-auto relative">
                      <svg
                        className="w-10 h-10 text-emerald-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                  </div>

                  <div className="mb-3">
                    <img src="assets/icons/logo-sysmico.png" alt="Sysmicon" className="w-8 h-8 object-contain mx-auto opacity-50" />
                  </div>

                  <h2 className="font-serif text-3xl font-bold text-white tracking-tight mb-3">
                    ¡Revisa tu<br />
                    <span className="text-emerald-400">Correo!</span>
                  </h2>

                  <div className="w-16 h-0.5 bg-wood-accent/60 mx-auto my-5"></div>

                  <p className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto mb-2">
                    Hemos enviado las instrucciones de restablecimiento a
                  </p>
                  <p className="text-wood-light font-bold text-sm mb-6">{email}</p>

                  {/* Tarjeta informativa */}
                  <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 text-left space-y-3 mb-8 text-xs text-gray-400 font-sans">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-wood-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span>
                        El enlace es válido por <strong className="text-white">24 horas</strong>.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-wood-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span>
                        Si no lo ves, revisa tu carpeta de <strong className="text-white">correo no deseado</strong>.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-wood-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span>
                        El remitente será <strong className="text-white">noreply@sysmicon.com</strong>
                      </span>
                    </div>
                  </div>

                  {/* Alerta de reenvío exitoso */}
                  {successMessage && (
                    <div className="w-full p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs mb-5 flex items-center gap-3 animate-fade">
                      <svg className="w-4 h-4 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="space-y-3">
                    <button
                      onClick={reenviarCorreo}
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-white hover:bg-gray-100 text-black font-serif font-bold text-xs tracking-widest uppercase shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {!isSubmitting && (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                          </svg>
                          <span>Reenviar Correo</span>
                        </>
                      )}
                      {isSubmitting && <span className="animate-pulse">Reenviando...</span>}
                    </button>

                    <button
                      onClick={volverAlLogin}
                      className="w-full py-3 rounded-xl bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/25 font-sans font-bold text-xs tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      Volver al Inicio de Sesión
                    </button>
                  </div>

                  {/* Pie de página */}
                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-500 font-sans">
                    <span>© 2026 Sysmicon — Oriente Antioqueño</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Servidor Seguro SSL
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========== COLUMNA DERECHA: IMAGEN HERO (Cols 6-12) ========== */}
          <div className="lg:col-span-7 relative overflow-hidden bg-[#0A0A0A] hidden lg:block h-screen order-1 lg:order-2">
            {/* Imagen de fondo premium con efecto ken burns */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[15000ms] hover:scale-105"
              style={{ backgroundImage: "url('/images/imagen5.jpg')" }}
            ></div>

            {/* Capa de oscurecimiento sutil para legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-l from-[#0B0B0B]/30 via-transparent to-[#0B0B0B]/10"></div>

            {/* Marcos y trazos arquitectónicos finos */}
            <div className="absolute top-28 right-8 w-24 h-24 border-t-2 border-r-2 border-wood-accent/80 pointer-events-none"></div>
            <div className="absolute bottom-12 left-12 w-20 h-20 border-b-2 border-l-2 border-wood-accent/80 pointer-events-none"></div>

            {/* Contenido sobre la imagen */}
            <div className="absolute top-36 right-14 left-14 z-20 flex flex-col justify-start items-end text-right">
              <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-tight leading-[1.08] mb-6">
                Tu Cuenta,<br />
                <span className="text-wood-light font-serif italic">Tu Patrimonio</span>
              </h2>

              <div className="w-32 h-1.5 bg-gradient-to-l from-wood-accent via-[#7AA3D0] to-transparent rounded-full"></div>

              <p className="text-white/70 text-sm font-sans mt-4 max-w-sm leading-relaxed">
                Protegemos tu información con los más altos estándares de seguridad arquitectónica digital.
              </p>
            </div>

            {/* Indicadores flotantes en la parte inferior */}
            <div className="absolute bottom-10 left-12 right-12 z-20 flex items-center justify-between border-t border-white/20 pt-6">
              <div className="flex items-center gap-3">
                <span className="text-wood-light font-serif font-bold text-2xl">256</span>
                <span className="text-[11px] uppercase text-white font-sans tracking-widest font-bold">
                  Bit Encriptación SSL
                </span>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <span className="text-wood-light font-serif font-bold text-2xl">24/7</span>
                <span className="text-[11px] uppercase text-white font-sans tracking-widest font-bold">
                  Soporte Técnico
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-wood-light font-serif font-bold text-2xl">100%</span>
                <span className="text-[11px] uppercase text-white font-sans tracking-widest font-bold">
                  Datos Protegidos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OlvideContrasena;
