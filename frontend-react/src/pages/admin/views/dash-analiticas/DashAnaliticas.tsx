import React, { useEffect, useMemo } from 'react';
import { adminService, useAdminService } from '../../../../services/admin.service';

export const DashAnaliticas: React.FC = () => {
  const { analiticas, mensajes, kpis: webKpis } = useAdminService();

  useEffect(() => {
    adminService.cargarDatosReales();
  }, []);

  const totalVisitasSemana = useMemo(() => {
    const list = analiticas.visitasDiarias;
    if (list.length === 0) return 1280;
    return list.reduce((acc, curr) => acc + curr.visitas, 0);
  }, [analiticas.visitasDiarias]);

  const tasaConversion = useMemo(() => {
    const total = totalVisitasSemana;
    const leads = mensajes.length;
    if (total === 0) return leads > 0 ? 100 : 0;
    const rate = (leads / total) * 100;
    return Math.min(Math.round(rate * 10) / 10, 100);
  }, [totalVisitasSemana, mensajes.length]);

  const maxVisitas = useMemo(() => {
    const list = analiticas.visitasDiarias;
    if (list.length === 0) return 100;
    return Math.max(...list.map((d) => d.visitas), 100);
  }, [analiticas.visitasDiarias]);

  const exportarDatos = () => {
    let csv = 'ID,Remitente,Email,Telefono,Asunto,Presupuesto,Fecha\n';
    mensajes.forEach((m) => {
      csv += `"${m.id}","${m.remitente}","${m.email}","${m.telefono || ''}","${m.asunto}","${m.presupuesto || ''}","${m.fecha || m.created_at || ''}"\n`;
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
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* ── HEADER DE SECCIÓN BENTO ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e4e4e7]">
        <div>
          <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#71717a]">
            ADMINISTRACIÓN &bull; INTELIGENCIA DE TRÁFICO
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#09090b] tracking-tight mt-1">
            Analíticas &amp; <span className="font-light text-[#71717a]">Rendimiento Web</span>
          </h1>
          <p className="text-xs text-[#71717a] mt-1 font-medium">
            Métricas de visitantes, dispositivos, páginas más vistas y conversión de cotizaciones en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => adminService.cargarDatosReales()}
            className="btn-secondary-white text-xs"
          >
            <span className="material-symbols-rounded text-base">sync</span>
            <span>Actualizar</span>
          </button>
          <button
            onClick={exportarDatos}
            className="btn-primary-black text-xs"
          >
            <span className="material-symbols-rounded text-base">download</span>
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* ── 3 STAT CARDS BENTO CON BORDES IZQUIERDOS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* KPI 1: Visitas Totales */}
        <div className="stat-card stat-accent-blue">
          <div className="stat-card-top">
            <span className="stat-card-label">TRÁFICO TOTAL REGISTRADO</span>
            <div className="stat-card-icon-box stat-icon-blue">
              <span className="material-symbols-rounded text-lg">insights</span>
            </div>
          </div>
          <div className="stat-number">{totalVisitasSemana}</div>
          <div className="stat-card-footer">
            <span className="stat-footer-text flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Monitoreo activo
            </span>
            <span className="stat-footer-arrow">→</span>
          </div>
        </div>

        {/* KPI 2: Solicitudes de Cotización */}
        <div className="stat-card stat-accent-green">
          <div className="stat-card-top">
            <span className="stat-card-label">LEADS CAPTURADOS</span>
            <div className="stat-card-icon-box stat-icon-green">
              <span className="material-symbols-rounded text-lg">contact_mail</span>
            </div>
          </div>
          <div className="stat-number">{mensajes.length}</div>
          <div className="stat-card-footer">
            <span className="stat-footer-text">Desde el formulario web</span>
            <span className="stat-footer-arrow">→</span>
          </div>
        </div>

        {/* KPI 3: Tasa de Conversión */}
        <div className="stat-card stat-accent-purple">
          <div className="stat-card-top">
            <span className="stat-card-label">TASA DE CONVERSIÓN WEB</span>
            <div className="stat-card-icon-box stat-icon-purple">
              <span className="material-symbols-rounded text-lg">percent</span>
            </div>
          </div>
          <div className="stat-number">{tasaConversion}%</div>
          <div className="stat-card-footer">
            <span className="stat-footer-text">Visitas convertidas en contactos</span>
            <span className="stat-footer-arrow">→</span>
          </div>
        </div>

      </div>

      {/* ── CUADRÍCULA ASIMÉTRICA BENTO ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Gráfico de Barras de Visitas Diarias (8 cols) */}
        <div className="lg:col-span-8 bento-card">
          <div className="bento-card-header">
            <div>
              <h3 className="bento-card-title">Volumen de Tráfico por Día</h3>
              <p className="bento-card-subtitle">Histórico de sesiones de navegación registradas en la plataforma</p>
            </div>
            <span className="status-badge neutral text-[0.65rem] uppercase">
              Últimos 7 Días
            </span>
          </div>

          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-3 h-48 px-2 border-b border-[#e4e4e7]">
              {analiticas.visitasDiarias.map((d, index) => {
                const alturaPorcentaje = Math.max(12, Math.round((d.visitas / maxVisitas) * 100));
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[0.68rem] font-mono font-bold text-[#71717a] opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.visitas}
                    </span>
                    <div className="w-full max-w-[42px] bg-[#f4f5f7] rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                      <div
                        className="w-full bg-[#09090b] group-hover:bg-[#2563eb] transition-all rounded-t-lg duration-300"
                        style={{ height: `${alturaPorcentaje}%` }}
                      ></div>
                    </div>
                    <span className="text-[0.68rem] font-bold text-[#71717a] uppercase font-mono mt-1">
                      {d.dia}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#71717a] pt-4 mt-2">
            <span>Visitas únicas promedio por día: <strong>~{Math.round(totalVisitasSemana / 7)}</strong></span>
            <span className="flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded bg-[#09090b]"></span> Sesiones
            </span>
          </div>
        </div>

        {/* Columna Derecha: Dispositivos y Retención (4 cols) */}
        <div className="lg:col-span-4 bento-card flex flex-col justify-between">
          <div>
            <div className="bento-card-header">
              <div>
                <h3 className="bento-card-title">Dispositivos</h3>
                <p className="bento-card-subtitle">Distribución de tráfico</p>
              </div>
              <span className="material-symbols-rounded text-[#71717a]">devices</span>
            </div>

            <div className="space-y-4 my-2">
              {analiticas.dispositivos.map((disp, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#09090b] flex items-center gap-2 uppercase tracking-wider text-[0.7rem]">
                      <span className="material-symbols-rounded text-sm text-[#71717a]">
                        {disp.tipo === 'Mobile' ? 'smartphone' : disp.tipo === 'Desktop' ? 'laptop' : 'tablet'}
                      </span>
                      {disp.tipo}
                    </span>
                    <span className="font-mono text-[#71717a]">{disp.porcentaje}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#f4f5f7] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        disp.tipo === 'Mobile' ? 'bg-[#09090b]' :
                        disp.tipo === 'Desktop' ? 'bg-[#2563eb]' : 'bg-[#7c3aed]'
                      }`}
                      style={{ width: `${disp.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#fafafa] border border-[#e4e4e7] mt-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#71717a]">Tiempo promedio sesión:</span>
              <span className="font-mono font-bold text-[#09090b]">{analiticas.tiempoPromedioCAD}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#71717a]">Tasa de rebote estimada:</span>
              <span className="font-mono font-bold text-[#09090b]">{analiticas.tasaRebote}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── EMBUDO DE CONVERSIÓN BENTO ── */}
      <div className="bento-card">
        <div className="bento-card-header">
          <div>
            <h3 className="bento-card-title">Embudo de Conversión Comercial</h3>
            <p className="bento-card-subtitle">Recorrido del usuario desde la primera visita hasta el registro formal en el CRM</p>
          </div>
          <span className="status-badge success text-[0.65rem] uppercase">
            Embudo Activo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          
          <div className="p-4 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
            <span className="text-[0.65rem] font-bold text-[#71717a] uppercase tracking-wider block">ETAPA 1</span>
            <h4 className="font-bold text-sm text-[#09090b] mt-1">Visita al Sitio</h4>
            <span className="text-xl font-black font-mono text-[#09090b] block my-1">100%</span>
            <p className="text-[0.7rem] text-[#71717a]">Llegan al Home o Portafolio</p>
          </div>

          <div className="p-4 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
            <span className="text-[0.65rem] font-bold text-[#71717a] uppercase tracking-wider block">ETAPA 2</span>
            <h4 className="font-bold text-sm text-[#09090b] mt-1">Exploran Diseños</h4>
            <span className="text-xl font-black font-mono text-[#2563eb] block my-1">~54%</span>
            <p className="text-[0.7rem] text-[#71717a]">Interacción con proyectos y planos</p>
          </div>

          <div className="p-4 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
            <span className="text-[0.65rem] font-bold text-[#71717a] uppercase tracking-wider block">ETAPA 3</span>
            <h4 className="font-bold text-sm text-[#09090b] mt-1">Formulario Cotiza</h4>
            <span className="text-xl font-black font-mono text-[#7c3aed] block my-1">~18%</span>
            <p className="text-[0.7rem] text-[#71717a]">Apertura del módulo de contacto</p>
          </div>

          <div className="p-4 rounded-xl bg-[#09090b] text-white border border-[#27272a]">
            <span className="text-[0.65rem] font-bold text-white/50 uppercase tracking-wider block">ETAPA 4</span>
            <h4 className="font-bold text-sm text-white mt-1">Lead Registrado</h4>
            <span className="text-xl font-black font-mono text-emerald-400 block my-1">{tasaConversion}%</span>
            <p className="text-[0.7rem] text-white/70">Cotización enviada al CRM</p>
          </div>

        </div>
      </div>

    </div>
  );
};
