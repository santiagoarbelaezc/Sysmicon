import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-inicio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-fade">
      
      <!-- Banner de Bienvenida -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111A2E] via-[#0E1422] to-[#0A0D14] border border-white/10 p-6 sm:p-8 shadow-xl">
        <div class="absolute top-0 right-0 w-96 h-96 bg-wood-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wood-accent/20 border border-wood-accent/40 text-wood-light text-xs font-serif uppercase tracking-widest mb-3">
              <span class="w-2 h-2 rounded-full bg-wood-accent animate-ping"></span>
              <span>Portal Directivo Sysmicon v2.4</span>
            </div>
            <h2 class="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bienvenido, <span class="text-wood-light">Director de Arquitectura</span>
            </h2>
            <p class="text-gray-400 text-sm mt-1 max-w-xl font-sans">
              Supervisión en tiempo real del tráfico, cotizaciones en línea, proyectos de Studio CAD 2D y actividad residencial.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-right">
              <span class="block text-[10px] text-gray-400 uppercase tracking-wider">Estado del Servidor</span>
              <span class="text-emerald-400 font-bold text-sm flex items-center justify-end gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 99.98% Óptimo
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid de 4 KPIs Principales -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- KPI 1: Cotizaciones -->
        <div class="bg-[#111111] hover:bg-[#151515] border border-white/10 hover:border-wood-accent/40 rounded-2xl p-5 transition-all shadow-lg group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Cotizaciones Formales</span>
            <div class="w-10 h-10 rounded-xl bg-wood-accent/15 text-wood-light flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📋</div>
          </div>
          <div class="flex items-baseline justify-between">
            <span class="font-serif text-3xl font-extrabold text-white">{{ adminService.kpis().totalCotizaciones }}</span>
            <span class="text-xs text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">+12 este mes</span>
          </div>
          <p class="text-[11px] text-gray-500 mt-2">Leads cualificados en espera</p>
        </div>

        <!-- KPI 2: Diseños CAD Guardados -->
        <div class="bg-[#111111] hover:bg-[#151515] border border-white/10 hover:border-wood-accent/40 rounded-2xl p-5 transition-all shadow-lg group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Diseños CAD 2D</span>
            <div class="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📐</div>
          </div>
          <div class="flex items-baseline justify-between">
            <span class="font-serif text-3xl font-extrabold text-white">{{ adminService.kpis().diseñosCADGuardados }}</span>
            <span class="text-xs text-blue-400 font-bold bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/40">Activos en nube</span>
          </div>
          <p class="text-[11px] text-gray-500 mt-2">Proyectos creados en simulador</p>
        </div>

        <!-- KPI 3: Usuarios Registrados -->
        <div class="bg-[#111111] hover:bg-[#151515] border border-white/10 hover:border-wood-accent/40 rounded-2xl p-5 transition-all shadow-lg group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Comunidad Sysmicon</span>
            <div class="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">👥</div>
          </div>
          <div class="flex items-baseline justify-between">
            <span class="font-serif text-3xl font-extrabold text-white">{{ adminService.kpis().usuariosRegistrados }}</span>
            <span class="text-xs text-purple-400 font-bold bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">{{ adminService.kpis().crecimientoMensual }}</span>
          </div>
          <p class="text-[11px] text-gray-500 mt-2">Propietarios & Arquitectos</p>
        </div>

        <!-- KPI 4: Valor Cotizado Estimado -->
        <div class="bg-[#111111] hover:bg-[#151515] border border-white/10 hover:border-wood-accent/40 rounded-2xl p-5 transition-all shadow-lg group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Pipeline Estimado</span>
            <div class="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">💲</div>
          </div>
          <div class="flex items-baseline justify-between">
            <span class="font-serif text-2xl sm:text-3xl font-extrabold text-white">\${{ (adminService.kpis().ingresoEstimadoUSD / 1000000).toFixed(2) }}M</span>
            <span class="text-xs text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">USD</span>
          </div>
          <p class="text-[11px] text-gray-500 mt-2">Valor acumulado en proyectos</p>
        </div>

      </div>

      <!-- Sección Inferior: Gráfico Simulado & Actividad Reciente -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Gráfico de Rendimiento Semanal (Cols 1-2) -->
        <div class="lg:col-span-2 bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="font-serif text-lg font-bold text-white">Rendimiento y Tráfico Semanal</h3>
                <p class="text-xs text-gray-400">Comparativa de visitas al portal vs. conversiones en Studio CAD 2</p>
              </div>
              <span class="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">Últimos 7 días</span>
            </div>

            <!-- Gráfico visual de barras en CSS -->
            <div class="h-64 flex items-end justify-between gap-3 pt-8 pb-2 border-b border-white/10 px-2">
              <div *ngFor="let dia of adminService.analiticas().visitasDiarias" class="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div class="w-full max-w-[40px] flex items-end justify-center gap-1.5 h-[80%]">
                  <!-- Barra Visitas -->
                  <div class="w-4 bg-white/10 group-hover:bg-wood-accent/80 transition-all rounded-t-sm relative" [style.height.%]="(dia.visitas / 2500) * 100">
                    <span class="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{{ dia.visitas }}</span>
                  </div>
                  <!-- Barra Conversiones -->
                  <div class="w-4 bg-wood-accent group-hover:bg-white transition-all rounded-t-sm relative" [style.height.%]="(dia.conversiones / 100) * 100">
                  </div>
                </div>
                <span class="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{{ dia.dia }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 text-xs text-gray-400">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-white/10 inline-block"></span> Visitas Totales</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-wood-accent inline-block"></span> Diseños Guardados</span>
            </div>
            <span class="text-wood-light font-bold">Promedio diario: 1,680 visitas</span>
          </div>
        </div>

        <!-- Actividad Reciente del Portal (Col 3) -->
        <div class="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 class="font-serif text-lg font-bold text-white mb-1">Actividad en Tiempo Real</h3>
            <p class="text-xs text-gray-400 mb-5">Últimos movimientos en la plataforma</p>

            <div class="space-y-4">
              
              <div class="flex items-start gap-3 p-3 rounded-xl bg-[#161616] border border-white/5">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✨</div>
                <div>
                  <p class="text-xs font-bold text-white">Nuevo Lead: Dr. Fernando Hoyos</p>
                  <p class="text-[11px] text-gray-400 leading-snug">Cotizó casa en Llanogrande por $450k USD.</p>
                  <span class="text-[10px] text-gray-500 mt-1 block">Hace 12 minutos</span>
                </div>
              </div>

              <div class="flex items-start gap-3 p-3 rounded-xl bg-[#161616] border border-white/5">
                <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">📐</div>
                <div>
                  <p class="text-xs font-bold text-white">Diseño CAD Guardado #412</p>
                  <p class="text-[11px] text-gray-400 leading-snug">Arq. Mariana Vélez exportó distribución 2D.</p>
                  <span class="text-[10px] text-gray-500 mt-1 block">Hace 45 minutos</span>
                </div>
              </div>

              <div class="flex items-start gap-3 p-3 rounded-xl bg-[#161616] border border-white/5">
                <div class="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">👤</div>
                <div>
                  <p class="text-xs font-bold text-white">Nuevo Propietario Registrado</p>
                  <p class="text-[11px] text-gray-400 leading-snug">Sofia Londoño creó cuenta privada.</p>
                  <span class="text-[10px] text-gray-500 mt-1 block">Hace 2 horas</span>
                </div>
              </div>

            </div>
          </div>

          <div class="pt-4 border-t border-white/10 mt-4 text-center">
            <span class="text-[11px] text-wood-light font-bold">● Sistema sincronizado en la nube</span>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashInicioComponent {
  readonly adminService = inject(AdminService);
}
