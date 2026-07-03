import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-inicio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-fade">
      
      <!-- Banner de Bienvenida (Estilo Plano Arquitectónico) -->
      <div class="relative overflow-hidden rounded-xl bg-[#030303] border border-white/10 p-6 sm:p-8 shadow-xl">
        <!-- Ejes de plano y trazos decorativos -->
        <div class="absolute top-0 bottom-0 left-[8%] w-[1px] bg-white/[0.03] pointer-events-none"></div>
        <div class="absolute top-0 bottom-0 right-[8%] w-[1px] bg-white/[0.03] pointer-events-none"></div>
        <div class="absolute -top-1 -left-1 w-5 h-5 border-t border-l border-white/20 pointer-events-none"></div>
        <div class="absolute -bottom-1 -right-1 w-5 h-5 border-b border-r border-white/20 pointer-events-none"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-mono uppercase tracking-widest mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span>Portal Directivo Sysmicon v2.4</span>
            </div>
            <h2 class="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bienvenido, <span class="text-gray-400">Director de Arquitectura</span>
            </h2>
            <p class="text-gray-400 text-base mt-1 max-w-xl font-sans">
              Supervisión en tiempo real del tráfico, cotizaciones en línea, proyectos de Studio CAD 2D y actividad residencial.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="px-4 py-3 rounded-lg bg-white/[0.02] border border-white/10 text-right font-mono">
              <span class="block text-[10px] text-gray-500 uppercase tracking-wider">Estado del Servidor</span>
              <span class="text-white font-bold text-sm flex items-center justify-end gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> 99.98% Óptimo
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid de 4 KPIs Principales con Trazos Esquineros -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- KPI 1: Cotizaciones -->
        <div class="relative bg-[#030303] hover:bg-[#080808] border border-white/10 hover:border-white/30 rounded-xl p-5 transition-all shadow-lg group">
          <!-- Trazos de plano -->
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-bold uppercase tracking-wider text-gray-400 font-sans">Cotizaciones Formales</span>
            <div class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center">
              <svg class="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
          </div>
          <div class="flex items-baseline justify-between font-sans">
            <span class="font-serif text-3xl font-extrabold text-white">{{ adminService.kpis().totalCotizaciones }}</span>
            <span class="text-xs text-white font-bold border border-white/20 bg-white/5 px-2 py-0.5 rounded font-mono">+12 este mes</span>
          </div>
          <p class="text-xs text-gray-500 mt-2 font-sans">Leads cualificados en espera</p>
        </div>

        <!-- KPI 2: Diseños CAD Guardados -->
        <div class="relative bg-[#030303] hover:bg-[#080808] border border-white/10 hover:border-white/30 rounded-xl p-5 transition-all shadow-lg group">
          <!-- Trazos de plano -->
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-bold uppercase tracking-wider text-gray-400 font-sans">Diseños CAD 2D</span>
            <div class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center">
              <svg class="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 0 3.4Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>
            </div>
          </div>
          <div class="flex items-baseline justify-between font-sans">
            <span class="font-serif text-3xl font-extrabold text-white">{{ adminService.kpis().disenosCADGuardados }}</span>
            <span class="text-xs text-white font-bold border border-white/20 bg-white/5 px-2 py-0.5 rounded font-mono">Activos en nube</span>
          </div>
          <p class="text-xs text-gray-500 mt-2 font-sans">Proyectos creados en simulador</p>
        </div>

        <!-- KPI 3: Usuarios Registrados -->
        <div class="relative bg-[#030303] hover:bg-[#080808] border border-white/10 hover:border-white/30 rounded-xl p-5 transition-all shadow-lg group">
          <!-- Trazos de plano -->
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-bold uppercase tracking-wider text-gray-400 font-sans">Comunidad Sysmicon</span>
            <div class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center">
              <svg class="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <div class="flex items-baseline justify-between font-sans">
            <span class="font-serif text-3xl font-extrabold text-white">{{ adminService.kpis().usuariosRegistrados }}</span>
            <span class="text-xs text-white font-bold border border-white/20 bg-white/5 px-2 py-0.5 rounded font-mono">{{ adminService.kpis().crecimientoMensual }}</span>
          </div>
          <p class="text-xs text-gray-500 mt-2 font-sans">Propietarios & Arquitectos</p>
        </div>

        <!-- KPI 4: Valor Cotizado Estimado -->
        <div class="relative bg-[#030303] hover:bg-[#080808] border border-white/10 hover:border-white/30 rounded-xl p-5 transition-all shadow-lg group">
          <!-- Trazos de plano -->
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-bold uppercase tracking-wider text-gray-400 font-sans">Pipeline Estimado</span>
            <div class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center">
              <svg class="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <div class="flex items-baseline justify-between font-sans">
            <span class="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">\${{ (adminService.kpis().ingresoEstimadoUSD / 1000000).toFixed(2) }}M</span>
            <span class="text-sm text-black font-extrabold bg-white px-2.5 py-1 rounded font-mono shadow">USD</span>
          </div>
          <p class="text-xs text-gray-500 mt-2 font-sans">Valor acumulado en proyectos</p>
        </div>

      </div>

      <!-- Sección Inferior: Gráfico Simulado & Actividad Reciente -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Gráfico de Rendimiento Semanal (Cols 1-2) -->
        <div class="lg:col-span-2 relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl flex flex-col justify-between overflow-hidden">
          <!-- Trazos de plano -->
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <div>
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="font-serif text-lg font-bold text-white">Rendimiento y Tráfico Semanal</h3>
                <p class="text-sm text-gray-400 font-sans">Comparativa de visitas al portal vs. conversiones en Studio CAD 2</p>
              </div>
              <span class="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-mono">Últimos 7 días</span>
            </div>

            <!-- Gráfico visual de barras en CSS -->
            <div class="h-64 flex items-end justify-between gap-3 pt-8 pb-2 border-b border-white/10 px-2">
              <div *ngFor="let dia of adminService.analiticas().visitasDiarias" class="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div class="w-full max-w-[40px] flex items-end justify-center gap-1.5 h-[80%]">
                  <!-- Barra Visitas -->
                  <div class="w-4 bg-white/10 group-hover:bg-white/30 transition-all rounded-t-sm relative" [style.height.%]="(dia.visitas / 2500) * 100">
                    <span class="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-black border border-white/20 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">{{ dia.visitas }}</span>
                  </div>
                  <!-- Barra Conversiones -->
                  <div class="w-4 bg-white group-hover:bg-gray-300 transition-all rounded-t-sm relative" [style.height.%]="(dia.conversiones / 100) * 100">
                  </div>
                </div>
                <span class="text-xs font-bold text-gray-400 group-hover:text-white transition-colors font-mono">{{ dia.dia }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 text-xs text-gray-400 font-sans">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-white/10 inline-block"></span> Visitas Totales</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-white inline-block"></span> Diseños Guardados</span>
            </div>
            <span class="text-gray-300 font-bold font-mono">Promedio diario: 1,680 visitas</span>
          </div>
        </div>

        <!-- Actividad Reciente del Portal (Col 3) -->
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl flex flex-col justify-between overflow-hidden">
          <!-- Trazos de plano -->
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <div>
            <h3 class="font-serif text-lg font-bold text-white mb-1">Actividad en Tiempo Real</h3>
            <p class="text-sm text-gray-400 mb-5 font-sans">Últimos movimientos en la plataforma</p>

            <div class="space-y-4 font-sans">
              
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[#0C0C0C] border border-white/5">
                <div class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-white">Nuevo Lead: Dr. Fernando Hoyos</p>
                  <p class="text-xs text-gray-400 leading-snug">Cotizó casa en Llanogrande por $450k USD.</p>
                  <span class="text-[11px] text-gray-500 mt-1 block font-mono">Hace 12 minutos</span>
                </div>
              </div>

              <div class="flex items-start gap-3 p-3 rounded-lg bg-[#0C0C0C] border border-white/5">
                <div class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18L3 3v18z"/><path d="M7 17h6l-6-6v6z"/></svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-white">Diseño CAD Guardado #412</p>
                  <p class="text-xs text-gray-400 leading-snug">Arq. Mariana Vélez exportó distribución 2D.</p>
                  <span class="text-[11px] text-gray-500 mt-1 block font-mono">Hace 45 minutos</span>
                </div>
              </div>

              <div class="flex items-start gap-3 p-3 rounded-lg bg-[#0C0C0C] border border-white/5">
                <div class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-white">Nuevo Propietario Registrado</p>
                  <p class="text-xs text-gray-400 leading-snug">Sofia Londoño creó cuenta privada.</p>
                  <span class="text-[11px] text-gray-500 mt-1 block font-mono">Hace 2 horas</span>
                </div>
              </div>

            </div>
          </div>

          <div class="pt-4 border-t border-white/10 mt-4 text-center">
            <span class="text-xs text-gray-400 font-bold font-mono">● Sistema sincronizado en la nube</span>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashInicioComponent {
  readonly adminService = inject(AdminService);
}
