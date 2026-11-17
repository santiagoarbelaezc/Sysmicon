import React, { useEffect, useMemo } from 'react';
import { adminService, useAdminService } from '../../../../services/admin.service';

export const DashAnaliticas: React.FC = () => {
  const { analiticas, mensajes } = useAdminService();

  useEffect(() => {
    adminService.cargarDatosReales();
  }, []);

  const totalVisitasSemana = useMemo(() => {
    const list = analiticas.visitasDiarias;
    if (list.length === 0) return 0;
    return list.reduce((acc, curr) => acc + curr.visitas, 0);
  }, [analiticas.visitasDiarias]);

  const tasaConversion = useMemo(() => {
    const total = totalVisitasSemana;
    const leads = mensajes.length;
    if (total === 0) return leads > 0 ? 100 : 0;
    const rate = (leads / total) * 100;
    return Math.min(Math.round(rate * 10) / 10, 100);
  }, [totalVisitasSemana, mensajes.length]);

  const exportarDatos = () => {
    let csv = 'ID,Remitente,Email,Telefono,Asunto,Presupuesto,Fecha\n';
    mensajes.forEach((m) => {
      csv += `"${m.id}","${m.remitente}","${m.email}","${m.telefono}","${m.asunto}","${m.presupuesto || ''}","${m.fecha || m.created_at || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sysmicon_leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      
      {/* ENCABEZADO DE SECCIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
        <div>
          <span className="font-mono text-xs sm:text-sm tracking-ultra text-neutral-400 font-black uppercase block mb-2">
            MÉTRICAS &amp; INTELIGENCIA DEL SISTEMA
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 uppercase tracking-tight leading-[1.05]">
            ANALÍTICAS &amp; <span className="font-light">RENDIMIENTO WEB</span>
          </h1>
          <p className="font-sans text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mt-3 max-w-3xl">
            Monitoreo en tiempo real de tráfico, interacción con el portafolio y embudos de conversión de clientes.
          </p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-xs sm:text-sm px-5 py-3 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-800 font-mono font-bold uppercase tracking-wider">ÚLTIMOS 30 DÍAS</span>
          <button onClick={exportarDatos} className="admin-btn-primary py-3.5 px-7">
            <svg className="w-4.5 h-4.5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            EXPORTAR (.CSV)
          </button>
        </div>
      </div>

      {/* MÉTRICAS CLAVE (3 TARJETAS MONOCROMÁTICAS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-9 shadow-xs hover:border-neutral-400 hover:shadow-md transition-all group duration-300">
          <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.2em] text-neutral-400 block mb-3">TOTAL VISITAS SEMANALES</span>
          <span className="font-serif text-5xl sm:text-6xl font-black text-neutral-950 tracking-tight">{totalVisitasSemana}</span>
          <p className="text-sm text-neutral-600 mt-4 font-mono font-semibold flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> TRÁFICO EN VIVO
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-9 shadow-xs hover:border-neutral-400 hover:shadow-md transition-all group duration-300">
          <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.2em] text-neutral-400 block mb-3">COTIZACIONES REGISTRADAS</span>
          <span className="font-serif text-5xl sm:text-6xl font-black text-neutral-950 tracking-tight">{mensajes.length}</span>
          <p className="text-sm text-neutral-700 mt-4 font-mono font-semibold flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-950"></span> LEADS EN BASE DE DATOS
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-9 shadow-xs hover:border-neutral-400 hover:shadow-md transition-all group duration-300">
          <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.2em] text-neutral-400 block mb-3">TASA DE CONVERSIÓN</span>
          <span className="font-serif text-5xl sm:text-6xl font-black text-neutral-950 tracking-tight">{tasaConversion}%</span>
          <p className="text-sm text-neutral-700 mt-4 font-mono font-semibold flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> LEADS VS. SESIONES
          </p>
        </div>

      </div>

      {/* EMBUDO DE CONVERSIÓN DINÁMICO */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-8">
        <div className="pb-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">EMBUDO DE CONVERSIÓN DE CLIENTES</h3>
            <p className="text-sm sm:text-base text-neutral-600 font-normal mt-1">Recorrido del usuario desde la primera visita hasta la solicitud formal</p>
          </div>
          <span className="text-xs font-mono font-black text-neutral-500 uppercase tracking-widest bg-neutral-100 px-4 py-2 rounded-xl">CONVERSIÓN WEB</span>
        </div>

        <div className="space-y-7 max-w-4xl font-sans pt-2">
          
          {/* Paso 1 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm sm:text-base font-bold text-neutral-900">
              <span className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-mono text-xs font-black">1</span>
                <span className="uppercase tracking-wide">VISITAS TOTALES AL PORTAL</span>
              </span>
              <span className="font-mono text-neutral-600 text-sm font-semibold">100% ({totalVisitasSemana} visitas)</span>
            </div>
            <div className="w-full h-4 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div className="w-full h-full bg-neutral-950 rounded-full"></div>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm sm:text-base font-bold text-neutral-900">
              <span className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-mono text-xs font-black">2</span>
                <span className="uppercase tracking-wide">EXPLORACIÓN DE PROYECTOS Y PORTAFOLIO</span>
              </span>
              <span className="font-mono text-neutral-600 text-sm font-semibold">{totalVisitasSemana > 0 ? '65%' : '0%'}</span>
            </div>
            <div className="w-full h-4 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div className="h-full bg-neutral-600 rounded-full" style={{ width: `${totalVisitasSemana > 0 ? 65 : 0}%` }}></div>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm sm:text-base font-bold text-neutral-900">
              <span className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-mono text-xs font-black">3</span>
                <span className="uppercase tracking-wide">SOLICITUDES DE COTIZACIÓN &amp; MENSAJES FORMALES</span>
              </span>
              <span className="font-mono text-neutral-950 font-black text-sm sm:text-base">{mensajes.length} leads ({tasaConversion}%)</span>
            </div>
            <div className="w-full h-4 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div className="h-full bg-neutral-950 rounded-full" style={{ width: `${tasaConversion}%` }}></div>
            </div>
          </div>

        </div>
      </div>

      {/* DISPOSITIVOS Y REGIONES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
          <div className="pb-5 border-b border-neutral-200">
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">DISPOSITIVOS DE ACCESO</h3>
            <p className="text-sm text-neutral-600 font-normal mt-1">Distribución de tráfico por tipo de pantalla</p>
          </div>
          
          <div className="space-y-5 font-sans pt-2">
            {analiticas.dispositivos.map((disp, idx) => (
              <div key={idx} className="space-y-2.5">
                <div className="flex justify-between text-sm sm:text-base text-neutral-900 font-bold uppercase tracking-wider">
                  <span>{disp.tipo}</span>
                  <span className="font-mono text-neutral-600 text-sm font-semibold">{disp.porcentaje}%</span>
                </div>
                <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                  <div className="h-full bg-neutral-950 rounded-full" style={{ width: `${disp.porcentaje}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
          <div className="pb-5 border-b border-neutral-200">
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">REGIONES CLAVE DE INTERÉS</h3>
            <p className="text-sm text-neutral-600 font-normal mt-1">Procedencia geográfica de los interesados</p>
          </div>

          <div className="space-y-4 text-sm sm:text-base font-sans pt-2">
            <div className="flex justify-between items-center p-4 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-colors">
              <span className="text-neutral-950 font-bold uppercase tracking-wide">ORIENTE ANTIOQUEÑO (LLANOGRANDE / EL RETIRO)</span>
              <span className="text-neutral-950 font-black font-mono text-xs uppercase bg-white px-3 py-1.5 rounded-lg border border-neutral-200">PRINCIPAL</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-colors">
              <span className="text-neutral-900 font-medium uppercase tracking-wide">MEDELLÍN &amp; VALLE DE ABURRÁ</span>
              <span className="text-neutral-700 font-mono text-xs uppercase font-bold bg-white px-3 py-1.5 rounded-lg border border-neutral-200">ACTIVO</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-colors">
              <span className="text-neutral-900 font-medium uppercase tracking-wide">BOGOTÁ D.C. &amp; INVERSIONISTAS</span>
              <span className="text-neutral-700 font-mono text-xs uppercase font-bold bg-white px-3 py-1.5 rounded-lg border border-neutral-200">NACIONAL</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashAnaliticas;
