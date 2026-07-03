import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-estadisticas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade">
      
      <!-- Encabezado de Sección (Estilo CAD) -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 class="font-serif text-2xl font-bold text-white tracking-tight">Estadísticas Arquitectónicas & Comerciales</h2>
          <p class="text-xs text-gray-400 mt-1 font-sans">Análisis de los diseños generados por los clientes y presupuestos promedio cotizados en la plataforma.</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs px-3.5 py-2 rounded-xl bg-[#0D0D0D] border border-white/10 text-white font-mono inline-flex items-center gap-2 shadow">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            <span>Año Fiscal 2026</span>
          </span>
        </div>
      </div>

      <!-- Grid Principal de Estadísticas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Categorías Más Cotizadas (Col 1) -->
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl overflow-hidden">
          <!-- Trazos esquineros de plano -->
          <div class="absolute -top-1 -left-1 w-5 h-5 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-5 h-5 border-b border-r border-white/20 pointer-events-none"></div>
          
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="font-serif text-lg font-bold text-white flex items-center gap-2.5">
                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                <span>Categorías de Bloques Más Solicitadas</span>
              </h3>
              <p class="text-xs text-gray-400 mt-0.5 font-sans">Preferencia en las distribuciones en nube</p>
            </div>
            <span class="text-xs text-white font-mono font-bold bg-white/10 px-2.5 py-1 rounded border border-white/10">412 diseños</span>
          </div>

          <div class="space-y-5">
            <div *ngFor="let cat of adminService.estadisticas().categoriasPopulares" class="space-y-2 group">
              <div class="flex items-center justify-between text-xs font-sans">
                <span class="font-bold text-gray-200 flex items-center gap-2.5 group-hover:text-white transition-colors">
                  <span class="w-6 h-6 rounded bg-[#1C1C1C] border border-white/10 flex items-center justify-center text-white shrink-0">
                    <svg *ngIf="cat.categoria.includes('Alcobas')" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
                    <svg *ngIf="cat.categoria.includes('Cocinas')" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
                    <svg *ngIf="cat.categoria.includes('Piscinas')" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>
                    <svg *ngIf="cat.categoria.includes('Zonas')" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3z"/><path d="M16 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3z"/><path d="M3 5h18"/><path d="M12 5v16"/></svg>
                    <svg *ngIf="cat.categoria.includes('Garajes') || !cat.categoria.includes('Alcobas') && !cat.categoria.includes('Cocinas') && !cat.categoria.includes('Piscinas') && !cat.categoria.includes('Zonas')" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  </span>
                  <span>{{ cat.categoria }}</span>
                </span>
                <span class="text-gray-300 font-bold font-mono">{{ cat.porcentaje }}% <span class="text-[10px] text-gray-500 font-mono">({{ cat.totalDisenos }} diseños)</span></span>
              </div>
              <div class="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                <div class="h-full bg-white rounded-full transition-all duration-500 group-hover:bg-gray-300" [style.width.%]="cat.porcentaje"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Presupuestos Promedio Cotizados (Col 2) -->
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl flex flex-col justify-between overflow-hidden">
          <!-- Trazos esquineros de plano -->
          <div class="absolute -top-1 -left-1 w-5 h-5 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-5 h-5 border-b border-r border-white/20 pointer-events-none"></div>
          <div>
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="font-serif text-lg font-bold text-white flex items-center gap-2.5">
                  <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  <span>Distribución de Inversión por Proyecto</span>
                </h3>
                <p class="text-xs text-gray-400 mt-0.5 font-sans">Presupuestos estimados en dólares (USD)</p>
              </div>
              <span class="text-xs text-white font-mono font-bold bg-white/10 px-2.5 py-1 rounded border border-white/15 shadow-sm">Ticket Promedio: $320k USD</span>
            </div>

            <div class="space-y-4 pt-2 font-sans">
              <div *ngFor="let pres of adminService.estadisticas().presupuestosPromedio" class="p-4 rounded-lg bg-[#0C0C0C] border border-white/5 space-y-2 hover:border-white/20 transition-colors">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-white flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                    <span>{{ pres.rango }}</span>
                  </span>
                  <span class="text-white font-extrabold font-mono">{{ pres.porcentaje }}% del portafolio</span>
                </div>
                <div class="w-full h-2 bg-black/60 rounded-full overflow-hidden p-[1px] border border-white/5">
                  <div class="h-full bg-white/80 rounded-full" [style.width.%]="pres.porcentaje"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4 mt-6 border-t border-white/10 text-xs text-gray-300 flex items-center justify-between font-sans">
            <div class="inline-flex items-center gap-2">
              <span class="w-6 h-6 rounded bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              </span>
              <span>Proyección Q3: Crecimiento estimado del <strong class="text-white">+22%</strong> en segmento Luxury.</span>
            </div>
            <span class="text-white font-bold hover:underline cursor-pointer inline-flex items-center gap-1">
              <span>Ver reporte PDF</span>
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </div>
        </div>

      </div>

      <!-- Tarjetas de Métricas Complementarias -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <!-- Tarjeta 1: Área Promedio Diseñada -->
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-5 shadow-lg flex items-center justify-between group hover:border-white/30 transition-all overflow-hidden">
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400 block font-sans">Área Promedio Diseñada</span>
            <span class="font-serif text-3xl font-extrabold text-white mt-1 block group-hover:text-gray-300 transition-colors">340 m²</span>
            <span class="text-[10px] text-gray-500 mt-1 block font-mono">Por residencia en Llanogrande</span>
          </div>
          <div class="w-12 h-12 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-white/30 transition-all shadow-md">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>
          </div>
        </div>

        <!-- Tarjeta 2: Tiempo de Decisión -->
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-5 shadow-lg flex items-center justify-between group hover:border-white/30 transition-all overflow-hidden">
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400 block font-sans">Tiempo de Decisión</span>
            <span class="font-serif text-3xl font-extrabold text-white mt-1 block group-hover:text-gray-300 transition-colors">18 días</span>
            <span class="text-[10px] text-gray-400 font-bold mt-1 inline-flex items-center gap-1 font-mono">
              <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
              <span>-4 días desde Studio CAD 2</span>
            </span>
          </div>
          <div class="w-12 h-12 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-white/30 transition-all shadow-md">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/></svg>
          </div>
        </div>

        <!-- Tarjeta 3: Satisfacción Propietarios -->
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-5 shadow-lg flex items-center justify-between group hover:border-white/30 transition-all overflow-hidden">
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400 block font-sans">Satisfacción Propietarios</span>
            <span class="font-serif text-3xl font-extrabold text-white mt-1 block group-hover:text-gray-300 transition-colors">99.4%</span>
            <span class="text-[10px] text-gray-400 font-bold mt-1 inline-flex items-center gap-1 font-mono">
              <svg class="w-3 h-3 fill-white text-white" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>5.0 en 140+ hogares</span>
            </span>
          </div>
          <div class="w-12 h-12 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-white/30 transition-all shadow-md">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/><path d="M12 17.77V2"/></svg>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashEstadisticasComponent {
  readonly adminService = inject(AdminService);
}
