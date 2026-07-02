import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-estadisticas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade">
      
      <!-- Encabezado de Sección -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 class="font-serif text-2xl font-bold text-white tracking-tight">Estadísticas Arquitectónicas & Comerciales</h2>
          <p class="text-xs text-gray-400 mt-1">Análisis de los diseños generados por los clientes y presupuestos promedio cotizados en la plataforma.</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs px-3 py-1.5 rounded-xl bg-[#161616] border border-white/10 text-gray-300">📊 Año Fiscal 2026</span>
        </div>
      </div>

      <!-- Grid Principal de Estadísticas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Categorías Más Cotizadas (Col 1) -->
        <div class="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="font-serif text-lg font-bold text-white">Categorías de Bloques Más Solicitadas</h3>
              <p class="text-xs text-gray-400">Preferencia en las distribuciones en nube</p>
            </div>
            <span class="text-xs text-wood-light font-bold">412 diseños</span>
          </div>

          <div class="space-y-5">
            <div *ngFor="let cat of adminService.estadisticas().categoriasPopulares" class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-gray-200 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-wood-accent inline-block"></span>
                  {{ cat.categoria }}
                </span>
                <span class="text-gray-400 font-bold">{{ cat.porcentaje }}% <span class="text-[10px] text-gray-500">({{ cat.totalDiseños }} diseños)</span></span>
              </div>
              <div class="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div class="h-full bg-gradient-to-r from-wood-accent to-wood-light rounded-full transition-all duration-500" [style.width.%]="cat.porcentaje"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Presupuestos Promedio Cotizados (Col 2) -->
        <div class="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="font-serif text-lg font-bold text-white">Distribución de Inversión por Proyecto</h3>
                <p class="text-xs text-gray-400">Presupuestos estimados en dólares (USD)</p>
              </div>
              <span class="text-xs text-emerald-400 font-bold bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40">Ticket Promedio: $320k USD</span>
            </div>

            <div class="space-y-6 pt-2">
              <div *ngFor="let pres of adminService.estadisticas().presupuestosPromedio" class="p-4 rounded-xl bg-[#161616] border border-white/5 space-y-2">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-white">{{ pres.rango }}</span>
                  <span class="text-emerald-400 font-extrabold">{{ pres.porcentaje }}% del portafolio</span>
                </div>
                <div class="w-full h-2.5 bg-black rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" [style.width.%]="pres.porcentaje"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4 mt-6 border-t border-white/10 text-xs text-gray-400 flex items-center justify-between">
            <span>📈 Proyección Q3: Crecimiento estimado del +22% en segmento Luxury.</span>
            <span class="text-wood-light font-bold">Ver reporte PDF →</span>
          </div>
        </div>

      </div>

      <!-- Tarjetas de Métricas Complementarias -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div class="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400 block">Área Promedio Diseñada</span>
            <span class="font-serif text-3xl font-extrabold text-white mt-1 block">340 m²</span>
            <span class="text-[11px] text-gray-400">Por residencia en Llanogrande</span>
          </div>
          <div class="text-3xl">📐</div>
        </div>
        <div class="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400 block">Tiempo de Decisión</span>
            <span class="font-serif text-3xl font-extrabold text-white mt-1 block">18 días</span>
            <span class="text-[11px] text-emerald-400 font-bold">↓ -4 días desde Studio CAD 2</span>
          </div>
          <div class="text-3xl">⏱️</div>
        </div>
        <div class="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400 block">Satisfacción Propietarios</span>
            <span class="font-serif text-3xl font-extrabold text-white mt-1 block">99.4%</span>
            <span class="text-[11px] text-wood-light font-bold">★ 5.0 en 140+ hogares</span>
          </div>
          <div class="text-3xl">⭐</div>
        </div>
      </div>

    </div>
  `
})
export class DashEstadisticasComponent {
  readonly adminService = inject(AdminService);
}
