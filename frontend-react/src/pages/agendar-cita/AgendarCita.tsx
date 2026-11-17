import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './AgendarCita.css';

export interface TipoConsulta {
  id: string;
  titulo: string;
  subtitulo: string;
  duracion: string;
  modalidad: string;
  icono: string;
  destacado?: boolean;
}

export interface HorarioDisponible {
  hora: string;
  periodo: string;
  disponible: boolean;
}

const TIPOS_CONSULTA: TipoConsulta[] = [
  {
    id: 'diseno-arquitectonico',
    titulo: 'Diseño Arquitectónico Personalizado',
    subtitulo: 'Concepción integral de tu vivienda, distribución espacial, bioclíma y renders 3D de alta fidelidad.',
    duracion: '60 Minutos',
    modalidad: 'Presencial / Virtual',
    icono: '🏛️',
    destacado: true
  },
  {
    id: 'factibilidad-lote',
    titulo: 'Evaluación de Lote & Normativa',
    subtitulo: 'Análisis topográfico preliminar, viabilidad de servicios, retiros y máximo aprovechamiento.',
    duracion: '45 Minutos',
    modalidad: 'Presencial / Virtual',
    icono: '📐'
  },
  {
    id: 'ejecucion-obra',
    titulo: 'Dirección & Ejecución de Obra',
    subtitulo: 'Revisión técnica de cronogramas, presupuesto de construcción, materiales y garantías de entrega.',
    duracion: '60 Minutos',
    modalidad: 'Presencial / Virtual',
    icono: '🏗️'
  },
  {
    id: 'asesoria-financiera',
    titulo: 'Estructuración Presupuestal VIP',
    subtitulo: 'Modelación de costos de inversión, flujos de caja y planeación financiera por etapas de obra.',
    duracion: '45 Minutos',
    modalidad: 'Virtual VIP',
    icono: '💎'
  }
];

const HORARIOS: HorarioDisponible[] = [
  { hora: '08:30', periodo: 'AM', disponible: true },
  { hora: '10:00', periodo: 'AM', disponible: true },
  { hora: '11:30', periodo: 'AM', disponible: true },
  { hora: '02:00', periodo: 'PM', disponible: true },
  { hora: '03:30', periodo: 'PM', disponible: false },
  { hora: '05:00', periodo: 'PM', disponible: true }
];

