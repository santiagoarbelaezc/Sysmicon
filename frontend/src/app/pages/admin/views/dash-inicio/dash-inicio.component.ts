import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-inicio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-fade font-sans">
      
      <!-- ENCABEZADO DE SECCIÓN -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-200/80">
        <div>
          <span class="font-mono text-xs sm:text-sm tracking-[0.3em] text-neutral-400 font-bold uppercase block mb-2">
            PANEL DE CONTROL DIRECTIVO
          </span>
          <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-neutral-900 tracking-tight leading-[1.05]">
            Supervisión & <span class="font-bold">Resumen General</span>
          </h1>
          <p class="font-sans text-sm sm:text-base text-neutral-500 font-light leading-relaxed mt-2.5 max-w-2xl">
            Monitoreo en tiempo real de cotizaciones, consultas web, directorio de usuarios y estado del sistema.
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="px-5 py-3 rounded-2xl bg-white border border-neutral-200 text-right font-mono shadow-2xs">
            <span class="block text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Base de Datos</span>
            <span class="text-neutral-900 font-bold text-xs sm:text-sm flex items-center justify-end gap-2 mt-0.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> MySQL Conectada
            </span>
          </div>
        </div>
      </div>

      <!-- GRID DE 4 KPIS REALES VINCULADOS A LA BD -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- KPI 1: Cotizaciones Reales -->
        <div class="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs hover:border-black/40 hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">Cotizaciones</span>
            <div class="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
          </div>
          <div class="flex items-baseline justify-between">
            <span class="font-serif text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">{{ adminService.mensajes().length }}</span>
            <span class="text-xs text-neutral-700 font-bold bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-lg font-mono">Total</span>
          </div>
          <p class="text-xs text-neutral-500 font-light mt-2.5">Solicitudes registradas en la web</p>
        </div>

        <!-- KPI 2: Mensajes Sin Leer -->
        <div class="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs hover:border-black/40 hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">Sin Leer</span>
            <div class="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
          </div>
          <div class="flex items-baseline justify-between">
            <span class="font-serif text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">{{ countSinLeer() }}</span>
            <span class="text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg font-mono">Bandeja</span>
          </div>
          <p class="text-xs text-neutral-500 font-light mt-2.5">Pendientes por responder</p>
        </div>

        <!-- KPI 3: Usuarios Registrados -->
        <div class="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs hover:border-black/40 hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">Comunidad</span>
            <div class="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <div class="flex items-baseline justify-between">
            <span class="font-serif text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">{{ adminService.usuarios().length }}</span>
            <span class="text-xs text-neutral-700 font-bold bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-lg font-mono">Activos</span>
          </div>
          <p class="text-xs text-neutral-500 font-light mt-2.5">Usuarios en la base de datos</p>
        </div>

        <!-- KPI 4: Cotizaciones con Presupuesto -->
        <div class="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs hover:border-black/40 hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">Cotizaciones Formales</span>
            <div class="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <div class="flex items-baseline justify-between">
            <span class="font-serif text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">{{ countConPresupuesto() }}</span>
            <span class="text-xs text-white font-extrabold bg-black px-2 py-0.5 rounded-md font-mono shadow-xs">LEADS</span>
          </div>
          <p class="text-xs text-neutral-500 font-light mt-2.5">Con solicitud económica</p>
        </div>

      </div>

      <!-- SECCIÓN INFERIOR: RENDIMIENTO & ACTIVIDAD DINÁMICA -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Gráfico Semanal (Cols 1-2) -->
        <div class="lg:col-span-2 bg-white border border-neutral-200/90 rounded-3xl p-7 sm:p-8 shadow-2xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200/80">
              <div>
                <h3 class="font-serif text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Rendimiento y Tráfico Semanal</h3>
                <p class="text-xs sm:text-sm text-neutral-500 font-light mt-1">Visitas registradas al portal web</p>
              </div>
              <span class="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] text-neutral-700 font-mono font-semibold">Semanal</span>
            </div>

            <!-- Gráfico de barras -->
            <div *ngIf="adminService.analiticas().visitasDiarias.length > 0; else sinVisitas" class="h-56 flex items-end justify-between gap-3 pt-4 pb-2 border-b border-neutral-200/80 px-2">
              <div *ngFor="let dia of adminService.analiticas().visitasDiarias" class="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div class="w-full max-w-[40px] flex items-end justify-center gap-1.5 h-[85%]">
                  <div class="w-4 bg-neutral-200 group-hover:bg-neutral-300 transition-all rounded-t-md relative" [style.height.%]="(dia.visitas / (maxVisitas() || 100)) * 100">
                    <span class="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-black text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">{{ dia.visitas }}</span>
                  </div>
                  <div class="w-4 bg-black group-hover:bg-neutral-800 transition-all rounded-t-md relative" [style.height.%]="(dia.conversiones / (maxConversiones() || 10)) * 100">
                  </div>
                </div>
                <span class="text-xs font-bold text-neutral-600 group-hover:text-black transition-colors font-mono">{{ dia.dia }}</span>
              </div>
            </div>

            <ng-template #sinVisitas>
              <div class="h-56 flex flex-col items-center justify-center text-center text-neutral-400 gap-2 border-b border-neutral-100">
                <svg class="w-8 h-8 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                <span class="text-xs text-neutral-500 font-mono">Recopilando visitas de los últimos 7 días...</span>
              </div>
            </ng-template>
          </div>

          <div class="flex items-center justify-between pt-4 text-xs text-neutral-500 font-sans">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-xs bg-neutral-200 inline-block"></span> Visitas</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-xs bg-black inline-block"></span> Leads / Mensajes</span>
            </div>
            <span class="text-neutral-800 font-mono text-[11px] font-bold">Datos en vivo</span>
          </div>
        </div>

        <!-- Actividad Reciente Dinámica (Col 3) -->
        <div class="bg-white border border-neutral-200/90 rounded-3xl p-7 sm:p-8 shadow-2xs flex flex-col justify-between">
          <div>
            <div class="pb-3.5 mb-4 border-b border-neutral-200/80">
              <h3 class="font-serif text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Actividad en Vivo</h3>
              <p class="text-xs text-neutral-500 font-light mt-0.5">Últimas solicitudes recibidas en la base de datos</p>
            </div>

            <!-- Listado dinámico de mensajes reales -->
            <div *ngIf="adminService.mensajes().length > 0; else sinActividad" class="space-y-3 font-sans max-h-72 overflow-y-auto scrollbar-thin pr-1">
              <div *ngFor="let m of adminService.mensajes().slice(0, 4)" class="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div class="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-xs">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-bold text-neutral-900 truncate">{{ m.remitente }}</p>
                  <p class="text-[11px] text-neutral-600 font-light truncate mt-0.5">{{ m.asunto }}</p>
                  <span class="text-[10px] text-neutral-400 mt-1 block font-mono">{{ m.fecha || m.created_at || 'Reciente' }}</span>
                </div>
              </div>
            </div>

            <ng-template #sinActividad>
              <div class="py-12 flex flex-col items-center justify-center text-center text-neutral-400 gap-2">
                <svg class="w-8 h-8 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span class="text-xs text-neutral-500">Sin mensajes registrados aún.</span>
              </div>
            </ng-template>
          </div>

          <div class="pt-4 border-t border-neutral-200/80 mt-4 text-center">
            <span class="text-[11px] text-neutral-500 font-bold font-mono">● Base de datos MySQL sincronizada</span>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashInicioComponent implements OnInit {
  readonly adminService = inject(AdminService);

  ngOnInit(): void {
    this.adminService.cargarDatosReales();
  }

  countSinLeer(): number {
    return this.adminService.mensajes().filter((m: any) => !m.leido).length;
  }

  countConPresupuesto(): number {
    return this.adminService.mensajes().filter((m: any) => Boolean(m.presupuesto)).length;
  }

  maxVisitas = computed(() => {
    const list = this.adminService.analiticas().visitasDiarias;
    if (list.length === 0) return 100;
    return Math.max(...list.map(d => d.visitas), 100);
  });

  maxConversiones = computed(() => {
    const list = this.adminService.analiticas().visitasDiarias;
    if (list.length === 0) return 10;
    return Math.max(...list.map(d => d.conversiones), 10);
  });
}