export const AgendarCita: React.FC = () => {
  const [pasoActual, setPasoActual] = useState<number>(1);
  const [citaConfirmada, setCitaConfirmada] = useState<boolean>(false);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState<TipoConsulta | null>(TIPOS_CONSULTA[0]);

  const { diasMes, initialDia } = useMemo(() => {
    const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const hoy = new Date();
    const list: { dia: number; fechaCompleta: string; nombreDia: string; disponible: boolean }[] = [];
    let firstAvailable = '';

    for (let i = 1; i <= 14; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() + i);
      const diaSemana = fecha.getDay();

      if (diaSemana !== 0) {
        const strFecha = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
        const item = {
          dia: fecha.getDate(),
          fechaCompleta: strFecha,
          nombreDia: nombresDias[diaSemana],
          disponible: i % 5 !== 0
        };
        list.push(item);
        if (!firstAvailable && item.disponible) {
          firstAvailable = item.fechaCompleta;
        }
      }
    }
    return { diasMes: list, initialDia: firstAvailable };
  }, []);

  const [diaSeleccionado, setDiaSeleccionado] = useState<string>(initialDia);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>('10:00 AM');
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState<'Presencial' | 'Virtual'>('Presencial');

  const [nombreCompleto, setNombreCompleto] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [ubicacionLote, setUbicacionLote] = useState<string>('');
  const [presupuestoEstimado, setPresupuestoEstimado] = useState<string>('500M - 1.200M COP');
  const [notasAdicionales, setNotasAdicionales] = useState<string>('');

  const isFormValid =
    nombreCompleto.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()) &&
    telefono.trim().length >= 7;

  const seleccionarConsulta = (consulta: TipoConsulta) => {
    setConsultaSeleccionada(consulta);
  };

  const seleccionarDia = (fecha: string, disponible: boolean) => {
    if (disponible) {
      setDiaSeleccionado(fecha);
    }
  };

  const seleccionarHora = (horaCompleta: string, disponible: boolean) => {
    if (disponible) {
      setHoraSeleccionada(horaCompleta);
    }
  };

  const avanzarPaso = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pasoActual === 1 && !consultaSeleccionada) {
      return;
    }
    if (pasoActual === 2 && (!diaSeleccionado || !horaSeleccionada)) {
      return;
    }
    if (pasoActual === 3 && !isFormValid) {
      return;
    }
    if (pasoActual === 3 && isFormValid) {
      setCitaConfirmada(true);
    }
    if (pasoActual < 4) {
      setPasoActual(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const retrocederPaso = () => {
    if (pasoActual > 1 && !citaConfirmada) {
      setPasoActual(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-24 pb-28 relative overflow-hidden font-sans">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        {/* HEADER VIP MINIMALISTA */}
        <div className="text-left max-w-3xl mb-14">
          <span className="font-mono text-xs tracking-[0.3em] text-neutral-400 font-semibold uppercase block mb-3">
            ATENCIÓN EXCLUSIVA & CONSULTORÍA 360°
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight uppercase leading-tight mb-4">
            AGENDAR CITA <span className="font-serif italic font-normal text-neutral-500">TÉCNICA</span>
          </h1>
          <p className="font-sans text-base sm:text-lg text-neutral-600 font-light leading-relaxed">
            Reserva un espacio directamente con nuestro equipo directivo para evaluar tu proyecto, viabilidad legal del lote o arquitectura a la medida.
          </p>
        </div>

        {/* STEPPER PROGRESS BAR MINIMALISTA */}
        {!citaConfirmada && (
          <div className="max-w-3xl mx-auto mb-14">
            <div className="grid grid-cols-3 gap-4 relative">
              {/* Paso 1 */}
              <div className="flex flex-col items-center text-center group cursor-pointer" onClick={() => setPasoActual(1)}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold border transition-all duration-300 mb-2 ${
                    pasoActual === 1
                      ? 'bg-black text-white border-black scale-110 shadow-sm'
                      : pasoActual > 1
                      ? 'bg-neutral-200 text-neutral-900 border-neutral-300'
                      : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                  }`}
                >
                  {pasoActual > 1 ? '✓' : '01'}
                </div>
                <span
                  className={`font-sans text-[11px] uppercase tracking-widest font-semibold ${
                    pasoActual === 1 ? 'text-black' : 'text-neutral-400'
                  }`}
                >
                  1. Consulta
                </span>
              </div>

              {/* Paso 2 */}
              <div
                className="flex flex-col items-center text-center group cursor-pointer"
                onClick={() => (pasoActual > 1 ? setPasoActual(2) : undefined)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold border transition-all duration-300 mb-2 ${
                    pasoActual === 2
                      ? 'bg-black text-white border-black scale-110 shadow-sm'
                      : pasoActual > 2
                      ? 'bg-neutral-200 text-neutral-900 border-neutral-300'
                      : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                  }`}
                >
                  {pasoActual > 2 ? '✓' : '02'}
                </div>
                <span
                  className={`font-sans text-[11px] uppercase tracking-widest font-semibold ${
                    pasoActual === 2 ? 'text-black' : 'text-neutral-400'
                  }`}
                >
                  2. Horario
                </span>
              </div>

              {/* Paso 3 */}
              <div
                className="flex flex-col items-center text-center group cursor-pointer"
                onClick={() => (pasoActual > 2 ? setPasoActual(3) : undefined)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold border transition-all duration-300 mb-2 ${
                    pasoActual === 3
                      ? 'bg-black text-white border-black scale-110 shadow-sm'
                      : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                  }`}
                >
                  03
                </div>
                <span
                  className={`font-sans text-[11px] uppercase tracking-widest font-semibold ${
                    pasoActual === 3 ? 'text-black' : 'text-neutral-400'
                  }`}
                >
                  3. Datos
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CONTENEDOR PRINCIPAL DEL PASO */}
        <div className="bg-neutral-50/60 border border-neutral-200/90 rounded-[32px] p-6 sm:p-12 shadow-sm relative">
          {/* ==================== PASO 1: TIPO DE CONSULTA ==================== */}
          {pasoActual === 1 && (
            <div className="space-y-8">
              <div className="border-b border-neutral-200 pb-4">
                <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-bold uppercase">
                  Selecciona la Naturaleza de tu Consulta
                </h3>
                <p className="font-sans text-xs text-neutral-500 tracking-wider uppercase mt-1">
                  Cada sesión es atendida directamente por arquitectos o ingenieros senior de Sysmicon.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TIPOS_CONSULTA.map(c => {
                  const isSelected = consultaSeleccionada?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => seleccionarConsulta(c)}
                      className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative flex flex-col justify-between group overflow-hidden ${
                        isSelected
                          ? 'bg-black text-white border-black shadow-lg scale-[1.01]'
                          : 'bg-white border-neutral-200/90 hover:border-black text-neutral-900'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-3xl p-3 rounded-xl bg-neutral-100 text-neutral-900 group-hover:bg-neutral-800 group-hover:text-white transition-colors">
                          {c.icono}
                        </span>
                        <div className="flex items-center gap-2">
                          {c.destacado && (
                            <span className="px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-900 group-hover:bg-neutral-800 group-hover:text-white text-[10px] font-mono tracking-widest uppercase">
                              RECOMENDADO
                            </span>
                          )}
                          <span
                            className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-colors ${
                              isSelected ? 'bg-white text-black border-white' : 'border-neutral-300 text-transparent'
                            }`}
                          >
                            ✓
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4
                          className={`font-serif text-xl sm:text-2xl font-bold uppercase mb-2 ${
                            isSelected ? 'text-white' : 'text-neutral-900'
                          }`}
                        >
                          {c.titulo}
                        </h4>
                        <p
                          className={`font-sans text-xs sm:text-sm leading-relaxed font-light mb-6 ${
                            isSelected ? 'text-neutral-300' : 'text-neutral-600'
                          }`}
                        >
                          {c.subtitulo}
                        </p>
                      </div>

                      <div
                        className={`pt-4 border-t border-neutral-200/30 flex items-center justify-between text-xs font-mono tracking-widest uppercase ${
                          isSelected ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        <span>⏱️ {c.duracion}</span>
                        <span className={`font-bold ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                          {c.modalidad}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => avanzarPaso()}
                  disabled={!consultaSeleccionada}
                  className="px-9 py-4 rounded-full bg-black text-white hover:bg-neutral-800 transition-all duration-300 font-sans text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  <span>Continuar a Horario</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================== PASO 2: SELECCIÓN DE FECHA Y HORARIO ==================== */}
          {pasoActual === 2 && (
            <div className="space-y-8">
              <div className="border-b border-neutral-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-bold uppercase">
                    Selecciona Fecha y Modalidad
                  </h3>
                  <p className="font-sans text-xs text-neutral-500 tracking-wider uppercase mt-1">
                    {consultaSeleccionada?.titulo} ({consultaSeleccionada?.duracion})
                  </p>
                </div>

                <div className="inline-flex p-1 rounded-full bg-neutral-200/80 border border-neutral-300">
                  <button
                    type="button"
                    onClick={() => setModalidadSeleccionada('Presencial')}
                    className={`px-4 py-2 rounded-full font-sans text-xs uppercase tracking-widest transition-all cursor-pointer ${
                      modalidadSeleccionada === 'Presencial'
                        ? 'bg-black text-white font-bold shadow'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    🏛️ Presencial
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalidadSeleccionada('Virtual')}
                    className={`px-4 py-2 rounded-full font-sans text-xs uppercase tracking-widest transition-all cursor-pointer ${
                      modalidadSeleccionada === 'Virtual'
                        ? 'bg-black text-white font-bold shadow'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    💻 Videollamada
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Calendario / Día */}
                <div className="lg:col-span-7 space-y-4">
                  <label className="block font-mono text-xs uppercase tracking-widest text-neutral-700 font-semibold">
                    1. Elige un día disponible
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {diasMes.map(item => {
                      const isSelected = diaSeleccionado === item.fechaCompleta;
                      return (
                        <div
                          key={item.fechaCompleta}
                          onClick={() => seleccionarDia(item.fechaCompleta, item.disponible)}
                          className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                            isSelected
                              ? 'bg-black border-black text-white shadow-md scale-105'
                              : item.disponible
                              ? 'bg-white border-neutral-200 hover:border-black text-neutral-900'
                              : 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <span
                            className={`font-mono text-[11px] uppercase tracking-wider mb-1 ${
                              isSelected ? 'text-neutral-300' : 'text-neutral-400'
                            }`}
                          >
                            {item.nombreDia}
                          </span>
                          <span className="font-serif text-3xl font-light">{item.dia}</span>
                          {item.disponible && (
                            <span
                              className={`text-[9px] font-mono uppercase mt-1 ${
                                isSelected ? 'text-white' : 'text-black'
                              }`}
                            >
                              Disponible
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Horario */}
                <div className="lg:col-span-5 space-y-4">
                  <label className="block font-mono text-xs uppercase tracking-widest text-neutral-700 font-semibold">
                    2. Elige el horario exacto
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {HORARIOS.map(h => {
                      const label = `${h.hora} ${h.periodo}`;
                      const isSelected = horaSeleccionada === label && h.disponible;
                      return (
                        <div
                          key={label}
                          onClick={() => seleccionarHora(label, h.disponible)}
                          className={`p-4 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-black border-black text-white shadow-md scale-105 font-bold'
                              : h.disponible
                              ? 'bg-white border-neutral-200 hover:border-black text-neutral-900'
                              : 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-40'
                          }`}
                        >
                          <span className="font-mono text-sm tracking-wider">{h.hora}</span>
                          <span className="font-mono text-xs">{h.periodo}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={retrocederPaso}
                  className="px-6 py-3 rounded-full border border-neutral-300 hover:bg-black hover:text-white text-neutral-800 transition-all font-sans text-xs tracking-widest uppercase cursor-pointer"
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  onClick={() => avanzarPaso()}
                  disabled={!diaSeleccionado || !horaSeleccionada}
                  className="px-9 py-4 rounded-full bg-black text-white hover:bg-neutral-800 transition-all duration-300 font-sans text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  <span>Continuar a Datos</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================== PASO 3: FORMULARIO CLIENTE ==================== */}
          {pasoActual === 3 && !citaConfirmada && (
            <div className="space-y-8">
              <div className="border-b border-neutral-200 pb-4">
                <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-bold uppercase">
                  Especificaciones y Datos del Proyecto
                </h3>
              </div>

              <form onSubmit={avanzarPaso} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-mono text-xs uppercase tracking-widest text-neutral-700 font-semibold">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={nombreCompleto}
                      onChange={e => setNombreCompleto(e.target.value)}
                      placeholder="Ej. Ing. Carlos Rodríguez"
                      required
                      minLength={3}
                      className="w-full px-5 py-4 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-black focus:outline-none transition-all text-sm font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-mono text-xs uppercase tracking-widest text-neutral-700 font-semibold">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={correo}
                      onChange={e => setCorreo(e.target.value)}
                      placeholder="carlos@empresa.com"
                      required
                      className="w-full px-5 py-4 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-black focus:outline-none transition-all text-sm font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-mono text-xs uppercase tracking-widest text-neutral-700 font-semibold">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={e => setTelefono(e.target.value)}
                      placeholder="+57 310 845 9210"
                      required
                      minLength={7}
                      className="w-full px-5 py-4 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-black focus:outline-none transition-all text-sm font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-mono text-xs uppercase tracking-widest text-neutral-700 font-semibold">
                      Ubicación del Lote
                    </label>
                    <input
                      type="text"
                      value={ubicacionLote}
                      onChange={e => setUbicacionLote(e.target.value)}
                      placeholder="Llanogrande, Envigado, El Retiro..."
                      className="w-full px-5 py-4 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-black focus:outline-none transition-all text-sm font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-neutral-700 font-semibold">
                    Rango Presupuestal
                  </label>
                  <select
                    value={presupuestoEstimado}
                    onChange={e => setPresupuestoEstimado(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-black focus:outline-none transition-all text-sm font-sans"
                  >
                    <option value="300M - 600M COP">Entre $300M y $600M COP</option>
                    <option value="600M - 1.200M COP">Entre $600M y $1.200M COP</option>
                    <option value="1.200M - 2.500M+ COP">Superior a $1.200M / Alta Gama Lux</option>
                    <option value="Aún en evaluación">Aún en evaluación o estudio de factibilidad</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-neutral-700 font-semibold">
                    Notas o Requerimientos
                  </label>
                  <textarea
                    rows={3}
                    value={notasAdicionales}
                    onChange={e => setNotasAdicionales(e.target.value)}
                    placeholder="Describe área deseada, estilo o inquietudes..."
                    className="w-full px-5 py-4 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-black focus:outline-none transition-all text-sm font-sans"
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-neutral-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={retrocederPaso}
                    className="px-6 py-3 rounded-full border border-neutral-300 hover:bg-black hover:text-white text-neutral-800 transition-all font-sans text-xs tracking-widest uppercase cursor-pointer"
                  >
                    ← Volver
                  </button>
                  <button
                    type="submit"
                    className="px-9 py-4 rounded-full bg-black text-white hover:bg-neutral-800 transition-all duration-300 font-sans text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-3 shadow-sm cursor-pointer"
                  >
                    <span>Agendar Cita</span>
                    <span>✓</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================== PASO 4: CONFIRMACIÓN ==================== */}
          {citaConfirmada && (
            <div className="py-10 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl mx-auto shadow-sm">
                ✓
              </div>
              <h3 className="font-serif text-4xl sm:text-5xl font-bold text-neutral-900 uppercase">
                ¡CITA RESERVADA CON ÉXITO!
              </h3>
              <p className="font-sans text-neutral-600 text-base max-w-xl mx-auto font-light leading-relaxed">
                Hemos enviado un correo de confirmación con los detalles para tu cita en nuestra sede o enlace virtual.
              </p>

              <div className="pt-6 flex items-center justify-center gap-4">
                <Link
                  to="/"
                  className="px-9 py-4 rounded-full bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  Volver al Inicio
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgendarCita;
